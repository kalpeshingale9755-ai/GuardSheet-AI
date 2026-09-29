# GuardSheet AI 🛡️📄

GuardSheet AI is an intelligent automated answer sheet evaluation and audit system. It leverages Google Gemini vision models, FastAPI backend, and Next.js frontend to automate the grading, audit checking, coverage analysis, and flag resolution of exam answer scripts.

## 🚀 Features

- **Document Ingestion & Splitting**: Automatic conversion of PDF answer sheets into high-resolution page images.
- **Multimodal AI Auditing**: Uses Google Gemini AI to analyze handwriting, evaluate step-by-step math/code answers, detect flags, and evaluate marks.
- **Interactive Review Interface**: High-resolution page viewer with flagged issue overlay and teacher decision controls.
- **Audit & Coverage Analytics**: Real-time coverage reports, mark verification, and decision log tracking.

## 📁 Repository Structure

```
GuardSheet/
├── backend/                  # FastAPI Python Backend
│   ├── app/                  # Application code (API routes, services, schemas, AI providers)
│   ├── storage/              # Local runtime file storage (git-ignored uploads & pages)
│   ├── .env.example          # Environment variables template
│   └── requirements.txt      # Python dependencies
├── frontend/                 # Next.js TypeScript Frontend
│   ├── app/                  # Next.js App Router pages
│   ├── components/           # UI components (Upload, Review, Dashboard)
│   ├── lib/                  # API clients and TypeScript definitions
│   └── .env.example          # Frontend environment variables template
├── sample_data/              # Sample PDF answer scripts and generation scripts
├── .env.example              # Consolidated environment variables example
└── README.md                 # Project documentation
```

## 🛠️ Getting Started

### Prerequisites

- **Python**: 3.10+
- **Node.js**: 18+
- **Google Gemini API Key**: [Get API Key](https://aistudio.google.com/)

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env and set your GEMINI_API_KEY

uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local

npm run dev
```

The frontend will be running at `http://localhost:3000` and connecting to the backend at `http://localhost:8000`.

## 🛡️ Security & Privacy

- Sensitive environment files (`.env`, `.env.local`) are strictly git-ignored.
- Uploaded test PDFs and rendered page images are excluded from version control.

## 📄 License

MIT License.
