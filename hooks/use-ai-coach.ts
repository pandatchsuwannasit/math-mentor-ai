"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useAuth } from "@/hooks/use-auth"
import { analyzeStudent } from "@/lib/ai-coach/analyzer"
import { generateStudyPlan } from "@/lib/ai-coach/planner"
import { generateForecast } from "@/lib/ai-coach/forecast"
import type { AIAnalysis, StudyPlan, Forecast } from "@/lib/ai-coach/types"

export function useAICoach() {
  const { user } = useAuth()
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null)
  const [forecast, setForecast] = useState<Forecast | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    if (!user) {
      setAnalysis(null)
      setStudyPlan(null)
      setForecast(null)
      setLoading(false)
      return
    }

    setLoading(true)

    // Simulate async computation
    setTimeout(() => {
      const analysisResult = analyzeStudent(user)
      const planResult = generateStudyPlan(user)
      const forecastResult = generateForecast({
        accuracy: user.stats.accuracy,
        mastery: analysisResult.overallMastery,
        xp: user.stats.xp,
        level: user.stats.level,
        studyMinutes: planResult.estimatedMinutes,
      })

      setAnalysis(analysisResult)
      setStudyPlan(planResult)
      setForecast(forecastResult)
      setLoading(false)
    }, 100)
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  return useMemo(
    () => ({
      analysis,
      studyPlan,
      forecast,
      loading,
      refresh,
    }),
    [analysis, studyPlan, forecast, loading, refresh]
  )
}