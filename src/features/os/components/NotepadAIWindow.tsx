"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Send, Lightbulb, Copy, Trash2, ChevronDown } from "lucide-react";

interface NotepadAIWindowProps {
  onClose: () => void;
}

export function NotepadAIWindow({ onClose }: NotepadAIWindowProps) {
  const [text, setText] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<
    Array<{ type: "user" | "ai"; content: string }>
  >([
    {
      type: "ai",
      content:
        "Hi! I'm your AI writing assistant. Type something to get started.",
    },
  ]);
  const [input, setInput] = React.useState("");

  const handleAISuggestion = async () => {
    if (!text.trim()) {
      setSuggestions(["Write something first!"]);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const aiSuggestions = [
        "✨ Break into shorter, punchier sentences.",
        "💡 Add specific examples to support your point.",
        "📝 Consider a more conversational tone here.",
      ];
      setSuggestions(
        aiSuggestions.sort(() => Math.random() - 0.5).slice(0, 2)
      );
      setLoading(false);
    }, 600);
  };

  const handleAIMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { type: "user" as const, content: input };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const responses = [
        "That's a great idea! You could expand with more details.",
        "Strong writing! Your voice comes through well.",
        "This flows nicely. Consider a transition sentence.",
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [...prev, { type: "ai", content: response }]);
      setLoading(false);
    }, 500);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(text);
  };

  const handleClearText = () => {
    setText("");
    setSuggestions([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, x: 80, y: -80 }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, x: 80, y: -80 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed bottom-20 right-12 z-40 w-full max-w-3xl bg-gradient-to-br from-white/8 via-white/5 to-white/3 border border-white/15 backdrop-blur-2xl rounded-xl overflow-hidden shadow-2xl"
      style={{ maxHeight: "70vh" }}
    >
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-white/10 to-white/5 border-b border-white/10 px-5 py-3 flex items-center justify-between group hover:bg-gradient-to-r hover:from-white/15 hover:to-white/8 transition-colors">
        <div className="flex items-center gap-3 text-white font-medium">
          <span className="text-lg">✎</span>
          <span>Notepad AI</span>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-1.5 rounded transition text-white/70 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col h-full" style={{ maxHeight: "calc(70vh - 54px)" }}>
        {/* Text Editor */}
        <div className="flex-1 flex flex-col min-h-0 border-b border-white/10">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing..."
            className="flex-1 bg-transparent text-white/90 placeholder-white/30 resize-none focus:outline-none text-sm font-mono p-4 leading-relaxed"
          />

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="px-4 py-3 bg-white/5 border-t border-white/10 space-y-2 max-h-32 overflow-y-auto">
              <p className="text-white/60 text-xs font-semibold flex items-center gap-2">
                <Lightbulb size={12} /> Suggestions
              </p>
              {suggestions.map((suggestion, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-white/70 text-xs bg-white/5 rounded px-3 py-2 border-l-2 border-cyan-400/30"
                >
                  {suggestion}
                </motion.p>
              ))}
            </div>
          )}
        </div>

        {/* AI Chat */}
        <div className="flex-1 flex flex-col min-h-0 border-t border-white/10">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white/3">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 text-sm leading-relaxed ${
                    msg.type === "user"
                      ? "bg-cyan-600/40 text-white border border-cyan-500/30"
                      : "bg-white/10 text-white/90 border border-white/10"
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-white/40 text-xs"
              >
                AI is thinking...
              </motion.div>
            )}
          </div>

          {/* Chat Input */}
          <div className="border-t border-white/10 p-3 flex gap-2 bg-white/3 backdrop-blur-sm">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && !e.shiftKey && handleAIMessage()
              }
              placeholder="Ask AI..."
              className="flex-1 bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-cyan-400/50 transition"
            />
            <button
              onClick={handleAIMessage}
              disabled={!input.trim() || loading}
              className="bg-cyan-600/60 hover:bg-cyan-600 disabled:opacity-40 disabled:cursor-not-allowed p-2 rounded-lg transition text-white"
            >
              <Send size={14} />
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white/5 border-t border-white/10 px-4 py-2 flex gap-2 backdrop-blur-sm">
          <button
            onClick={handleAISuggestion}
            disabled={!text.trim() || loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed rounded text-white text-xs transition font-medium"
          >
            <Lightbulb size={12} />
            Suggest
          </button>
          <button
            onClick={handleCopyText}
            disabled={!text.trim()}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed rounded text-white text-xs transition font-medium"
          >
            <Copy size={12} />
            Copy
          </button>
          <button
            onClick={handleClearText}
            disabled={!text.trim()}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed rounded text-white text-xs transition font-medium"
          >
            <Trash2 size={12} />
            Clear
          </button>
          <div className="flex-1" />
          <span className="text-white/40 text-xs font-medium">
            {text.length} chars
          </span>
        </div>
      </div>
    </motion.div>
  );
}
