import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { KanbanBoard } from "@/components/KanbanBoard";

describe("AiChatSidebar UI & Integration", () => {
  beforeEach(() => {
    sessionStorage.setItem("flowkanban_user", "user");
  });

  it("opens AI chat sidebar when AI Chat button is clicked", () => {
    render(<KanbanBoard />);
    const aiBtn = screen.getByRole("button", { name: /ai chat/i });
    fireEvent.click(aiBtn);

    expect(screen.getByText("AI Assistant")).toBeInTheDocument();
    expect(
      screen.getByText(/hello! i am your ai project management assistant/i)
    ).toBeInTheDocument();
  });

  it("sends quick prompt and triggers board mutation update", async () => {
    render(<KanbanBoard />);
    const aiBtn = screen.getByRole("button", { name: /ai chat/i });
    fireEvent.click(aiBtn);

    const quickBtn = screen.getByRole("button", {
      name: /add implement ssl in to do column/i,
    });
    fireEvent.click(quickBtn);

    await waitFor(() => {
      // Check if Implement SSL card appears in UI
      expect(screen.getAllByText(/implement ssl/i).length).toBeGreaterThan(0);
    });
  });
});
