"use client";

import React, { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Plus, Edit2, Check, X } from "lucide-react";
import { Column, Card } from "../types/kanban";
import { KanbanCard } from "./KanbanCard";

interface KanbanColumnProps {
  column: Column;
  cards: Card[];
  onRenameColumn: (columnId: string, newTitle: string) => void;
  onDeleteCard: (cardId: string, columnId: string) => void;
  onOpenAddModal: (columnId: string) => void;
  onOpenCardDetails?: (card: Card) => void;
  onUpdateCardTitle?: (cardId: string, newTitle: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  cards,
  onRenameColumn,
  onDeleteCard,
  onOpenAddModal,
  onOpenCardDetails,
  onUpdateCardTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(column.title);

  const handleSaveTitle = () => {
    if (titleInput.trim()) {
      onRenameColumn(column.id, titleInput.trim());
    } else {
      setTitleInput(column.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setTitleInput(column.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-testid={`column-${column.id}`}
      className="flex flex-col w-80 shrink-0 bg-surfaceNavy/90 border border-borderNavy rounded-2xl p-4 max-h-full shadow-lg"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-borderNavy">
        {isEditing ? (
          <div className="flex items-center gap-1.5 flex-1">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full bg-cardNavy border border-goldenPrimary text-white text-sm font-semibold rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-accentYellow"
            />
            <button
              onClick={handleSaveTitle}
              className="p-1 text-accentYellow hover:bg-cardNavy rounded transition-colors"
              title="Save title"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setTitleInput(column.title);
                setIsEditing(false);
              }}
              className="p-1 text-grayText hover:bg-cardNavy rounded transition-colors"
              title="Cancel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full group">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="h-2.5 w-2.5 rounded-full bg-accentYellow shrink-0"></span>
              <h2
                onClick={() => setIsEditing(true)}
                className="font-semibold text-white text-base tracking-tight truncate cursor-pointer hover:text-goldenPrimary transition-colors"
                title="Click to rename"
              >
                {column.title}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cardNavy border border-borderNavy text-grayText font-mono font-medium">
                {cards.length}
              </span>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="opacity-0 group-hover:opacity-100 text-grayText hover:text-goldenPrimary p-1 rounded transition-all"
              title="Rename column"
              aria-label={`Rename column ${column.title}`}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Add Card Button */}
      <button
        onClick={() => onOpenAddModal(column.id)}
        className="w-full mb-3 py-2 px-3 rounded-xl border border-dashed border-borderNavy hover:border-boldSecondary bg-cardNavy/40 hover:bg-boldSecondary/10 text-xs font-medium text-grayText hover:text-white flex items-center justify-center gap-2 transition-all group"
      >
        <Plus className="h-4 w-4 text-boldSecondary group-hover:scale-110 transition-transform" />
        <span>Add Card</span>
      </button>

      {/* Droppable Card Area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto pr-1 min-h-[160px] rounded-xl transition-colors ${
              snapshot.isDraggingOver
                ? "bg-cardNavy/40 border border-dashed border-boldSecondary/40 p-2"
                : ""
            }`}
          >
            {cards.map((card, index) => (
              <KanbanCard
                key={card.id}
                card={card}
                index={index}
                columnId={column.id}
                onDeleteCard={onDeleteCard}
                onOpenDetails={onOpenCardDetails}
                onUpdateCardTitle={onUpdateCardTitle}
              />
            ))}
            {provided.placeholder}
            {cards.length === 0 && !snapshot.isDraggingOver && (
              <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-borderNavy/40 rounded-xl text-grayText/60 text-xs">
                <span>No cards in this column</span>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};
