import { GoogleGenerativeAI } from "@google/generative-ai"
import type { AIMode } from "@/types/ai"
import { buildSystemPrompt, buildTutorPrompt, buildSummaryPrompt, buildQuizPrompt, buildCoachPrompt } from "./prompts"

const TIMEOUT_MS = 30000
const RETRY_COUNT = 1
const MAX_CONTINUATIONS = 3
const MODEL = "gemini-2.5-flash"

function getApiKey(): string {
  const key = process.env.GOOGLE_AI_API_KEY
  if (!key || key === "YOUR_API_KEY") {
    throw new Error("API_KEY_MISSING")
  }
  return key
}

function buildPrompt(mode: AIMode, prompt: string, context?: string): string {
  switch (mode) {
    case "tutor":
      return buildTutorPrompt(prompt, context)
    case "summary":
      return buildSummaryPrompt(prompt, context || "")
    case "quiz": {
      const parsed = tryParseQuizContext(context)
      if (parsed) {
        return buildQuizPrompt(parsed.question, parsed.choices, parsed.correctAnswer, parsed.studentAnswer)
      }
      return prompt
    }
    case "coach": {
      const parsed = tryParseCoachContext(context)
      if (parsed) {
        return buildCoachPrompt(parsed.accuracy, parsed.weakTopics, parsed.strongTopics)
      }
      return prompt
    }
    default:
      return prompt
  }
}

function tryParseQuizContext(context?: string): {
  question: string
  choices: string[]
  correctAnswer: number
  studentAnswer: number
} | null {
  if (!context) return null
  try {
    return JSON.parse(context)
  } catch {
    return null
  }
}

function tryParseCoachContext(context?: string): {
  accuracy: number
  weakTopics: string[]
  strongTopics: string[]
} | null {
  if (!context) return null
  try {
    return JSON.parse(context)
  } catch {
    return null
  }
}

function sanitizeResponse(text: string): string {
  return text
    .trim()
    .replace(/^```[\s\S]*?\n/, "")
    .replace(/\n```$/, "")
    .trim()
}

function getFinishReason(response: { candidates?: Array<{ finishReason?: string }> }): string {
  return response.candidates?.[0]?.finishReason || "UNKNOWN"
}

function isTruncated(finishReason: string): boolean {
  return finishReason === "MAX_TOKENS" || finishReason === "SAFETY" || finishReason === "RECITATION"
}

async function callGeminiWithTimeout(
  ai: GoogleGenAI,
  systemPrompt: string,
  userPrompt: string,
  continuationCount = 0
): Promise<{ text: string; finishReason: string; continuationCount: number }> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] },
      ],
      config: {
        temperature: 0.3,
        maxOutputTokens: 4096,
      },
    })

    clearTimeout(timeoutId)
    const text = response.text || ""
    const finishReason = getFinishReason(response)

    if (process.env.NODE_ENV === "development") {
      console.log(`[Gemini] FinishReason: ${finishReason}`)
      console.log(`[Gemini] Initial response length: ${text.length}`)
    }

    if (!text) {
      throw new Error("EMPTY_RESPONSE")
    }

    return { text: sanitizeResponse(text), finishReason, continuationCount }
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

export async function askGemini(mode: AIMode, prompt: string, context?: string): Promise<string> {
  const apiKey = getApiKey()
  const ai = new GoogleGenAI({ apiKey })
  const systemPrompt = buildSystemPrompt(mode)
  const userPrompt = buildPrompt(mode, prompt, context)

  let lastError: Error | null = null
  let currentPrompt = userPrompt
  let fullResponse = ""
  let continuationCount = 0

  for (let attempt = 0; attempt <= RETRY_COUNT; attempt++) {
    try {
      const result = await callGeminiWithTimeout(ai, systemPrompt, currentPrompt, continuationCount)
      fullResponse += result.text
      continuationCount = result.continuationCount

      if (process.env.NODE_ENV === "development") {
        console.log(`[Gemini] Continuation: ${continuationCount}`)
        console.log(`[Gemini] FinishReason: ${result.finishReason}`)
      }

      // Check if response was truncated and we can continue
      if (isTruncated(result.finishReason) && continuationCount < MAX_CONTINUATIONS) {
        continuationCount++
        currentPrompt = `${userPrompt}\n\nContinue exactly where you stopped.\nDo not repeat previous text.\nContinue from the last unfinished sentence.\nFinish the explanation completely.\n\nPrevious response:\n${fullResponse}\n\nContinue:`
        
        if (process.env.NODE_ENV === "development") {
          console.log(`[Gemini] Attempting continuation ${continuationCount}/${MAX_CONTINUATIONS}`)
        }
        continue
      }

      if (process.env.NODE_ENV === "development") {
        console.log(`[Gemini] Final Characters: ${fullResponse.length}`)
      }

      return sanitizeResponse(fullResponse)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("UNKNOWN_ERROR")

      if (error instanceof Error && error.name === "AbortError") {
        if (attempt < RETRY_COUNT) {
          continue
        }
        throw new Error("TIMEOUT")
      }

      if (attempt < RETRY_COUNT) {
        continue
      }
    }
  }

  // If we have a partial response, return it instead of throwing
  if (fullResponse) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[Gemini] Returning partial response due to error: ${fullResponse.length} characters`)
    }
    return sanitizeResponse(fullResponse)
  }

  throw lastError || new Error("UNKNOWN_ERROR")
}