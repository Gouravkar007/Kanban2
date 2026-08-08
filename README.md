# Kanban Project Management

A single-board Kanban project management application built with a Next.js frontend, FastAPI backend, SQLite persistence, and an AI chat sidebar powered by OpenRouter.

## Features

- Single-board Kanban Interface: Drag and drop cards across five customizable columns.
- Card Management: Create, edit, move, and delete cards with titles and details.
- AI Chat Assistant: Integrated sidebar chat that answers questions and executes board mutations.
- Persistence: User session and board state saved in SQLite database.
- Docker Support: Containerized setup for quick local deployment.

## Tech Stack

- Frontend: Next.js (React / TypeScript), Tailwind CSS, @hello-pangea/dnd, Vitest, Playwright.
- Backend: FastAPI (Python), SQLite, Uvicorn, OpenRouter AI client.
- Operations: Docker, Docker Compose, cross-platform scripts.

## Quick Start

### 1. Using Docker (Recommended)

```bash
docker-compose up --build
```

Access the application at `http://localhost:8080`.

### 2. Local Development Setup

#### Backend Setup

```bash
cd backend
pip install -e .
uvicorn app.main:app --reload --port 8080
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Access the frontend at `http://localhost:3000`.

## Operations Scripts

Helper scripts are available in the `scripts/` directory:

- Windows: `scripts/start.bat` or `scripts/start.ps1`
- Linux / macOS: `scripts/start.sh`

## Testing

### Backend Unit Tests

```bash
cd backend
pytest
```

### Frontend Unit & E2E Tests

```bash
cd frontend
npm test
npm run test:e2e
```
