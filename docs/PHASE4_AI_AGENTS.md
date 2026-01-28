# Phase 4: Personal AI Agents

## Overview

This phase introduces **specialized AI agents** for different tasks within AYOS. Each agent has a unique role, personality, and expertise to help with specific types of work.

## Available Agents

### 📁 File Assistant
- **Role**: File management and organization
- **Helps with**:
  - Finding files you can't remember
  - Organizing folder structures
  - Cleaning up and archiving
  - Suggesting naming conventions
  - Creating backup strategies

**Example**: "I have 200 photos from my vacation scattered in different folders. How should I organize them?"

### ✍️ Writing Assistant
- **Role**: Writing improvement and editing
- **Helps with**:
  - Improving clarity and flow
  - Grammar and punctuation
  - Word choice suggestions
  - Idea development
  - Essay/article structure

**Example**: "Help me improve this paragraph for my blog post"

### 💻 Code Helper
- **Role**: Programming support and debugging
- **Helps with**:
  - Explaining programming concepts
  - Debugging code issues
  - Suggesting better approaches
  - Algorithm explanations
  - Framework-specific questions

**Example**: "Why is my React component re-rendering too much?"

### 🔍 Research Assistant
- **Role**: Research and information gathering
- **Helps with**:
  - Researching topics thoroughly
  - Summarizing information
  - Comparing viewpoints
  - Finding credible sources
  - Organizing research findings

**Example**: "I need to understand machine learning. Give me a beginner-friendly overview."

### ⚡ Productivity Coach
- **Role**: Time management and task organization
- **Helps with**:
  - Planning complex projects
  - Breaking down large tasks
  - Time management strategies
  - Overcoming procrastination
  - Prioritization techniques

**Example**: "I have too much to do and don't know where to start"

### 💡 Idea Brainstorm
- **Role**: Creative brainstorming and innovation
- **Helps with**:
  - Generating new ideas
  - Exploring possibilities
  - Combining concepts creatively
  - Overcoming creative blocks
  - Developing rough ideas

**Example**: "I want to create a portfolio project. What are some cool ideas?"

## How Agents Work

### Architecture

```
User Message
    ↓
Select Agent
    ↓
Agent System Prompt (Defines personality & expertise)
    ↓
Ollama LLM
    ↓
Contextual Response
    ↓
Display in Agent Window
```

### System Prompts

Each agent has a specialized system prompt that:
- Defines their role and expertise
- Sets conversation style and tone
- Provides best practices
- Gives specific instructions on how to help

Example (Writing Assistant):
```
"You are an expert writing assistant. You help users:
- Improve clarity and flow
- Fix grammar and punctuation
- Suggest better word choices
- Provide writing feedback

Keep feedback constructive and encouraging."
```

### Conversation Context

Agents remember recent conversation:
- ✅ Maintains conversation history
- ✅ Builds on previous messages
- ✅ Provides coherent multi-turn dialogs
- ✅ Understands context and follow-ups

**Example conversation**:
```
User: "Help me organize my files"
Agent: "I'd be happy to help! First, what types of files do you have?"

User: "Photos, documents, and code projects mostly"
Agent: "Great! Here's a structure I recommend..."
```

## Using Agents in AYOS

### Opening an Agent

1. **Desktop** → Double-click an Agent app icon (when implemented)
2. **Start Menu** → Agents section
3. **From Notepad AI** → Select agent mode (future enhancement)

### Features

- **Switch Agents** → Dropdown menu to select agent
- **Clear History** → Start fresh conversation
- **Export Conversation** → Save to file
- **Copy Response** → Quick copy to clipboard
- **Streaming Responses** → See AI thinking in real-time

## Implementation Details

### File Structure

- **[src/lib/agents.ts](../src/lib/agents.ts)** - Agent definitions and logic
  - `AGENTS` object with all agents
  - `streamAgentResponse()` - Stream responses with context
  - `getAgentResponse()` - Get complete response

- **[src/components/AgentWindow.tsx](../src/components/AgentWindow.tsx)** (to be created)
  - Agent selector
  - Conversation display
  - Input handling
  - Message history

### API

```typescript
// Get all agents
const agents = getAvailableAgents();

// Stream response from specific agent
for await (const chunk of streamAgentResponse(
  "writing-assistant",
  "Improve this paragraph...",
  "neural-chat"
)) {
  console.log(chunk);
}

// Get full response
const response = await getAgentResponse(
  "file-assistant",
  "How should I organize photos?"
);
```

## Customizing Agents

### Add New Agent

Edit `src/lib/agents.ts`:

```typescript
export const AGENTS: Record<string, Agent> = {
  // ... existing agents
  
  "custom-agent": {
    id: "custom-agent",
    name: "🎯 Custom Agent",
    role: "custom",
    icon: "🎯",
    color: "red",
    description: "Does something specific",
    systemPrompt: `You are a custom specialist...`,
  },
};
```

### Customize System Prompt

System prompts define agent behavior:

```typescript
systemPrompt: `You are a [ROLE].
You help users:
- [CAPABILITY 1]
- [CAPABILITY 2]
- [CAPABILITY 3]

When helping:
1. [INSTRUCTION 1]
2. [INSTRUCTION 2]
3. [INSTRUCTION 3]

[TONE AND STYLE GUIDANCE]`
```

Guidelines:
- Be specific about capabilities
- Include step-by-step instructions
- Mention tone (friendly, professional, etc.)
- Add warnings if needed

## Advanced: Multi-Agent Workflows

Future enhancements could enable:

### Agent Collaboration
```
User: "Help me plan a blog post about productivity"
   ↓
Idea Brainstorm Agent: Generates outline ideas
   ↓
Writing Assistant Agent: Helps write the content
   ↓
Productivity Coach Agent: Provides tips for writing routine
   ↓
Consolidated output with contributions from all agents
```

### Context Sharing
```
File Assistant: "Found 50 related documents"
   ↓
Research Assistant: "Let me summarize these documents"
   ↓
Writing Assistant: "Here's a draft synthesis"
```

### Agent Feedback Loop
```
User → Agent 1 → Agent 2 → Agent 1 (with new context) → User
```

## UI Components (To Be Created)

### Agent Selector
```
[Agent Dropdown] 🎯 Writing Assistant ▼
[Clear History] [Export]
```

### Conversation Display
```
┌─────────────────────────────────────────┐
│ You: Help me improve this paragraph    │
│                                         │
│ Writing Assistant: Here are my suggestions... │
│                                         │
│ [Input: Follow-up question]             │
└─────────────────────────────────────────┘
```

## Performance Optimization

### Response Caching
Cache frequently asked questions:
```typescript
const cache = new Map<string, string>();
const key = `${agentId}-${hash(message)}`;
```

### Streaming Optimization
- Break large responses into chunks
- Display as soon as available
- Show loading indicator

### Context Window Management
- Keep last 6 messages (3 exchanges)
- Summarize longer histories
- Load from localStorage if needed

## Troubleshooting

### Agent Responses Are Slow

**Solutions**:
1. Use faster model: `neural-chat`
2. Reduce context window (fewer messages)
3. Close other applications
4. Check system RAM usage

### Agent Responses Are Inaccurate

**Solutions**:
1. Use more powerful model: `mistral` or `llama2`
2. Ask more specific questions
3. Provide more context
4. Rephrase the question

### Agent Keeps Same Response Format

**Solutions**:
1. Vary your questions
2. Clear conversation history
3. Change the model
4. Different phrasing can help

## Next Steps

✅ **Phase 4 Complete When**:
- [ ] All 6 agents defined in `agents.ts`
- [ ] Agent window component created
- [ ] Conversation history persisted
- [ ] Model selection works per-agent
- [ ] Testing with all agents functional

🚀 **Coming Next: Phase 5 - Theme & Polish**

---

**Phase Status**: 🏗️ Core Implementation Ready

The agent system is fully architected and ready for UI component development.
