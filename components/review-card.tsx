"use client"

import { motion } from "framer-motion"
import { BookOpen, Clock, Zap } from "lucide-react"
import { useAITutor } from "@/hooks/use-ai-tutor"
import { panelClassName, innerCardClassName } from "@/lib/dashboard-utils"

export function ReviewCard() {
  const { reviewSession, loading } = useAITutor()

  if (loading || !reviewSession) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={panelClassName}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <BookOpen className="size-6 text-violet-400" />
          <h2 className="text-lg font-semibold text-white">Review Session</h2>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="size-4 text-amber-400" />
          <span className="text-sm font-semibold text-white">+{reviewSession.xpReward} XP</span>
        </div>
      </div>

      <div className={innerCardClassName}>
        <div className="flex items-center gap-3 mb-3">
          <Clock className="size-4 text-slate-400" />
          <span className="text-sm text-slate-400">
            {reviewSession.estimatedMinutes} minutes
          </span>
        </div>

        <p className="text-sm text-white mb-3">
          Review {reviewSession.questions.length} questions to strengthen your understanding.
        </p>

        {reviewSession.mistakePatterns.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-slate-400 mb-2">Focus areas:</p>
            <div className="flex flex-wrap gap-2">
              {reviewSession.mistakePatterns.slice(0, 3).map((pattern) => (
                <span
                  key={pattern}
                  className="rounded-full bg-red-500/10 px-2 py-1 text-xs text-red-400"
                >
                  {pattern}
                </span>
              ))}
            </div>
          </div>
        )}

        {reviewSession.skills.length > 0 && (
          <div>
            <p className="text-xs text-slate-400 mb-2">Skills to practice:</p>
            <div className="flex flex-wrap gap-2">
              {reviewSession.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-400"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button className="mt-4 w-full rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400">
        Start Review
      </button>
    </motion.div>
  )
}