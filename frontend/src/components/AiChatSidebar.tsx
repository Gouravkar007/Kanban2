"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Sparkles, MessageSquare, Loader2, Undo } from "lucide-react";
import { BoardState } from "../types/kanban";
import { aiChatApi } from "../utils/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  previousBoardState?: BoardState;
}

interface AiChatSidebarProps {
  username?: string;
  isOpen: boolean;
  onClose: () => void;
  onBoardUpdate?: (newBoard: BoardState) => void;
  onBoardStateChange?: (newBoard: BoardState) => void;
  currentBoard?: BoardState;
}

export const AiChatSidebar: React.FC<AiChatSidebarProps> = ({
  username = "user",
  isOpen,
  onClose,
  onBoardUpdate,
  onBoardStateChange,
  currentBoard,
}) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      role: "assistant",
      content:
        "Hello! I am your AI Project Management Assistant. Tell me to add, move, or rename cards or columns on your board!",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (typeof messagesEndRef.current?.scrollIntoView === "function") {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleUndoMessage = (msg: Message) => {
    if (msg.previousBoardState && onBoardStateChange) {
      onBoardStateChange(msg.previousBoardState);
      setMessages((prev) =>
        prev.map((item) =>
          item.id === msg.id ? { ...item, previousBoardState: undefined } : item
        )
      );
    }
  };

  const handleSend = async (textToSend?: string) => {
    const promptText = (textToSend || input).trim();
    if (!promptText || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: promptText,
    };

    const boardBeforeMutation = currentBoard ? JSON.parse(JSON.stringify(currentBoard)) : undefined;

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    const historyPayload = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await aiChatApi(username, promptText, historyPayload);
      setIsLoading(false);

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: "assistant",
            content: "Sorry, I ran into an issue processing your request. Please try again.",
          },
        ]);
        return;
      }

      const hasBoardChanges =
        res.board &&
        boardBeforeMutation &&
        JSON.stringify(res.board) !== JSON.stringify(boardBeforeMutation);

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: res.reply || "Request processed.",
        previousBoardState: hasBoardChanges ? boardBeforeMutation : undefined,
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (res.board) {
        onBoardUpdate?.(res.board);
        onBoardStateChange?.(res.board);
      }
    } catch (error) {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: "An unexpected network error occurred while reaching the AI service.",
        },
      ]);
    }
  };

  const quickPrompts = [
    "Add Implement SSL in To Do column",
    "Rename Backlog column to Ideas",
    "Move card-1 to Done column",
  ];

  return (
    <aside className="fixed right-0 top-0 bottom-0 z-40 w-80 md:w-96 bg-[#032147] border-l border-[#1e3a6d] shadow-2xl flex flex-col font-sans select-none animate-slideLeft">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-[#0b1a3f] border-b border-[#1e3a6d]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-[#753991] to-[#ecad0a] text-white shadow-md">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
              AI Assistant
              <Sparkles className="h-3.5 w-3.5 text-[#ecad0a] inline" />
            </h2>
            <p className="text-[11px] text-[#888888]">Kanban Automation & Insights</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[#888888] hover:text-white p-1.5 rounded-lg hover:bg-[#032147] transition-colors"
          title="Close Sidebar"
          aria-label="Close AI Sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Quick Suggestions */}
      <div className="px-4 py-2.5 bg-[#081635] border-b border-[#1e3a6d] flex items-center gap-2 overflow-x-auto scrollbar-none">
        <MessageSquare className="h-3.5 w-3.5 text-[#ecad0a] shrink-0" />
        <span className="text-[10px] text-[#888888] font-semibold shrink-0">Try:</span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="text-[10px] bg-[#032147] hover:bg-[#753991]/20 border border-[#1e3a6d] text-gray-200 px-2 py-1 rounded-full whitespace-nowrap transition-colors"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                m.role === "user"
                  ? "bg-[#753991] text-white rounded-br-none"
                  : "bg-[#0b1a3f] border border-[#1e3a6d] text-gray-200 rounded-bl-none"
              }`}
            >
              <div>{m.content}</div>
              {m.role === "assistant" && m.previousBoardState && (
                <div className="mt-2 pt-2 border-t border-[#1e3a6d] flex justify-end">
                  <button
                    onClick={() => handleUndoMessage(m)}
                    className="flex items-center gap-1.5 text-[10px] text-accentYellow hover:text-white transition-colors cursor-pointer px-2.5 py-1 rounded bg-[#032147] border border-[#1e3a6d]"
                    title="Undo this specific AI change"
                  >
                    <Undo className="h-3 w-3" />
                    <span>Undo Action</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#0b1a3f] border border-[#1e3a6d] text-[#ecad0a] text-xs rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>AI is thinking & updating board...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 bg-[#0b1a3f] border-t border-[#1e3a6d] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI to add or edit cards..."
          disabled={isLoading}
          className="flex-1 bg-[#032147] border border-[#1e3a6d] focus:border-[#753991] text-white text-xs rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-[#753991] transition-all placeholder-[#888888]/60 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-[#753991] hover:bg-[#753991]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-all cursor-pointer shadow-md"
          title="Send Message"
          aria-label="Send message to AI"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </aside>
  );
};
