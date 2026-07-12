export interface QuizQuestion {
  id: string
  curriculum: string
  topicId: string
  topicName: string
  difficulty: "easy" | "medium" | "hard"
  question: string
  choices: string[]
  answer: number
  explanation: string
  solutionSteps: string[]
  hints: string[]
  /** Estimated time to answer in seconds */
  estimatedTime: number
  /** What the student will learn from this question */
  learningObjective: string
  /** Optional formula reference */
  formula?: string
  /** Search tags */
  tags: string[]
  /** Content source */
  source: "Math Mentor AI"
  /** Version for content updates */
  version: number
}

export interface TopicQuestions {
  [topicId: string]: Partial<QuizQuestion>[]
}

export interface TopicProgress {
  completed: boolean
  score: number
  attempts: number
  bestScore: number
  lastAttempt: string
  wrongQuestionIds: string[]
  /** Total correct answers across all attempts */
  totalCorrect: number
  /** Total wrong answers across all attempts */
  totalWrong: number
  /** Total time spent in minutes */
  totalTimeMinutes: number
  /** Recent question IDs to avoid repeats */
  recentQuestionIds: string[]
}

export interface TopicMetadata {
  id: string
  title: string
  description: string
  curriculum: string
  subject: string
  objectives: string[]
  prerequisites: string[]
  questionCount: number
}

export interface LearningStats {
  overallAccuracy: number
  totalQuestionsAnswered: number
  totalStudyTimeMinutes: number
  weakTopics: string[]
  strongTopics: string[]
  recommendedTopic: string | null
  topicAccuracy: Record<string, number>
  topicProgress: Record<string, number>
  currentStreak: number
  longestStreak: number
}