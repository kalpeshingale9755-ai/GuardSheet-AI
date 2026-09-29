from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    page_count: int
    status: str

class PageInfo(BaseModel):
    id: str
    document_id: str
    page_number: int
    image_url: str
    is_blank: bool
    processing_status: str # PENDING, PROCESSING, COMPLETED, FAILED
    coverage_status: str # NOT_REVIEWED, ANALYZED, FLAGGED, REVIEWED
    ai_status: str = "PENDING" # PENDING, COMPLETED, FAILED

class DocumentDetail(BaseModel):
    id: str
    filename: str
    page_count: int
    status: str
    created_at: str
    processed_pages_count: int
    coverage_percentage: float
