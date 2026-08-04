"use client";

import React, { useState } from "react";
import { X, Plus } from "lucide-react";

interface AddCardModalProps {
  isOpen: boolean;
  columnTitle: string;
  onClose: () => void;
  onAddCard: (title: string, details: string) => void;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({
  isOpen,
  columnTitle,
  onClose,
  onAddCard,
}) => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddCard(title, details);
    setTitle("");
    setDetails("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-darkNavy border border-borderNavy rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-borderNavy bg-surfaceNavy">
          <div>
            <h2 className="text-base font-semibold text-white">Create New Card</h2>
            <p className="text-xs text-grayText">Adding to column: <strong className="text-goldenPrimary">{columnTitle}</strong></p>
          </div>
          <button
            onClick={onClose}
            className="text-grayText hover:text-white p-1 rounded-lg hover:bg-cardNavy transition-colors"
            title="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-grayText mb-1.5">
              Card Title <span className="text-accentYellow">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement user authentication"
              autoFocus
              className="w-full bg-cardNavy border border-borderNavy focus:border-boldSecondary text-white placeholder-grayText/60 text-sm rounded-xl p-3 outline-none focus:ring-1 focus:ring-boldSecondary transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-grayText mb-1.5">
              Card Details
            </label>
            <textarea
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide context, acceptance criteria, or relevant technical details..."
              className="w-full bg-cardNavy border border-borderNavy focus:border-boldSecondary text-white placeholder-grayText/60 text-sm rounded-xl p-3 outline-none focus:ring-1 focus:ring-boldSecondary transition-all resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-borderNavy text-xs font-medium text-grayText hover:text-white hover:bg-cardNavy transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2.5 rounded-xl bg-boldSecondary hover:bg-boldSecondary/90 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold text-white flex items-center gap-2 shadow-lg shadow-boldSecondary/30 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Create Card</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
