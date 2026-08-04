"use client";

import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Trash2, GripVertical, Clock } from "lucide-react";
import { Card } from "../types/kanban";

interface KanbanCardProps {
  card: Card;
  index: number;
  columnId: string;
  onDeleteCard: (cardId: string, columnId: string) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  card,
  index,
  columnId,
  onDeleteCard,
}) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group relative rounded-xl border p-4 mb-3 transition-all duration-200 shadow-md ${
            snapshot.isDragging
              ? "bg-cardNavy border-boldSecondary shadow-2xl shadow-boldSecondary/20 scale-[1.02] ring-2 ring-boldSecondary/50 z-50"
              : "bg-cardNavy/90 border-borderNavy hover:border-goldenPrimary/40 hover:bg-cardNavy hover:shadow-lg"
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span
                {...provided.dragHandleProps}
                className="text-grayText hover:text-white cursor-grab active:cursor-grabbing p-0.5 rounded transition-colors"
                title="Drag card"
              >
                <GripVertical className="h-4 w-4 shrink-0" />
              </span>
              <h3 className="font-semibold text-sm text-white truncate leading-snug">
                {card.title}
              </h3>
            </div>
            <button
              onClick={() => onDeleteCard(card.id, columnId)}
              className="opacity-0 group-hover:opacity-100 text-grayText hover:text-red-400 p-1 rounded-md hover:bg-red-500/10 transition-all shrink-0"
              title="Delete card"
              aria-label={`Delete card ${card.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {card.details && (
            <p className="text-xs text-grayText leading-relaxed mb-3 line-clamp-3 pl-6">
              {card.details}
            </p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-borderNavy/50 pl-6 text-[11px] text-grayText">
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
