import { QUESTION_BANK } from "./index"
import type { QuizQuestion } from "./types"
import { lessonLoaders } from "@/lib/lesson-bank"

export interface ValidationReport {
  valid: boolean
  errors: string[]
  warnings: string[]
  stats: {
    totalQuestions: number
    totalLessons: number
    topics: string[]
    duplicateIds: string[]
    missingExplanations: string[]
    missingHints: string[]
    missingLearningObjectives: string[]
    duplicateQuestions: string[]
  }
}

export function validateQuestionBank(): ValidationReport {
  const errors: string[] = []
  const warnings: string[] = []
  const stats = {
    totalQuestions: 0,
    totalLessons: 0,
    topics: [] as string[],
    duplicateIds: [] as string[],
    missingExplanations: [] as string[],
    missingHints: [] as string[],
    missingLearningObjectives: [] as string[],
    duplicateQuestions: [] as string[],
  }

  const seenIds = new Set<string>()
  const seenQuestions = new Set<string>()

  // Validate questions
  for (const [curriculum, topics] of Object.entries(QUESTION_BANK)) {
    for (const [topicId, questions] of Object.entries(topics)) {
      stats.topics.push(topicId)
      stats.totalLessons++

      for (const q of questions) {
        stats.totalQuestions++

        // Check duplicate IDs
        if (seenIds.has(q.id)) {
          stats.duplicateIds.push(q.id)
          errors.push(`Duplicate question ID: ${q.id}`)
        }
        seenIds.add(q.id)

        // Check required fields
        if (!q.explanation || q.explanation.trim() === "") {
          stats.missingExplanations.push(q.id)
          warnings.push(`Question ${q.id} missing explanation`)
        }

        if (!q.hints || q.hints.length === 0) {
          stats.missingHints.push(q.id)
          warnings.push(`Question ${q.id} missing hints`)
        }

        if (!q.learningObjective || q.learningObjective.trim() === "") {
          stats.missingLearningObjectives.push(q.id)
          warnings.push(`Question ${q.id} missing learning objective`)
        }

        // Check for duplicate questions
        const questionKey = `${q.topicId}-${q.question}`
        if (seenQuestions.has(questionKey)) {
          stats.duplicateQuestions.push(q.id)
          warnings.push(`Duplicate question content in ${q.topicId}`)
        }
        seenQuestions.add(questionKey)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats,
  }
}

export function validateLessonBank(): ValidationReport {
  const errors: string[] = []
  const warnings: string[] = []
  const stats = {
    totalQuestions: 0,
    totalLessons: 0,
    topics: [] as string[],
    duplicateIds: [] as string[],
    missingExplanations: [] as string[],
    missingHints: [] as string[],
    missingLearningObjectives: [] as string[],
    duplicateQuestions: [] as string[],
  }

  const seenIds = new Set<string>()

  // Validate lessons
  for (const [topicId, loader] of Object.entries(lessonLoaders)) {
    stats.topics.push(topicId)
    stats.totalLessons++

    // Check if lesson can be loaded
    try {
      const lesson = loader().then(m => m.default())
      // Note: We can't await here, so we just check registration
    } catch (e) {
      errors.push(`Failed to load lesson ${topicId}: ${e}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats,
  }
}

export function validateAll(): ValidationReport {
  const questionReport = validateQuestionBank()
  const lessonReport = validateLessonBank()

  return {
    valid: questionReport.valid && lessonReport.valid,
    errors: [...questionReport.errors, ...lessonReport.errors],
    warnings: [...questionReport.warnings, ...lessonReport.warnings],
    stats: questionReport.stats,
  }
}