import { NextRequest, NextResponse } from "next/server"
import { askGemini } from "@/lib/ai/gemini"
import type { AIMode } from "@/types/ai"

const VALID_MODES: AIMode[] = ["tutor", "summary", "quiz", "coach"]

interface Message {
  role: "user" | "assistant"
  content: string
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { mode, prompt, context, messages } = body

    if (!mode || !VALID_MODES.includes(mode)) {
      return NextResponse.json({
        success: false,
        error: "Invalid mode. Must be one of: tutor, summary, quiz, coach",
      }, { status: 400 })
    }

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: "Prompt is required and must be a non-empty string",
      }, { status: 400 })
    }

    if (prompt.length > 5000) {
      return NextResponse.json({
        success: false,
        error: "Prompt too long. Maximum 5000 characters.",
      }, { status: 400 })
    }

    // Build conversation context
    let conversationContext = context || ""
    if (messages && Array.isArray(messages) && messages.length > 0) {
      const recentMessages = messages.slice(-20)
      const conversationHistory = recentMessages
        .map((m: Message) => `${m.role === "user" ? "Student" : "AI"}: ${m.content}`)
        .join("\n")
      conversationContext = conversationHistory + (conversationContext ? "\n\n" + conversationContext : "")
    }

    const response = await askGemini(mode, prompt, conversationContext || undefined)

    return NextResponse.json({
      success: true,
      response,
    })
  } catch (error) {
    console.error("===== GEMINI ERROR =====")
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error",
      },
      { status: 500 }
    )
  }
}