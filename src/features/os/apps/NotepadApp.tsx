"use client";

import React from "react";
import { Lightbulb, Copy, Trash2, Send, ChevronDown, Zap } from "lucide-react";
import {
  isGeminiAvailable,
  streamGeminiResponse,
  getGeminiResponse,
  AVAILABLE_GEMINI_MODELS,
} from "@/lib/gemini";

// Smart fallback AI that understands context and responds like ChatGPT
const generateSmartResponse = (userInput: string): string => {
  const input = userInput.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|greetings|good (morning|afternoon|evening))/.test(input)) {
    return "Hey there! 👋 Great to see you. I'm here to help you with writing, ideas, creative thinking, or just having a thoughtful conversation. Whether you want to work on a document, brainstorm ideas, or get feedback on your thoughts, I'm ready to help. What's on your mind today?";
  }

  // Questions about the AI
  if (/name|who are you|what.*you|introduce|tell.*about/.test(input)) {
    return "I'm your AI writing and thinking partner! 🤖 I'm designed to help you in several ways:\n\n1. **Writing Assistance** - Improve clarity, tone, and structure\n2. **Brainstorming** - Help develop and refine ideas\n3. **Feedback** - Provide constructive suggestions\n4. **Learning** - Explain concepts and provide context\n\nWhether you're working on professional writing, creative projects, or just need someone to bounce ideas off, I'm here to support your thinking process. What would you like help with?";
  }

  // How/What/Why questions
  if (/^(how|what|why|when|where) /.test(input)) {
    if (/how.*improve|how.*better|how.*write/.test(input)) {
      return "Great question! Here are some key strategies for improvement:\n\n**Structure & Organization**\n- Start with a clear point or hook\n- Build logically from idea to idea\n- Use transitions to connect thoughts\n- Conclude with impact\n\n**Content Quality**\n- Be specific with examples\n- Show, don't just tell\n- Use varied sentence lengths\n- Choose precise words\n\n**Polish**\n- Read aloud to catch rhythm issues\n- Check for clarity in each sentence\n- Remove unnecessary words\n- Ensure consistent tone\n\nWhat specifically are you working on? I can give more targeted advice if you share the context!";
    }
    if (/why|reason|purpose/.test(input)) {
      return "That's a thoughtful question that gets to the heart of things. To give you the best answer, I'd need a bit more context about what you're specifically asking about.\n\nAre you curious about:\n- The purpose or reasoning behind something you're writing?\n- Why a particular approach or technique works?\n- The motivation behind an idea or decision?\n- How to explain the \"why\" in your own writing?\n\nLet me know, and I can provide a more detailed explanation!";
    }
    return "I'd love to help with that! To give you the most useful answer, could you tell me a bit more about what you're trying to accomplish or what context this question comes from? That way I can provide advice that's specifically tailored to your situation.";
  }

  // Professional/Developer related
  if (/developer|code|project|build|tech|react|next|javascript|python|startup|app|software/.test(input)) {
    if (/resume|portfolio|github|skill|experience/.test(input)) {
      return "Excellent! Building a strong professional presence is crucial, especially in tech. Here's what works well:\n\n**For Your Resume/Portfolio:**\n- Lead with impact: What did you build and what was the result?\n- Include metrics when possible (users, performance, adoption)\n- Showcase a variety of projects and skills\n- Make it easy for people to see your work\n\n**For Documentation:**\n- Start with a clear README\n- Show \"before and after\" or problem-solution\n- Include setup instructions\n- Add examples or use cases\n\n**For Presentations:**\n- Story over features\n- Why it matters, not just how it works\n- Keep it digestible\n\nWhat aspect would you like help with? I can help you craft descriptions, structure documentation, or refine how you communicate your work.";
    }
    return "Ah, a fellow builder! 🚀 Working in tech is exciting. I'd love to help you articulate your ideas better, document your work, or think through problems.\n\nWhat are you working on or thinking about right now? Whether it's a technical idea, documentation, explaining a concept, or working through a design decision, I'm here to help you think it through more clearly.";
  }

  // Writing/Content related
  if (/write|essay|article|blog|story|poem|content|book|chapter|draft/.test(input)) {
    return "Great! Writing is a craft, and there's always room to make it better. Here's a solid framework:\n\n**The Writing Process:**\n1. **Clarify Your Purpose** - What do you want readers to think, feel, or do?\n2. **Know Your Audience** - Who are you writing for?\n3. **Structure It** - Opening → Main Ideas → Conclusion\n4. **Draft Freely** - Get ideas down without self-editing\n5. **Revise Deliberately** - Polish for clarity, flow, and impact\n\n**Key Principles:**\n- Lead with your strongest point\n- One main idea per paragraph\n- Use concrete examples\n- Read it out loud\n- Cut ruthlessly\n\nWhat are you writing? If you share what you're working on or have questions about a specific piece, I can give you much more targeted feedback!";
  }

  // Motivation/Encouragement
  if (/can i|should i|will i|can you help|help me|stuck|difficult|hard|struggle/.test(input)) {
    return "Absolutely! You've come to the right place. 💪\n\nHere's the thing: everyone struggles with writing, communicating ideas, or getting unstuck. It's completely normal. The fact that you're thinking about this means you're already on the path to improvement.\n\n**Here's how I can help:**\n- Break down what's blocking you\n- Offer different perspectives\n- Provide structure and frameworks\n- Give specific, actionable suggestions\n- Help you refine your thinking\n\nTell me more about what you're facing:\n- What are you trying to write or accomplish?\n- What's the main challenge?\n- What does success look like to you?\n\nI'm here to help you work through it!";
  }

  // Thank you / Appreciation
  if (/thank|thanks|appreciate|grateful|thank you/.test(input)) {
    return "You're very welcome! 😊 It's my pleasure to help.\n\nRemember, the best ideas often come from thinking things through carefully and being willing to revise. Keep that mindset, and you'll keep improving.\n\nAnytime you need to brainstorm, refine your writing, or just think through something, I'm here. What's next on your mind?";
  }

  // Personal information
  if (/\b(abhishek|my name|i'?m|i am)\b/.test(input)) {
    return "Great to know more about you! It sounds like you have an impressive tech background. 👨‍💻\n\nAs a full-stack developer, you likely have tons of interesting stories, projects, and insights worth sharing. That's actually a superpower when it comes to writing—you understand the problem space deeply.\n\nSome thoughts:\n- Your technical expertise makes for compelling documentation\n- Real problems you've solved make great case studies\n- Your unique perspective is valuable\n\nHow can I help you share your knowledge or work more effectively? Whether it's writing documentation, crafting your story, or something else, I'm here for it!";
  }

  // Generic but thoughtful response
  const thoughtfulResponses = [
    "That's an interesting point! Let me think through this with you:\n\nFirst, let's break down what you're saying. What's the core idea or problem you're addressing? Once I understand that better, I can help you develop it more fully or think through the implications.\n\nTell me more—what aspect would you like to explore?",
    
    "I like where your head's at. Here's how I'd approach this:\n\nWhen thinking through something like this, it helps to consider:\n- The context and why it matters\n- Who your audience or stakeholders are\n- What success looks like\n- Any constraints or challenges\n\nCould you elaborate on any of these? That would help me give you more specific and useful guidance.",
    
    "That's worth exploring more deeply. Here's what stands out to me:\n\nThere's a valuable idea here, but let's make sure we're communicating it clearly. Some questions to help clarify:\n- What problem are you trying to solve?\n- Who needs to understand this?\n- What's the key insight or benefit?\n\nHelp me understand the full picture, and I can give you better suggestions!",
  ];

  return thoughtfulResponses[Math.floor(Math.random() * thoughtfulResponses.length)];
};

// Generate smart writing suggestions like ChatGPT
const generateSmartSuggestions = (text: string): string[] => {
  if (!text.trim()) {
    return [
      "Start writing to get personalized suggestions for improvement.",
      "I'll analyze your writing and offer ways to make it clearer and more compelling.",
    ];
  }

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
  
  const punctMarks = text.match(/[,;:]/g);
  const punctuationCount = punctMarks ? punctMarks.length : 0;

  const suggestions: string[] = [];

  // Analyze text length and structure
  if (words.length < 20) {
    suggestions.push(
      "✍️ Your response is quite brief. Consider adding more detail or examples to make it more compelling and complete."
    );
  }

  if (words.length > 500) {
    suggestions.push(
      "🎯 This is quite long! Look for opportunities to tighten your language. Can you combine ideas or remove redundancies?"
    );
  }

  // Sentence structure analysis
  if (avgWordsPerSentence > 25) {
    suggestions.push(
      "📌 Some sentences are quite long (avg. " + Math.round(avgWordsPerSentence) + " words). Breaking these into shorter sentences can improve clarity and readability."
    );
  }

  if (avgWordsPerSentence < 8 && sentences.length > 3) {
    suggestions.push(
      "🔗 Your sentences are quite short. Consider connecting related ideas to improve flow and sophistication."
    );
  }

  // Punctuation analysis
  if (punctuationCount === 0 && words.length > 30) {
    suggestions.push(
      "💬 Your text lacks variety in punctuation. Using commas, semicolons, or em-dashes can improve rhythm and emphasize key points."
    );
  }

  // Content quality suggestions
  if (!text.match(/[A-Z][^.!?]*[.!?]/g)?.some(s => s.length > 15)) {
    suggestions.push(
      "💡 Vary your sentence structure. Mix different lengths and types of sentences to create rhythm and maintain reader interest."
    );
  }

  // Check for common improvements
  if (/\bthere is\b|\bthere are\b/.test(text.toLowerCase())) {
    suggestions.push(
      "🎯 Replace \"there is/are\" with more direct language. This is often wordier than necessary (e.g., 'There are 3 reasons' → '3 reasons exist')."
    );
  }

  if (/\bvery\b|\breally\b|\bso\b/.test(text.toLowerCase())) {
    suggestions.push(
      "✨ Reduce intensifiers like 'very,' 'really,' or 'so.' Choose stronger words instead (e.g., 'very good' → 'excellent')."
    );
  }

  if (/\bin my opinion\b|\bi think\b|\bi believe\b/i.test(text)) {
    suggestions.push(
      "🗣️ You're using hedging language. If you're writing confidently, try asserting your points more directly when appropriate."
    );
  }

  // Ensure we have at least some suggestions
  if (suggestions.length === 0) {
    if (words.length > 50) {
      suggestions.push(
        "💬 Your writing is clear and well-structured! To make it even stronger, consider: adding specific examples, varying sentence structure, or strengthening your opening."
      );
    } else {
      suggestions.push(
        "✍️ Good start! Consider expanding on your ideas with examples, details, or more specific language to make your point more compelling."
      );
    }
  }

  // Return top 3 suggestions
  return suggestions.slice(0, 3);
};

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
            "💡 Running in demo mode. For full AI features, add NEXT_PUBLIC_GEMINI_API_KEY to .env.local",
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

        try {
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
        } catch (apiError) {
          // If API fails, fall back to smart suggestions
          const suggestions = generateSmartSuggestions(text);
          setSuggestions(suggestions);
        }
      } else {
        // Fallback suggestions without API
        const suggestions = generateSmartSuggestions(text);
        setSuggestions(suggestions);
      }
    } catch (error) {
      // Fallback to mock suggestions on any error
      setSuggestions([
        "• Consider breaking this into shorter, punchier sentences",
        "• Add specific examples to strengthen your point"
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

        try {
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
        } catch (apiError) {
          // If API fails, fall back to smart mock responses
          const response = generateSmartResponse(userInput);
          
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last?.type === "ai") {
              last.content = response;
            }
            return updated;
          });
        }
      } else {
        // Fallback to smart mock responses without API
        const response = generateSmartResponse(userInput);
        
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.type === "ai") {
            last.content = response;
          }
          return updated;
        });
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
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs text-yellow-300">
              💡 Demo Mode
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
