import json
import io
import re
import sys
import speech_recognition as sr
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

# Force UTF-8 for console output on Windows to prevent charmap crashes
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Import your configurations and schemas
from config import settings
from schemas import (
    NavigationRequest,
    NavigationResponse,
    SuggestedAction,
    SuggestionRequest,
    SuggestionResponse,
)

# Initialize FastAPI app
app = FastAPI(
    title="AI Navigation Assistant API",
    description="Backend processor utilizing Perplexity to compute next steps for web navigation workflows.",
    version="1.0.0"
)

# Allow the Chrome extension to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Perplexity client (OpenAI-compatible)
client = OpenAI(
    api_key=settings.perplexity_api_key,
    base_url="https://api.perplexity.ai",
)

def build_system_prompt(elements: list, page_context: str = "page", current_url: str = "") -> str:
    """
    Dynamically serializes the pruned DOM snapshot into a clean JSON manifest
    and injects it directly into the core structural ruleset for the LLM.
    """
    serialized_elements = json.dumps(
        [el.model_dump(exclude_none=True) for el in elements], 
        indent=2
    )

    modal_note = ""
    if page_context == "modal":
        modal_note = "\nCONTEXT: A dialog/modal is open. The elements below are ONLY from inside that modal. You MUST interact with a modal element."

    return f"""You are a careful navigation assistant helping a person navigate the website currently open. Read the visible page controls, understand the page, and choose the clearest safe next step.{modal_note}

CURRENT URL: {current_url}

INTERACTIVE ELEMENTS VISIBLE ON SCREEN:
{serialized_elements}

─── HOW TO THINK ───

1. WHERE AM I? Read the URL and element texts to understand what page you are on.
2. WHAT DOES THE USER WANT? Parse their goal. "check" / "see" / "find" = they want INFORMATION (read-only pages). "apply" / "submit" / "register" = they want an ACTION (e-Service forms).
3. WHAT IS THE MOST OBVIOUS NEXT CLICK? Like a human, pick the navigation link or topic card whose text best matches the goal topic. Go deeper step by step.
4. AM I THERE YET? (CRITICAL) If the current page already displays the final content (e.g., project details, flat types, town maps, price tables), the task is 100% DONE. Immediately return action_type "done". DO NOT click "Next", "›", or any pagination buttons to look for "more details". Stop exactly where you are.

─── ABSOLUTE RULES ───

NEVER DO:
• Click anything with "advisory", "banner", "carousel", "See more", or slide navigation — these are decorative noise, NEVER relevant.
• Click "Apply", "Submit", or e-Service buttons when the user only wants to CHECK / READ / FIND information.
• Click "Login" or "Sign in" unless the user's goal is to access their personal account (e.g., checking their application status). For public information (like checking BTO launches, prices, or eligibility), DO NOT login.
• Click in-page anchor tabs (like "Project details" / "Application rates" / "Town map") — these just scroll the same page. If you see these, the user has ARRIVED at the destination. Return "done".
• Click the Search button or toggle when a direct navigation menu link matching the goal exists.
• Repeat any element_id already in the COMPLETED STEPS history.
• Invent an element_id — you may ONLY use IDs from the list above.
• Enter, invent, request, or repeat passwords, one-time passcodes, payment details, banking details, identity numbers, or document contents.
• Automatically submit a financial transaction, identity document, sensitive credential, account deletion, or other destructive action.

ALWAYS DO:
• Choose the single most relevant navigation link that takes you closer to the goal topic.
• On a homepage, prefer the visible top navigation item that best matches the user's goal.
• On category pages, choose the visible topic or service card that best matches the goal.
• On HDB pages, HDB topic links such as "Buying a Flat", "Resale Flats", and "Eligibility" are valid when they match the goal.
• If a login modal appears, click "Log in with Singpass" or the Singpass QR code. These are valid intermediate steps.
• Use action_type "type" only for non-sensitive search or navigation text. The user must personally enter all credentials and sensitive information.
• Write the "explanation" as one short, plain sentence an elderly person can understand.

SEARCH — ABSOLUTE LAST RESORT ONLY:
Only use search if there is truly NO visible navigation link, menu item, or topic card that can lead to the goal. If you must search:
  1. FIRST: action_type="type", target the search input, put your query in type_value.
  2. THEN (next step): action_type="click" on the Search submit button.
  Never click Search with an empty search field.

─── RESPONSE FORMAT ───

Return ONLY valid JSON. No markdown, no explanation text outside the JSON:
{{
  "element_id": "<string or null>",
  "action_type": "<click|type|done|fail>",
  "type_value": "<string or null>",
  "explanation": "<string>"
}}"""

@app.post("/api/next-step", response_model=NavigationResponse)
def get_next_step(request: NavigationRequest):
    valid_ids = {el.id for el in request.elements}
    sensitive_ids = {el.id for el in request.elements if el.sensitive_kind}
    max_retries = 2

    # Build the user turn — include full step history to prevent looping
    user_content = f"Goal: {request.goal}"

    if request.step_history and len(request.step_history) > 0:
        history_lines = []
        for i, step in enumerate(request.step_history, 1):
            eid = f" on element '{step.element_id}'" if step.element_id else ""
            history_lines.append(f"  Step {i}: {step.action_type}{eid} — {step.explanation}")
        user_content += (
            f"\n\nCOMPLETED STEPS SO FAR (DO NOT REPEAT ANY OF THESE):\n"
            + "\n".join(history_lines)
            + "\n\nThe page may have changed after each step. Choose the NEXT step based on what is visible NOW."
            + f"\nDo NOT select any element_id that was already used: {[s.element_id for s in request.step_history if s.element_id]}"
        )
    elif request.previous_action:
        pa = request.previous_action
        user_content += (
            f"\n\nPREVIOUS STEP COMPLETED: I already performed action_type='{pa.action_type}'"
            + (f" on element_id='{pa.element_id}'" if pa.element_id else "")
            + f". Explanation given was: \"{pa.explanation}\"."
            + "\nThe page may have changed as a result. Choose the NEXT step based on what is visible NOW."
        )

    messages = [
        {"role": "system", "content": build_system_prompt(request.elements, request.page_context or "page", request.current_url or "")},
        {"role": "user", "content": user_content}
    ]

    for attempt in range(max_retries + 1):
        try:
            print(f"--- Attempt {attempt + 1}: Calling Perplexity sonar-pro... ---")
            
            completion = client.chat.completions.create(
                model="sonar-pro",
                messages=messages,
                temperature=0.0,
            )

            raw = completion.choices[0].message.content.strip()
            print(f"--- Raw LLM response: {raw} ---")

            # Strip markdown code fences if present
            if raw.startswith("```"):
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
                raw = raw.strip()

            data = json.loads(raw)
            response = NavigationResponse(**data)
            
            print("--- Success! Received response from LLM ---")
            
            # Condition A: Valid terminal state
            if response.action_type in ["done", "fail"]:
                return response
                
            # Condition B: Valid targeted element
            if response.element_id in valid_ids and not (
                response.action_type == "type" and response.element_id in sensitive_ids
            ):
                return response
                
            # Condition C: Hallucination detected.
            if response.action_type == "type" and response.element_id in sensitive_ids:
                error_msg = (
                    "ERROR: You selected a sensitive input. Never type passwords, OTPs, payment details, "
                    "banking details, identity information, or document contents. Choose a safe navigation "
                    "step or explain that the user must complete the field personally."
                )
            else:
                error_msg = (
                    f"ERROR: You selected element_id '{response.element_id}', but that ID does not exist on this page. "
                    f"You must select an absolute match from this valid set: {list(valid_ids)}. Re-evaluate the DOM."
                )
            
            messages.append({"role": "assistant", "content": raw})
            messages.append({"role": "user", "content": error_msg})
            
            print(f"[Warning] Element ID hallucination caught (Attempt {attempt + 1}). Re-routing request...")

        except Exception as e:
            error_str = str(e)
            print(f"\n[CRITICAL API ERROR] {error_str}\n")
            if "429" in error_str or "quota" in error_str.lower() or "rate" in error_str.lower():
                return NavigationResponse(
                    element_id=None,
                    action_type="fail",
                    type_value=None,
                    explanation=f"Rate-limited by Perplexity API. Please wait a moment and try again. Error: {error_str}"
                )
            raise HTTPException(
                status_code=500, 
                detail=f"Downstream LLM execution failure: {error_str}"
            )

    # Global Fallback
    return NavigationResponse(
        element_id=None,
        action_type="fail",
        type_value=None,
        explanation="I am having trouble reading this page layout clearly. Try refreshing the page or altering your request."
    )

def _extract_json(raw: str) -> dict:
    text = raw.strip()
    if text.startswith("```"):
        parts = text.split("```")
        text = parts[1] if len(parts) > 1 else text
        if text.lstrip().startswith("json"):
            text = text.lstrip()[4:]
    return json.loads(text.strip())

def _normalise_target_text(value: str | None) -> str:
    return re.sub(r"\s+", " ", value or "").strip().casefold()

@app.post("/api/suggestions", response_model=SuggestionResponse)
def generate_suggestions(request: SuggestionRequest):
    """
    Optionally refine locally generated actions. The side panel validates the
    result again and uses deterministic local suggestions if this is unavailable.
    """
    context = request.page_context
    safe_context = context.model_dump(exclude_none=True)
    available_targets = [*context.navigation, *context.links, *context.buttons]
    valid_target_texts = {
        _normalise_target_text(target.text): target
        for target in available_targets
        if target.text.strip()
    }
    language_names = {
        "en": "English",
        "zh-CN": "Simplified Chinese",
        "zh-HK": "Traditional Chinese with Cantonese-friendly wording",
        "zh-CN-hokkien": "Traditional Chinese with simple Hokkien-friendly wording",
        "ms": "Malay",
        "ta": "Tamil",
    }
    output_language = language_names.get(request.language, "English")
    prompt = f"""Generate 3 to 5 concise navigation suggestions for the current page.

PAGE SUMMARY (sanitised; it contains no form values or raw HTML):
{json.dumps(safe_context, ensure_ascii=False, indent=2)}

Rules:
- Write labels in {output_language}. Keep domains, URLs, company names, and numbers unchanged.
- Every suggestion must be supported by the page summary.
- For link, button, or navigation targets, targetText must exactly match visible target text.
- If there is no exact target, use targetType "explanation" and omit targetText.
- Do not suggest entering, providing, submitting, uploading, or confirming passwords, OTPs,
  payment/banking details, identity documents, personal documents, crypto, or transactions.
- A login suggestion may navigate to a visible login page but must not enter credentials.
- Avoid destructive actions, duplicates, invented features, and unsupported claims.
- confidence is a number from 0 to 1. Direct targets require confidence >= 0.7.
- Return only JSON with this shape:
{{
  "suggestions": [
    {{
      "id": "short-stable-id",
      "label": "short user-facing label",
      "intent": "safe chatbot navigation request",
      "targetType": "link|button|form|section|navigation|explanation",
      "targetText": "exact visible text or null",
      "confidence": 0.0,
      "reason": "brief evidence"
    }}
  ]
}}"""

    try:
        completion = client.chat.completions.create(
            model="sonar-pro",
            messages=[
                {
                    "role": "system",
                    "content": "Generate conservative, evidence-based website navigation suggestions as strict JSON.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.0,
        )
        parsed = _extract_json(completion.choices[0].message.content)
        raw_suggestions = parsed.get("suggestions", [])
        checked: list[SuggestedAction] = []
        seen_labels: set[str] = set()
        forbidden = re.compile(
            r"\b(enter|submit|provide|upload|confirm|send|share|type)\b.{0,40}"
            r"\b(password|otp|passcode|credit card|cvv|bank|identity|nric|passport|crypto|transaction)\b",
            re.IGNORECASE,
        )

        for raw_item in raw_suggestions[:8]:
            item = SuggestedAction(**raw_item)
            label_key = item.label.strip().casefold()
            if not label_key or label_key in seen_labels or forbidden.search(f"{item.label} {item.intent}"):
                continue
            if item.targetType in {"link", "button", "navigation"}:
                target = valid_target_texts.get(_normalise_target_text(item.targetText))
                if not target or item.confidence < 0.7:
                    item.targetType = "explanation"
                    item.targetText = None
                    item.targetSelector = None
                    item.confidence = min(item.confidence, 0.69)
                else:
                    item.targetText = target.text
            seen_labels.add(label_key)
            checked.append(item)
            if len(checked) == 5:
                break

        if len(checked) < 2:
            raise ValueError("The model did not return enough valid suggestions.")
        return SuggestionResponse(suggestions=checked)
    except Exception as error:
        print(f"[Suggestions] AI refinement unavailable: {error}")
        raise HTTPException(status_code=503, detail="Context suggestion refinement is unavailable.")

@app.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...), lang: str = Form("en-US")):
    """
    Accepts a WAV audio file from the browser and transcribes it using
    Google Speech Recognition in the specified language.
    """
    print(f"[Backend] Received transcription request. Language: {lang}")
    recognizer = sr.Recognizer()
    try:
        raw = await audio.read()
        audio_io = io.BytesIO(raw)
        with sr.AudioFile(audio_io) as source:
            audio_data = recognizer.record(source)
            
        kwargs = {"language": lang}
        if settings.google_speech_api_key and settings.google_speech_api_key != "REPLACE_WITH_YOUR_KEY":
            kwargs["key"] = settings.google_speech_api_key
            
        text = recognizer.recognize_google(audio_data, **kwargs)
        return {"text": text}
    except sr.UnknownValueError:
        return {"text": "", "error": "no-speech"}
    except sr.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Speech recognition service error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=settings.port, reload=settings.debug_mode)
