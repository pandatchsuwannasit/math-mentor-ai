"use client"

import { motion } from "framer-motion"
import { Brain, Target, Zap, ArrowRight } from "lucide-react"
import { useAICoach } from "@/hooks/use-ai-coach"
import { innerCardClassName, panelClassName } from "@/lib/dashboard-utils"

export function AICoachCard() {
  const { analysis, loading } = useAICoach()

  if (loading) {
    return (
      <div className={panelClassName}>
        <div className="flex items-center gap-3 mb-4">
          <Brain className="size-6 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">AI Study Coach</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="size-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
        </div>
      </div>
    )
  }

  if (!analysis) return null

  const priorityColors = {
    high: "text-red-400 bg-red-500/10",
    medium: "text-amber-400 bg-amber-500/10",
    low: "text-emerald-400 bg-emerald-500/10",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={panelClassName}
    >
      <div className="flex items-center gap-3 mb-4">
        <Brain className="size-6 text-cyan-400" />
        <h2 className="text-lg font-semibold text-white">AI Study Coach</h2>
      </div>

      {/* Motivation Message */}
      <div className="mb-4 rounded-lg bg-cyan-500/10 p-3">
        <p className="text-sm text-cyan-300">{analysis.motivationMessage}</p>
      </div>

      {/* Main Recommendation */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-slate-400 mb-2">Today's Recommendation</h3>
        <div className={innerCardClassName}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Target className="size-4 text-cyan-400" />
                <span className="text-sm font-medium text-white">
                  {analysis.recommendedTopic.split("-").slice(1).join(" ")}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Current mastery: {analysis.overallMastery}%
              </p>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${priorityColors[analysis.studyPriority]}`}>
                  {analysis.studyPriority.toUpperCase()} PRIORITY
                </span>
                <span className="text-xs text-slate-400">
                  {analysis.estimatedStudyMinutes} min
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-slate-800/50 p-3">
          <p className="text-xs text-slate-400">Overall Mastery</p>
          <p className="text-lg font-bold text-white">{analysis.overallMastery}%</p>
        </div>
        <div className="rounded-lg bg-slate-800/50 p-3">
          <p className="text-xs text-slate-400">Estimated Skill</p>
          <p className="text-lg font-bold text-white">{analysis.estimatedSkill}/100</p>
        </div>
      </div>

      {/* Weak Topics */}
      {analysis.weakTopics.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Weak Topics</h3>
          <div className="space-y-2">
            {analysis.weakTopics.slice(0, 3).map((topic) => (
              <div key={topic} className="flex items-center justify-between rounded-lg bg-slate-800/50 p-2">
                <span className="text-xs text-slate-300">{topic.split("-").slice(1).join(" ")}</span>
                <span className="text-xs text-red-400">Needs Practice</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}