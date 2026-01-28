"use client";

import React from "react";
import { Lightbulb, Copy, Trash2, Send, ChevronDown, Zap } from "lucide-react";
import {
  checkOllamaAvailability,
  getAvailableModels,
  streamOllamaResponse,
  AVAILABLE_MODELS,
} from "@/lib/ollama";

export function NotepadApp() {
  const [text, setText] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [ollamaAvailable, setOllamaAvailable] = React.useState(false);
  const [ollamaModels, setOllamaModels] = React.useState<string[]>([]);
  const [selectedModel, setSelectedModel] = React.useState("qwen2.5");
  const [showModelDropdown, setShowModelDropdown] = React.useState(false);
  const [messages, setMessages] = React.useState<Array<{ type: "user" | "ai"; content: string }>>([
    { type: "ai", content: "Hi! I'm your AI writing assistant. Type something to get started." },
  ]);
  const [input, setInput] = React.useState("");

  React.useEffect(() => {
    const initOllama = async () => {
      const available = await checkOllamaAvailability();
      setOllamaAvailable(available);

      if (available) {
        const models = await getAvailableModels();
        setOllamaModels(models);
        if (models.length > 0) {
          setSelectedModel(models[0]);
        }
      }
    };

    initOllama();
  }, []);

  const handleAISuggestion = async () => {
    if (!text.trim()) {
      setSuggestions(["Write something first!"]);
      return;
    }
    setLoading(true);
    try {
      if (ollamaAvailable) {
        const suggestionsChunks: string[] = [];
        const systemPrompt =
          "You are a helpful writing assistant. Provide 2-3 specific, actionable suggestions to improve the writing below. Format each as bullet points starting with •.";

        for await (const chunk of streamOllamaResponse(
          `Here's some writing I'd like help improving:\n\n${text}`,
          selectedModel,
          systemPrompt
        )) {
          suggestionsChunks.push(chunk);
        }

        const fullResponse = suggestionsChunks.join("");
        setSuggestions(
          fullResponse
            .split("\n")
            .filter((s) => s.trim().startsWith("•"))
            .slice(0, 3)
        );
      } else {
        const aiSuggestions = [
          "Break into shorter, punchier sentences.",
          "Add specific examples to support your point.",
          "Consider a more conversational tone here.",
        ];
        setSuggestions(aiSuggestions.sort(() => Math.random() - 0.5).slice(0, 2));
      }
    } catch (error) {
      setSuggestions([
        `Error getting suggestions: ${error instanceof Error ? error.message : "Unknown error"}`,
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
      if (ollamaAvailable) {
        let fullResponse = "";
        setMessages((prev) => [...prev, { type: "ai", content: "✨ Thinking..." }]);

        for await (const chunk of streamOllamaResponse(
          userInput,
          selectedModel,
          "You are a helpful writing assistant. Provide clear, concise feedback or answers."
        )) {
          fullResponse += chunk;
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last?.type === "ai") {
              last.content = fullResponse;
            }
            return updated;
          });
        }
      } else {
        throw new Error("Local LLM not available");
      }
    } catch (error) {
      // Fallback to mock responses if Ollama is not running
      setTimeout(() => {
        const responses = [
          "That's a great idea! You could expand with more details.",
          "Strong writing! Your voice comes through well.",
          "This flows nicely. Consider a transition sentence.",
          "Note: Start Ollama and pull a model (e.g., qwen2.5) for real AI responses.",
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        setMessages((prev) => [...prev, { type: "ai", content: response }]);
        setLoading(false);
      }, 500);
      return;
    }
    
    setLoading(false);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(text);
  };

  const handleClearText = () => {
    setText("");
    setSuggestions([]);
  };

  const getModelDisplay = (model: string): string => {
    const meta = AVAILABLE_MODELS[model];
    return meta ? meta.display : model;
  };

  return (
    <div className="flex flex-col h-full text-white gap-3">
      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span>Notepad AI</span>
          {ollamaAvailable ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-300">
              <Zap size={10} />
              Local LLM Ready
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-300">
              Offline
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="relative">
            <button
              onClick={() => setShowModelDropdown((v) => !v)}
              className="flex items-center gap-2 px-2 py-1 rounded bg-white/10 hover:bg-white/15 border border-white/10 text-white/80"
              disabled={!ollamaAvailable || ollamaModels.length === 0}
            >
              {getModelDisplay(selectedModel)}
              <ChevronDown size={12} />
            </button>
            {showModelDropdown && ollamaModels.length > 0 ? (
              <div className="absolute right-0 mt-1 bg-black/90 border border-white/15 rounded-lg shadow-xl z-50 min-w-40 overflow-hidden">
                {ollamaModels.map((model) => (
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
