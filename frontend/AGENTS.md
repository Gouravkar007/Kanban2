# The Project Management MVP web app

## Business Requirements

This project is building a Project Management App. Key features:

- A user can sign in
- When signed in, the user sees a Kanban board representing their project
- The Kanban board has fixed columns that can be renamed
- The cards on the Kanban board can be moved with drag and drop, and edited
- There is an AI chat feature in a sidebar; the AI is able to create / edit / move one or more cards

## Limitations

For the MVP, there will only be a user sign in (hardcoded to 'user' and 'password') but the database will support multiple users for future.

For the MVP, there will only be 1 Kanban board per signed in user.

For the MVP, this will run locally (in a docker container)

## Technical Decisions

- NextJS frontend
- Python FastAPI backend, including serving the static NextJS site at /
- Everything packaged into a Docker container
- Use "uv" as the package manager for python in the Docker container
- Use OpenRouter for the AI calls. An OPENROUTER_API_KEY is in .env in the project root
- Use `openai/gpt-oss-120b` as the model
- Use SQLLite local database for the database, creating a new db if it doesn't exist
- Start and Stop server scripts for Mac, PC, Linux in scripts/

## Starting Point

A working MVP of the frontend has been built and is already in frontend. This is not yet designed for the Docker setup. It's a pure frontend-only demo.

## Color Scheme

- Accent Yellow: `#ecad0a` - accent lines, highlights
- Blue Primary: `#209dd7` - links, key sections
- Purple Secondary: `#753991` - submit buttons, important actions
- Dark Navy: `#032147` - main headings
- Gray Text: `#888888` - supporting text, labels

## Coding standards

1. Use latest versions of libraries and idiomatic approaches as of today
2. Keep it simple - NEVER over-engineer, ALWAYS simplify, NO unnecessary defensive programming. No extra features - focus on simplicity.
3. Be concise. Keep README minimal. IMPORTANT: no emojis ever
4. When hitting issues, always identify root cause before trying a fix. Do not guess. Prove with evidence, then fix the root cause.

## Working documentation

All documents for planning and executing this project will be in the docs/ directory.
Please review the docs/PLAN.md document before proceeding.

# Frontend AGENTS documentation

## Purpose

This file documents the current frontend implementation in `frontend/`. It is intended to make the existing codebase easy to understand before backend integration begins.

## Current architecture

- Framework: Next.js 15
- Language: TypeScript
- Styling: Tailwind CSS
- Drag and drop: `@hello-pangea/dnd`
- Test runners: `vitest` and Playwright

## Entry point

- `frontend/src/app/page.tsx`
  - Renders the `KanbanBoard` component directly.
  - No routing or auth currently handled here.

## Main components

- `KanbanBoard` (`frontend/src/components/KanbanBoard.tsx`)
  - Client component (`"use client"`).
  - Loads initial state from `initialBoardState` in `frontend/src/data/dummyData.ts`.
  - Handles drag/drop and card movements using `handleDragEnd`.
  - Supports rename, delete, and add card actions.
  - Uses `KanbanColumn`, `AddCardModal`, and `Header`.

- `KanbanColumn` (`frontend/src/components/KanbanColumn.tsx`)
  - Renders a column and its card list.
  - Provides rename and add-card actions.

- `KanbanCard` / `KanbanCardPreview`
  - Card display components for the board.

- `AddCardModal` (`frontend/src/components/AddCardModal.tsx`)
  - Modal form for creating a new card.
  - Validates title and invokes `onAddCard`.

- `Header` (`frontend/src/components/Header.tsx`)
  - Shows counts and top status information.

## State and data

- `frontend/src/data/dummyData.ts`
  - Provides `initialBoardState`.
  - Contains board structure, columns, cards, and ordering.

- `frontend/src/types/kanban.ts`
  - Defines `BoardState`, `Column`, and `Card` types.

- `frontend/src/utils/kanbanUtils.ts`
  - Pure helpers for board mutations:
    - `renameColumn`
    - `addCard`
    - `deleteCard`
    - `moveCard`

## Testing

- `frontend/src/components/KanbanBoard.test.tsx`
  - Tests the board UI and behavior.
- Existing test files:
  - `frontend/tests/kanban.spec.ts`
  - `frontend/e2e/kanban.spec.ts`
  - `frontend/src/__tests__/*`

Test commands

- `npm run test`
- `npm run test:watch`
- `npm run test:e2e`

## Current limitations

- No backend integration exists yet.
- Board state is local only and resets on refresh.
- No authentication flow.
- No AI or API calls are implemented yet.

## Next steps for frontend integration

1. Keep the current `KanbanBoard` component logic, but replace local state initialization with backend API loading.
2. Add auth gating before `KanbanBoard` renders.
3. Persist move/add/delete/rename events by dispatching backend updates.
4. Add a sidebar chat UI for AI prompts.
5. Expand the test suite to cover:
   - auth flow
   - API integration
   - board persistence
   - AI chat behavior
