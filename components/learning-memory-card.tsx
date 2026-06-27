"use client"

import { motion } from "framer-motion"
import { Brain, Clock, TrendingUp } from "lucide-react"
import { useAITutor } from "@/hooks/use-ai-tutor"
import { panelClassName, innerCardClassName } from "@/lib/dashboard-utils"

export function LearningMemoryCard() {
  const { memory, loading } = useAITutor()

  if (loading || !memory) return null

  const formatTimeAgo = (timestamp: number) => {
    if (timestamp === 0) return "Never"
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return "Just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    return `${Math.floor(seconds / 86400)} days ago`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={panelClassName}
    >
      <div className="flex items-center gap-3 mb-4">
        <Brain className="size-6 text-violet-400" />
        <h2 className="text-lg font-semibold text-white">Learning Memory</h2>
      </div>

      <div className="space-y-3">
        {/* Last Studied */}
        <div className={innerCardClassName}>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="size-4 text-slate-400" />
            <span className="text-xs text-slate-400">Last Studied</span>
          </div>
          <p className="text-sm font-medium text-white">
            {formatTimeAgo(memory.lastStudied)}
          </p>
        </div>

        {/* Average Solve Time */}
        {memory.averageSolveTime > 0 && (
          <div className={innerCardClassName}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="size-4 text-slate-400" />
              <span className="text-xs text-slate-400">Avg Solve Time</span>
            </div>
            <p className="text-sm font-medium text-white">
              {Math.round(memory.averageSolveTime)} seconds
            </p>
          </div>
        )}

        {/* Recent Topics */}
        {memory.recentTopics.length > 0 && (
          <div>
            <p className="text-xs text-slate-400 mb-2">Recent Topics</p>
            <div className="flex flex-wrap gap-2">
              {memory.recentTopics.slice(0, 3).map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-cyan-500/10 px-2 py-1 text-xs text-cyan-400"
                >
                  {topic.split("-").slice(1).join(" ")}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Favorite Difficulty */}
        <div className={innerCardClassName}>
          <p className="text-xs text-slate-400 mb-1">Preferred Difficulty</p>
          <p className="text-sm font-medium text-white capitalize">
            {memory.favoriteDifficulty}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        The AI uses this memory to personalize your learning experience.
      </p>
    </motion.div>
  )
}