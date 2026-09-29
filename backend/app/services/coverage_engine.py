class CoverageEngine:
    @staticmethod
    def calculate_coverage(pages: list[dict]) -> dict:
        total_pages = len(pages)
        if total_pages == 0:
            return {
                "total_pages": 0,
                "processed_pages": 0,
                "failed_pages": 0,
                "coverage_percentage": 0.0,
                "is_100_percent_covered": False,
                "warning": "No pages detected."
            }

        processed_count = sum(1 for p in pages if p.get("processing_status") == "COMPLETED")
        failed_count = sum(1 for p in pages if p.get("processing_status") == "FAILED")
        percentage = round((processed_count / total_pages) * 100.0, 1)
        is_complete = (processed_count == total_pages)

        warning = None
        if not is_complete:
            warning = f"Coverage warning: {processed_count}/{total_pages} pages processed. {failed_count} page(s) failed."

        return {
            "total_pages": total_pages,
            "processed_pages": processed_count,
            "failed_pages": failed_count,
            "coverage_percentage": percentage,
            "is_100_percent_covered": is_complete,
            "warning": warning
        }
