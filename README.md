# FlowKanban

A single-board Kanban project management web application built with FastAPI and Next.js, featuring real-time AI board assistance.

## Architecture

- **Backend**: FastAPI (Python), SQLite database, Uvicorn server, OpenRouter AI integration
- **Frontend**: Next.js (React), Tailwind CSS, `@hello-pangea/dnd`
- **Infrastructure**: Docker & Docker Compose

## Features

- Fixed customizable columns (Backlog, To Do, In Progress, In Review, Done)
- Drag-and-drop card movement across columns
- Card creation, inline editing, and deletion
- Authentication and session state
- SQLite state persistence
- AI sidebar assistant for automated board updates

## Quick Start

### Using Docker Compose

```bash
docker-compose up --build
```
Access the application at `http://localhost:8080`.

### Local Development

1. **Backend**:
```bash
cd backend
uvicorn app.main:app --reload --port 8080
```

2. **Frontend**:
```bash
cd frontend
npm install
npm run dev
```

### Using Scripts

Start service:
- Windows: `.\scripts\start.bat` or `.\scripts\start.ps1`
- Linux/macOS: `./scripts/start.sh`

Stop service:
- Windows: `.\scripts\stop.bat` or `.\scripts\stop.ps1`
- Linux/macOS: `./scripts/stop.sh`

## Testing

Backend unit tests:
```bash
cd backend
pytest
```

Frontend unit and integration tests:
```bash
cd frontend
npm test
npm run test:e2e
```
