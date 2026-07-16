import os, json
os.chdir(r"c:\Users\alexh\DOM_extractor\Backend")
from config import settings
from schemas import NavigationResponse

import instructor
from google import genai

client = instructor.from_genai(
    client=genai.Client(api_key=settings.gemini_api_key),
    mode=instructor.Mode.JSON,
)

elements = [{"id": "login-button", "tag": "button", "text": "Login"}]

try:
    response = client.chat.completions.create(
        model="gemini-2.5-flash",
        response_model=NavigationResponse,
        messages=[
            {"role": "user", "content": f"You are a navigation assistant. Goal: click the login button. Elements: {json.dumps(elements)}. Return the element_id, action_type, and explanation."}
        ],
        temperature=0.0,
    )
    print("SUCCESS:", response.model_dump_json(indent=2))
except Exception as e:
    import traceback
    traceback.print_exc()
