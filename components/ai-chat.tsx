"use client"

import { useState } from "react"
import { Sparkles, Loader2, X, Send } from "lucide-react"
import { useAI } from "@/hooks/use-ai"
import type { AIMode } from "@/types/ai"
import { panelClassName, innerCardClassName } from "@/lib/dashboard-utils"

interface AIChatProps {
  mode: AIMode
  title?: string
  placeholder?: string
  context?: string
  defaultPrompt?: string
  className?: string
}

export function AIChat({
  mode,
  title = "Ask AI",
  placeholder = "Ask a math question...",
  context,
  defaultPrompt,
  className = "",
}: AIChatProps) {
  const { loading, response, error, ask, clear } = useAI()
  const [prompt, setPrompt] = useState(defaultPrompt || "")
  const [expanded, setExpanded] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim() || loading) return
    await ask(mode, prompt.trim(), context)
  }

  function handleClose() {
    clear()
    setExpanded(false)
    setPrompt(defaultPrompt || "")
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className={`flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20 ${className}`}
      >
        <Sparkles className="size-4" />
        {title}
      </button>
    )
  }

  return (
    <div className={`${panelClassName} rounded-xl border border-cyan-500/20 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="text-slate-400 hover:text-white"
        >
          <X className="size-4" />
        </button>
      </div>

      {response && (
        <div className={`mb-4 rounded-lg p-4 text-sm leading-relaxed text-slate-200 ${innerCardClassName}`}>
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="size-3.5 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-400">AI Response</span>
          </div>
          <div className="whitespace-pre-wrap">{response}</div>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-slate-800/50 p-4">
          <Loader2 className="size-5 animate-spin text-cyan-400" />
          <span className="text-sm text-slate-400">AI is thinking...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholder}
          disabled={loading}
          className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:from-cyan-400 hover:to-violet-400"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  )
}