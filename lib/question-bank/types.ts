export interface QuizQuestion {
  id: string
  question: string
  choices: string[]
  answer: number
  explanation: string
}

export interface TopicQuestions {
  [topicId: string]: QuizQuestion[]
}

export interface TopicProgress {
  completed: boolean
  score: number
  attempts: number
  bestScore: number
  lastAttempt: string
}