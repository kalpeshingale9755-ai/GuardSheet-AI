from abc import ABC, abstractmethod
from typing import Dict, Any, List

class AIProvider(ABC):
    @abstractmethod
    async def analyze_page_image(self, image_path: str, page_number: int, context: dict = None) -> Dict[str, Any]:
        """
        Analyzes a page image and returns raw JSON dict with findings list.
        """
        pass
