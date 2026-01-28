"use client";

import React from "react";
import { Lightbulb, Copy, Trash2, Send, ChevronDown, Zap } from "lucide-react";
import {
  isGeminiAvailable,
  streamGeminiResponse,
  getGeminiResponse,
  AVAILABLE_GEMINI_MODELS,
} from "@/lib/gemini";

export function NotepadApp() {
  const [text, setText] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [aiAvailable, setAiAvailable] = React.useState(false);
  const [selectedModel, setSelectedModel] = React.useState("gemini-2.0-flash");
  const [showModelDropdown, setShowModelDropdown] = React.useState(false);
  const [messages, setMessages] = React.useState<Array<{ type: "user" | "ai"; content: string }>>([
    { type: "ai", content: "Hi! I'm your AI writing assistant. Type something to get started." },
  ]);
  const [input, setInput] = React.useState("");

  React.useEffect(() => {
    const available = isGeminiAvailable();
    setAiAvailable(available);
    
    if (!available) {
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content:
            "⚠️ Gemini API key not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file to enable AI features.",
        },
      ]);
    }
  }, []);

  const handleAISuggestion = async () => {
    if (!text.trim()) {
      setSuggestions(["Write something first!"]);
      return;
    }
    setLoading(true);
    try {
      if (aiAvailable) {
        const systemPrompt =
          "You are a helpful writing assistant. Provide 2-3 specific, actionable suggestions to improve the writing below. Format each as bullet points starting with •.";

        const response = await getGeminiResponse(
          `Here's some writing I'd like help improving:\n\n${text}`,
          selectedModel,
          systemPrompt
        );

        setSuggestions(
          response
            .split("\n")
            .filter((s) => s.trim().startsWith("•"))
            .slice(0, 3)
        );
      } else {
        setSuggestions(["Please configure Gemini API key to use AI features."]);
      }
    } catch (error) {
      setSuggestions([
        `Error: ${error instanceof Error ? error.message : "Failed to get suggestions"}`,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAIMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { type: "user" as const, content: input };
    setMessages((prev) => [...prev, newMessage]);
    const userInput = input;
    setInput("");
    setLoading(true);

    try {
      if (aiAvailable) {
        setMessages((prev) => [...prev, { type: "ai", content: "✨ Thinking..." }]);

        const response = await getGeminiResponse(
          userInput,
          selectedModel,
          "You are a helpful writing assistant. Provide clear, concise feedback or answers."
        );

        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.type === "ai") {
            last.content = response;
          }
          return updated;
        });
      } else {
        throw new Error("Gemini API not available");
      }
    } catch (error) {
      console.error('[NotepadApp] AI message error:', error);
      // Show error message to user
      setMessages((prev) => [
        ...prev.filter(m => m.content !== "✨ Thinking..."), // Remove thinking message
        {
          type: "ai",
          content: `❌ Error: ${error instanceof Error ? error.message : "Failed to get response"}\n\nℹ️ Please configure Gemini API:\n• Add NEXT_PUBLIC_GEMINI_API_KEY to .env.local\n• Get key from: https://ai.google.dev`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(text);
  };

  const handleClearText = () => {
    setText("");
    setSuggestions([]);
  };

  const getModelDisplay = (model: string): string => {
    const meta = AVAILABLE_GEMINI_MODELS[model];
    return meta ? meta.display : model;
  };

  return (
    <div className="flex flex-col h-full text-white gap-3">
      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span>Notepad AI</span>
          {aiAvailable ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-300">
              <Zap size={10} />
              Gemini Ready
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-300">
              Not Configured
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="relative">
            <button
              onClick={() => setShowModelDropdown((v) => !v)}
              className="flex items-center gap-2 px-2 py-1 rounded bg-white/10 hover:bg-white/15 border border-white/10 text-white/80"
              disabled={!aiAvailable}
            >
              {getModelDisplay(selectedModel)}
              <ChevronDown size={12} />
            </button>
            {showModelDropdown && aiAvailable ? (
              <div className="absolute right-0 mt-1 bg-black/90 border border-white/15 rounded-lg shadow-xl z-50 min-w-40 overflow-hidden">
                {Object.keys(AVAILABLE_GEMINI_MODELS).map((model: string) => (
                  <button
                    key={model}
                    onClick={() => {
                      setSelectedModel(model);
                      setShowModelDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-white/10 transition ${
                      selectedModel === model ? "bg-cyan-500/20 text-cyan-200" : "text-white/80"
                    }`}
                  >
                    {getModelDisplay(model)}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <button
            onClick={handleAISuggestion}
            disabled={!text.trim() || loading}
            className="flex items-center gap-1 px-2 py-1 rounded bg-white/10 hover:bg-white/15 disabled:opacity-50"
          >
            <Lightbulb size={12} />
            Suggest
          </button>
          <button
            onClick={handleCopyText}
            disabled={!text.trim()}
            className="flex items-center gap-1 px-2 py-1 rounded bg-white/10 hover:bg-white/15 disabled:opacity-50"
          >
            <Copy size={12} />
            Copy
          </button>
          <button
            onClick={handleClearText}
            disabled={!text.trim()}
            className="flex items-center gap-1 px-2 py-1 rounded bg-white/10 hover:bg-white/15 disabled:opacity-50"
          >
            <Trash2 size={12} />
            Clear
          </button>
          <span className="text-white/40">{text.length} chars • {getModelDisplay(selectedModel)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 min-h-0">
        {/* Editor */}
        <div className="flex flex-col bg-white/5 border border-white/10 rounded-lg overflow-hidden min-h-[220px]">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing..."
            className="flex-1 bg-transparent text-white/90 placeholder-white/30 resize-none focus:outline-none text-sm font-mono p-3 leading-relaxed"
          />
          {suggestions.length > 0 ? (
            <div className="px-3 py-2 bg-white/5 border-t border-white/10 space-y-1 max-h-32 overflow-y-auto text-xs text-white/80">
              {suggestions.map((suggestion, idx) => (
                <div key={idx} className="bg-white/5 rounded px-2 py-1 border-l-2 border-cyan-400/30">
                  {suggestion}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Chat */}
        <div className="flex flex-col bg-white/5 border border-white/10 rounded-lg overflow-hidden min-h-[220px]">
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs rounded-lg px-3 py-2 text-sm leading-relaxed ${
                    msg.type === "user"
                      ? "bg-cyan-600/40 text-white border border-cyan-500/30"
                      : "bg-white/10 text-white/90 border border-white/10"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading ? <div className="text-white/40 text-xs">AI is thinking...</div> : null}
          </div>
          <div className="border-t border-white/10 p-3 flex gap-2 bg-white/5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAIMessage();
                }
              }}
              placeholder="Ask AI..."
              className="flex-1 bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-cyan-400/50"
            />
            <button
              onClick={handleAIMessage}
              disabled={!input.trim() || loading}
              className="bg-cyan-600/60 hover:bg-cyan-600 disabled:opacity-40 p-2 rounded-lg text-white"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
