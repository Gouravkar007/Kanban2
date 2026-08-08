from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "message": "Project Management backend is healthy",
    }


def test_hello_endpoint():
    response = client.get("/api/hello")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Hello from the Project Management backend"
    }


def test_root_serves_static_html():
    response = client.get("/")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]
    assert "FlowKanban" in response.text


def test_login_success():
    response = client.post(
        "/api/login", json={"username": "user", "password": "password"}
    )
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "username": "user"}


def test_login_failure():
    response = client.post(
        "/api/login", json={"username": "user", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid username or password"


def test_get_and_save_board():
    # 1. Fetch board
    response = client.get("/api/board?username=user")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    board = data["board"]
    assert "columnOrder" in board
    assert "columns" in board
    assert "cards" in board

    # 2. Update board (e.g. rename first column)
    board["columns"]["col-1"]["title"] = "Updated Backlog"
    save_resp = client.post(
        "/api/board", json={"username": "user", "board": board}
    )
    assert save_resp.status_code == 200
    assert save_resp.json()["status"] == "ok"

    # 3. Fetch again and verify persistence
    get_again = client.get("/api/board?username=user")
    assert get_again.status_code == 200
    updated_board = get_again.json()["board"]
    assert updated_board["columns"]["col-1"]["title"] == "Updated Backlog"


def test_ai_check_endpoint():
    response = client.get("/api/ai/check")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "message" in data


def test_ai_chat_endpoint():
    response = client.post(
        "/api/ai/chat",
        json={
            "username": "user",
            "prompt": "Add a new card called Implement SSL in To Do column",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "reply" in data
    assert data["board"] is not None
    # Verify SSL card was persisted
    get_board = client.get("/api/board?username=user")
    board = get_board.json()["board"]
    card_titles = [c["title"] for c in board["cards"].values()]
    assert "Implement SSL" in card_titles
