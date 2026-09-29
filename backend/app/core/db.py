from typing import Dict, List, Optional
import datetime

class InMemoryDB:
    def __init__(self):
        self.documents: Dict[str, dict] = {}
        self.pages: Dict[str, list] = {} # document_id -> list of page dicts
        self.flags: Dict[str, list] = {} # document_id -> list of flag dicts
        self.decisions: Dict[str, dict] = {} # flag_id -> decision dict

    def add_document(self, doc_data: dict):
        self.documents[doc_data["id"]] = doc_data
        if doc_data["id"] not in self.pages:
            self.pages[doc_data["id"]] = []
        if doc_data["id"] not in self.flags:
            self.flags[doc_data["id"]] = []

    def get_document(self, doc_id: str) -> Optional[dict]:
        return self.documents.get(doc_id)

    def set_pages(self, doc_id: str, pages_list: list):
        self.pages[doc_id] = pages_list

    def get_pages(self, doc_id: str) -> list:
        return self.pages.get(doc_id, [])

    def get_page(self, doc_id: str, page_id: str) -> Optional[dict]:
        for p in self.pages.get(doc_id, []):
            if p["id"] == page_id:
                return p
        return None

    def add_flags(self, doc_id: str, flags_list: list):
        if doc_id not in self.flags:
            self.flags[doc_id] = []
        self.flags[doc_id].extend(flags_list)

    def get_flags(self, doc_id: str) -> list:
        return self.flags.get(doc_id, [])

    def update_flag_status(self, flag_id: str, status: str, comment: Optional[str] = None) -> Optional[dict]:
        for doc_id, flag_list in self.flags.items():
            for f in flag_list:
                if f["id"] == flag_id:
                    f["status"] = status
                    if comment is not None:
                        f["decision_comment"] = comment
                    self.decisions[flag_id] = {
                        "flag_id": flag_id,
                        "status": status,
                        "comment": comment,
                        "created_at": datetime.datetime.now().isoformat()
                    }
                    return f
        return None

db = InMemoryDB()
