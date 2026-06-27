import type { LearningMemory } from "./types"
import { getMistakePatterns } from "./mistake-analyzer"
import { getSkills, getWeakSkills, getStrongSkills } from "./skill-engine"

const MEMORY_KEY = "mathmentor-learning-memory"

export function updateLearningMemory(updates: Partial<LearningMemory>) {
  if (typeof window === "undefined") return

  const memory = getLearningMemory()
  const updated = { ...memory, ...updates, lastStudied: Date.now() }
  localStorage.setItem(MEMORY_KEY, JSON.stringify(updated))
}

export function getLearningMemory(): LearningMemory {
  if (typeof window === "undefined") {
    return {
      recentTopics: [],
      recentMistakes: [],
      favoriteDifficulty: "medium",
      averageSolveTime: 0,
      strongSkills: [],
      weakSkills: [],
      lastStudied: 0,
    }
  }

  try {
    const stored = localStorage.getItem(MEMORY_KEY)
    if (stored) return JSON.parse(stored) as LearningMemory
  } catch {
    // Fall through to default
  }

  // Initialize from existing data
  const mistakes = getMistakePatterns()
  const skills = getSkills()
  const weakSkills = getWeakSkills()
  const strongSkills = getStrongSkills()

  return {
    recentTopics: [],
    recentMistakes: mistakes.slice(0, 10).map((m) => m.topicId),
    favoriteDifficulty: "medium",
    averageSolveTime: 0,
    strongSkills: strongSkills.slice(0, 5).map((s) => s.name),
    weakSkills: weakSkills.slice(0, 5).map((s) => s.name),
    lastStudied: 0,
  }
}

export function addRecentTopic(topicId: string) {
  const memory = getLearningMemory()
  const recentTopics = [topicId, ...memory.recentTopics.filter((t) => t !== topicId)].slice(0, 10)
  updateLearningMemory({ recentTopics })
}

export function addRecentMistake(topicId: string) {
  const memory = getLearningMemory()
  const recentMistakes = [topicId, ...memory.recentMistakes.filter((t) => t !== topicId)].slice(0, 10)
  updateLearningMemory({ recentMistakes })
}

export function updateAverageSolveTime(solveTimeSeconds: number) {
  const memory = getLearningMemory()
  const currentAvg = memory.averageSolveTime
  const count = memory.recentTopics.length || 1
  const newAvg = currentAvg === 0 ? solveTimeSeconds : (currentAvg + solveTimeSeconds) / 2
  updateLearningMemory({ averageSolveTime: Math.round(newAvg) })
}

export function refreshSkillLists() {
  const strongSkills = getStrongSkills()
  const weakSkills = getWeakSkills()
  updateLearningMemory({
    strongSkills: strongSkills.slice(0, 5).map((s) => s.name),
    weakSkills: weakSkills.slice(0, 5).map((s) => s.name),
  })
}