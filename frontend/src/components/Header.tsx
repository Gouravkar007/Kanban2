"use client";

import React from "react";
import { LayoutGrid, Layers, Bot, Sparkles, LogOut, User } from "lucide-react";

interface HeaderProps {
  totalCards: number;
  totalColumns: number;
  username?: string;
  onLogout?: () => void;
  onToggleAi?: () => void;
  isAiOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  totalCards,
  totalColumns,
  username,
  onLogout,
  onToggleAi,
  isAiOpen,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-darkNavy/90 backdrop-blur-md border-b border-borderNavy px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-boldSecondary to-accentYellow p-0.5 shadow-lg shadow-boldSecondary/20 flex items-center justify-center">
            <div className="h-full w-full bg-darkNavy rounded-[10px] flex items-center justify-center">
              <LayoutGrid className="h-5 w-5 text-accentYellow" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              FlowKanban{" "}
              <span className="text-xs px-2 py-0.5 rounded-full bg-accentYellow/10 text-accentYellow border border-accentYellow/30 font-medium">
                MVP
              </span>
            </h1>
            <p className="text-xs text-grayText">Single Board Project Workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {onToggleAi && (
            <button
              onClick={onToggleAi}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                isAiOpen
                  ? "bg-[#753991] border-[#753991] text-white ring-2 ring-[#753991]/30"
                  : "bg-[#0b1a3f] border-[#1e3a6d] text-[#d4a373] hover:text-white hover:border-[#753991]"
              }`}
              title="Open AI Assistant"
            >
              <Bot className="h-3.5 w-3.5 text-[#ecad0a]" />
              <span>AI Chat</span>
              <Sparkles className="h-3 w-3 text-[#ecad0a] animate-pulse" />
            </button>
          )}

          <div className="flex items-center gap-2 bg-cardNavy/80 border border-borderNavy px-3 py-1.5 rounded-lg text-grayText">
            <Layers className="h-4 w-4 text-goldenPrimary" />
            <span>
              <strong className="text-white">{totalColumns}</strong> Columns
            </span>
          </div>

          <div className="flex items-center gap-2 bg-cardNavy/80 border border-borderNavy px-3 py-1.5 rounded-lg text-grayText">
            <span className="h-2 w-2 rounded-full bg-accentYellow inline-block animate-pulse"></span>
            <span>
              <strong className="text-white">{totalCards}</strong> Total Cards
            </span>
          </div>

          {username && (
            <div className="flex items-center gap-2.5 pl-2 border-l border-borderNavy">
              <div className="flex items-center gap-1.5 bg-cardNavy border border-borderNavy px-2.5 py-1 rounded-lg text-grayText font-mono text-[11px]">
                <User className="h-3 w-3 text-goldenPrimary" />
                <span className="text-white font-medium">{username}</span>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1 text-grayText hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Logout session"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
