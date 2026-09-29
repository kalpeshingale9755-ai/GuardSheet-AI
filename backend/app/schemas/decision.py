from pydantic import BaseModel, Field
from typing import Optional

class DecisionRequest(BaseModel):
    decision: str = Field(..., description="ACCEPT, MODIFY, or DISMISS")
    comment: Optional[str] = None

class DecisionResponse(BaseModel):
    flag_id: str
    status: str
    decision: str
    comment: Optional[str] = None
