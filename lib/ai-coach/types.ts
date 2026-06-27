export interface AIAnalysis {
  overallMastery: number
  estimatedSkill: number
  weakTopics: string[]
  strongTopics: string[]
  recommendedTopic: string
  recommendedLesson: string
  recommendedQuiz: string
  studyPriority: "high" | "medium" | "low"
  estimatedStudyMinutes: number
  motivationMessage: string
}

export interface StudyPlanTask {
  id: string
  type: "lesson" | "quiz" | "review" | "practice"
  title: string
  description: string
  topicId: string
  estimatedMinutes: number
  difficulty: "easy" | "medium" | "hard"
  xpReward: number
  completed: boolean
}

export interface StudyPlan {
  tasks: StudyPlanTask[]
  estimatedMinutes: number
  difficulty: "easy" | "medium" | "hard"
  expectedXP: number
  completionRate: number
}

export interface Forecast {
  currentAccuracy: number
  expectedAccuracy: number
  currentMastery: number
  expectedMastery: number
  currentXP: number
  expectedXP: number
  currentLevel: number
  expectedLevel: number
  improvementPercent: number
}

export interface Recommendation {
  type: "continue-lesson" | "next-lesson" | "review-mistakes" | "hard-practice" | "easy-practice"
  title: string
  description: string
  topicId: string
  reason: string
  estimatedMinutes: number
  xpReward: number
}