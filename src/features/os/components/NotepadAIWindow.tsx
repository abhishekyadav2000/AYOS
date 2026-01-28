"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Send, Lightbulb, Copy, Trash2, ChevronDown, Zap } from "lucide-react";
import {
  checkOllamaAvailability,
  getAvailableModels,
  streamOllamaResponse,
  AVAILABLE_MODELS,
  type OllamaModel,
} from "@/lib/ollama";

interface NotepadAIWindowProps {
  onClose: () => void;
}

export function NotepadAIWindow({ onClose }: NotepadAIWindowProps) {
  const [text, setText] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [ollamaAvailable, setOllamaAvailable] = React.useState(false);
  const [ollamaModels, setOllamaModels] = React.useState<string[]>([]);
  const [selectedModel, setSelectedModel] = React.useState("neural-chat");
  const [showModelDropdown, setShowModelDropdown] = React.useState(false);
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
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Initialize Ollama on mount
  React.useEffect(() => {
    const initOllama = async () => {
      const available = await checkOllamaAvailability();
      setOllamaAvailable(available);

      if (available) {
        const models = await getAvailableModels();
        setOllamaModels(models);
        // Use first available model or fallback to neural-chat
        if (models.length > 0) {
          setSelectedModel(models[0]);
        }
      }
    };

    initOllama();
  }, []);

  // Auto-scroll to latest message
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAISuggestion = async () => {
    if (!text.trim()) {
      setSuggestions(["Write something first!"]);
      return;
    }

    setLoading(true);
    try {
      if (ollamaAvailable) {
        const suggestions_array: string[] = [];
        const systemPrompt =
          "You are a helpful writing assistant. Provide 2-3 specific, actionable suggestions to improve the writing below. Format each as a bullet point starting with an emoji.";

        for await (const chunk of streamOllamaResponse(
          `Here's some writing I'd like help improving:\n\n${text}`,
          selectedModel,
          systemPrompt
        )) {
          suggestions_array.push(chunk);
        }

        const fullResponse = suggestions_array.join("");
        setSuggestions(
          fullResponse
            .split("\n")
            .filter((s) => s.trim() && s.trim().startsWith("•"))
            .slice(0, 2)
        );
      } else {
        const aiSuggestions = [
          "✨ Break into shorter, punchier sentences.",
          "💡 Add specific examples to support your point.",
          "📝 Consider a more conversational tone here.",
        ];
        setSuggestions(
          aiSuggestions.sort(() => Math.random() - 0.5).slice(0, 2)
        );
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
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    try {
      if (ollamaAvailable) {
        let fullResponse = "";
        const systemPrompt =
          "You are a helpful writing assistant. Provide clear, concise feedback on the user's writing or question.";

        // Add AI thinking message
        setMessages((prev) => [
          ...prev,
          { type: "ai", content: "✨ Thinking..." },
        ]);

        for await (const chunk of streamOllamaResponse(
          input,
          selectedModel,
          systemPrompt
        )) {
          fullResponse += chunk;
          // Update last message with streamed content
          setMessages((prev) => {
            const newMessages = [...prev];
            if (newMessages[newMessages.length - 1].type === "ai") {
              newMessages[newMessages.length - 1].content = fullResponse;
            }
            return newMessages;
          });
        }
      } else {
        const responses = [
          "That's a great idea! You could expand with more details.",
          "Strong writing! Your voice comes through well.",
          "This flows nicely. Consider a transition sentence.",
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        setMessages((prev) => [...prev, { type: "ai", content: response }]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: `Error: ${error instanceof Error ? error.message : "Failed to get response"}`,
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

  const handleSaveChat = () => {
    const chatContent = messages
      .map((msg) => `${msg.type === "user" ? "You" : "AI"}: ${msg.content}`)
      .join("\n\n");
    const fullContent = `# Chat History\nModel: ${getModelDisplay(selectedModel)}\n\n${chatContent}`;
    const blob = new Blob([fullContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${new Date().toISOString().split("T")[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportToTwitter = () => {
    const tweet = text.length > 280 ? text.substring(0, 277) + "..." : text;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweet + "\n\n#AYOS #AI"
    )}`;
    window.open(twitterUrl, "_blank");
  };

  const handleExportToLinkedin = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      window.location.href
    )}&summary=${encodeURIComponent(text.substring(0, 200))}`;
    window.open(linkedinUrl, "_blank");
  };

  const getModelDisplay = (model: string): string => {
    const meta = AVAILABLE_MODELS[model];
    return meta ? `${meta.display}` : model;
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
          {ollamaAvailable && (
            <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-300">
              <Zap size={10} />
              Ollama Ready
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-1.5 rounded transition text-white/70 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      {/* Model Selector - Only show if Ollama is available */}
      {ollamaAvailable && (
        <div className="bg-white/5 border-b border-white/10 px-5 py-2 flex items-center gap-3">
          <span className="text-white/60 text-xs font-medium">Model:</span>
          <div className="relative">
            <button
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded text-white text-xs font-medium transition"
            >
              {getModelDisplay(selectedModel)}
              <ChevronDown size={12} />
            </button>

            {showModelDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-1 left-0 bg-black/90 border border-white/20 rounded-lg shadow-xl min-w-48 z-50 overflow-hidden"
              >
                {ollamaModels.map((model) => (
                  <button
                    key={model}
                    onClick={() => {
                      setSelectedModel(model);
                      setShowModelDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-white/10 transition ${
                      selectedModel === model ? "bg-cyan-500/30 text-cyan-300" : "text-white/70"
                    }`}
                  >
                    {getModelDisplay(model)}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      )}

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
            <div ref={messagesEndRef} />
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
        <div className="bg-white/5 border-t border-white/10 px-4 py-2 flex gap-2 flex-wrap backdrop-blur-sm">
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
            onClick={handleSaveChat}
            disabled={messages.length <= 1}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-600/30 hover:bg-green-600/40 disabled:opacity-40 disabled:cursor-not-allowed rounded text-green-300 text-xs transition font-medium"
          >
            💾
            Save
          </button>
          <button
            onClick={handleExportToTwitter}
            disabled={!text.trim()}
            className="flex items-center gap-2 px-3 py-1.5 bg-cyan-600/30 hover:bg-cyan-600/40 disabled:opacity-40 disabled:cursor-not-allowed rounded text-cyan-300 text-xs transition font-medium"
          >
            𝕏
            Tweet
          </button>
          <button
            onClick={handleExportToLinkedin}
            disabled={!text.trim()}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/40 disabled:opacity-40 disabled:cursor-not-allowed rounded text-blue-300 text-xs transition font-medium"
          >
            in
            LinkedIn
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
            {text.length} chars • {getModelDisplay(selectedModel)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
