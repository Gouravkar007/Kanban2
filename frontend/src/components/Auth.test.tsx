import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { KanbanBoard } from "@/components/KanbanBoard";

describe("Auth Flow", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders login screen when unauthenticated", () => {
    render(<KanbanBoard />);
    expect(screen.getByText("Sign In to FlowKanban")).toBeInTheDocument();
  });

  it("shows error message on invalid credentials", async () => {
    render(<KanbanBoard />);
    const usernameInput = screen.getByPlaceholderText(/enter username/i);
    const passwordInput = screen.getByPlaceholderText(/enter password/i);
    const submitBtn = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: "wronguser" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/invalid username or password|network error/i)
      ).toBeInTheDocument();
    });
  });

  it("authenticates with valid credentials and allows logout", async () => {
    render(<KanbanBoard />);
    const usernameInput = screen.getByPlaceholderText(/enter username/i);
    const passwordInput = screen.getByPlaceholderText(/enter password/i);
    const submitBtn = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: "user" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Single Board Project Workspace")).toBeInTheDocument();
      expect(screen.getByText("user")).toBeInTheDocument();
    });

    // Logout
    const logoutBtn = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(screen.getByText("Sign In to FlowKanban")).toBeInTheDocument();
    });
  });
});
