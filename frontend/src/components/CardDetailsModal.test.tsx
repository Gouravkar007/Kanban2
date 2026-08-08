import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CardDetailsModal } from "@/components/CardDetailsModal";
import { Card } from "@/types/kanban";

describe("CardDetailsModal Component", () => {
  const dummyCard: Card = {
    id: "card-1",
    title: "Design System Tokens",
    details: "Establish typography scale and variables.",
    createdAt: "2026-08-01",
  };

  it("does not render when isOpen is false", () => {
    render(
      <CardDetailsModal
        card={dummyCard}
        isOpen={false}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.queryByText("Card Details")).not.toBeInTheDocument();
  });

  it("renders card title and details when isOpen is true", () => {
    render(
      <CardDetailsModal
        card={dummyCard}
        columnTitle="Backlog"
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText("Card Details")).toBeInTheDocument();
    expect(screen.getByText("Backlog")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Design System Tokens")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Establish typography scale and variables.")
    ).toBeInTheDocument();
  });

  it("calls onSave with updated title and details on form submit", () => {
    const handleSave = vi.fn();
    render(
      <CardDetailsModal
        card={dummyCard}
        isOpen={true}
        onClose={vi.fn()}
        onSave={handleSave}
        onDelete={vi.fn()}
      />
    );

    const titleInput = screen.getByDisplayValue("Design System Tokens");
    const detailsInput = screen.getByDisplayValue("Establish typography scale and variables.");

    fireEvent.change(titleInput, { target: { value: "Updated Design System" } });
    fireEvent.change(detailsInput, { target: { value: "Updated details notes" } });

    const saveBtn = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(saveBtn);

    expect(handleSave).toHaveBeenCalledWith(
      "card-1",
      "Updated Design System",
      "Updated details notes"
    );
  });
});
