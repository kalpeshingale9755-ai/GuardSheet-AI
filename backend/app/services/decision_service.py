from typing import Optional
from app.core.db import db
from app.core.errors import GuardSheetException

class DecisionService:
    @staticmethod
    def record_decision(flag_id: str, decision: str, comment: Optional[str] = None) -> dict:
        allowed = {"ACCEPT", "MODIFY", "DISMISS"}
        clean_dec = decision.upper()
        if clean_dec not in allowed:
            raise GuardSheetException("Invalid decision. Allowed values: ACCEPT, MODIFY, DISMISS", status_code=400)

        # Map to flag status
        status_map = {
            "ACCEPT": "ACCEPTED",
            "MODIFY": "MODIFIED",
            "DISMISS": "DISMISSED"
        }
        target_status = status_map[clean_dec]

        updated_flag = db.update_flag_status(flag_id, target_status, comment)
        if not updated_flag:
            raise GuardSheetException(f"Flag with ID {flag_id} not found.", status_code=404)

        # Check if all flags for the document/page have decisions
        doc_id = updated_flag["document_id"]
        page_id = updated_flag["page_id"]
        
        all_flags = db.get_flags(doc_id)
        page_flags = [f for f in all_flags if f["page_id"] == page_id]
        
        # If all page flags are decided, update page coverage_status to REVIEWED
        if all(f["status"] != "OPEN" for f in page_flags):
            page = db.get_page(doc_id, page_id)
            if page:
                page["coverage_status"] = "REVIEWED"

        return {
            "flag_id": flag_id,
            "status": target_status,
            "decision": clean_dec,
            "comment": comment
        }
