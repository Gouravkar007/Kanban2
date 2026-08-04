"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { BoardState } from "../types/kanban";
import { initialBoardState } from "../data/dummyData";
import {
  renameColumn,
  addCard,
  deleteCard,
  moveCard,
} from "../utils/kanbanUtils";
import { KanbanColumn } from "./KanbanColumn";
import { AddCardModal } from "./AddCardModal";
import { Header } from "./Header";

export const KanbanBoard: React.FC = () => {
  const [boardState, setBoardState] = useState<BoardState>(initialBoardState);
  const [isMounted, setIsMounted] = useState(false);
  const [activeAddColumnId, setActiveAddColumnId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    // Dropped outside a droppable area
    if (!destination) return;

    // Dropped in exact same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    setBoardState((prev) =>
      moveCard(
        prev,
        source.droppableId,
        destination.droppableId,
        source.index,
        destination.index
      )
    );
  };

  const handleRenameColumn = (columnId: string, newTitle: string) => {
    setBoardState((prev) => renameColumn(prev, columnId, newTitle));
  };

  const handleDeleteCard = (cardId: string, columnId: string) => {
    setBoardState((prev) => deleteCard(prev, cardId, columnId));
  };

  const handleAddCard = (title: string, details: string) => {
    if (!activeAddColumnId) return;
    setBoardState((prev) =>
      addCard(prev, activeAddColumnId, title, details)
    );
  };

  const totalCards = Object.keys(boardState.cards).length;
  const totalColumns = boardState.columnOrder.length;

  const activeColumnTitle = activeAddColumnId
    ? boardState.columns[activeAddColumnId]?.title || ""
    : "";

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-darkNavy text-white flex flex-col">
        <Header totalCards={totalCards} totalColumns={totalColumns} />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-sm text-grayText animate-pulse">Loading Kanban Workspace...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkNavy text-white flex flex-col font-sans select-none">
      <Header totalCards={totalCards} totalColumns={totalColumns} />

      <main className="flex-1 overflow-x-auto p-6 scrollbar-thin">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex items-start gap-5 pb-6 overflow-x-auto">
              {boardState.columnOrder.map((colId) => {
                const column = boardState.columns[colId];
                const cards = column.cardIds
                  .map((id) => boardState.cards[id])
                  .filter(Boolean);

                return (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    cards={cards}
                    onRenameColumn={handleRenameColumn}
                    onDeleteCard={handleDeleteCard}
                    onOpenAddModal={(id) => setActiveAddColumnId(id)}
                  />
                );
              })}
            </div>
          </DragDropContext>
        </div>
      </main>

      <AddCardModal
        isOpen={Boolean(activeAddColumnId)}
        columnTitle={activeColumnTitle}
        onClose={() => setActiveAddColumnId(null)}
        onAddCard={handleAddCard}
      />
    </div>
  );
};
