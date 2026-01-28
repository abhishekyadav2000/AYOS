/**
 * Ollama Integration Service
 * Handles communication with local Ollama instances
 * Supports multiple models and streaming responses
 */

const DEFAULT_OLLAMA_URL = "http://localhost:11434";

export interface OllamaModel {
  name: string;
  display: string;
  context: number; // Context window size
  speed: "fast" | "balanced" | "powerful";
  size: string;
}

// Available models to use with Ollama
export const AVAILABLE_MODELS: Record<string, OllamaModel> = {
  "neural-chat": {
    name: "neural-chat",
    display: "Neural Chat (Fast)",
    context: 4096,
    speed: "fast",
    size: "4B",
  },
  "mistral": {
    name: "mistral",
    display: "Mistral (Balanced)",
    context: 8192,
    speed: "balanced",
    size: "7B",
  },
  "llama2": {
    name: "llama2",
    display: "Llama 2 (Powerful)",
    context: 4096,
    speed: "powerful",
    size: "7B",
  },
  "orca-mini": {
    name: "orca-mini",
    display: "Orca Mini (Fast)",
    context: 4096,
    speed: "fast",
    size: "3B",
  },
  "openchat": {
    name: "openchat",
    display: "OpenChat (Balanced)",
    context: 4096,
    speed: "balanced",
    size: "7B",
  },
};

/**
 * Check if Ollama is running and available
 */
export async function checkOllamaAvailability(): Promise<boolean> {
  try {
    const response = await fetch(`${DEFAULT_OLLAMA_URL}/api/tags`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch (error) {
    console.warn("Ollama not available:", error instanceof Error ? error.message : error);
    return false;
  }
}

/**
 * Get list of available models from Ollama
 */
export async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await fetch(`${DEFAULT_OLLAMA_URL}/api/tags`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return [];

    const data = await response.json() as { models?: Array<{ name: string }> };
    return data.models?.map((m) => m.name.split(":")[0]) || [];
  } catch (error) {
    console.warn("Failed to get Ollama models:", error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Stream a response from Ollama
 * Yields chunks of text as they arrive
 */
export async function* streamOllamaResponse(
  prompt: string,
  model: string = "neural-chat",
  systemPrompt?: string
): AsyncGenerator<string, void, unknown> {
  try {
    const response = await fetch(`${DEFAULT_OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        system: systemPrompt || "You are a helpful AI assistant.",
        stream: true,
        temperature: 0.7,
        top_k: 40,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error("No response body from Ollama");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      // Process all complete lines
      for (let i = 0; i < lines.length - 1; i++) {
        try {
          const line = lines[i].trim();
          if (!line) continue;

          const json = JSON.parse(line) as { response?: string };
          if (json.response) {
            yield json.response;
          }
        } catch (e) {
          // Skip invalid JSON lines
          console.debug("Skipping invalid JSON line in Ollama response");
        }
      }

      // Keep the incomplete line in the buffer
      buffer = lines[lines.length - 1];
    }

    // Process any remaining buffer content
    if (buffer.trim()) {
      try {
        const json = JSON.parse(buffer) as { response?: string };
        if (json.response) {
          yield json.response;
        }
      } catch (e) {
        console.debug("Skipping final invalid JSON in Ollama response");
      }
    }
  } catch (error) {
    console.error("Ollama stream error:", error);
    throw error;
  }
}

/**
 * Get a complete response from Ollama (non-streaming)
 */
export async function getOllamaResponse(
  prompt: string,
  model: string = "neural-chat",
  systemPrompt?: string
): Promise<string> {
  let fullResponse = "";

  try {
    for await (const chunk of streamOllamaResponse(prompt, model, systemPrompt)) {
      fullResponse += chunk;
    }
    return fullResponse;
  } catch (error) {
    throw new Error(
      `Failed to get Ollama response: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Validate if a model is available in the AVAILABLE_MODELS list
 */
export function isValidModel(model: string): boolean {
  return Object.keys(AVAILABLE_MODELS).includes(model);
}

/**
 * Get model metadata
 */
export function getModelMetadata(model: string): OllamaModel | null {
  return AVAILABLE_MODELS[model] || null;
}
