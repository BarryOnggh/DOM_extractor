import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

# Import your configurations and schemas
from config import settings
from schemas import NavigationRequest, NavigationResponse

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

def build_system_prompt(elements: list, page_context: str = "page") -> str:
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
        modal_note = "\nIMPORTANT: A dialog/modal window is currently open on screen. The elements below are ONLY from inside that modal. You MUST interact with one of these modal elements — do NOT reference anything outside."

    return f"""You are an AI navigation assistant helping elderly or low-literacy users complete tasks on Singapore government websites (HDB, Singpass, CPF, etc.).
Your task is to identify the single best NEXT interactive element the user should act on RIGHT NOW.{modal_note}

AVAILABLE ELEMENTS ON SCREEN RIGHT NOW:
{serialized_elements}

RULES:
1. STRICT ID MATCHING: You may ONLY output an element_id that explicitly appears in the list above. Never invent or guess an ID.

2. ELEMENT TYPES: Each element is labelled [BUTTON], [LINK], [INPUT], or [CLOSE BUTTON]. When choosing between two elements with similar text, ALWAYS prefer the [BUTTON] over the [LINK]. A [CLOSE BUTTON] should only be chosen if the current modal/dialog was opened by mistake — otherwise proceed through it.

3. MODAL BEHAVIOUR: If a login dialog/modal is open, interact with the primary [BUTTON] or [LINK] action inside it (e.g. "[BUTTON] Residents MyHDB Page", "[LINK] Log in with Singpass"). Do not close the modal unless you are truly stuck.

4. LOGIN PAGE BEHAVIOUR: If you see "[BUTTON] Log in with Singpass" in the list, that is always the correct choice on a login page — not any [LINK] in the footer or help text.

5. SINGPASS APP / QR LOGIN: If you are on a Singpass login page and see the "[QR SCANNER]" element, ALWAYS instruct the user to use the Singpass App / QR code login (which is the default). Set action_type to "click" and target the QR scanner element with explanation "Please use your Singpass mobile app to scan the QR code on the screen to log in." DO NOT choose the password login or password tab.

6. NO REPETITION: Never repeat an element_id that appears in the COMPLETED STEPS history.

7. INTERMEDIATE STEPS (CRITICAL): Logging in, clicking "Residents", "MyHDB Page", "Singpass", or "continue" are all valid intermediate steps toward any government service goal. Always proceed through them.

8. FAIL GRACEFULLY: Only set action_type to "fail" if NO element in the list can advance the goal at all (or for the Singpass QR rule above).

9. EMPATHY & SIMPLICITY: Write the "explanation" as one short, plain sentence for an elderly user — no jargon. (e.g., "I will click the Login button for you.")

10. FILL FORMS FIRST: If there are empty text inputs on the page (like NRIC, Name, Phone), you MUST fill them out using action_type "type" and type_value BEFORE clicking "Next" or "Submit". Do not skip empty fields!

11. INPUT HANDLING: If a text field needs to be filled, set action_type to "type" and put the exact value in "type_value".

12. STEP-BY-STEP: Choose only the immediate next single step.

You MUST respond with ONLY valid JSON matching this exact schema — no extra text, no markdown, no code fences:
{{
  "element_id": "<string or null>",
  "action_type": "<click|type|scroll|done|fail>",
  "type_value": "<string or null>",
  "explanation": "<string>"
}}"""

@app.post("/api/next-step", response_model=NavigationResponse)
def get_next_step(request: NavigationRequest):
    valid_ids = {el.id for el in request.elements}
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
        {"role": "system", "content": build_system_prompt(request.elements, request.page_context or "page")},
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
            if response.element_id in valid_ids:
                return response
                
            # Condition C: Hallucination detected.
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=settings.port, reload=settings.debug_mode)