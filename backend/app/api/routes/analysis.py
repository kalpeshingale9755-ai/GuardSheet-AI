from fastapi import APIRouter, HTTPException
from app.core.db import db
from app.services.audit_engine import AuditEngine
from app.schemas.analysis import DocumentAnalysisStatusResponse

router = APIRouter(prefix="/documents", tags=["analysis"])
audit_engine = AuditEngine()

@router.post("/{document_id}/analyze", response_model=DocumentAnalysisStatusResponse)
async def analyze_document(document_id: str):
    doc = db.get_document(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    # Synchronous processing for prototype/demo scope
    flags = await audit_engine.analyze_document(document_id)

    return DocumentAnalysisStatusResponse(
        document_id=document_id,
        status=doc["status"],
        message=f"Analysis completed successfully. {len(flags)} audit flag(s) generated."
    )

@router.get("/{document_id}/flags")
async def get_document_flags(document_id: str):
    doc = db.get_document(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    flags = db.get_flags(document_id)
    return {"flags": flags}
