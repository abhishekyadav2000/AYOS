/**
 * Google Gemini Integration Service
 * Handles communication with Google Gemini API
 */

const DEFAULT_GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

export interface GeminiModel {
  name: string;
  display: string;
  speed: "fast" | "balanced" | "powerful";
}

// Available Gemini models
export const AVAILABLE_GEMINI_MODELS: Record<string, GeminiModel> = {
  "gemini-2.0-flash": {
    name: "gemini-2.0-flash",
    display: "Gemini 2.0 Flash (Fast & Powerful)",
    speed: "powerful",
  },
  "gemini-1.5-flash": {
    name: "gemini-1.5-flash",
    display: "Gemini 1.5 Flash (Fast)",
    speed: "fast",
  },
  "gemini-1.5-pro": {
    name: "gemini-1.5-pro",
    display: "Gemini 1.5 Pro (Powerful)",
    speed: "powerful",
  },
};

/**
 * Check if Gemini API key is available
 */
export function isGeminiAvailable(): boolean {
  return !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;
}

/**
 * Stream a response from Google Gemini
 */
export async function* streamGeminiResponse(
  prompt: string,
  model: string = "gemini-2.0-flash",
  systemPrompt?: string
): AsyncGenerator<string, void, unknown> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("Gemini API key not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY environment variable.");
  }

  try {
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

    const response = await fetch(
      `${DEFAULT_GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: fullPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.9,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json() as { error?: { message: string } };
      throw new Error(
        `Gemini API error: ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json() as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    if (text) {
      yield text;
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}

/**
 * Get a complete response from Gemini (non-streaming)
 */
export async function getGeminiResponse(
  prompt: string,
  model: string = "gemini-2.0-flash",
  systemPrompt?: string
): Promise<string> {
  let fullResponse = "";

  try {
    for await (const chunk of streamGeminiResponse(prompt, model, systemPrompt)) {
      fullResponse += chunk;
    }
    return fullResponse;
  } catch (error) {
    throw new Error(
      `Failed to get Gemini response: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
