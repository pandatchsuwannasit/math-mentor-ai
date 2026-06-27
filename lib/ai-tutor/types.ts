export interface MistakePattern {
  id: string
  topicId: string
  type: "sign" | "fraction" | "move-term" | "formula" | "concept" | "careless"
  count: number
  lastSeen: number
}

export interface Skill {
  id: string
  topicId: string
  name: string
  mastery: number
  practicedCount: number
  lastPracticed: number
}

export interface LearningMemory {
  recentTopics: string[]
  recentMistakes: string[]
  favoriteDifficulty: "easy" | "medium" | "hard"
  averageSolveTime: number
  strongSkills: string[]
  weakSkills: string[]
  lastStudied: number
}

export interface Hint {
  level: number
  text: string
}

export interface ReviewSession {
  id: string
  questions: string[]
  mistakePatterns: string[]
  skills: string[]
  estimatedMinutes: number
  xpReward: number
}

export interface AdaptiveConfig {
  difficulty: "easy" | "medium" | "hard"
  questionType: "conceptual" | "computational" | "word-problem" | "multi-step" | "exam-style"
  hintLevel: number
  reviewMode: boolean
}