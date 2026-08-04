"use client";

import React from "react";
import { LayoutGrid, Layers } from "lucide-react";

interface HeaderProps {
  totalCards: number;
  totalColumns: number;
}

export const Header: React.FC<HeaderProps> = ({ totalCards, totalColumns }) => {
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
              FlowKanban <span className="text-xs px-2 py-0.5 rounded-full bg-accentYellow/10 text-accentYellow border border-accentYellow/30 font-medium">MVP</span>
            </h1>
            <p className="text-xs text-grayText">Single Board Project Workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 bg-cardNavy/80 border border-borderNavy px-3 py-1.5 rounded-lg text-grayText">
            <Layers className="h-4 w-4 text-goldenPrimary" />
            <span><strong className="text-white">{totalColumns}</strong> Columns</span>
          </div>
          <div className="flex items-center gap-2 bg-cardNavy/80 border border-borderNavy px-3 py-1.5 rounded-lg text-grayText">
            <span className="h-2 w-2 rounded-full bg-accentYellow inline-block animate-pulse"></span>
            <span><strong className="text-white">{totalCards}</strong> Total Cards</span>
          </div>
        </div>
      </div>
    </header>
  );
};
