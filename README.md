# FlowKanban

FlowKanban is a single-board Kanban project management application featuring automated AI board assistance and full undo/redo capabilities.

## Architecture & Structure

The project is structured as a client-side rendered Next.js frontend integrated with a FastAPI backend.

```
.
├── backend/               # FastAPI python backend
│   ├── app/               # Core API server logic
│   │   ├── static/        # Compiled frontend production assets
│   │   └── logs/          # Local rotating application log files
│   └── tests/             # Backend pytest suite
├── frontend/              # Next.js frontend workspace
│   ├── src/               # React components and state utilities
│   └── e2e/               # Playwright E2E integration test suite
└── scripts/               # Automation control scripts
```

- **Backend**: FastAPI serving static files, managing basic user board states, and routing requests to OpenRouter.
- **Frontend**: Next.js (React), HSL-curated Hues CSS design system, `@hello-pangea/dnd` for drag-and-drop actions, and local Undo/Redo history tracking.

## Development Pipeline

### 1. Prerequisite Configuration

Create a `.env` file in the root directory:
```env
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 2. Local Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # On Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8080
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Production Build & Static Export Sync
To compile the frontend and serve it statically from the FastAPI server:
```bash
cd frontend
npm run build
cd ../backend
Remove-Item -Path app/static/* -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item -Path ../frontend/out/* -Destination app/static/ -Recurse -Container -Force
```

### 4. Testing Suite

#### Backend Pytest Tests
```bash
cd backend
python -m pytest
```

#### Frontend Vitest Tests
```bash
cd frontend
npm run test -- --run
```

#### Playwright End-to-End Tests
```bash
cd frontend
npx playwright test
```

## Quick Deployment

Deploy locally using Docker:
```bash
docker-compose up --build
```
Access the application at `http://localhost:8080`.
