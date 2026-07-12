import { GoogleGenerativeAI } from "@google/generative-ai"
import type { AIMode } from "@/types/ai"
import { buildSystemPrompt, buildTutorPrompt, buildSummaryPrompt, buildQuizPrompt, buildCoachPrompt } from "./prompts"

const TIMEOUT_MS = 30000
const RETRY_COUNT = 1
const MAX_CONTINUATIONS = 3
const PRIMARY_MODEL = "gemini-2.5-flash"
const FALLBACK_MODEL = "gemini-2.0-flash"
const MAX_RETRIES = 3

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
        return buildQuizPrompt(parsed.question, parsed.choices, parsed.answer, parsed.studentAnswer)
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
  answer: number
  studentAnswer: number
} | null {
  if (!context) return null
  try {
    const parsed = JSON.parse(context) as Partial<{ question: string; choices: string[]; answer: number; correctAnswer: number; studentAnswer: number }>
    if (!parsed.question || !parsed.choices) return null
    return {
      question: parsed.question,
      choices: parsed.choices,
      answer: parsed.answer ?? parsed.correctAnswer ?? 0,
      studentAnswer: parsed.studentAnswer ?? 0,
    }
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

function isServiceUnavailable(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return (
      message.includes("503") ||
      message.includes("service unavailable") ||
      message.includes("overloaded") ||
      message.includes("high demand")
    )
  }
  return false
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function callGeminiWithTimeout(
  genAI: GoogleGenerativeAI,
  modelName: string,
  systemPrompt: string,
  userPrompt: string,
  continuationCount = 0
): Promise<{ text: string; finishReason: string; continuationCount: number }> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const model = genAI.getGenerativeModel({ model: modelName })

    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 4096,
      },
    })

    clearTimeout(timeoutId)
    const response = result.response
    const text = response.text()
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
  const genAI = new GoogleGenerativeAI(apiKey)
  const systemPrompt = buildSystemPrompt(mode)
  const userPrompt = buildPrompt(mode, prompt, context)

  let currentPrompt = userPrompt
  let fullResponse = ""
  let continuationCount = 0
  let currentModel = PRIMARY_MODEL

  if (process.env.NODE_ENV === "development") {
    console.log(`[Gemini] Using model: ${PRIMARY_MODEL}`)
  }

  // Try primary model first
  try {
    const result = await callGeminiWithTimeout(genAI, PRIMARY_MODEL, systemPrompt, currentPrompt, continuationCount)
    fullResponse += result.text
    continuationCount = result.continuationCount

    if (process.env.NODE_ENV === "development") {
      console.log(`[Gemini] Continuation: ${continuationCount}`)
      console.log(`[Gemini] FinishReason: ${result.finishReason}`)
    }

    if (isTruncated(result.finishReason) && continuationCount < MAX_CONTINUATIONS) {
      continuationCount++
      currentPrompt = `${userPrompt}\n\nContinue exactly where you stopped.\nDo not repeat previous text.\nContinue from the last unfinished sentence.\nFinish the explanation completely.\n\nPrevious response:\n${fullResponse}\n\nContinue:`
      
      if (process.env.NODE_ENV === "development") {
        console.log(`[Gemini] Attempting continuation ${continuationCount}/${MAX_CONTINUATIONS}`)
      }
      
      const continueResult = await callGeminiWithTimeout(genAI, PRIMARY_MODEL, systemPrompt, currentPrompt, continuationCount)
      fullResponse += continueResult.text
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`[Gemini] Final Characters: ${fullResponse.length}`)
    }

    return sanitizeResponse(fullResponse)
  } catch (error) {
    // If primary model fails with 503, try fallback
    if (isServiceUnavailable(error)) {
      if (process.env.NODE_ENV === "development") {
        console.log(`[Gemini] Switched to: ${FALLBACK_MODEL}`)
      }
      currentModel = FALLBACK_MODEL
    } else {
      // For non-503 errors, return partial response or throw
      if (fullResponse) {
        return sanitizeResponse(fullResponse)
      }
      throw error
    }
  }

  // Try fallback model with retries
  for (let retry = 1; retry <= MAX_RETRIES; retry++) {
    try {
      if (process.env.NODE_ENV === "development") {
        console.log(`[Gemini] Retry ${retry}...`)
      }

      const result = await callGeminiWithTimeout(genAI, FALLBACK_MODEL, systemPrompt, currentPrompt, continuationCount)
      fullResponse += result.text
      continuationCount = result.continuationCount

      if (process.env.NODE_ENV === "development") {
        console.log(`[Gemini] Continuation: ${continuationCount}`)
        console.log(`[Gemini] FinishReason: ${result.finishReason}`)
      }

      if (isTruncated(result.finishReason) && continuationCount < MAX_CONTINUATIONS) {
        continuationCount++
        currentPrompt = `${userPrompt}\n\nContinue exactly where you stopped.\nDo not repeat previous text.\nContinue from the last unfinished sentence.\nFinish the explanation completely.\n\nPrevious response:\n${fullResponse}\n\nContinue:`
        
        if (process.env.NODE_ENV === "development") {
          console.log(`[Gemini] Attempting continuation ${continuationCount}/${MAX_CONTINUATIONS}`)
        }
        
        const continueResult = await callGeminiWithTimeout(genAI, FALLBACK_MODEL, systemPrompt, currentPrompt, continuationCount)
        fullResponse += continueResult.text
      }

      if (process.env.NODE_ENV === "development") {
        console.log(`[Gemini] Final Characters: ${fullResponse.length}`)
      }

      return sanitizeResponse(fullResponse)
    } catch (error) {
      if (retry < MAX_RETRIES) {
        const backoffMs = Math.pow(2, retry - 1) * 1000
        if (process.env.NODE_ENV === "development") {
          console.log(`[Gemini] Waiting ${backoffMs}ms before retry...`)
        }
        await sleep(backoffMs)
      } else {
        // All retries failed
        if (fullResponse) {
          return sanitizeResponse(fullResponse)
        }
        throw new Error("ขณะนี้ AI มีผู้ใช้งานจำนวนมาก กรุณาลองใหม่อีกครั้งในอีกสักครู่")
      }
    }
  }

  // Should not reach here, but just in case
  if (fullResponse) {
    return sanitizeResponse(fullResponse)
  }

  throw new Error("ขณะนี้ AI มีผู้ใช้งานจำนวนมาก กรุณาลองใหม่อีกครั้งในอีกสักครู่")
}