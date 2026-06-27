"use client"

import { motion } from "framer-motion"
import { Target, TrendingUp, TrendingDown } from "lucide-react"
import { useAITutor } from "@/hooks/use-ai-tutor"
import { panelClassName, innerCardClassName } from "@/lib/dashboard-utils"

export function SkillCard() {
  const { weakSkills, strongSkills, topicMastery, loading } = useAITutor()

  if (loading || (weakSkills.length === 0 && strongSkills.length === 0)) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={panelClassName}
    >
      <div className="flex items-center gap-3 mb-4">
        <Target className="size-6 text-cyan-400" />
        <h2 className="text-lg font-semibold text-white">Learning Intelligence</h2>
      </div>

      {/* Topic Mastery */}
      <div className={innerCardClassName}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">Topic Mastery</span>
          <span className="text-xs text-cyan-400">{topicMastery}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-cyan-500 transition-all"
            style={{ width: `${topicMastery}%` }}
          />
        </div>
      </div>

      {/* Weak Skills */}
      {weakSkills.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Weak Skills</h3>
          <div className="space-y-2">
            {weakSkills.slice(0, 3).map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={innerCardClassName}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{skill.name}</p>
                    <p className="text-xs text-slate-400 mt-1">Needs practice</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-400">{skill.mastery}%</span>
                    <TrendingDown className="size-4 text-red-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Strong Skills */}
      {strongSkills.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Strong Skills</h3>
          <div className="space-y-2">
            {strongSkills.slice(0, 3).map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={innerCardClassName}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{skill.name}</p>
                    <p className="text-xs text-slate-400 mt-1">Well mastered</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-400">{skill.mastery}%</span>
                    <TrendingUp className="size-4 text-emerald-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}