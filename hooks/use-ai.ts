"use client"

import { useState, useCallback } from "react"
import type { AIMode, AIResponse } from "@/types/ai"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface UseAIReturn {
  loading: boolean
  response: string | null
  error: string | null
  ask: (mode: AIMode, prompt: string, context?: string, messages?: Message[]) => Promise<void>
  clear: () => void
}

export function useAI(): UseAIReturn {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const ask = useCallback(async (mode: AIMode, prompt: string, context?: string, messages?: Message[]) => {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, prompt, context, messages }),
      })

      const data: AIResponse = await res.json()

      if (!data.success || !data.response) {
        setError(data.error || "Failed to get AI response")
        return
      }

      setResponse(data.response)
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  const clear = useCallback(() => {
    setResponse(null)
    setError(null)
    setLoading(false)
  }, [])

  return { loading, response, error, ask, clear }
}