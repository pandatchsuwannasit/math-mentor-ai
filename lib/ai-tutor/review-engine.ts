import type { ReviewSession } from "./types"
import { getMistakePatterns, getMistakesForTopic } from "./mistake-analyzer"
import { getWeakSkills } from "./skill-engine"
import { selectReviewQuestions } from "./question-generator"

export function generateReviewSession(topicId: string): ReviewSession | null {
  const mistakes = getMistakesForTopic(topicId)
  const allMistakes = getMistakePatterns()
  const weakSkills = getWeakSkills(topicId)

  if (mistakes.length === 0 && weakSkills.length === 0) return null

  const wrongQuestionIds = mistakes.map((m) => m.topicId) // Simplified - in real app would track actual question IDs
  const mistakePatterns = mistakes.map((m) => m.type)
  const skills = weakSkills.map((s) => s.name)

  const questions = selectReviewQuestions(topicId, wrongQuestionIds, mistakePatterns)

  if (questions.length === 0) return null

  const estimatedMinutes = questions.length * 2
  const xpReward = questions.length * 15

  return {
    id: `review-${Date.now()}`,
    questions,
    mistakePatterns,
    skills,
    estimatedMinutes,
    xpReward,
  }
}

export function getReviewTopics(): string[] {
  const mistakes = getMistakePatterns()
  const topicIds = new Set(mistakes.map((m) => m.topicId))
  return Array.from(topicIds)
}

export function shouldReview(topicId: string): boolean {
  const mistakes = getMistakesForTopic(topicId)
  const weakSkills = getWeakSkills(topicId)
  return mistakes.length >= 2 || weakSkills.length >= 2
}