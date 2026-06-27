export const XP_REWARDS = {
  correctAnswer: 10,
  perfectQuiz: 50,
  lessonComplete: 100,
  dailyMission: 150,
  achievement: 200,
} as const

export const LEVEL_THRESHOLDS = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000, 5500] as const

export const ACHIEVEMENTS = {
  first_lesson: { id: "first_lesson", title: "First Lesson", description: "Complete your first lesson", icon: "📖" },
  questions_100: { id: "questions_100", title: "Centurion", description: "Answer 100 questions", icon: "💯" },
  perfect_quiz: { id: "perfect_quiz", title: "Perfect Score", description: "Get 100% on a quiz", icon: "🌟" },
  streak_7: { id: "streak_7", title: "Week Warrior", description: "7-day streak", icon: "🔥" },
  xp_1000: { id: "xp_1000", title: "Scholar", description: "Earn 1000 XP", icon: "🎓" },
  lessons_10: { id: "lessons_10", title: "Bookworm", description: "Complete 10 lessons", icon: "📚" },
} as const

export function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1
  }
  return 1
}

export function getLevelProgress(xp: number): { current: number; next: number; progress: number } {
  const level = calculateLevel(xp)
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  const progress = nextThreshold > currentThreshold ? ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100 : 100
  return { current: currentThreshold, next: nextThreshold, progress: Math.min(100, Math.max(0, progress)) }
}

export function getToday(): string {
  return new Date().toISOString().split("T")[0]
}

export function checkStreak(lastStudyDate?: string): { streak: number; longestStreak: number; isNewDay: boolean } {
  const today = getToday()
  if (!lastStudyDate) return { streak: 1, longestStreak: 1, isNewDay: true }

  const last = new Date(lastStudyDate)
  const now = new Date(today)
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return { streak: 0, longestStreak: 0, isNewDay: false }
  if (diffDays === 1) return { streak: 1, longestStreak: 1, isNewDay: true }

  return { streak: 1, longestStreak: 1, isNewDay: true }
}

export function generateDailyMissions() {
  const missions = [
    { id: "lesson_1", title: "อ่านบทเรียน 1 บท", description: "อ่านบทเรียนให้สมบูรณ์ 1 บท", target: 1, type: "lessons" as const, xpReward: XP_REWARDS.dailyMission },
    { id: "questions_10", title: "ทำโจทย์ 10 ข้อ", description: "ตอบคำถาม 10 ข้อ", target: 10, type: "questions" as const, xpReward: XP_REWARDS.dailyMission },
    { id: "study_20", title: "เรียน 20 นาที", description: "เรียนติดต่อกัน 20 นาที", target: 20, type: "minutes" as const, xpReward: XP_REWARDS.dailyMission },
    { id: "accuracy_80", title: "ความแม่นยำ 80%", description: "ทำโจทย์ได้ความแม่นยำ 80% ขึ้นไป", target: 80, type: "accuracy" as const, xpReward: XP_REWARDS.dailyMission },
  ]
  return missions
}

export function checkAchievements(stats: {
  xp: number
  questionsDone: number
  lessonsCompleted: number
  streak: number
  perfectQuizzes: number
  achievements: string[]
}): string[] {
  const newAchievements: string[] = []

  if (stats.lessonsCompleted >= 1 && !stats.achievements.includes("first_lesson")) newAchievements.push("first_lesson")
  if (stats.questionsDone >= 100 && !stats.achievements.includes("questions_100")) newAchievements.push("questions_100")
  if (stats.perfectQuizzes >= 1 && !stats.achievements.includes("perfect_quiz")) newAchievements.push("perfect_quiz")
  if (stats.streak >= 7 && !stats.achievements.includes("streak_7")) newAchievements.push("streak_7")
  if (stats.xp >= 1000 && !stats.achievements.includes("xp_1000")) newAchievements.push("xp_1000")
  if (stats.lessonsCompleted >= 10 && !stats.achievements.includes("lessons_10")) newAchievements.push("lessons_10")

  return newAchievements
}