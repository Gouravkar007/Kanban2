import { BoardState, Card } from "../types/kanban";

export function renameColumn(
  state: BoardState,
  columnId: string,
  newTitle: string
): BoardState {
  const trimmed = newTitle.trim();
  if (!trimmed || !state.columns[columnId]) {
    return state;
  }

  return {
    ...state,
    columns: {
      ...state.columns,
      [columnId]: {
        ...state.columns[columnId],
        title: trimmed,
      },
    },
  };
}

export function addCard(
  state: BoardState,
  columnId: string,
  title: string,
  details: string
): BoardState {
  const trimmedTitle = title.trim();
  if (!trimmedTitle || !state.columns[columnId]) {
    return state;
  }

  const newId = `card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newCard: Card = {
    id: newId,
    title: trimmedTitle,
    details: details.trim(),
    createdAt: new Date().toISOString().split("T")[0],
  };

  return {
    ...state,
    cards: {
      ...state.cards,
      [newId]: newCard,
    },
    columns: {
      ...state.columns,
      [columnId]: {
        ...state.columns[columnId],
        cardIds: [...state.columns[columnId].cardIds, newId],
      },
    },
  };
}

export function deleteCard(
  state: BoardState,
  cardId: string,
  columnId?: string
): BoardState {
  const newCards = { ...state.cards };
  delete newCards[cardId];

  const newColumns = { ...state.columns };
  Object.keys(newColumns).forEach((colId) => {
    if (!columnId || colId === columnId) {
      newColumns[colId] = {
        ...newColumns[colId],
        cardIds: newColumns[colId].cardIds.filter((id) => id !== cardId),
      };
    }
  });

  return {
    ...state,
    cards: newCards,
    columns: newColumns,
  };
}

export function moveCard(
  state: BoardState,
  sourceColId: string,
  destColId: string,
  sourceIndex: number,
  destIndex: number
): BoardState {
  const sourceCol = state.columns[sourceColId];
  const destCol = state.columns[destColId];

  if (!sourceCol || !destCol) return state;

  // Moving within same column
  if (sourceColId === destColId) {
    const newCardIds = Array.from(sourceCol.cardIds);
    const [movedCardId] = newCardIds.splice(sourceIndex, 1);
    newCardIds.splice(destIndex, 0, movedCardId);

    return {
      ...state,
      columns: {
        ...state.columns,
        [sourceColId]: {
          ...sourceCol,
          cardIds: newCardIds,
        },
      },
    };
  }

  // Moving across columns
  const sourceCardIds = Array.from(sourceCol.cardIds);
  const [movedCardId] = sourceCardIds.splice(sourceIndex, 1);

  const destCardIds = Array.from(destCol.cardIds);
  destCardIds.splice(destIndex, 0, movedCardId);

  return {
    ...state,
    columns: {
      ...state.columns,
      [sourceColId]: {
        ...sourceCol,
        cardIds: sourceCardIds,
      },
      [destColId]: {
        ...destCol,
        cardIds: destCardIds,
      },
    },
  };
}
