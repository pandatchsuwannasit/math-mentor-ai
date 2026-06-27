"use client"

import { motion } from "framer-motion"
import { AlertTriangle, TrendingDown } from "lucide-react"
import { useAICoach } from "@/hooks/use-ai-coach"
import { panelClassName, innerCardClassName } from "@/lib/dashboard-utils"

export function WeakTopicsCard() {
  const { analysis, loading } = useAICoach()

  if (loading || !analysis || analysis.weakTopics.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={panelClassName}
    >
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="size-6 text-red-400" />
        <h2 className="text-lg font-semibold text-white">Weak Topics</h2>
      </div>

      <div className="space-y-3">
        {analysis.weakTopics.slice(0, 3).map((topic, index) => (
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
                  Needs more practice
                </p>
              </div>
              <TrendingDown className="size-4 text-red-400" />
            </div>
          </motion.div>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Focus on these topics to improve your overall mastery.
      </p>
    </motion.div>
  )
}