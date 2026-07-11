"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send, Sparkles, Loader2, User } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardShell } from "@/components/dashboard-shell"
import { useLanguage } from "@/components/language-provider"
import { useAI } from "@/hooks/use-ai"
import { panelClassName, innerCardClassName } from "@/lib/dashboard-utils"
import { MarkdownRenderer } from "@/components/ai/markdown-renderer"
import type { AIMode } from "@/types/ai"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function AIChatPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { loading, response, error, ask, clear } = useAI()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [mode, setMode] = useState<AIMode>("tutor")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (response) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        },
      ])
      clear()
      inputRef.current?.focus()
    }
  }, [response, clear])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    await ask(mode, input.trim())
  }

  function handleModeChange(newMode: AIMode) {
    setMode(newMode)
  }

  return (
    <AuthGuard>
      <DashboardShell>
        <div className="mx-auto max-w-3xl px-4 py-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="rounded-lg border border-slate-700 p-2 text-slate-400 transition-colors hover:border-cyan-500 hover:text-cyan-400"
              >
                <ArrowLeft className="size-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">AI Tutor</h1>
                <p className="text-sm text-slate-400">Ask me anything about math</p>
              </div>
            </div>
            <Sparkles className="size-6 text-cyan-400" />
          </div>

          {/* Mode Selector */}
          <div className="mb-6 flex flex-wrap gap-2">
            {[
              { value: "tutor", label: "💬 Ask AI" },
              { value: "summary", label: "📚 Summarize" },
              { value: "quiz", label: "📝 Quiz Help" },
              { value: "coach", label: "📖 Explain Lesson" },
            ].map((m) => (
              <button
                key={m.value}
                onClick={() => handleModeChange(m.value as AIMode)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  mode === m.value
                    ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white"
                    : "border border-slate-700 text-slate-300 hover:border-cyan-500 hover:text-cyan-400"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className={`${panelClassName} mb-4 min-h-[400px] max-h-[600px] overflow-y-auto`}>
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <Sparkles className="mx-auto size-12 text-cyan-400" />
                  <h2 className="mt-4 text-lg font-semibold text-white">Start a conversation</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Ask me anything about mathematics. I'm here to help!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-violet-500">
                        <Sparkles className="size-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === "user"
                          ? "bg-cyan-500 text-white"
                          : `${innerCardClassName} text-slate-200`
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <MarkdownRenderer content={message.content} />
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      )}
                      <p className="mt-2 text-xs opacity-60">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-700">
                        <User className="size-4 text-slate-300" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-violet-500">
                      <Sparkles className="size-4 text-white" />
                    </div>
                    <div className={`rounded-lg p-4 ${innerCardClassName}`}>
                      <div className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin text-cyan-400" />
                        <span className="text-sm text-slate-400">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a math question..."
              disabled={loading}
              className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:from-cyan-400 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </button>
          </form>
        </div>
      </DashboardShell>
    </AuthGuard>
  )
}