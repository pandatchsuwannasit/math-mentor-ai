"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Circle, Clock, Zap } from "lucide-react"
import { useAICoach } from "@/hooks/use-ai-coach"
import { panelClassName, innerCardClassName } from "@/lib/dashboard-utils"

export function DailyPlanCard() {
  const { studyPlan, loading } = useAICoach()

  if (loading || !studyPlan || studyPlan.tasks.length === 0) return null

  const completedTasks = studyPlan.tasks.filter((t) => t.completed).length
  const totalTasks = studyPlan.tasks.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={panelClassName}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Clock className="size-6 text-emerald-400" />
          <h2 className="text-lg font-semibold text-white">Today's Plan</h2>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="size-4 text-amber-400" />
          <span className="text-sm font-semibold text-white">+{studyPlan.expectedXP} XP</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-400">Progress</span>
          <span className="text-white font-medium">{completedTasks}/{totalTasks} tasks</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-3">
        {studyPlan.tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={innerCardClassName}
          >
            <div className="flex items-start gap-3">
              {task.completed ? (
                <CheckCircle2 className="size-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Circle className="size-5 text-slate-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${task.completed ? "text-slate-500 line-through" : "text-white"}`}>
                  {task.title}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {task.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-slate-500">
                    {task.estimatedMinutes} min
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    task.difficulty === "easy" ? "bg-emerald-500/10 text-emerald-400" :
                    task.difficulty === "medium" ? "bg-amber-500/10 text-amber-400" :
                    "bg-red-500/10 text-red-400"
                  }`}>
                    {task.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Total Time */}
      <div className="mt-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Total Time</span>
          <span className="text-sm font-semibold text-white">{studyPlan.estimatedMinutes} minutes</span>
        </div>
      </div>
    </motion.div>
  )
}