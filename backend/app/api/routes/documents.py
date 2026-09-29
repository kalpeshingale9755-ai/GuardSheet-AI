import os
import uuid
import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.core.config import settings
from app.core.db import db
from app.core.errors import DocumentProcessingError
from app.services.document_processor import DocumentProcessor
from app.services.coverage_engine import CoverageEngine
from app.schemas.document import DocumentUploadResponse, DocumentDetail, PageInfo

router = APIRouter(prefix="/documents", tags=["documents"])

@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    doc_id = f"doc_{uuid.uuid4().hex[:8]}"
    saved_filename = f"{doc_id}_{file.filename}"
    file_path = os.path.join(settings.UPLOADS_DIR, saved_filename)

    try:
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    try:
        pages_metadata = DocumentProcessor.process_pdf(file_path, doc_id)
    except DocumentProcessingError as dpe:
        raise HTTPException(status_code=422, detail=dpe.message)
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"PDF extraction error: {str(err)}")

    doc_record = {
        "id": doc_id,
        "filename": file.filename,
        "file_path": file_path,
        "file_type": "application/pdf",
        "page_count": len(pages_metadata),
        "status": "UPLOADED",
        "created_at": datetime.datetime.now().isoformat()
    }

    db.add_document(doc_record)
    db.set_pages(doc_id, pages_metadata)

    return DocumentUploadResponse(
        document_id=doc_id,
        filename=file.filename,
        page_count=len(pages_metadata),
        status="UPLOADED"
    )

@router.get("/{document_id}", response_model=DocumentDetail)
async def get_document(document_id: str):
    doc = db.get_document(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    pages = db.get_pages(document_id)
    coverage_info = CoverageEngine.calculate_coverage(pages)

    return DocumentDetail(
        id=doc["id"],
        filename=doc["filename"],
        page_count=doc["page_count"],
        status=doc["status"],
        created_at=doc["created_at"],
        processed_pages_count=coverage_info["processed_pages"],
        coverage_percentage=coverage_info["coverage_percentage"]
    )

@router.get("/{document_id}/pages")
async def get_document_pages(document_id: str):
    doc = db.get_document(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    pages = db.get_pages(document_id)
    return {"pages": pages}
