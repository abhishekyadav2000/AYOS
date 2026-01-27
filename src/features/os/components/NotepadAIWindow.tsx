"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Send, Lightbulb, Copy, Trash2 } from "lucide-react";

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
        "Hello! I'm your AI writing assistant. Tell me what you're working on, and I'll help you with suggestions, improvements, or creative ideas. What would you like to write about?",
    },
  ]);
  const [input, setInput] = React.useState("");

  const handleAISuggestion = async () => {
    if (!text.trim()) {
      setSuggestions(["Please enter some text first!"]);
      return;
    }

    setLoading(true);
    // Simulate AI suggestions
    setTimeout(() => {
      const aiSuggestions = [
        "✨ Try breaking this into shorter, punchier sentences.",
        "💡 Consider adding specific examples to support your point.",
        "📝 The tone could be more conversational here.",
        "🎯 This paragraph could be the introduction to your piece.",
        "✅ Great use of active voice! Keep it up.",
      ];
      setSuggestions(
        aiSuggestions.sort(() => Math.random() - 0.5).slice(0, 3)
      );
      setLoading(false);
    }, 800);
  };

  const handleAIMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { type: "user" as const, content: input };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great idea! You could expand on that by adding more details and examples.",
        "I love where you're going with this. Try connecting it to your main theme.",
        "This flows well. Consider adding a transition sentence here for better readability.",
        "Strong writing! Your voice really comes through in this section.",
        "That's insightful. Would you like suggestions on how to develop this further?",
      ];
      const response =
        responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [
        ...prev,
        { type: "ai", content: response },
      ]);
      setLoading(false);
    }, 600);
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
      initial={{ opacity: 0, scale: 0.8, x: 100, y: -100 }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: 100, y: -100 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-20 right-12 z-40 w-full max-w-2xl bg-white/5 border border-white/10 backdrop-blur-xl rounded-lg overflow-hidden shadow-2xl"
      style={{ maxHeight: "600px" }}
    >
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-semibold">
          <span>✎</span>
          <span>Notepad AI</span>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-1 rounded transition"
        >
          <X size={20} className="text-white" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col h-full" style={{ maxHeight: "580px" }}>
        {/* Text Editor */}
        <div className="flex-1 flex flex-col min-h-0 border-b border-white/10">
          <div className="flex-1 overflow-y-auto p-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing... I'll help you improve your writing!"
              className="w-full h-full bg-transparent text-white placeholder-white/40 resize-none focus:outline-none text-sm font-mono"
            />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="px-4 py-3 bg-white/5 border-t border-white/10 space-y-2">
              <p className="text-white/70 text-xs font-semibold flex items-center gap-2">
                <Lightbulb size={14} /> AI Suggestions
              </p>
              {suggestions.map((suggestion, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-white/60 text-sm bg-white/5 rounded px-3 py-2 border-l-2 border-cyan-400/50"
                >
                  {suggestion}
                </motion.p>
              ))}
            </div>
          )}
        </div>

        {/* AI Chat Interface */}
        <div className="flex-1 flex flex-col min-h-0 border-t border-white/10 bg-black/20">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 text-sm ${
                    msg.type === "user"
                      ? "bg-cyan-600/60 text-white"
                      : "bg-white/10 text-white/90"
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
                className="text-white/50 text-xs italic"
              >
                AI is thinking...
              </motion.div>
            )}
          </div>

          {/* Chat Input */}
          <div className="border-t border-white/10 p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && !e.shiftKey && handleAIMessage()
              }
              placeholder="Ask AI for help..."
              className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm placeholder-white/40 focus:outline-none focus:border-cyan-400/50"
            />
            <button
              onClick={handleAIMessage}
              disabled={!input.trim() || loading}
              className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded transition text-white"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white/5 border-t border-white/10 px-4 py-2 flex gap-2">
          <button
            onClick={handleAISuggestion}
            disabled={!text.trim() || loading}
            className="flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white text-xs transition"
          >
            <Lightbulb size={14} />
            Suggest
          </button>
          <button
            onClick={handleCopyText}
            disabled={!text.trim()}
            className="flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white text-xs transition"
          >
            <Copy size={14} />
            Copy
          </button>
          <button
            onClick={handleClearText}
            disabled={!text.trim()}
            className="flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white text-xs transition"
          >
            <Trash2 size={14} />
            Clear
          </button>
          <div className="flex-1" />
          <span className="text-white/50 text-xs">
            {text.length} characters
          </span>
        </div>
      </div>
    </motion.div>
  );
}
