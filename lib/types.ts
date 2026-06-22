export type Grade =
  | "Grade 7"
  | "Grade 8"
  | "Grade 9"
  | "Grade 10"
  | "Grade 11"
  | "Grade 12"

export type CurriculumLevel = "M1" | "M2" | "M3" | "M4" | "M5" | "M6"

export type Subject =
  | "Algebra"
  | "Geometry"
  | "Calculus"
  | "Trigonometry"
  | "Statistics"

export type LearningGoal =
  | "Improve grades"
  | "Prepare for exams"
  | "University entrance exams"
  | "Master mathematics"
  | "General Learning"
  | "Exam Preparation"
  | "A-Level Preparation"

export interface OnboardingData {
  grade: Grade
  subjects: Subject[]
  learningGoal: LearningGoal
  completed: boolean
  currentCurriculum?: CurriculumLevel
}

export interface UserStats {
  questionsDone: number
  studyTimeMinutes: number
  accuracy: number
  streak: number
  overallProgress: number
  subjectProgress: Partial<Record<Subject, number>>
  curriculumProgress: Partial<Record<CurriculumLevel, number>>
}

export interface Activity {
  id: string
  title: string
  type: "quiz" | "practice"
  score?: number
  questions: number
  completed: number
  date: string
  status: "completed" | "in-progress"
}

export interface User {
  id: string
  fullName: string
  email: string
  password: string
  isGuest?: boolean
  onboarding: OnboardingData | null
  stats: UserStats
  activities: Activity[]
  createdAt: string
}

export interface Session {
  userId: string
}

export const GRADES: Grade[] = [
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
]

export const CURRICULUM_LEVELS: CurriculumLevel[] = [
  "M1",
  "M2",
  "M3",
  "M4",
  "M5",
  "M6",
]

export const SUBJECTS: Subject[] = [
  "Algebra",
  "Geometry",
  "Calculus",
  "Trigonometry",
  "Statistics",
]

export const LEARNING_GOALS: LearningGoal[] = [
  "Improve grades",
  "Prepare for exams",
  "University entrance exams",
  "Master mathematics",
]

export function gradeToCurriculum(grade: Grade): CurriculumLevel {
  const map: Record<Grade, CurriculumLevel> = {
    "Grade 7": "M1",
    "Grade 8": "M2",
    "Grade 9": "M3",
    "Grade 10": "M4",
    "Grade 11": "M5",
    "Grade 12": "M6",
  }
  return map[grade]
}
