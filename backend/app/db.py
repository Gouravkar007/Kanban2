import json
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "pm.db"

INITIAL_BOARD_DATA = {
    "columnOrder": ["col-1", "col-2", "col-3", "col-4", "col-5"],
    "columns": {
        "col-1": {"id": "col-1", "title": "Backlog", "cardIds": ["card-1", "card-2"]},
        "col-2": {"id": "col-2", "title": "To Do", "cardIds": ["card-3", "card-4"]},
        "col-3": {"id": "col-3", "title": "In Progress", "cardIds": ["card-5"]},
        "col-4": {"id": "col-4", "title": "In Review", "cardIds": ["card-6"]},
        "col-5": {"id": "col-5", "title": "Done", "cardIds": ["card-7", "card-8"]},
    },
    "cards": {
        "card-1": {
            "id": "card-1",
            "title": "Design System Tokens",
            "details": "Establish typography scale, custom palette variables, and component spacing guidelines.",
            "createdAt": "2026-08-01",
        },
        "card-2": {
            "id": "card-2",
            "title": "Database Schema Optimization",
            "details": "Review index structures and query performance for patient data aggregation.",
            "createdAt": "2026-08-02",
        },
        "card-3": {
            "id": "card-3",
            "title": "Client-Side Form Validation",
            "details": "Implement input validation and accessibility attributes across modal entry forms.",
            "createdAt": "2026-08-02",
        },
        "card-4": {
            "id": "card-4",
            "title": "API Gateway Rate Limiting",
            "details": "Configure request throttling and error handling boundaries on regional endpoints.",
            "createdAt": "2026-08-03",
        },
        "card-5": {
            "id": "card-5",
            "title": "Drag and Drop Integration",
            "details": "Hook up drag listeners and state transitions across column boundaries seamlessly.",
            "createdAt": "2026-08-03",
        },
        "card-6": {
            "id": "card-6",
            "title": "Interactive Card Modals",
            "details": "Verify modal open/close states, keyboard shortcuts, and form reset hooks.",
            "createdAt": "2026-08-04",
        },
        "card-7": {
            "id": "card-7",
            "title": "Project Scaffolding Setup",
            "details": "Initialize Next.js project structure, TypeScript compiler flags, and CSS configuration.",
            "createdAt": "2026-08-04",
        },
        "card-8": {
            "id": "card-8",
            "title": "Unit Test Harness Setup",
            "details": "Configure Vitest and React Testing Library for state mutations and component rendering.",
            "createdAt": "2026-08-04",
        },
    },
}


_initialized_dbs = set()


def get_db_connection(db_file: Path | str = DB_PATH) -> sqlite3.Connection:
    str_path = str(db_file)
    if str_path not in _initialized_dbs:
        _initialized_dbs.add(str_path)
        init_db(db_file)
    conn = sqlite3.connect(db_file)
    conn.row_factory = sqlite3.Row
    return conn


def init_db(db_file: Path | str = DB_PATH) -> None:
    conn = get_db_connection(db_file)
    cursor = conn.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """
    )

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS boards (
            id TEXT PRIMARY KEY,
            user_id TEXT UNIQUE NOT NULL,
            data TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """
    )

    # Seed default user if absent
    cursor.execute("SELECT id FROM users WHERE username = ?", ("user",))
    user_row = cursor.fetchone()
    if not user_row:
        user_id = "usr_demo"
        cursor.execute(
            "INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)",
            (user_id, "user", "password"),
        )
    else:
        user_id = user_row["id"]

    # Seed default board if absent
    cursor.execute("SELECT id FROM boards WHERE user_id = ?", (user_id,))
    board_row = cursor.fetchone()
    if not board_row:
        cursor.execute(
            "INSERT INTO boards (id, user_id, data) VALUES (?, ?, ?)",
            ("board_demo", user_id, json.dumps(INITIAL_BOARD_DATA)),
        )

    conn.commit()
    conn.close()


def get_user_by_username(username: str, db_file: Path | str = DB_PATH):
    conn = get_db_connection(db_file)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None


def get_user_board(username: str, db_file: Path | str = DB_PATH):
    conn = get_db_connection(db_file)
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT b.data FROM boards b
        JOIN users u ON u.id = b.user_id
        WHERE u.username = ?
    """,
        (username,),
    )
    row = cursor.fetchone()
    conn.close()
    if row:
        return json.loads(row["data"])
    return None


def save_user_board(username: str, board_data: dict, db_file: Path | str = DB_PATH):
    user = get_user_by_username(username, db_file=db_file)
    if not user:
        return False

    conn = get_db_connection(db_file)
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO boards (id, user_id, data, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id) DO UPDATE SET
            data = excluded.data,
            updated_at = CURRENT_TIMESTAMP
    """,
        (f"board_{user['id']}", user["id"], json.dumps(board_data)),
    )
    conn.commit()
    conn.close()
    return True
