import json
from fastapi import FastAPI, HTTPException
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

# Initialize the Gemini client wrapped with Instructor for strict Pydantic parsing.
client = instructor.from_genai(
    client=genai.Client(api_key=settings.gemini_api_key),
    mode=instructor.Mode.JSON,
)

def build_system_prompt(elements: list) -> str:
    """
    Dynamically serializes the pruned DOM snapshot into a clean JSON manifest
    and injects it directly into the core structural ruleset for the LLM.
    """
    serialized_elements = json.dumps(
        [el.model_dump(exclude_none=True) for el in elements], 
        indent=2
    )
    
    return f"""You are an AI navigation assistant for complex government portals (such as Singpass, IRAS, and health portals).
Your task is to match the user's current GOAL to the single best interactive element on the screen.

AVAILABLE ELEMENTS SNAPSHOT:
{serialized_elements}

RULES:
1. STRICT ID MATCHING: You may ONLY output an element_id that explicitly exists in the AVAILABLE ELEMENTS SNAPSHOT list. 
2. NO ASSUMPTIONS: If the user's goal cannot be clearly advanced or achieved by interacting with the current screen elements, you must set action_type to "fail" and explain why simply.
3. EMPATHY & SIMPLICITY: Your "explanation" must be a single, short sentence written for low-literacy or elderly users. Avoid technical jargon entirely. (e.g., "I will click the 'Login with Singpass' button for you.")
4. INPUT HANDLING: If the user needs to query or input data into a field, set action_type to "type" and provide the exact string inside "type_value".
5. STEP-BY-STEP: Only plan the immediate NEXT step. Do not try to solve the entire workflow at once.
"""

@app.post("/api/next-step", response_model=NavigationResponse)
def get_next_step(request: NavigationRequest):
    valid_ids = {el.id for el in request.elements}
    max_retries = 2
    
    # Initialize the baseline conversational frame
    messages = [
        {"role": "system", "content": build_system_prompt(request.elements)},
        {"role": "user", "content": f"Goal: {request.goal}"}
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
            raise HTTPException(
                status_code=500, 
                detail=f"Downstream LLM execution failure: {str(e)}"
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