import type { AdaptiveConfig } from "./types"
import { getWeakSkills, getSkillsForTopic } from "./skill-engine"
import { getMistakesForTopic } from "./mistake-analyzer"

export function getAdaptiveConfig(topicId: string): AdaptiveConfig {
  const weakSkills = getWeakSkills(topicId)
  const mistakes = getMistakesForTopic(topicId)
  const skills = getSkillsForTopic(topicId)

  // Determine difficulty based on skill mastery and mistake patterns
  let difficulty: AdaptiveConfig["difficulty"] = "medium"
  let questionType: AdaptiveConfig["questionType"] = "computational"
  let hintLevel = 1
  let reviewMode = false

  // Check for sign mistakes - generate easier sign questions
  const signMistakes = mistakes.filter((m) => m.type === "sign")
  const hasSignIssues = signMistakes.length > 0 && signMistakes[0].count >= 2

  // Check for concept misunderstandings
  const conceptMistakes = mistakes.filter((m) => m.type === "concept")
  const hasConceptIssues = conceptMistakes.length > 0

  // Calculate average skill mastery
  const avgMastery = skills.length > 0
    ? skills.reduce((sum, s) => sum + s.mastery, 0) / skills.length
    : 50

  // Determine difficulty
  if (hasConceptIssues || avgMastery < 30) {
    difficulty = "easy"
    hintLevel = 2
    questionType = "conceptual"
  } else if (hasSignIssues || weakSkills.length > 2) {
    difficulty = "easy"
    hintLevel = 1
    questionType = "computational"
  } else if (avgMastery >= 80 && weakSkills.length === 0) {
    difficulty = "hard"
    hintLevel = 1
    questionType = "exam-style"
  } else if (avgMastery >= 60) {
    difficulty = "medium"
    hintLevel = 1
    questionType = "multi-step"
  }

  // Enable review mode if many mistakes
  if (mistakes.length >= 3 || weakSkills.length >= 3) {
    reviewMode = true
  }

  return {
    difficulty,
    questionType,
    hintLevel,
    reviewMode,
  }
}

export function getNextHintLevel(currentLevel: number, mistakeType: string): number {
  // Increase hint level based on mistake type
  if (mistakeType === "concept") {
    return Math.min(currentLevel + 1, 4)
  }
  if (mistakeType === "formula") {
    return Math.min(currentLevel + 1, 3)
  }
  return currentLevel
}

export function shouldReduceDifficulty(topicId: string): boolean {
  const weakSkills = getWeakSkills(topicId)
  const mistakes = getMistakesForTopic(topicId)
  const recentMistakes = mistakes.filter((m) => Date.now() - m.lastSeen < 24 * 60 * 60 * 1000)

  return weakSkills.length >= 3 || recentMistakes.length >= 3
}

export function shouldIncreaseDifficulty(topicId: string): boolean {
  const skills = getSkillsForTopic(topicId)
  const weakSkills = skills.filter((s) => s.mastery < 50)

  if (skills.length === 0) return false
  const avgMastery = skills.reduce((sum, s) => sum + s.mastery, 0) / skills.length
  return avgMastery >= 85 && weakSkills.length === 0
}