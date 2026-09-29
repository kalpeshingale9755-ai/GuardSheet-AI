import uuid
import datetime
import logging
from typing import List, Dict, Any, Optional
from app.ai.gemini_provider import GeminiProvider
from app.schemas.analysis import RawFindingSchema, RegionSchema, AuditFlagSchema
from app.core.db import db

logger = logging.getLogger(__name__)

class AuditEngine:
    def __init__(self):
        self.ai_provider = GeminiProvider()

    async def analyze_document(self, doc_id: str) -> List[dict]:
        """
        Processes AI analysis for all pages of a document and generates AuditFlags.
        """
        document = db.get_document(doc_id)
        if not document:
            return []

        document["status"] = "PROCESSING"
        pages = db.get_pages(doc_id)
        generated_flags = []

        for page in pages:
            if page.get("processing_status") != "COMPLETED":
                page["ai_status"] = "SKIPPED"
                continue

            try:
                # Call AI Provider
                analysis_raw = await self.ai_provider.analyze_page_image(
                    image_path=page.get("image_path", ""),
                    page_number=page.get("page_number", 1)
                )

                validated_findings = self._validate_and_normalize_findings(analysis_raw)
                page["ai_status"] = "COMPLETED"

                if validated_findings:
                    page["coverage_status"] = "FLAGGED"
                    for finding in validated_findings:
                        flag_id = f"flag_{uuid.uuid4().hex[:8]}"
                        flag_dict = {
                            "id": flag_id,
                            "document_id": doc_id,
                            "page_id": page["id"],
                            "page_number": page["page_number"],
                            "type": finding.type,
                            "title": finding.title,
                            "description": finding.description,
                            "evidence": finding.evidence,
                            "region": finding.region.model_dump() if finding.region else None,
                            "confidence": finding.confidence,
                            "status": "OPEN",
                            "decision_comment": None,
                            "created_at": datetime.datetime.now().isoformat()
                        }
                        generated_flags.append(flag_dict)
                else:
                    if page["coverage_status"] == "NOT_REVIEWED":
                        page["coverage_status"] = "ANALYZED"

            except Exception as page_ai_err:
                logger.error(f"AI Analysis failed on page {page.get('page_number')}: {page_ai_err}")
                # AI failure does not change deterministic page processing status!
                page["ai_status"] = "FAILED"

        document["status"] = "ANALYZED"
        db.add_flags(doc_id, generated_flags)
        return generated_flags

    def _validate_and_normalize_findings(self, raw_data: Dict[str, Any]) -> List[RawFindingSchema]:
        """
        Strictly validates raw JSON from AI provider against Pydantic schema.
        """
        if not isinstance(raw_data, dict) or "findings" not in raw_data:
            return []

        validated = []
        raw_list = raw_data.get("findings", [])
        if not isinstance(raw_list, list):
            return []

        for item in raw_list:
            if not isinstance(item, dict):
                continue
            try:
                # Schema validation
                finding_obj = RawFindingSchema(**item)
                validated.append(finding_obj)
            except Exception as val_err:
                logger.warning(f"Skipping malformed AI finding: {item}. Error: {val_err}")
                continue

        return validated
