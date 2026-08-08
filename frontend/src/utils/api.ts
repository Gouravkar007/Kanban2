import { BoardState } from "../types/kanban";

function getApiUrl(endpoint: string): string {
  if (typeof window !== "undefined" && window.location.origin && window.location.origin !== "null" && !window.location.origin.startsWith("file:")) {
    if (window.location.port === "3000") {
      return `http://127.0.0.1:8080/api${endpoint}`;
    }
    return `/api${endpoint}`;
  }
  return `http://127.0.0.1:8080/api${endpoint}`;
}

export async function loginApi(username: string, password: string): Promise<{ ok: boolean; username?: string; error?: string }> {
  try {
    const url = getApiUrl("/login");
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, error: data.detail || "Invalid username or password. Try user / password" };
    }

    const data = await res.json();
    return { ok: true, username: data.username };
  } catch (err: any) {
    return { ok: false, error: "Network error" };
  }
}

export async function fetchBoardApi(username: string): Promise<BoardState | null> {
  try {
    const url = getApiUrl(`/board?username=${encodeURIComponent(username)}`);
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.board || null;
  } catch (err) {
    return null;
  }
}

export async function saveBoardApi(username: string, board: BoardState): Promise<boolean> {
  try {
    const url = getApiUrl("/board");
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, board }),
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

export async function aiChatApi(
  username: string,
  prompt: string,
  history?: Array<{ role: string; content: string }>
): Promise<{ ok: boolean; reply: string; board?: BoardState }> {
  try {
    const url = getApiUrl("/ai/chat");
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, prompt, history }),
    });
    if (!res.ok) {
      return { ok: false, reply: "AI service request failed." };
    }
    const data = await res.json();
    return {
      ok: true,
      reply: data.reply || "AI response received.",
      board: data.board || undefined,
    };
  } catch (err: any) {
    return { ok: false, reply: `AI Network error: ${err.message || "Failed to reach backend"}` };
  }
}
