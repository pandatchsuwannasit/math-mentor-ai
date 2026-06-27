"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { getMistakePatterns, getMostCommonMistake } from "@/lib/ai-tutor/mistake-analyzer"
import { getWeakSkills, getStrongSkills, getSkillMastery } from "@/lib/ai-tutor/skill-engine"
import { getLearningMemory, refreshSkillLists } from "@/lib/ai-tutor/memory"
import { generateReviewSession, shouldReview, getReviewTopics } from "@/lib/ai-tutor/review-engine"
import { getAdaptiveConfig } from "@/lib/ai-tutor/adaptive-engine"
import type { MistakePattern, Skill, LearningMemory, ReviewSession, AdaptiveConfig } from "@/lib/ai-tutor/types"

export function useAITutor(topicId?: string) {
  const [mistakes, setMistakes] = useState<MistakePattern[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [memory, setMemory] = useState<LearningMemory | null>(null)
  const [reviewSession, setReviewSession] = useState<ReviewSession | null>(null)
  const [adaptiveConfig, setAdaptiveConfig] = useState<AdaptiveConfig | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    if (!topicId) {
      setMistakes([])
      setSkills([])
      setMemory(null)
      setReviewSession(null)
      setAdaptiveConfig(null)
      setLoading(false)
      return
    }

    setLoading(true)

    // Simulate async computation
    setTimeout(() => {
      const mistakePatterns = getMistakePatterns().filter((m) => m.topicId === topicId)
      const skillList = getWeakSkills(topicId).concat(getStrongSkills(topicId))
      const learningMemory = getLearningMemory()
      const review = shouldReview(topicId) ? generateReviewSession(topicId) : null
      const adaptive = getAdaptiveConfig(topicId)

      setMistakes(mistakePatterns)
      setSkills(skillList)
      setMemory(learningMemory)
      setReviewSession(review)
      setAdaptiveConfig(adaptive)
      setLoading(false)
    }, 50)
  }, [topicId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const mostCommonMistake = useMemo(() => getMostCommonMistake(), [mistakes])
  const weakSkills = useMemo(() => getWeakSkills(topicId), [topicId])
  const strongSkills = useMemo(() => getStrongSkills(topicId), [topicId])
  const topicMastery = useMemo(() => (topicId ? getSkillMastery(topicId) : 0), [topicId])

  return useMemo(
    () => ({
      mistakes,
      skills,
      memory,
      reviewSession,
      adaptiveConfig,
      mostCommonMistake,
      weakSkills,
      strongSkills,
      topicMastery,
      loading,
      refresh,
    }),
    [mistakes, skills, memory, reviewSession, adaptiveConfig, mostCommonMistake, weakSkills, strongSkills, topicMastery, loading, refresh]
  )
}

export function useGlobalAITutor() {
  const [mistakes, setMistakes] = useState<MistakePattern[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [memory, setMemory] = useState<LearningMemory | null>(null)
  const [reviewTopics, setReviewTopics] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setLoading(true)

    setTimeout(() => {
      const mistakePatterns = getMistakePatterns()
      const allSkills = getWeakSkills().concat(getStrongSkills())
      const learningMemory = getLearningMemory()
      const reviewTopicIds = getReviewTopics()

      setMistakes(mistakePatterns)
      setSkills(allSkills)
      setMemory(learningMemory)
      setReviewTopics(reviewTopicIds)
      setLoading(false)
    }, 50)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const mostCommonMistake = useMemo(() => getMostCommonMistake(), [mistakes])

  return useMemo(
    () => ({
      mistakes,
      skills,
      memory,
      reviewTopics,
      mostCommonMistake,
      loading,
      refresh,
    }),
    [mistakes, skills, memory, reviewTopics, mostCommonMistake, loading, refresh]
  )
}