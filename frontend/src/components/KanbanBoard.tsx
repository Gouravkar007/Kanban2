"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { BoardState } from "../types/kanban";
import { initialBoardState } from "../data/dummyData";
import { Card } from "../types/kanban";
import {
  renameColumn,
  addCard,
  deleteCard,
  moveCard,
  updateCard,
} from "../utils/kanbanUtils";
import { KanbanColumn } from "./KanbanColumn";
import { AddCardModal } from "./AddCardModal";
import { CardDetailsModal } from "./CardDetailsModal";
import { AiChatSidebar } from "./AiChatSidebar";
import { Header } from "./Header";

export const KanbanBoard: React.FC = () => {
  const [boardState, setBoardState] = useState<BoardState>(initialBoardState);
  const [pastStates, setPastStates] = useState<BoardState[]>([]);
  const [futureStates, setFutureStates] = useState<BoardState[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [activeAddColumnId, setActiveAddColumnId] = useState<string | null>(null);
  const [activeDetailCard, setActiveDetailCard] = useState<Card | null>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("flowkanban_user");
    }
    return null;
  });

  const handleLogout = () => {
    sessionStorage.removeItem("flowkanban_user");
    setUsername(null);
  };

  const updateBoardState = (
    nextStateOrUpdater: BoardState | ((prev: BoardState) => BoardState)
  ) => {
    setBoardState((prev) => {
      const nextState = typeof nextStateOrUpdater === "function"
        ? nextStateOrUpdater(prev)
        : nextStateOrUpdater;

      if (JSON.stringify(prev) !== JSON.stringify(nextState)) {
        setPastStates((past) => [...past.slice(-19), prev]);
        setFutureStates([]);
      }
      return nextState;
    });
  };

  const handleUndo = () => {
    if (pastStates.length === 0) return;
    const previousState = pastStates[pastStates.length - 1];
    const remainingPast = pastStates.slice(0, pastStates.length - 1);

    setPastStates(remainingPast);
    setFutureStates((future) => [boardState, ...future]);
    setBoardState(previousState);
  };

  const handleRedo = () => {
    if (futureStates.length === 0) return;
    const nextState = futureStates[0];
    const remainingFuture = futureStates.slice(1);

    setFutureStates(remainingFuture);
    setPastStates((past) => [...past, boardState]);
    setBoardState(nextState);
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isEditingText =
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.getAttribute("contenteditable") === "true");

      if (e.ctrlKey && !isEditingText) {
        if (e.key.toLowerCase() === "z") {
          e.preventDefault();
          handleUndo();
        } else if (e.key.toLowerCase() === "y") {
          e.preventDefault();
          handleRedo();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [pastStates, futureStates, boardState]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    updateBoardState((prev) =>
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
    updateBoardState((prev) => renameColumn(prev, columnId, newTitle));
  };

  const handleDeleteCard = (cardId: string, columnId: string) => {
    updateBoardState((prev) => deleteCard(prev, cardId, columnId));
  };

  const handleAddCard = (title: string, details: string) => {
    if (!activeAddColumnId) return;
    updateBoardState((prev) =>
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

  const handleSaveCardDetails = (cardId: string, newTitle: string, newDetails: string) => {
    updateBoardState((prev) => updateCard(prev, cardId, newTitle, newDetails));
  };

  const getColumnTitleForCard = (cardId: string): string | undefined => {
    for (const col of Object.values(boardState.columns)) {
      if (col.cardIds.includes(cardId)) {
        return col.title;
      }
    }
    return undefined;
  };

  return (
    <div className="min-h-screen bg-darkNavy text-white flex flex-col font-sans select-none">
      <Header
        totalCards={totalCards}
        totalColumns={totalColumns}
        onToggleAi={() => setIsAiOpen((prev) => !prev)}
        isAiOpen={isAiOpen}
        username={username || undefined}
        onLogout={handleLogout}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={pastStates.length > 0}
        canRedo={futureStates.length > 0}
      />

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
                    onOpenCardDetails={(card) => setActiveDetailCard(card)}
                    onUpdateCardTitle={(cardId, newTitle) =>
                      handleSaveCardDetails(
                        cardId,
                        newTitle,
                        boardState.cards[cardId]?.details || ""
                      )
                    }
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

      <CardDetailsModal
        card={activeDetailCard}
        columnTitle={activeDetailCard ? getColumnTitleForCard(activeDetailCard.id) : undefined}
        isOpen={Boolean(activeDetailCard)}
        onClose={() => setActiveDetailCard(null)}
        onSave={handleSaveCardDetails}
        onDelete={(cardId) => {
          handleDeleteCard(cardId, "");
          setActiveDetailCard(null);
        }}
      />

      <AiChatSidebar
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onBoardStateChange={updateBoardState}
        currentBoard={boardState}
      />
    </div>
  );
};
