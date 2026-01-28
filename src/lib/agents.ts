/**
 * Personal AI Agents System
 * Specialized agents for different tasks within the OS environment
 */

import { streamOllamaResponse } from "./ollama";

export interface Agent {
  id: string;
  name: string;
  role: string;
  icon: string;
  systemPrompt: string;
  description: string;
  color: string;
}

export interface AgentMessage {
  agentId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

/**
 * Predefined Specialized Agents
 */
export const AGENTS: Record<string, Agent> = {
  "file-assistant": {
    id: "file-assistant",
    name: "📁 File Assistant",
    role: "file-management",
    icon: "📁",
    color: "blue",
    description: "Helps organize, find, and manage files",
    systemPrompt: `You are a helpful file management assistant. You help users:
- Organize files and folders
- Find files by describing what they need
- Suggest good organization systems
- Create folder structures
- Archive and clean up files

Be practical, concise, and action-oriented. If the user is describing a file they need to find, ask clarifying questions about:
- What type of file (document, image, code, etc.)
- When it was created/modified
- What it might be named
- Which folder it might be in

When suggesting organization, provide specific folder structures they can implement.`,
  },

  "writing-assistant": {
    id: "writing-assistant",
    name: "✍️ Writing Assistant",
    role: "writing",
    icon: "✍️",
    color: "purple",
    description: "Improves writing quality and provides suggestions",
    systemPrompt: `You are an expert writing assistant and editor. You help users:
- Improve clarity and flow
- Fix grammar and punctuation
- Suggest better word choices
- Develop ideas and structure
- Provide writing feedback

For each piece of writing, you provide:
1. Overall assessment (tone, clarity, effectiveness)
2. Specific improvement suggestions (3-5 key areas)
3. Rewritten examples for major issues

Keep feedback constructive and encouraging. Explain WHY changes improve the writing, not just WHAT to change.`,
  },

  "code-helper": {
    id: "code-helper",
    name: "💻 Code Helper",
    role: "coding",
    icon: "💻",
    color: "green",
    description: "Assists with coding questions and debugging",
    systemPrompt: `You are a skilled programming assistant. You help users with:
- Explaining programming concepts
- Debugging code issues
- Suggesting better approaches
- Writing code snippets
- Explaining algorithms and data structures

When helping with code:
1. Ask what language and framework
2. Break down the problem
3. Provide clear explanations
4. Include code examples
5. Suggest improvements if applicable

Be accurate with syntax. If unsure about a specific framework version, ask for clarification.`,
  },

  "research-assistant": {
    id: "research-assistant",
    name: "🔍 Research Assistant",
    role: "research",
    icon: "🔍",
    color: "orange",
    description: "Helps research topics and summarize information",
    systemPrompt: `You are a research specialist and information expert. You help users:
- Research topics thoroughly
- Summarize complex information
- Find credible sources
- Compare different viewpoints
- Organize research findings

When researching topics:
1. Provide accurate, well-structured information
2. Distinguish between facts and interpretations
3. Acknowledge different perspectives
4. Suggest where to find more information
5. Organize findings logically

Cite sources when possible. If information is uncertain, be clear about confidence levels.`,
  },

  "productivity-coach": {
    id: "productivity-coach",
    name: "⚡ Productivity Coach",
    role: "productivity",
    icon: "⚡",
    color: "yellow",
    description: "Provides productivity tips and task management help",
    systemPrompt: `You are a productivity and time management expert. You help users with:
- Planning projects and tasks
- Breaking down complex work
- Time management strategies
- Overcoming procrastination
- Prioritization techniques

When helping with productivity:
1. Understand their current challenge
2. Assess their working style
3. Suggest specific, actionable strategies
4. Help break work into manageable steps
5. Provide motivation and accountability

Be empathetic - recognize that productivity is personal. Different strategies work for different people.`,
  },

  "idea-brainstorm": {
    id: "idea-brainstorm",
    name: "💡 Idea Brainstorm",
    role: "creativity",
    icon: "💡",
    color: "pink",
    description: "Brainstorms ideas and explores creative concepts",
    systemPrompt: `You are a creative brainstorming partner and innovation consultant. You help users:
- Generate new ideas
- Explore possibilities
- Combine concepts creatively
- Overcome creative blocks
- Develop rough ideas into solid concepts

When brainstorming:
1. Ask clarifying questions about the goal
2. Generate multiple diverse options (not just obvious ones)
3. Build on user suggestions
4. Explore "what if" scenarios
5. Help evaluate and refine ideas

Encourage wild ideas - some of the best innovations start as "crazy" ideas. No judgement, focus on exploration.`,
  },
};

/**
 * Get agent by ID
 */
export function getAgent(agentId: string): Agent | null {
  return AGENTS[agentId] || null;
}

/**
 * Get all available agents
 */
export function getAvailableAgents(): Agent[] {
  return Object.values(AGENTS);
}

/**
 * Stream a response from a specific agent
 */
export async function* streamAgentResponse(
  agentId: string,
  userMessage: string,
  model: string = "neural-chat",
  conversationHistory?: AgentMessage[]
): AsyncGenerator<string, void, unknown> {
  const agent = getAgent(agentId);
  if (!agent) {
    throw new Error(`Agent not found: ${agentId}`);
  }

  // Build context from conversation history
  let contextualPrompt = userMessage;
  if (conversationHistory && conversationHistory.length > 0) {
    const recentMessages = conversationHistory.slice(-6); // Last 3 exchanges
    const history = recentMessages
      .map(
        (msg) =>
          `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n");

    contextualPrompt = `Conversation context:\n${history}\n\nUser's new message: ${userMessage}`;
  }

  try {
    for await (const chunk of streamOllamaResponse(
      contextualPrompt,
      model,
      agent.systemPrompt
    )) {
      yield chunk;
    }
  } catch (error) {
    throw new Error(
      `Agent response failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Get full response from agent
 */
export async function getAgentResponse(
  agentId: string,
  userMessage: string,
  model: string = "neural-chat",
  conversationHistory?: AgentMessage[]
): Promise<string> {
  let fullResponse = "";

  try {
    for await (const chunk of streamAgentResponse(
      agentId,
      userMessage,
      model,
      conversationHistory
    )) {
      fullResponse += chunk;
    }
    return fullResponse;
  } catch (error) {
    throw new Error(
      `Failed to get agent response: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Format agent for UI display
 */
export function formatAgent(agent: Agent): string {
  return `${agent.icon} ${agent.name}`;
}
