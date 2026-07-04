#Purpose: Define data contracts


from pydantic import BaseModel, Field
from typing import List, Literal, Optional

# --- Request Data (What DOM Scanner returns) ---
class DOMElement(BaseModel):
    id: str
    tag: str
    text: str
    type: Optional[str] = None
    placeholder: Optional[str] = None
    disabled: Optional[bool] = False

class NavigationRequest(BaseModel):
    goal: str
    current_url: str
    elements: List[DOMElement]

# --- Response Data (Force LLM to output) ---
class NavigationResponse(BaseModel):
    element_id: Optional[str] = Field(
        description="The exact ID of the chosen element, or null if action_type is done/fail."
    )
    action_type: Literal["click", "type", "done", "fail"]
    type_value: Optional[str] = Field(
        default=None, 
        description="The string to enter, ONLY if action_type is 'type'."
    )
    explanation: str = Field(
        description="A simple, one-sentence explanation for the elderly user."
    )