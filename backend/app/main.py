import logging
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any, Dict, List, Optional
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from app.ai import process_ai_chat, test_ai_connectivity
from app.db import get_user_board, get_user_by_username, init_db, save_user_board
from app.logger import logger

# Redirect uvicorn loggers to app.log file
for log_name in ["uvicorn", "uvicorn.error", "uvicorn.access"]:
    uv_logger = logging.getLogger(log_name)
    uv_logger.handlers = logger.handlers

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing database and starting FastAPI backend...")
    init_db()
    logger.info("Database initialized successfully.")
    yield
    logger.info("Shutting down FastAPI backend...")


app = FastAPI(title="Project Management MVP Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if (STATIC_DIR / "_next").exists():
    app.mount("/_next", StaticFiles(directory=STATIC_DIR / "_next"), name="_next")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


class LoginRequest(BaseModel):
    username: str
    password: str


class BoardSaveRequest(BaseModel):
    username: str
    board: Dict[str, Any]


@app.get("/api/health")
async def health():
    return {"status": "ok", "message": "Project Management backend is healthy"}


@app.get("/api/hello")
async def hello():
    return {"message": "Hello from the Project Management backend"}


@app.post("/api/login")
async def login(req: LoginRequest):
    user = get_user_by_username(req.username)
    if not user or user["password_hash"] != req.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    return {"status": "ok", "username": user["username"]}


@app.get("/api/board")
async def get_board(username: str = Query("user")):
    board = get_user_board(username)
    if board is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Board for user '{username}' not found",
        )
    return {"status": "ok", "board": board}


@app.post("/api/board")
async def save_board(req: BoardSaveRequest):
    success = save_user_board(req.username, req.board)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to save board for user '{req.username}'",
        )
    return {"status": "ok", "message": "Board saved successfully"}


class AIChatRequest(BaseModel):
    username: str = "user"
    prompt: str
    history: Optional[List[Dict[str, str]]] = None


@app.post("/api/ai/chat")
async def ai_chat(req: AIChatRequest):
    result = await process_ai_chat(req.username, req.prompt, req.history)
    return {"status": "ok", "reply": result.get("reply"), "board": result.get("board")}


@app.api_route("/api/ai/check", methods=["GET", "POST"])
async def ai_check():
    result = await test_ai_connectivity()
    if not result.get("ok"):
        return {
            "status": "error",
            "message": result.get("error", "AI connectivity failed"),
            "details": result,
        }
    return {
        "status": "ok",
        "message": "AI connection successful",
        "result": result,
    }


@app.get("/", response_class=HTMLResponse)
async def root():
    index_file = STATIC_DIR / "index.html"
    return HTMLResponse(
        content=index_file.read_text(encoding="utf-8"), media_type="text/html"
    )


@app.get("/{full_path:path}")
async def catch_all(full_path: str):
    file_path = STATIC_DIR / full_path
    if file_path.is_file():
        return FileResponse(file_path)
    index_file = STATIC_DIR / "index.html"
    return HTMLResponse(
        content=index_file.read_text(encoding="utf-8"), media_type="text/html"
    )