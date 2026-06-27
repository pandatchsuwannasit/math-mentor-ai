"use client"

import { motion } from "framer-motion"
import { TrendingUp, Zap, Target, Award } from "lucide-react"
import { useAICoach } from "@/hooks/use-ai-coach"
import { panelClassName, innerCardClassName } from "@/lib/dashboard-utils"

export function ForecastCard() {
  const { forecast, loading } = useAICoach()

  if (loading || !forecast) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={panelClassName}
    >
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="size-6 text-violet-400" />
        <h2 className="text-lg font-semibold text-white">Forecast</h2>
      </div>

      <div className="space-y-4">
        {/* Accuracy Forecast */}
        <div className={innerCardClassName}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Accuracy</span>
            <span className="text-xs text-emerald-400">+{forecast.improvementPercent}%</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{forecast.currentAccuracy}%</span>
                <span className="text-sm text-slate-500">→</span>
                <span className="text-2xl font-bold text-emerald-400">{forecast.expectedAccuracy}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* XP Forecast */}
        <div className={innerCardClassName}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">XP Today</span>
            <Zap className="size-3 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{forecast.currentXP}</span>
            <span className="text-sm text-slate-500">→</span>
            <span className="text-2xl font-bold text-amber-400">{forecast.expectedXP}</span>
          </div>
        </div>

        {/* Level Forecast */}
        {forecast.expectedLevel > forecast.currentLevel && (
          <div className="rounded-lg bg-amber-500/10 p-3 border border-amber-500/30">
            <div className="flex items-center gap-2">
              <Award className="size-5 text-amber-400" />
              <div>
                <p className="text-sm font-medium text-white">Level Up!</p>
                <p className="text-xs text-slate-400">
                  You'll reach Level {forecast.expectedLevel}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mastery Forecast */}
        <div className={innerCardClassName}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Mastery</span>
            <Target className="size-3 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{forecast.currentMastery}%</span>
            <span className="text-sm text-slate-500">→</span>
            <span className="text-2xl font-bold text-cyan-400">{forecast.expectedMastery}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}