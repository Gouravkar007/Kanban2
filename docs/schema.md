# Database Schema & Data Model

This document specifies the database schema for the Project Management MVP backend using **SQLite**.

---

## 1. Storage Overview

The database uses SQLite (stored locally as `pm.db`).
If `pm.db` does not exist when the backend starts, FastAPI automatically initializes the SQLite tables.

---

## 2. Table Schemas

### `users` Table

Stores user credentials and authentication data.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Unique identifier (e.g. `usr_123`) |
| `username` | `TEXT` | `UNIQUE NOT NULL` | Login username (e.g. `user`) |
| `password_hash` | `TEXT` | `NOT NULL` | Password hash |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Account creation timestamp |

---

### `boards` Table

Stores user Kanban board states as JSON objects to support single-board per user persistence and structured AI board mutations.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Board ID (e.g. `board_user`) |
| `user_id` | `TEXT` | `UNIQUE NOT NULL`, `FOREIGN KEY (user_id) REFERENCES users(id)` | Owner user ID |
| `data` | `TEXT (JSON)` | `NOT NULL` | Complete board state payload (columns, cards, column order) |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Last updated timestamp |

---

## 3. Data Structure (Board JSON Payload)

```json
{
  "columnOrder": ["col-1", "col-2", "col-3", "col-4", "col-5"],
  "columns": {
    "col-1": {
      "id": "col-1",
      "title": "Backlog",
      "cardIds": ["card-1", "card-2"]
    },
    "col-2": {
      "id": "col-2",
      "title": "In Progress",
      "cardIds": ["card-3"]
    },
    "col-3": {
      "id": "col-3",
      "title": "Review",
      "cardIds": ["card-4"]
    },
    "col-4": {
      "id": "col-4",
      "title": "Done",
      "cardIds": ["card-5"]
    },
    "col-5": {
      "id": "col-5",
      "title": "Archive",
      "cardIds": []
    }
  },
  "cards": {
    "card-1": {
      "id": "card-1",
      "title": "Design System Tokens",
      "details": "Establish color palette and typography rules.",
      "createdAt": "2026-08-08T00:00:00Z"
    },
    "card-2": {
      "id": "card-2",
      "title": "Database Schema Optimization",
      "details": "Create SQLite table structure and indexing.",
      "createdAt": "2026-08-08T00:00:00Z"
    }
  }
}
```

---

## 4. Rationale for JSON Storage Model

1. **Atomic Updates & Integrity:** Kanban board drag-and-drop actions update column ordering and card lists atomically. Storing board state as structured JSON ensures single-query read/write transactions without complex cascading foreign key locks.
2. **Seamless AI Integration:** OpenRouter / LLM prompt context requires sending the board JSON structure to the AI model and parsing structured JSON mutations returned by the AI.
3. **Multi-user Extensibility:** The `user_id` foreign key enforces 1 board per user for the MVP while allowing multi-user and multi-board extensions in the future.
