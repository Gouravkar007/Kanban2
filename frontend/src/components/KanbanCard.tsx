"use client";

import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Trash2, GripVertical, Clock, Edit2, Check, X } from "lucide-react";
import { Card } from "../types/kanban";

interface KanbanCardProps {
  card: Card;
  index: number;
  columnId: string;
  onDeleteCard: (cardId: string, columnId: string) => void;
  onUpdateCardTitle?: (cardId: string, newTitle: string) => void;
  onOpenDetails?: (card: Card) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  card,
  index,
  columnId,
  onDeleteCard,
  onUpdateCardTitle,
  onOpenDetails,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(card.title);

  const handleSaveTitle = (e?: React.FormEvent) => {
    if (e) e.stopPropagation();
    const trimmed = titleInput.trim();
    if (trimmed && onUpdateCardTitle) {
      onUpdateCardTitle(card.id, trimmed);
    } else {
      setTitleInput(card.title);
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setTitleInput(card.title);
      setIsEditingTitle(false);
    }
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group relative rounded-xl border p-4 mb-3 transition-all duration-200 shadow-md select-none ${
            snapshot.isDragging
              ? "bg-cardNavy border-boldSecondary shadow-2xl shadow-boldSecondary/20 scale-[1.02] ring-2 ring-boldSecondary/50 z-50"
              : "bg-cardNavy/90 border-borderNavy hover:border-goldenPrimary/50 hover:bg-cardNavy hover:shadow-xl"
          }`}
        >
          {/* Card Top Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span
                {...provided.dragHandleProps}
                onClick={(e) => e.stopPropagation()}
                className="text-grayText hover:text-white cursor-grab active:cursor-grabbing p-0.5 rounded transition-colors"
                title="Drag card"
              >
                <GripVertical className="h-4 w-4 shrink-0" />
              </span>

              {isEditingTitle ? (
                <div
                  className="flex items-center gap-1 flex-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => handleSaveTitle()}
                    autoFocus
                    className="w-full bg-[#032147] border border-[#753991] text-white text-xs font-semibold rounded px-2 py-1 outline-none focus:ring-1 focus:ring-[#ecad0a]"
                  />
                  <button
                    onClick={handleSaveTitle}
                    className="p-1 text-[#ecad0a] hover:bg-[#0b1a3f] rounded transition-colors"
                    title="Save title"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTitleInput(card.title);
                      setIsEditingTitle(false);
                    }}
                    className="p-1 text-grayText hover:bg-[#0b1a3f] rounded transition-colors"
                    title="Cancel"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <h3
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingTitle(true);
                  }}
                  className="font-semibold text-sm text-white truncate leading-snug cursor-pointer hover:text-goldenPrimary transition-colors"
                  title="Click to rename card inline"
                >
                  {card.title}
                </h3>
              )}
            </div>

            {/* Quick Action Icons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetails?.(card);
                }}
                className="text-grayText hover:text-goldenPrimary p-1 rounded-md hover:bg-[#1e3a6d]/50 transition-all"
                title="Edit card details"
                aria-label={`Edit details for ${card.title}`}
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCard(card.id, columnId);
                }}
                className="text-grayText hover:text-red-400 p-1 rounded-md hover:bg-red-500/10 transition-all"
                title="Delete card"
                aria-label={`Delete card ${card.title}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Details Preview */}
          {card.details && (
            <p
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails?.(card);
              }}
              className="text-xs text-grayText leading-relaxed mb-3 line-clamp-3 pl-6 cursor-pointer hover:text-white transition-colors"
              title="Click to view/edit details"
            >
              {card.details}
            </p>
          )}

          {/* Footer Metadata */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails?.(card);
            }}
            className="flex items-center justify-between pt-2 border-t border-borderNavy/50 pl-6 text-[11px] text-grayText cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-goldenPrimary" />
              <span>{card.createdAt || "Recent"}</span>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-accentYellow/60"></span>
          </div>
        </div>
      )}
    </Draggable>
  );
};
