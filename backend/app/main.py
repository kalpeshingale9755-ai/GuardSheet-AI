from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import settings
from app.api.routes import documents, analysis, decisions

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="GuardSheet AI - Examination Audit Layer API",
    version="1.1.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow local frontend development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve rendered page images statically under /storage/pages
os.makedirs(settings.PAGES_DIR, exist_ok=True)
app.mount("/storage/pages", StaticFiles(directory=settings.PAGES_DIR), name="pages")

# Include Routers
app.include_router(documents.router, prefix=settings.API_V1_STR)
app.include_router(analysis.router, prefix=settings.API_V1_STR)
app.include_router(decisions.router, prefix=settings.API_V1_STR)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "gemini_configured": bool(settings.GEMINI_API_KEY)
    }
