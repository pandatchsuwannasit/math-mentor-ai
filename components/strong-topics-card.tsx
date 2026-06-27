"use client"

import { motion } from "framer-motion"
import { Trophy, TrendingUp } from "lucide-react"
import { useAICoach } from "@/hooks/use-ai-coach"
import { panelClassName, innerCardClassName } from "@/lib/dashboard-utils"

export function StrongTopicsCard() {
  const { analysis, loading } = useAICoach()

  if (loading || !analysis || analysis.strongTopics.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={panelClassName}
    >
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="size-6 text-amber-400" />
        <h2 className="text-lg font-semibold text-white">Strong Topics</h2>
      </div>

      <div className="space-y-3">
        {analysis.strongTopics.slice(0, 3).map((topic, index) => (
          <motion.div
            key={topic}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={innerCardClassName}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {topic.split("-").slice(1).join(" ")}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Well mastered
                </p>
              </div>
              <TrendingUp className="size-4 text-emerald-400" />
            </div>
          </motion.div>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Great work! Keep these topics sharp with occasional review.
      </p>
    </motion.div>
  )
}