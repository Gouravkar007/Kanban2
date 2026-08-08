"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, Layers, Trash2, Save, FileText } from "lucide-react";
import { Card } from "../types/kanban";

interface CardDetailsModalProps {
  card: Card | null;
  columnTitle?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardId: string, title: string, details: string) => void;
  onDelete: (cardId: string) => void;
}

export const CardDetailsModal: React.FC<CardDetailsModalProps> = ({
  card,
  columnTitle,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDetails(card.details);
    }
  }, [card]);

  if (!isOpen || !card) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(card.id, title.trim(), details.trim());
    onClose();
  };

  const handleDelete = () => {
    onDelete(card.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkNavy/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0b1a3f] border border-[#1e3a6d] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden font-sans select-none">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e3a6d] bg-[#032147]">
          <div className="flex items-center gap-2 text-xs text-[#888888]">
            <FileText className="h-4 w-4 text-[#ecad0a]" />
            <span className="font-semibold text-white">Card Details</span>
            {columnTitle && (
              <span className="flex items-center gap-1 bg-[#1e3a6d]/50 text-gray-300 px-2 py-0.5 rounded-md font-mono text-[11px]">
                <Layers className="h-3 w-3 text-[#d4a373]" />
                {columnTitle}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[#888888] hover:text-white p-1 rounded-lg hover:bg-[#1e3a6d] transition-colors cursor-pointer"
            title="Close dialog"
            aria-label="Close card details modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Card Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Card title..."
              required
              className="w-full bg-[#032147] border border-[#1e3a6d] focus:border-[#753991] text-white text-sm rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-[#753991] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Description & Details
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              placeholder="Add comprehensive details or notes for this task..."
              className="w-full bg-[#032147] border border-[#1e3a6d] focus:border-[#753991] text-white text-xs rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-[#753991] transition-all resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2 text-[11px] text-[#888888]">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#ecad0a]" />
              <span>Created on {card.createdAt}</span>
            </div>
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2 py-1 rounded-lg transition-colors cursor-pointer"
              title="Delete this card"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Card</span>
            </button>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e3a6d]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-300 bg-[#032147] hover:bg-[#1e3a6d] border border-[#1e3a6d] rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#4361ee] hover:bg-[#4361ee]/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all cursor-pointer shadow-md"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
