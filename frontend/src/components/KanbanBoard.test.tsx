import { render, screen, within, fireEvent, waitFor } from "@testing-library/react";
import { KanbanBoard } from "@/components/KanbanBoard";
import { describe, expect, it, beforeEach, afterEach } from "vitest";

const getFirstColumn = () => screen.getAllByTestId(/column-/i)[0];

describe("KanbanBoard", () => {
  beforeEach(() => {
    window.sessionStorage.setItem("flowkanban_user", "user");
  });

  afterEach(() => {
    window.sessionStorage.clear();
  });

  it("renders five columns", async () => {
    render(<KanbanBoard />);
    await waitFor(() => {
      expect(screen.getAllByTestId(/column-/i)).toHaveLength(5);
    });
  });

  it("renames a column", async () => {
    render(<KanbanBoard />);
    await waitFor(() => {
      expect(screen.getAllByTestId(/column-/i)).toHaveLength(5);
    });
    const column = getFirstColumn();
    const titleHeader = within(column).getByTitle("Click to rename");
    fireEvent.click(titleHeader);
    const input = within(column).getByRole("textbox");
    fireEvent.change(input, { target: { value: "New Name" } });
    expect(input).toHaveValue("New Name");
  });

  it("adds and removes a card", async () => {
    render(<KanbanBoard />);
    await waitFor(() => {
      expect(screen.getAllByTestId(/column-/i)).toHaveLength(5);
    });
    const column = getFirstColumn();
    const addButton = within(column).getByRole("button", {
      name: /add card/i,
    });
    fireEvent.click(addButton);

    const titleInput = screen.getByPlaceholderText(/implement user authentication/i);
    fireEvent.change(titleInput, { target: { value: "New card" } });
    const detailsInput = screen.getByPlaceholderText(/provide context/i);
    fireEvent.change(detailsInput, { target: { value: "Notes" } });

    fireEvent.click(screen.getByRole("button", { name: /create card/i }));

    expect(within(column).getByText("New card")).toBeInTheDocument();

    const deleteButton = within(column).getByRole("button", {
      name: /delete card new card/i,
    });
    fireEvent.click(deleteButton);

    expect(within(column).queryByText("New card")).not.toBeInTheDocument();
  });
});
