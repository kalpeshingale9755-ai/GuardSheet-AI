class GuardSheetException(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class DocumentProcessingError(GuardSheetException):
    def __init__(self, message: str):
        super().__init__(f"Document processing failed: {message}", status_code=422)

class AIAnalysisError(GuardSheetException):
    def __init__(self, message: str):
        super().__init__(f"AI analysis error: {message}", status_code=502)
