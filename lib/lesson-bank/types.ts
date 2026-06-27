export interface Formula {
  name: string
  formula: string
  description: string
}

export interface LessonConcept {
  title: string
  content: string
}

export interface LessonExample {
  question: string
  solution: string
  answer: string
}

export interface Lesson {
  id: string
  curriculum: string
  topicId: string
  title: string
  description: string
  estimatedReadingTime: number
  difficulty: "easy" | "medium" | "hard"
  learningObjectives: string[]
  prerequisites: string[]
  keywords: string[]
  introduction: string
  concepts: LessonConcept[]
  examples: LessonExample[]
  summary: string[]
  commonMistakes: string[]
  formulas: Formula[]
  relatedTopics: string[]
  quizTopicId: string
  version: number
}

export interface LessonProgress {
  lessonId: string
  status: "not-started" | "studying" | "completed"
  startedAt?: string
  completedAt?: string
  scrollPosition: number
  timeSpentMinutes: number
}