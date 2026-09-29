from pydantic import BaseModel, Field, model_validator
from typing import Optional, List

class RegionSchema(BaseModel):
    x: float = Field(..., ge=0.0, le=1.0)
    y: float = Field(..., ge=0.0, le=1.0)
    width: float = Field(..., ge=0.0, le=1.0)
    height: float = Field(..., ge=0.0, le=1.0)

    @model_validator(mode='after')
    def validate_bounds(self):
        if self.x + self.width > 1.05: # Slight tolerance for rounding
            self.width = max(0.01, min(1.0 - self.x, self.width))
        if self.y + self.height > 1.05:
            self.height = max(0.01, min(1.0 - self.y, self.height))
        return self

class RawFindingSchema(BaseModel):
    type: str = Field(..., description="Finding type: REASONING, PARTIAL_CREDIT, ROUGH_WORK, COVERAGE, REVIEW_REQUIRED")
    title: str
    description: str
    evidence: str
    region: Optional[RegionSchema] = None
    confidence: float = Field(..., ge=0.0, le=1.0)

    @model_validator(mode='after')
    def normalize_type(self):
        valid_types = {"REASONING", "PARTIAL_CREDIT", "ROUGH_WORK", "COVERAGE", "REVIEW_REQUIRED"}
        upper_type = self.type.upper() if self.type else "REVIEW_REQUIRED"
        if upper_type not in valid_types:
            self.type = "REVIEW_REQUIRED"
        else:
            self.type = upper_type
        return self

class AIAnalysisResponseSchema(BaseModel):
    findings: List[RawFindingSchema] = []

class AuditFlagSchema(BaseModel):
    id: str
    document_id: str
    page_id: str
    page_number: int
    type: str
    title: str
    description: str
    evidence: str
    region: Optional[RegionSchema] = None
    confidence: float
    status: str # OPEN, ACCEPTED, MODIFIED, DISMISS / DISMISSED
    decision_comment: Optional[str] = None
    created_at: str

class DocumentAnalysisStatusResponse(BaseModel):
    document_id: str
    status: str
    message: str
