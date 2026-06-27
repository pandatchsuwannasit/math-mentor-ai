"use client"

import { motion } from "framer-motion"
import { AlertTriangle, X } from "lucide-react"
import { useAITutor } from "@/hooks/use-ai-tutor"
import { getMistakeTypeLabel } from "@/lib/ai-tutor/mistake-analyzer"
import { panelClassName, innerCardClassName } from "@/lib/dashboard-utils"

export function MistakeCard() {
  const { mistakes, mostCommonMistake, loading } = useAITutor()

  if (loading || mistakes.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={panelClassName}
    >
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="size-6 text-red-400" />
        <h2 className="text-lg font-semibold text-white">Mistake Patterns</h2>
      </div>

      {mostCommonMistake && (
        <div className="mb-4 rounded-lg bg-red-500/10 p-3 border border-red-500/30">
          <p className="text-xs text-red-400 mb-1">Most Common Mistake</p>
          <p className="text-sm font-medium text-white">
            {getMistakeTypeLabel(mostCommonMistake.type)}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Occurred {mostCommonMistake.count} times
          </p>
        </div>
      )}

      <div className="space-y-2">
        {mistakes.slice(0, 5).map((mistake, index) => (
          <motion.div
            key={mistake.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={innerCardClassName}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {getMistakeTypeLabel(mistake.type)}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {mistake.count} occurrences
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  mistake.count >= 3 ? "bg-red-500/10 text-red-400" :
                  mistake.count >= 2 ? "bg-amber-500/10 text-amber-400" :
                  "bg-slate-800 text-slate-400"
                }`}>
                  {mistake.count}x
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        The AI adapts questions to help you overcome these patterns.
      </p>
    </motion.div>
  )
}