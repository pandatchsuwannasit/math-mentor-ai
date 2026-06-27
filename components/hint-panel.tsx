"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lightbulb, ChevronRight } from "lucide-react"
import { useAITutor } from "@/hooks/use-ai-tutor"
import { getHints, getNextHint } from "@/lib/ai-tutor/hint-engine"
import { panelClassName, innerCardClassName } from "@/lib/dashboard-utils"

export function HintPanel({ topicId, questionType = "default" }: { topicId: string; questionType?: string }) {
  const { adaptiveConfig } = useAITutor(topicId)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [showHint, setShowHint] = useState(false)

  if (!adaptiveConfig) return null

  const hints = getHints(topicId, questionType)
  const currentHint = hints.find((h) => h.level === currentLevel)
  const nextHint = getNextHint(hints, currentLevel)

  const handleNextHint = () => {
    if (nextHint) {
      setCurrentLevel(nextHint.level)
    }
  }

  return (
    <div className={panelClassName}>
      <div className="flex items-center gap-3 mb-4">
        <Lightbulb className="size-6 text-amber-400" />
        <h2 className="text-lg font-semibold text-white">Hint</h2>
      </div>

      {!showHint ? (
        <button
          onClick={() => setShowHint(true)}
          className={`w-full ${innerCardClassName} flex items-center justify-between hover:bg-slate-800/50 transition-colors`}
        >
          <span className="text-sm text-slate-400">Need a hint?</span>
          <ChevronRight className="size-4 text-slate-400" />
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className={innerCardClassName}>
            <p className="text-sm text-white">{currentHint?.text || "No hint available"}</p>
          </div>

          {nextHint && (
            <button
              onClick={handleNextHint}
              className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
            >
              <ChevronRight className="size-4" />
              Need more help? (Hint {nextHint.level}/4)
            </button>
          )}

          {!nextHint && (
            <p className="text-xs text-slate-500">No more hints available</p>
          )}
        </motion.div>
      )}
    </div>
  )
}