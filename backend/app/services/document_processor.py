import pymupdf as fitz # PyMuPDF
from PIL import Image, ImageStat
import os
import uuid
from app.core.config import settings
from app.core.errors import DocumentProcessingError

class DocumentProcessor:
    @staticmethod
    def process_pdf(pdf_path: str, doc_id: str) -> list[dict]:
        """
        Extracts pages from PDF, renders PNG images, and detects blank pages.
        Returns list of page dictionaries.
        """
        if not os.path.exists(pdf_path):
            raise DocumentProcessingError("PDF file does not exist on disk.")

        try:
            doc = fitz.open(pdf_path)
        except Exception as e:
            raise DocumentProcessingError(f"Failed to open PDF: {str(e)}")

        if len(doc) == 0:
            raise DocumentProcessingError("PDF document has 0 pages.")

        pages_metadata = []

        for index in range(len(doc)):
            page_num = index + 1
            page_id = f"page_{doc_id}_{page_num}"
            image_filename = f"{doc_id}_page_{page_num}.png"
            image_output_path = os.path.join(settings.PAGES_DIR, image_filename)
            image_url = f"/storage/pages/{image_filename}"

            try:
                page = doc.load_page(index)
                # Render at 150 DPI for good readability and fast processing
                pix = page.get_pixmap(dpi=150)
                pix.save(image_output_path)

                # Blank detection using Pillow
                is_blank = DocumentProcessor._is_page_blank(image_output_path, page.get_text())

                pages_metadata.append({
                    "id": page_id,
                    "document_id": doc_id,
                    "page_number": page_num,
                    "image_path": image_output_path,
                    "image_url": image_url,
                    "is_blank": is_blank,
                    "processing_status": "COMPLETED",
                    "coverage_status": "NOT_REVIEWED",
                    "ai_status": "PENDING"
                })

            except Exception as page_err:
                # Mark individual page as failed processing, do not crash whole doc
                pages_metadata.append({
                    "id": page_id,
                    "document_id": doc_id,
                    "page_number": page_num,
                    "image_path": "",
                    "image_url": "",
                    "is_blank": False,
                    "processing_status": "FAILED",
                    "coverage_status": "NOT_REVIEWED",
                    "ai_status": "FAILED"
                })

        doc.close()
        return pages_metadata

    @staticmethod
    def _is_page_blank(image_path: str, page_text: str) -> bool:
        """
        Basic blank / near-blank detection combining text content length and image standard deviation.
        """
        # If there's non-whitespace text over 30 chars, it's not blank
        clean_text = page_text.strip()
        if len(clean_text) > 40:
            return False

        if not os.path.exists(image_path):
            return True

        try:
            with Image.open(image_path) as img:
                grayscale = img.convert("L")
                stat = ImageStat.Stat(grayscale)
                # If stddev is extremely low (< 5.0), the page is virtually solid white/blank
                stddev = stat.stddev[0]
                return stddev < 5.0
        except Exception:
            return False
