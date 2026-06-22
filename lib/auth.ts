import type {
  Activity,
  Grade,
  LearningGoal,
  OnboardingData,
  Session,
  Subject,
  User,
  UserStats,
} from "./types"
import { getCurriculumTopicsForGrade } from "./curriculum"

const USERS_KEY = "mathmentor-users"
const SESSION_KEY = "mathmentor-session"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isBrowser() {
  return typeof window !== "undefined"
}

function createDefaultStats(subjects: Subject[] = []): UserStats {
  const subjectProgress: Partial<Record<Subject, number>> = {}
  for (const subject of subjects) {
    subjectProgress[subject] = 0
  }

  return {
    questionsDone: 0,
    studyTimeMinutes: 0,
    accuracy: 0,
    streak: 0,
    overallProgress: 0,
    subjectProgress,
  }
}

function createWelcomeActivities(subjects: Subject[]): Activity[] {
  if (subjects.length === 0) return []

  return [
    {
      id: crypto.randomUUID(),
      title: `${subjects[0]} Starter Quiz`,
      type: "quiz",
      score: undefined,
      questions: 10,
      completed: 0,
      date: "Just now",
      status: "in-progress",
    },
  ]
}

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim())
}

export function getUsers(): User[] {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(USERS_KEY)
    return raw ? (JSON.parse(raw) as User[]) : []
  } catch {
    return []
  }
}

function saveUsers(users: User[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getSession(): Session | null {
  if (!isBrowser()) return null
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

function setSession(userId: string) {
  const session: Session = { userId }
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function getCurrentUser(): User | null {
  const session = getSession()
  if (!session) return null
  return getUsers().find((user) => user.id === session.userId) ?? null
}

export function registerUser(input: {
  fullName: string
  email: string
  password: string
}): { success: true; user: User } | { success: false; error: string } {
  const fullName = input.fullName.trim()
  const email = input.email.trim().toLowerCase()
  const password = input.password

  if (!fullName) {
    return { success: false, error: "Full name is required." }
  }

  if (!isValidEmail(email)) {
    return { success: false, error: "Please enter a valid email address." }
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." }
  }

  const users = getUsers()
  if (users.some((user) => user.email === email)) {
    return { success: false, error: "An account with this email already exists." }
  }

  const user: User = {
    id: crypto.randomUUID(),
    fullName,
    email,
    password,
    onboarding: null,
    stats: createDefaultStats(),
    activities: [],
    createdAt: new Date().toISOString(),
  }

  users.push(user)
  saveUsers(users)
  setSession(user.id)

  return { success: true, user }
}

export function loginUser(
  email: string,
  password: string
): { success: true; user: User } | { success: false; error: string } {
  const normalizedEmail = email.trim().toLowerCase()
  const user = getUsers().find(
    (entry) => entry.email === normalizedEmail && entry.password === password
  )

  if (!user) {
    return { success: false, error: "Incorrect email or password." }
  }

  setSession(user.id)
  return { success: true, user }
}

export function createGuestUser(input: {
  grade: Grade
  learningGoal: Extract<
    LearningGoal,
    "General Learning" | "Exam Preparation" | "A-Level Preparation"
  >
}): User {
  const users = getUsers().filter((user) => !user.isGuest)
  const id = crypto.randomUUID()
  const subjects = Array.from(
    new Set(getCurriculumTopicsForGrade(input.grade).map((topic) => topic.subject))
  )

  const user: User = {
    id,
    fullName: "Guest User",
    email: `guest-${id}@mathmentor.local`,
    password: "",
    isGuest: true,
    onboarding: {
      grade: input.grade,
      learningGoal: input.learningGoal,
      subjects,
      completed: true,
    },
    stats: createDefaultStats(subjects),
    activities: createWelcomeActivities(subjects),
    createdAt: new Date().toISOString(),
  }

  users.push(user)
  saveUsers(users)
  setSession(user.id)

  return user
}

export function logout() {
  if (!isBrowser()) return
  window.localStorage.removeItem(SESSION_KEY)
}

export function completeOnboarding(
  userId: string,
  data: Omit<OnboardingData, "completed">
): User | null {
  const users = getUsers()
  const index = users.findIndex((user) => user.id === userId)
  if (index === -1) return null

  const onboarding: OnboardingData = { ...data, completed: true }
  const user = users[index]

  users[index] = {
    ...user,
    onboarding,
    stats: createDefaultStats(data.subjects),
    activities: createWelcomeActivities(data.subjects),
  }

  saveUsers(users)
  return users[index]
}

export function updateUserProfile(
  userId: string,
  updates: {
    fullName?: string
    grade?: OnboardingData["grade"]
    subjects?: Subject[]
    learningGoal?: OnboardingData["learningGoal"]
  }
): User | null {
  const users = getUsers()
  const index = users.findIndex((user) => user.id === userId)
  if (index === -1) return null

  const user = users[index]
  if (!user.onboarding?.completed) return null

  const nextSubjects = updates.subjects ?? user.onboarding.subjects
  const nextStats = { ...user.stats }

  for (const subject of nextSubjects) {
    if (nextStats.subjectProgress[subject] === undefined) {
      nextStats.subjectProgress[subject] = 0
    }
  }

  users[index] = {
    ...user,
    fullName: updates.fullName?.trim() || user.fullName,
    onboarding: {
      ...user.onboarding,
      grade: updates.grade ?? user.onboarding.grade,
      subjects: nextSubjects,
      learningGoal: updates.learningGoal ?? user.onboarding.learningGoal,
    },
    stats: nextStats,
  }

  saveUsers(users)
  return users[index]
}

export function getPostAuthRedirect(user: User): string {
  if (!user.onboarding?.completed) return "/onboarding"
  return "/dashboard"
}

export function getInitial(user: User | null): string {
  return user?.fullName?.charAt(0)?.toUpperCase() ?? "?"
}

export function formatStudyTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  return `${hours}h ${mins}m`
}
