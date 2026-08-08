import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LoginForm } from "@/components/LoginForm";

describe("LoginForm Component", () => {
  it("renders login form elements", () => {
    render(<LoginForm onLogin={vi.fn()} />);
    expect(screen.getByText("Sign In to FlowKanban")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
  });

  it("shows error on invalid credentials", async () => {
    render(<LoginForm onLogin={vi.fn()} />);
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

  it("invokes onLogin on valid credentials", async () => {
    const handleLogin = vi.fn();
    render(<LoginForm onLogin={handleLogin} />);
    const usernameInput = screen.getByPlaceholderText(/enter username/i);
    const passwordInput = screen.getByPlaceholderText(/enter password/i);
    const submitBtn = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: "user" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith("user");
    });
  });
});
