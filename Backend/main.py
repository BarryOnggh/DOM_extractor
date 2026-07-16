import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import instructor
from google import genai

# Import your configurations and schemas
from config import settings
from schemas import NavigationRequest, NavigationResponse

# Initialize FastAPI app
app = FastAPI(
    title="AI Navigation Assistant API",
    description="Backend processor utilizing Gemini to compute next steps for web navigation workflows.",
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

# Initialize the Gemini client wrapped with Instructor for strict Pydantic parsing.
client = instructor.from_genai(
    client=genai.Client(api_key=settings.gemini_api_key),
    mode=instructor.Mode.JSON,
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
2. CONTEXT AWARENESS: The elements above reflect exactly what is visible on screen right now. A modal may be open — work within it. Do NOT close a login/advisory modal to look for something behind it. Proceed through it.
3. NO REPETITION: If a previous action is provided, do NOT repeat the exact same element_id and action_type unless the page has not changed.
4. INTERMEDIATE STEPS (CRITICAL): If a login dialog pops up, or you see options for 'Residents', 'MyHDB Page', 'Singpass', or 'continue', you MUST select them to progress. Do not fail and do not close the modal, because logging in is a required step for all government services (like getting a housing grant).
5. FAIL GRACEFULLY: If the user's goal cannot be advanced by any element in the list, set action_type to "fail" and explain briefly.
6. EMPATHY & SIMPLICITY: Write the "explanation" as one short, plain sentence for an elderly user — no jargon. (e.g., "I will click the Login button for you.")
7. INPUT HANDLING: If a text field needs to be filled, set action_type to "type" and put the exact value in "type_value".
8. STEP-BY-STEP: Choose only the immediate next single step. Do not plan the whole workflow.
"""

@app.post("/api/next-step", response_model=NavigationResponse)
def get_next_step(request: NavigationRequest):
    valid_ids = {el.id for el in request.elements}
    max_retries = 2

    # Build the user turn — include previous action context if available
    user_content = f"Goal: {request.goal}"
    if request.previous_action:
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
            print(f"--- Attempt {attempt + 1}: Calling Gemini 2.5 Flash... ---")
            
            # Execute completion utilizing Gemini
            response = client.chat.completions.create(
                model="gemini-2.5-flash",
                response_model=NavigationResponse,
                messages=messages,
                temperature=0.0
            )
            
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
            
            messages.append({"role": "assistant", "content": response.model_dump_json()})
            messages.append({"role": "user", "content": error_msg})
            
            print(f"[Warning] Element ID hallucination caught (Attempt {attempt + 1}). Re-routing request...")

        except Exception as e:
            error_str = str(e)
            if "429" in error_str or "Quota exceeded" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                return NavigationResponse(
                    element_id=None,
                    action_type="fail",
                    type_value=None,
                    explanation="I am currently rate-limited by Google's servers. Please wait 45 seconds and try again!"
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