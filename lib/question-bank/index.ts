export { M1_QUESTIONS } from "./m1"
export { M2_QUESTIONS } from "./m2"
export { M3_QUESTIONS } from "./m3"
export { M4_QUESTIONS } from "./m4"
export { M5_QUESTIONS } from "./m5"
export { M6_QUESTIONS } from "./m6"

import type { QuizQuestion, TopicProgress } from "./types"
import { M1_QUESTIONS } from "./m1"
import { M2_QUESTIONS } from "./m2"
import { M3_QUESTIONS } from "./m3"
import { M4_QUESTIONS } from "./m4"
import { M5_QUESTIONS } from "./m5"
import { M6_QUESTIONS } from "./m6"
import { upgradeQuestion, getDifficultyDistribution } from "./utils"
import { shuffleQuestionChoices } from "@/lib/quiz/answer-utils"

export const QUESTION_BANK: Record<string, Record<string, QuizQuestion[]>> = {
  M1: M1_QUESTIONS as any,
  M2: M2_QUESTIONS as any,
  M3: M3_QUESTIONS as any,
  M4: M4_QUESTIONS as any,
  M5: M5_QUESTIONS as any,
  M6: M6_QUESTIONS as any,
}

/** Get all questions for a topic, auto-upgraded */
export function getQuestionsForTopic(topicId: string): QuizQuestion[] {
  for (const [, topics] of Object.entries(QUESTION_BANK)) {
    if (topics[topicId]) {
      return topics[topicId].map(upgradeQuestion)
    }
  }
  return []
}

/** Get questions filtered by difficulty */
export function getQuestionsByDifficulty(topicId: string, difficulty: string): QuizQuestion[] {
  return getQuestionsForTopic(topicId).filter((q) => q.difficulty === difficulty)
}

/** Adaptive question selection based on student accuracy */
export function getAdaptiveQuestions(
  topicId: string,
  accuracy: number,
  count: number = 10,
  recentIds: string[] = []
): QuizQuestion[] {
  const all = getQuestionsForTopic(topicId)
  if (all.length === 0) return []

  // Exclude recent questions
  const available = all.filter((q) => !recentIds.includes(q.id))
  const pool = available.length >= count ? available : all

  // Apply difficulty distribution based on accuracy
  const dist = getDifficultyDistribution(accuracy)
  const easyPool = pool.filter((q) => q.difficulty === "easy")
  const mediumPool = pool.filter((q) => q.difficulty === "medium")
  const hardPool = pool.filter((q) => q.difficulty === "hard")

  const selected: QuizQuestion[] = []
  const easyCount = Math.floor(count * dist.easy)
  const mediumCount = Math.floor(count * dist.medium)
  const hardCount = count - easyCount - mediumCount

  const pick = (arr: QuizQuestion[], n: number) => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(n, shuffled.length))
  }

  selected.push(...pick(easyPool, easyCount))
  selected.push(...pick(mediumPool, mediumCount))
  selected.push(...pick(hardPool, hardCount))

  // Fill remaining slots if needed
  const remaining = count - selected.length
  if (remaining > 0) {
    selected.push(...pick(pool.filter((q) => !selected.includes(q)), remaining))
  }

  // Shuffle final selection and answer choices
  return selected.sort(() => Math.random() - 0.5).map((q) => {
    const shuffledQuestion = shuffleQuestionChoices(q)

    if (process.env.NODE_ENV === "development") {
      console.log("🔀 [QuestionBank] Shuffled choices:", {
        questionId: q.id,
        originalAnswerIndex: q.answer,
        originalAnswer: q.choices[q.answer],
        newAnswerIndex: shuffledQuestion.answer,
        choices: shuffledQuestion.choices,
      })
    }

    return shuffledQuestion
  })
}

/** Random questions (legacy) */
export function getRandomQuestions(topicId: string, count: number = 10): QuizQuestion[] {
  return getAdaptiveQuestions(topicId, 50, count)
}

/** Get all questions for a curriculum level */
export function getQuestionsByCurriculum(curriculum: string): QuizQuestion[] {
  const topics = QUESTION_BANK[curriculum]
  if (!topics) return []
  return Object.values(topics).flat().map(upgradeQuestion)
}

/** Get question by ID */
export function getQuestionById(id: string): QuizQuestion | null {
  for (const [, topics] of Object.entries(QUESTION_BANK)) {
    for (const [, questions] of Object.entries(topics)) {
      const found = questions.find((q) => q.id === id)
      if (found) return upgradeQuestion(found)
    }
  }
  return null
}

/** Get questions by tags */
export function searchQuestions(query: string): QuizQuestion[] {
  const q = query.toLowerCase()
  const results: QuizQuestion[] = []
  for (const [, topics] of Object.entries(QUESTION_BANK)) {
    for (const [, questions] of Object.entries(topics)) {
      for (const question of questions) {
        const upgraded = upgradeQuestion(question)
        if (
          upgraded.topicId.toLowerCase().includes(q) ||
          upgraded.topicName.toLowerCase().includes(q) ||
          upgraded.curriculum.toLowerCase().includes(q) ||
          upgraded.difficulty === q ||
          upgraded.tags.some((t) => t.toLowerCase().includes(q))
        ) {
          results.push(upgraded)
        }
      }
    }
  }
  return results
}

/** Get wrong questions for review */
export function getWrongQuestions(ids: string[]): QuizQuestion[] {
  return ids.map((id) => getQuestionById(id)).filter((q): q is QuizQuestion => q !== null)
}

const PROGRESS_KEY = "mathmentor-topic-progress"

export function getTopicProgress(topicId: string): TopicProgress | null {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY)
    if (!stored) return null
    const allProgress: Record<string, TopicProgress> = JSON.parse(stored)
    return allProgress[topicId] || null
  } catch {
    return null
  }
}

export function getAllTopicProgress(): Record<string, TopicProgress> {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY)
    if (!stored) return {}
    return JSON.parse(stored)
  } catch {
    return {}
  }
}

export function saveTopicProgress(topicId: string, progress: TopicProgress): void {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY)
    const allProgress: Record<string, TopicProgress> = stored ? JSON.parse(stored) : {}
    allProgress[topicId] = progress
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress))
  } catch {
    // ignore storage errors
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}