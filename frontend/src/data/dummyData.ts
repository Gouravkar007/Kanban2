import { BoardState } from "../types/kanban";

export const initialBoardState: BoardState = {
  columnOrder: ["col-1", "col-2", "col-3", "col-4", "col-5"],
  columns: {
    "col-1": {
      id: "col-1",
      title: "Backlog",
      cardIds: ["card-1", "card-2"],
    },
    "col-2": {
      id: "col-2",
      title: "To Do",
      cardIds: ["card-3", "card-4"],
    },
    "col-3": {
      id: "col-3",
      title: "In Progress",
      cardIds: ["card-5"],
    },
    "col-4": {
      id: "col-4",
      title: "In Review",
      cardIds: ["card-6"],
    },
    "col-5": {
      id: "col-5",
      title: "Done",
      cardIds: ["card-7", "card-8"],
    },
  },
  cards: {
    "card-1": {
      id: "card-1",
      title: "Design System Tokens",
      details: "Establish typography scale, custom palette variables, and component spacing guidelines.",
      createdAt: "2026-08-01",
    },
    "card-2": {
      id: "card-2",
      title: "Database Schema Optimization",
      details: "Review index structures and query performance for preeclampsia patient data aggregation.",
      createdAt: "2026-08-02",
    },
    "card-3": {
      id: "card-3",
      title: "Client-Side Form Validation",
      details: "Implement input validation and accessibility attributes across modal entry forms.",
      createdAt: "2026-08-02",
    },
    "card-4": {
      id: "card-4",
      title: "API Gateway Rate Limiting",
      details: "Configure request throttling and error handling boundaries on regional endpoints.",
      createdAt: "2026-08-03",
    },
    "card-5": {
      id: "card-5",
      title: "Drag and Drop Integration",
      details: "Hook up drag listeners and state transitions across column boundaries seamlessly.",
      createdAt: "2026-08-03",
    },
    "card-6": {
      id: "card-6",
      title: "Interactive Card Modals",
      details: "Verify modal open/close states, keyboard shortcuts, and form reset hooks.",
      createdAt: "2026-08-04",
    },
    "card-7": {
      id: "card-7",
      title: "Project Scaffolding Setup",
      details: "Initialize Next.js project structure, TypeScript compiler flags, and CSS configuration.",
      createdAt: "2026-08-04",
    },
    "card-8": {
      id: "card-8",
      title: "Unit Test Harness Setup",
      details: "Configure Vitest and React Testing Library for state mutations and component rendering.",
      createdAt: "2026-08-04",
    },
  },
};
