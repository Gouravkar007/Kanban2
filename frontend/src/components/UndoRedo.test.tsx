import { render, screen, within, fireEvent, waitFor } from "@testing-library/react";
import { KanbanBoard } from "@/components/KanbanBoard";
import { describe, expect, it, beforeEach, afterEach } from "vitest";

const getFirstColumn = () => screen.getAllByTestId(/column-/i)[0];

describe("UndoRedo Integration", () => {
  beforeEach(() => {
    window.sessionStorage.setItem("flowkanban_user", "user");
  });

  afterEach(() => {
    window.sessionStorage.clear();
  });

  it("performs undo and redo on column renaming via header buttons", async () => {
    render(<KanbanBoard />);
    await waitFor(() => {
      expect(screen.getAllByTestId(/column-/i)).toHaveLength(5);
    });

    const column = getFirstColumn();
    const titleHeader = within(column).getByTitle("Click to rename");
    const originalTitle = titleHeader.textContent || "";

    // 1. Rename column
    fireEvent.click(titleHeader);
    const input = within(column).getByRole("textbox");
    fireEvent.change(input, { target: { value: "Renamed Title" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText("Renamed Title")).toBeInTheDocument();
    });

    // 2. Click Undo button in Header
    const undoBtn = screen.getByTitle(/undo last action/i);
    expect(undoBtn).not.toBeDisabled();
    fireEvent.click(undoBtn);

    await waitFor(() => {
      expect(screen.getByText(originalTitle)).toBeInTheDocument();
      expect(screen.queryByText("Renamed Title")).not.toBeInTheDocument();
    });

    // 3. Click Redo button in Header
    const redoBtn = screen.getByTitle(/redo action/i);
    expect(redoBtn).not.toBeDisabled();
    fireEvent.click(redoBtn);

    await waitFor(() => {
      expect(screen.getByText("Renamed Title")).toBeInTheDocument();
    });
  });

  it("triggers undo and redo using Ctrl+Z and Ctrl+Y keyboard shortcuts", async () => {
    render(<KanbanBoard />);
    await waitFor(() => {
      expect(screen.getAllByTestId(/column-/i)).toHaveLength(5);
    });

    const column = getFirstColumn();
    const titleHeader = within(column).getByTitle("Click to rename");
    const originalTitle = titleHeader.textContent || "";

    // Rename column
    fireEvent.click(titleHeader);
    const input = within(column).getByRole("textbox");
    fireEvent.change(input, { target: { value: "Shortcut Rename" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText("Shortcut Rename")).toBeInTheDocument();
    });

    // Press Ctrl+Z
    fireEvent.keyDown(window, { key: "z", ctrlKey: true });

    await waitFor(() => {
      expect(screen.getByText(originalTitle)).toBeInTheDocument();
      expect(screen.queryByText("Shortcut Rename")).not.toBeInTheDocument();
    });

    // Press Ctrl+Y
    fireEvent.keyDown(window, { key: "y", ctrlKey: true });

    await waitFor(() => {
      expect(screen.getByText("Shortcut Rename")).toBeInTheDocument();
    });
  });
});
