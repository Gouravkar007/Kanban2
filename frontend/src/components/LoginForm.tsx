"use client";

import React, { useState } from "react";
import { Lock, User, LogIn, AlertCircle } from "lucide-react";
import { loginApi } from "../utils/api";

interface LoginFormProps {
  onLogin: (username: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await loginApi(username.trim(), password);
    setIsLoading(false);

    if (res.ok && res.username) {
      onLogin(res.username);
    } else if (username.trim() === "user" && password === "password") {
      // Local demo fallback if API unreachable
      onLogin("user");
    } else {
      setError(res.error || "Invalid username or password. Try user / password");
    }
  };

  return (
    <div className="min-h-screen bg-[#032147] flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-[#0b1a3f] border border-[#1e3a6d] rounded-2xl p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#753991] to-[#ecad0a] p-0.5 shadow-lg shadow-[#753991]/30">
            <div className="w-full h-full bg-[#032147] rounded-[14px] flex items-center justify-center">
              <Lock className="h-6 w-6 text-[#ecad0a]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Sign In to FlowKanban
          </h1>
          <p className="text-xs text-[#888888]">
            Enter your credentials to access your project workspace
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#888888] mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username (user)"
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-[#032147] border border-[#1e3a6d] focus:border-[#753991] text-white text-sm rounded-xl outline-none focus:ring-1 focus:ring-[#753991] transition-all placeholder-[#888888]/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#888888] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (password)"
                className="w-full pl-10 pr-4 py-2.5 bg-[#032147] border border-[#1e3a6d] focus:border-[#753991] text-white text-sm rounded-xl outline-none focus:ring-1 focus:ring-[#753991] transition-all placeholder-[#888888]/60"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#753991] hover:bg-[#753991]/90 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#753991]/30 transition-all cursor-pointer"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#1e3a6d]">
          <p className="text-[11px] text-[#888888]">
            MVP Demo Credentials: <code className="text-[#ecad0a]">user</code> / <code className="text-[#ecad0a]">password</code>
          </p>
        </div>
      </div>
    </div>
  );
};
