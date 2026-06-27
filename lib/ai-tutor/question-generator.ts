import type { AdaptiveConfig } from "./types"
import { getQuestionsForTopic } from "@/lib/question-bank"
import { getAdaptiveConfig } from "./adaptive-engine"

export function selectQuestionsForTopic(topicId: string, count: number = 10): string[] {
  const config = getAdaptiveConfig(topicId)
  const allQuestions = getQuestionsForTopic(topicId)

  if (allQuestions.length === 0) return []

  // Filter by difficulty
  const filtered = allQuestions.filter((q) => q.difficulty === config.difficulty)

  // If not enough questions at target difficulty, include adjacent difficulties
  let selected = filtered
  if (filtered.length < count) {
    const adjacent = config.difficulty === "easy"
      ? allQuestions.filter((q) => q.difficulty === "medium")
      : config.difficulty === "hard"
      ? allQuestions.filter((q) => q.difficulty === "medium")
      : allQuestions.filter((q) => q.difficulty === "easy" || q.difficulty === "hard")

    selected = [...filtered, ...adjacent]
  }

  // Shuffle and select
  const shuffled = selected.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map((q) => q.id)
}

export function selectReviewQuestions(topicId: string, wrongQuestionIds: string[], mistakePatterns: string[]): string[] {
  const allQuestions = getQuestionsForTopic(topicId)

  // Prioritize wrong questions
  const wrongQuestions = allQuestions.filter((q) => wrongQuestionIds.includes(q.id))

  // Add questions related to mistake patterns
  const patternQuestions = allQuestions.filter((q) => {
    return mistakePatterns.some((pattern) => q.learningObjective?.toLowerCase().includes(pattern.toLowerCase()))
  })

  // Combine and deduplicate
  const combined = [...wrongQuestions, ...patternQuestions]
  const unique = Array.from(new Set(combined.map((q) => q.id)))

  // Shuffle and return
  return unique.sort(() => Math.random() - 0.5).slice(0, 10)
}

export function generateAdaptiveQuestion(topicId: string, weakSkills: string[]): { questionId: string; hintLevel: number } | null {
  const config = getAdaptiveConfig(topicId)
  const allQuestions = getQuestionsForTopic(topicId)

  // Filter questions that match weak skills
  const skillQuestions = allQuestions.filter((q) => {
    return weakSkills.some((skill) => q.learningObjective?.toLowerCase().includes(skill.toLowerCase()))
  })

  const pool = skillQuestions.length > 0 ? skillQuestions : allQuestions.filter((q) => q.difficulty === config.difficulty)

  if (pool.length === 0) return null

  const selected = pool[Math.floor(Math.random() * pool.length)]
  return {
    questionId: selected.id,
    hintLevel: config.hintLevel,
  }
}