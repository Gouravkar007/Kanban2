import json
import os
import re
from pathlib import Path
from typing import Any, Dict, List, Optional
import httpx
from dotenv import load_dotenv

from app.db import get_user_board, save_user_board
from app.logger import logger

ROOT_DIR = Path(__file__).resolve().parents[2]
load_dotenv(ROOT_DIR / ".env")
load_dotenv(Path(__file__).resolve().parents[1] / ".env")

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "").strip()
MODEL_NAME = os.getenv("OPENROUTER_MODEL", "google/gemma-4-31b-it:free").strip()
FALLBACK_MODELS = [
    "google/gemma-4-31b-it:free",
    "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
    "google/gemma-4-26b-a4b-it:free",
]
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

SYSTEM_PROMPT = """You are an AI Project Management Assistant.
The user has a Kanban board with columnOrder, columns, and cards.

Your goal is to answer the user's prompt AND optionally mutate the board structure if requested.
ALWAYS return valid JSON with two fields:
1. "reply": String explaining what you did or answering the user's question concisely.
2. "board": Optional updated board object matching the exact Kanban schema (columnOrder, columns, cards). If no board changes are required, set "board" to null.

Rule for adding/moving/updating cards or columns:
- Keep existing column IDs and card IDs intact.
- Generate new unique IDs like "card-ai-123" for new cards.
- Ensure every cardId in columns exists in cards dictionary.
"""


async def call_openrouter(
    messages: List[Dict[str, str]],
    model: str = MODEL_NAME,
    api_key: Optional[str] = None,
) -> Dict[str, Any]:
    key = (api_key or OPENROUTER_API_KEY or os.getenv("OPENROUTER_API_KEY", "")).strip()

    if not key:
        return {
            "ok": False,
            "error": "OPENROUTER_API_KEY is not set in environment or .env file",
        }

    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8080",
        "X-Title": "Project Management MVP",
    }

    models_to_try = [model] + [m for m in FALLBACK_MODELS if m != model]

    async with httpx.AsyncClient(timeout=30.0) as client:
        last_error = ""
        for target_model in models_to_try:
            payload = {
                "model": target_model,
                "messages": messages,
            }
            try:
                response = await client.post(OPENROUTER_URL, headers=headers, json=payload)
                if response.status_code == 200:
                    data = response.json()
                    content = (
                        data.get("choices", [{}])[0]
                        .get("message", {})
                        .get("content", "")
                    )
                    return {
                        "ok": True,
                        "model": target_model,
                        "content": content,
                        "raw": data,
                    }
                last_error = f"OpenRouter status {response.status_code} for {target_model}: {response.text}"
                logger.warning(last_error)
            except Exception as e:
                last_error = str(e)
                logger.warning(f"Error calling OpenRouter model {target_model}: {e}")

        return {
            "ok": False,
            "error": last_error or "Failed to receive response from OpenRouter models.",
        }


async def test_ai_connectivity() -> Dict[str, Any]:
    messages = [
        {"role": "system", "content": "You are a helpful assistant. Reply concisely."},
        {"role": "user", "content": "What is 2+2? Answer with just the number."},
    ]
    return await call_openrouter(messages)


def parse_ai_json_response(content: str) -> Dict[str, Any]:
    content_clean = content.strip()

    # Match json code block if present
    match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", content_clean, re.DOTALL)
    if match:
        content_clean = match.group(1)

    try:
        data = json.loads(content_clean)
        if isinstance(data, dict):
            return data
    except Exception:
        pass

    return {
        "reply": content,
        "board": None,
    }


def extract_card_info_from_prompt(prompt: str, current_board: Dict[str, Any]) -> tuple[str, str]:
    prompt_clean = prompt.strip()

    # Determine title
    title = "New AI Task"
    match_called = re.search(r"(?:called|named)\s+[\"']?([^\"'\n\r]+?)[\"']?\s+(?:to|in|on|into|$)", prompt_clean, re.IGNORECASE)
    match_add = re.search(r"add\s+(?:a\s+)?(?:new\s+)?(?:card\s+)?[\"']?([^\"'\n\r]+?)[\"']?\s+(?:to|in|on|into|$)", prompt_clean, re.IGNORECASE)

    if match_called and match_called.group(1).strip():
        title = match_called.group(1).strip()
    elif match_add and match_add.group(1).strip():
        title = match_add.group(1).strip()

    # Clean title prefix if needed
    title = re.sub(r"^(?:a\s+)?(?:new\s+)?(?:card\s+)?", "", title, flags=re.IGNORECASE).strip()
    if not title:
        title = "New AI Task"

    # Capitalize title cleanly
    title = title[0].upper() + title[1:]

    # Determine target column
    target_col_id = current_board.get("columnOrder", ["col-1"])[0]
    prompt_lower = prompt_clean.lower()

    for col_id, col_data in current_board.get("columns", {}).items():
        col_title = col_data.get("title", "").lower()
        if col_title and col_title in prompt_lower:
            target_col_id = col_id
            break

    return title, target_col_id


def handle_fallback_mutation(prompt: str, current_board: Dict[str, Any], username: str) -> Optional[Dict[str, Any]]:
    prompt_lower = prompt.lower()
    new_board = json.loads(json.dumps(current_board))

    # 1. RENAME COLUMN (e.g., "Rename Backlog column to Ideas")
    if "rename" in prompt_lower:
        match_rename = re.search(r"rename\s+(?:the\s+)?(?:column\s+)?(.+?)\s+(?:column\s+)?to\s+(.+)$", prompt, re.IGNORECASE)
        if match_rename:
            old_target = match_rename.group(1).strip().lower()
            new_title = match_rename.group(2).strip()
            new_title = re.sub(r"\s+column$", "", new_title, flags=re.IGNORECASE).strip()

            target_col_id = None
            old_title = ""
            for col_id, col_data in new_board.get("columns", {}).items():
                curr_title = col_data.get("title", "")
                if old_target in curr_title.lower() or curr_title.lower() in old_target:
                    target_col_id = col_id
                    old_title = curr_title
                    break

            if target_col_id:
                new_board["columns"][target_col_id]["title"] = new_title
                save_user_board(username, new_board)
                return {
                    "reply": f"Renamed '{old_title}' column to '{new_title}'.",
                    "board": new_board,
                }

    # 2. MOVE CARD (e.g., "Move card-1 to Done column")
    if "move" in prompt_lower:
        match_move = re.search(r"move\s+(?:card\s+)?(.+?)\s+to\s+(.+)$", prompt, re.IGNORECASE)
        if match_move:
            card_target = match_move.group(1).strip()
            dest_col_raw = match_move.group(2).strip()
            dest_col_clean = re.sub(r"\s+column$", "", dest_col_raw, flags=re.IGNORECASE).strip().lower()

            target_card_id = None
            card_title = card_target
            # Search by ID or title
            if card_target in new_board.get("cards", {}):
                target_card_id = card_target
                card_title = new_board["cards"][card_target].get("title", card_target)
            else:
                for c_id, c_data in new_board.get("cards", {}).items():
                    if card_target.lower() in c_data.get("title", "").lower():
                        target_card_id = c_id
                        card_title = c_data.get("title", c_id)
                        break

            # Find destination column
            dest_col_id = None
            dest_title = dest_col_raw
            for col_id, col_data in new_board.get("columns", {}).items():
                curr_title = col_data.get("title", "")
                if dest_col_clean in curr_title.lower() or curr_title.lower() in dest_col_clean:
                    dest_col_id = col_id
                    dest_title = curr_title
                    break

            if target_card_id and dest_col_id:
                # Remove card from old columns
                for col_data in new_board["columns"].values():
                    if target_card_id in col_data.get("cardIds", []):
                        col_data["cardIds"].remove(target_card_id)
                # Add card to dest column
                if target_card_id not in new_board["columns"][dest_col_id]["cardIds"]:
                    new_board["columns"][dest_col_id]["cardIds"].append(target_card_id)

                save_user_board(username, new_board)
                return {
                    "reply": f"Moved card '{card_title}' to '{dest_title}' column.",
                    "board": new_board,
                }

    # 3. ADD CARD (e.g., "Add Setup CI/CD Pipeline to To Do column")
    if any(kw in prompt_lower for kw in ["add", "create", "implement"]):
        title, target_col_id = extract_card_info_from_prompt(prompt, new_board)
        new_card_id = f"card-ai-{len(new_board['cards']) + 1}"
        new_board["cards"][new_card_id] = {
            "id": new_card_id,
            "title": title,
            "details": f"Created via AI prompt: '{prompt}'",
            "createdAt": "2026-08-08",
        }
        if target_col_id in new_board["columns"]:
            if new_card_id not in new_board["columns"][target_col_id]["cardIds"]:
                new_board["columns"][target_col_id]["cardIds"].append(new_card_id)

        col_name = new_board["columns"].get(target_col_id, {}).get("title", "target")
        save_user_board(username, new_board)
        return {
            "reply": f"Added '{title}' card to the {col_name} column.",
            "board": new_board,
        }

    return None


async def process_ai_chat(username: str, prompt: str, history: List[Dict[str, str]] = None) -> Dict[str, Any]:
    try:
        logger.info(f"Processing AI chat for user '{username}': prompt='{prompt}'")
        current_board = get_user_board(username)
        if not current_board:
            logger.warning(f"Board for user '{username}' not found.")
            return {
                "reply": "Could not find your Kanban board workspace.",
                "board": None,
            }

        formatted_messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        if history:
            for item in history:
                role = item.get("role", "user")
                text = item.get("content", "")
                if text:
                    formatted_messages.append({"role": role, "content": text})

        user_msg = (
            f"CURRENT BOARD STATE:\n{json.dumps(current_board, indent=2)}\n\nUSER PROMPT: {prompt}"
        )
        formatted_messages.append({"role": "user", "content": user_msg})

        res = await call_openrouter(formatted_messages)

        if not res.get("ok"):
            logger.info(f"OpenRouter returned non-200 response, executing fallback mutation for: '{prompt}'")
            fallback_res = handle_fallback_mutation(prompt, current_board, username)
            if fallback_res:
                logger.info(f"Fallback mutation executed successfully: {fallback_res.get('reply')}")
                return fallback_res

            logger.warning(f"Fallback mutation could not match prompt intent for: '{prompt}'")
            return {
                "reply": "I'm having trouble connecting to the AI provider right now. Please try again.",
                "board": None,
            }

        parsed = parse_ai_json_response(res.get("content", ""))
        updated_board = parsed.get("board")

        if updated_board and isinstance(updated_board, dict):
            save_user_board(username, updated_board)
            logger.info(f"AI response updated board state for user '{username}'.")
            return {
                "reply": parsed.get("reply", "Board updated."),
                "board": updated_board,
            }

        return {
            "reply": parsed.get("reply", res.get("content", "")),
            "board": None,
        }
    except Exception as e:
        logger.error(f"Error processing AI chat: {e}", exc_info=True)
        return {
            "reply": "An unexpected server error occurred while processing your message.",
            "board": None,
        }
