# High level steps for project

## Part 1: Plan

Goal

- Turn this document into a fully detailed implementation plan.
- Add substeps as a checklist.
- Add tests and success criteria for every part.
- Create `frontend/AGENTS.md` describing the current frontend code.
- Confirm the plan with the user before starting actual implementation.

Checklist

- [x] Review current frontend source and test coverage.
- [x] Confirm current architecture, libraries, and existing behavior.
- [x] Draft `frontend/AGENTS.md` to document the frontend.
- [x] Define a minimum 80% unit test coverage goal for frontend and backend logic.
- [x] Define robust integration tests for critical flows.
- [x] Get user approval on this plan before moving to Part 2.

Success criteria

- Plan has concrete substeps for each part.
- Every part includes explicit test types, tools, and acceptance criteria.
- `frontend/AGENTS.md` exists and accurately maps frontend files/components.
- The plan explicitly calls out coverage goals and integration testing requirements.

## Part 2: Scaffolding

Goal

- Create the backend scaffold under `backend/` using FastAPI.
- Add Docker infrastructure to build and run the app.
- Add `scripts/` start/stop scripts for Windows, Mac, Linux.
- Verify the backend can serve a simple static HTML page and a simple API call.

Checklist

- [x] Create `backend/` directory.
- [x] Add FastAPI app with one HTTP route at `/api/health`.
- [x] Add static file serving for the frontend build output under `/`.
- [x] Create `Dockerfile` for the full stack container.
- [x] Add `docker-compose.yaml` if needed for local development.
- [x] Add scripts in `scripts/`:
  - `start.ps1`, `stop.ps1`
  - `start.sh`, `stop.sh`
  - `start.bat`, `stop.bat`
- [x] Confirm `uv` is the package manager in Docker and dependency installation works.

Tests

- unit test: backend health route returns 200 and expected JSON.
- integration test: container runs; `/` returns static HTML content.
- smoke test: `/api/health` is reachable.

Success criteria

- `backend/` starts successfully.
- The app serves a hello world static response at `/`.
- The API route works from inside the container.
- Docker build passes.

## Part 3: Add in Frontend

Goal

- Build the existing frontend statically.
- Serve the built frontend from the backend.
- Confirm the demo Kanban board is visible at `/` in the running container.

Checklist

- [x] Add frontend build step to the repo.
- [x] Configure backend to serve the static Next.js output.
- [x] Ensure the frontend routes work from `/`.
- [x] Add frontend unit tests for core components.
- [x] Add frontend integration tests for rendering the Kanban board.

Tests

- unit tests: component rendering and utility functions.
- integration test: load `/` and verify the Kanban board appears.
- coverage: target 80% for frontend logic.

Success criteria

- frontend builds with `npm run build`.
- Static site is served by backend and visible in browser.
- Existing Kanban demo functions in the served app.

## Part 4: Add in a fake user sign in experience

Goal

- Create a login flow using dummy credentials.
- Prevent access to the Kanban until authentication.
- Allow logout.

Checklist

- [x] Add login page or modal.
- [x] Validate credentials against `user` / `password`.
- [x] Store session state in client-side state or cookie.
- [x] Protect the Kanban route/view behind auth.
- [x] Add logout support.
- [x] Add tests for login success, failure, and logout.

Tests

- unit tests: login form validation.
- integration tests: attempt access to Kanban before login, after login, and after logout.
- coverage: auth flow must be covered.

Success criteria

- `/` requires login before showing the board.
- valid credentials grant access.
- invalid credentials are rejected.
- logout returns to login state.

## Part 5: Database modeling

Goal

- Propose a schema for the Kanban board stored as JSON.
- Document the database schema and data model in `docs/`.
- Confirm schema design with the user.

Checklist

- [x] Define `users`, `boards`, `columns`, `cards` tables or JSON-based storage.
- [x] Decide whether to store board state as JSON in one row.
- [x] Create `docs/schema.md` or add schema details in `docs/PLAN.md`.
- [x] Include sample JSON structure.
- [x] Review and sign off before implementation.

Tests

- design review only in this phase.
- add schema validation tests once implemented.

Success criteria

- Database schema is documented.
- Data model supports one board per user.
- Data model allows columns, cards, titles, details, orders, and updates.

## Part 6: Backend

Goal

- Add backend API routes to read and update the Kanban.
- The database should be created if missing.
- Support user-specific board data.

Checklist

- [x] Add backend route `GET /api/board`.
- [x] Add backend route `POST /api/board`.
- [x] Add backend route `POST /api/login` or equivalent auth check.
- [x] Ensure SQLite database auto-creates if absent.
- [x] Add backend unit tests for read/write and login behavior.

Tests

- unit tests: data persistence, JSON schema validation, database creation.
- integration tests: API CRUD operations.

Success criteria

- backend can return the current board for the dummy user.
- board updates persist across server restarts.
- database file is created automatically.

## Part 7: Frontend + Backend

Goal

- Update the frontend to use backend APIs instead of local state.
- Make the Kanban persistent.

Checklist

- [x] Replace `initialBoardState` with API-driven state loading.
- [x] Add backend save calls for rename/add/delete/move actions.
- [x] Show loading state while board loads.
- [x] Add error handling for API failures.
- [x] Add integration tests for full frontend/backend persistence flow.

Tests

- integration tests: login, load board, update card, reload board, verify persistence.
- coverage: ensure frontend API integration logic is covered.

Success criteria

- the frontend loads board data from backend.
- board updates are saved to the backend.
- page refresh preserves board state.

## Part 8: AI connectivity

Goal

- Add backend AI connectivity using OpenRouter.
- Verify connectivity with a simple test prompt.

Checklist

- [x] Add backend route `POST /api/ai/check` or similar.
- [x] Implement OpenRouter client call.
- [x] Use `OPENROUTER_API_KEY` from `.env`.
- [x] Add simple test that sends `2+2` and verifies AI response.
- [x] Add unit tests around AI integration wiring.

Tests

- integration test: backend AI route returns expected response structure.
- verify environment variables are required.

Success criteria

- backend can call OpenRouter successfully.
- AI connectivity test passes.

## Part 9: Structured AI output + Kanban context

Goal

- Send board JSON plus user prompt to AI.
- Parse structured AI output containing response text and optional board updates.

Checklist

- [x] Define structured output schema for AI responses.
- [x] Send `board`, `question`, and `conversationHistory` to the AI.
- [x] Parse AI output and apply changes if present.
- [x] Add tests for AI output parsing and board update handling.

Tests

- unit tests: structured output parser.
- integration tests: AI route returns structured response and updates board when appropriate.

Success criteria

- AI response includes user-facing text and optional structured board changes.
- backend applies updates correctly when returned by AI.

## Part 10: AI chat sidebar

Goal

- Add a frontend sidebar chat widget.
- Use AI structured output to update the Kanban automatically.
- Refresh UI after AI-driven updates.

Checklist

- [x] Add chat sidebar UI.
- [x] Add conversation state management.
- [x] Send user message and board state to backend AI endpoint.
- [x] Display AI response and apply board updates.
- [x] Add tests for chat UI and AI interaction flow.

Tests

- unit tests: chat component behavior.
- integration tests: send prompt, receive AI response, update board view.

Success criteria

- users can chat with the sidebar.
- AI responses appear in chat.
- AI-driven board updates refresh the UI automatically.

## Part 11: CI/CD Pipeline & GitHub Actions Automation

Goal

- Set up GitHub Actions workflow to run backend pytest, frontend unit tests, and Playwright integration tests automatically on every push and pull request.
- Add automated linting and build checks.

Checklist

- [ ] Create `.github/workflows/ci.yml`.
- [ ] Add backend test step (pytest with uv / python).
- [ ] Add frontend test step (Vitest & Playwright e2e).
- [ ] Add Docker build verification step.
- [ ] Add workflow status badge to README.md.

Tests

- GitHub Actions workflow execution on push.

Success criteria

- All backend and frontend tests execute cleanly in GitHub Actions CI pipeline.

## Part 12: Board Export, Import, & Reset Controls

Goal

- Allow users to export their Kanban board as a JSON file, import a previously saved JSON board, and reset the board back to initial demo data.

Checklist

- [ ] Add Export Board button to download `kanban-board.json`.
- [ ] Add Import Board feature to upload and validate JSON board files.
- [ ] Add Reset Board modal with confirmation.
- [ ] Connect export/import/reset options to backend APIs.

Tests

- unit tests for JSON import validation.
- integration tests for export, import, and reset operations.

Success criteria

- User can download, upload, and reset Kanban board state seamlessly.

## Part 13: Card Labels, Priorities, and Search/Filtering

Goal

- Add optional Priority levels (Low, Medium, High) and Tag labels to Kanban cards.
- Add a search input bar to filter cards dynamically.

Checklist

- [ ] Add priority badge selector to Card creation/editing.
- [ ] Add visual tag/label badges on Kanban cards.
- [ ] Add real-time search bar to filter board cards by title or tag.
- [ ] Update backend JSON schema and AI prompt parser to handle priorities and tags.

Tests

- unit tests for priority and tag rendering.
- integration tests for searching and filtering cards.

Success criteria

- Cards display color-coded priority and tag badges; search bar filters cards in real time.
