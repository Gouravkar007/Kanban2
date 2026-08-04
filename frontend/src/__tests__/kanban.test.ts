import { describe, it, expect } from "vitest";
import { initialBoardState } from "../data/dummyData";
import {
  renameColumn,
  addCard,
  deleteCard,
  moveCard,
} from "../utils/kanbanUtils";

describe("Kanban Utils", () => {
  it("renames a column correctly", () => {
    const updated = renameColumn(initialBoardState, "col-1", "New Backlog Title");
    expect(updated.columns["col-1"].title).toBe("New Backlog Title");
  });

  it("does not rename column with empty string", () => {
    const updated = renameColumn(initialBoardState, "col-1", "   ");
    expect(updated.columns["col-1"].title).toBe("Backlog");
  });

  it("adds a card to a column", () => {
    const updated = addCard(
      initialBoardState,
      "col-1",
      "New Feature Task",
      "Details for new task"
    );
    expect(updated.columns["col-1"].cardIds.length).toBe(
      initialBoardState.columns["col-1"].cardIds.length + 1
    );
    const addedId =
      updated.columns["col-1"].cardIds[
        updated.columns["col-1"].cardIds.length - 1
      ];
    expect(updated.cards[addedId].title).toBe("New Feature Task");
    expect(updated.cards[addedId].details).toBe("Details for new task");
  });

  it("deletes a card from board and column", () => {
    const updated = deleteCard(initialBoardState, "card-1", "col-1");
    expect(updated.cards["card-1"]).toBeUndefined();
    expect(updated.columns["col-1"].cardIds).not.toContain("card-1");
  });

  it("moves a card within the same column", () => {
    const updated = moveCard(initialBoardState, "col-1", "col-1", 0, 1);
    expect(updated.columns["col-1"].cardIds[0]).toBe("card-2");
    expect(updated.columns["col-1"].cardIds[1]).toBe("card-1");
  });

  it("moves a card across columns", () => {
    const updated = moveCard(initialBoardState, "col-1", "col-2", 0, 0);
    expect(updated.columns["col-1"].cardIds).not.toContain("card-1");
    expect(updated.columns["col-2"].cardIds[0]).toBe("card-1");
  });
});
