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
    sensitive_kind: Optional[
        Literal["password", "otp", "payment", "banking", "government_id", "document_upload", "email"]
    ] = None

class PageTarget(BaseModel):
    text: str
    targetType: str
    id: Optional[str] = None

class PageField(BaseModel):
    type: str
    label: str = ""
    classification: str = "none"
    dataKind: str = "generic_text"
    disabled: bool = False

class PageForm(BaseModel):
    type: str
    labels: List[str] = Field(default_factory=list)
    fields: List[PageField] = Field(default_factory=list)

class PageSummary(BaseModel):
    url: str
    hostname: str
    route: str
    title: str = ""
    description: str = ""
    headings: List[str] = Field(default_factory=list)
    navigation: List[PageTarget] = Field(default_factory=list)
    buttons: List[PageTarget] = Field(default_factory=list)
    links: List[PageTarget] = Field(default_factory=list)
    forms: List[PageForm] = Field(default_factory=list)
    breadcrumbs: List[str] = Field(default_factory=list)
    ariaLabels: List[str] = Field(default_factory=list)
    visibleText: List[str] = Field(default_factory=list)
    pageCategory: str = "unknown"

class PreviousAction(BaseModel):
    element_id: Optional[str] = None
    action_type: str
    title: Optional[str] = None
    explanation: str

class NavigationRequest(BaseModel):
    goal: str
    current_url: str
    elements: List[DOMElement]
    page_context: Optional[str] = None          # "modal" or "page"
    page_summary: Optional[PageSummary] = None
    previous_action: Optional[PreviousAction] = None  # what happened last step
    step_history: Optional[List[PreviousAction]] = None  # full history of all steps taken

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
    title: str = Field(
        description="A short 3-6 word imperative summary of the action, naming the actual element/page (e.g. 'Open the HDB Flat Portal')."
    )
    explanation: str = Field(
        description="A simple, one-sentence explanation for the elderly user."
    )

class SuggestedAction(BaseModel):
    id: str
    label: str
    intent: str
    targetType: Literal["link", "button", "form", "section", "navigation", "explanation"]
    targetText: Optional[str] = None
    targetSelector: Optional[str] = None
    confidence: float = Field(ge=0, le=1)
    reason: Optional[str] = None

class SuggestionRequest(BaseModel):
    page_context: PageSummary
    language: str = "en"

class SuggestionResponse(BaseModel):
    suggestions: List[SuggestedAction]
