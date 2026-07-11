"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Send, Sparkles, Loader2, User, Plus, History, BookOpen, FileText, GraduationCap, Lightbulb } from "lucide-react"
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

interface ChatHistory {
  id: string
  title: string
  createdAt: Date
  messages: Message[]
  mode: AIMode
}

const SESSION_KEY = "mathmentor-ai-session"
const HISTORY_KEY = "mathmentor-ai-history"
const MODE_KEY = "mathmentor-ai-mode"

const SUGGESTIONS = [
  "อธิบายให้ง่ายขึ้น",
  "ยกตัวอย่างเพิ่ม",
  "จุดที่มักผิด",
  "ประยุกต์ใช้จริง",
  "สร้างโจทย์ใหม่",
  "แบบฝึกหัดเพิ่ม",
]

const THINKING_MESSAGES = [
  "🧠 กำลังวิเคราะห์...",
  "✍️ กำลังเขียนคำอธิบาย...",
  "📚 กำลังอ่านบทเรียน...",
  "💡 กำลังคิด...",
]

export default function DashboardAIPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { loading, response, error, ask, clear } = useAI()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [mode, setMode] = useState<AIMode>("tutor")
  const [history, setHistory] = useState<ChatHistory[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [thinkingText, setThinkingText] = useState(THINKING_MESSAGES[0])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasGreeted = useRef(false)

  // Load session and history
  useEffect(() => {
    try {
      const storedSession = localStorage.getItem(SESSION_KEY)
      if (storedSession) {
        const session = JSON.parse(storedSession)
        if (session.messages && session.messages.length > 0) {
          setMessages(session.messages.map((m: Message) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })))
        }
        if (session.mode) {
          setMode(session.mode)
        }
      }

      const storedHistory = localStorage.getItem(HISTORY_KEY)
      if (storedHistory) {
        const parsed = JSON.parse(storedHistory)
        setHistory(parsed.map((h: ChatHistory) => ({
          ...h,
          createdAt: new Date(h.createdAt),
          messages: h.messages.map((m: Message) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })),
        })))
      }

      const storedMode = localStorage.getItem(MODE_KEY)
      if (storedMode) {
        setMode(storedMode as AIMode)
      }
    } catch {
      // ignore
    }
  }, [])

  // Rotate thinking messages
  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => {
      setThinkingText((prev) => {
        const idx = THINKING_MESSAGES.indexOf(prev)
        return THINKING_MESSAGES[(idx + 1) % THINKING_MESSAGES.length]
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [loading])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  // Handle AI response
  useEffect(() => {
    if (response) {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }
      const newMessages = [...messages, assistantMessage]
      setMessages(newMessages)
      saveSession(newMessages, mode)
      clear()
      inputRef.current?.focus()
    }
  }, [response, clear, messages, mode])

  // Greeting logic
  useEffect(() => {
    if (messages.length === 0 && !hasGreeted.current) {
      hasGreeted.current = true
      const greeting: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Hello 👋\n\nI'm Math Mentor AI. How can I help you today?",
        timestamp: new Date(),
      }
      setMessages([greeting])
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    const currentInput = input.trim()
    setInput("")

    // Generate title from first user message
    if (newMessages.length === 2) {
      const title = currentInput.slice(0, 30) + (currentInput.length > 30 ? "..." : "")
      saveToHistory(title, newMessages, mode)
    }

    await ask(mode, currentInput, undefined, newMessages.slice(-20))
  }

  function handleNewChat() {
    const greeting: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "Hello 👋\n\nI'm Math Mentor AI. How can I help you today?",
      timestamp: new Date(),
    }
    setMessages([greeting])
    setInput("")
    clear()
    hasGreeted.current = true
  }

  function handleModeChange(newMode: AIMode) {
    setMode(newMode)
    localStorage.setItem(MODE_KEY, newMode)
  }

  function saveSession(messages: Message[], currentMode: AIMode) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        messages,
        mode: currentMode,
        lastUpdated: new Date().toISOString(),
      }))
    } catch {
      // ignore
    }
  }

  function saveToHistory(title: string, messages: Message[], currentMode: AIMode) {
    try {
      const newChat: ChatHistory = {
        id: crypto.randomUUID(),
        title,
        createdAt: new Date(),
        messages,
        mode: currentMode,
      }
      const updated = [newChat, ...history].slice(0, 20)
      setHistory(updated)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
    } catch {
      // ignore
    }
  }

  const modeOptions = [
    { value: "tutor", label: "💬 Ask AI", icon: Sparkles },
    { value: "summary", label: "📚 Summarize", icon: FileText },
    { value: "quiz", label: "📝 Generate Quiz", icon: GraduationCap },
    { value: "coach", label: "📖 Explain Lesson", icon: BookOpen },
  ]

  const currentSuggestions = useMemo(() => {
    if (messages.length === 0) return SUGGESTIONS.slice(0, 4)
    const lastMsg = messages[messages.length - 1]
    if (lastMsg.role === "assistant") {
      return SUGGESTIONS
    }
    return []
  }, [messages])

  return (
    <AuthGuard>
      <DashboardShell>
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-20 w-72 border-r border-slate-800 bg-slate-900 transition-transform lg:static lg:translate-x-0`}>
            <div className="flex h-full flex-col p-4">
              <button
                onClick={handleNewChat}
                className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:from-cyan-400 hover:to-violet-400"
              >
                <Plus className="size-4" />
                New Chat
              </button>

              <div className="mb-4">
                <h3 className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                  <History className="size-3.5" />
                  Recent Chats
                </h3>
                <div className="space-y-1">
                  {history.length === 0 ? (
                    <p className="text-xs text-slate-500">No recent chats</p>
                  ) : (
                    history.slice(0, 20).map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => {
                          setMessages(chat.messages)
                          setMode(chat.mode)
                        }}
                        className="w-full rounded-lg border border-slate-700 p-2 text-left text-xs text-slate-300 transition-colors hover:border-cyan-500 hover:text-cyan-400"
                      >
                        <p className="font-medium">{chat.title}</p>
                        <p className="mt-0.5 text-[10px] text-slate-500">
                          {chat.createdAt.toLocaleDateString()} · {chat.mode}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Chat Area */}
          <div className="flex flex-1 flex-col">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="rounded-lg border border-slate-700 p-2 text-slate-400 transition-colors hover:border-cyan-500 hover:text-cyan-400 lg:hidden"
                >
                  <History className="size-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">🤖 AI Tutor</h1>
                  <p className="text-sm text-slate-400">Ask anything about mathematics.</p>
                </div>
              </div>
              <select
                value={mode}
                onChange={(e) => handleModeChange(e.target.value as AIMode)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
              >
                {modeOptions.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Messages */}
            <div className={`${panelClassName} mb-4 flex-1 overflow-y-auto`}>
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
                          <span className="text-sm text-slate-400">{thinkingText}</span>
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

            {/* Smart Suggestions */}
            {!loading && currentSuggestions.length > 0 && messages.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {currentSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-cyan-500 hover:text-cyan-400"
                  >
                    <Lightbulb className="size-3.5" />
                    {suggestion}
                  </button>
                ))}
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
        </div>
      </DashboardShell>
    </AuthGuard>
  )
}