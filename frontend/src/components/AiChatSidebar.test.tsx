import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { KanbanBoard } from "@/components/KanbanBoard";

describe("AiChatSidebar UI & Integration", () => {
  beforeEach(() => {
    sessionStorage.setItem("flowkanban_user", "user");
  });

  it("opens AI chat sidebar when AI Chat button is clicked", () => {
    render(<KanbanBoard />);
    const aiBtn = screen.getByTitle("Open AI Assistant");
    fireEvent.click(aiBtn);

    expect(screen.getByText("AI Assistant")).toBeInTheDocument();
    expect(
      screen.getByText(/hello! i am your ai project management assistant/i)
    ).toBeInTheDocument();
  });

  it("sends quick prompt and triggers board mutation update", async () => {
    render(<KanbanBoard />);
    const aiBtn = screen.getByTitle("Open AI Assistant");
    fireEvent.click(aiBtn);

    const quickBtn = screen.getByText("Add Implement SSL in To Do column");
    fireEvent.click(quickBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/implement ssl/i).length).toBeGreaterThan(0);
    });
  });
});
