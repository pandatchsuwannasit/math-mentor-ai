import { supabase } from "@/lib/supabase/client"
import type { StudyHistory } from "@/lib/supabase/database.types"

export async function getAnalytics(userId: string) {
  const [historyResult, topicResult, lessonResult] = await Promise.all([
    supabase.from("study_history").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("topic_progress").select("*").eq("user_id", userId),
    supabase.from("lesson_progress").select("*").eq("user_id", userId),
  ])

  if (historyResult.error || topicResult.error || lessonResult.error) {
    return null
  }

  const history = historyResult.data as StudyHistory[]
  const topicProgress = topicResult.data
  const lessonProgress = lessonResult.data

  // Calculate analytics
  const totalQuestions = history.reduce((sum, h) => sum + h.questions_answered, 0)
  const totalCorrect = history.reduce((sum, h) => sum + h.correct_answers, 0)
  const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0
  const totalStudyTime = history.reduce((sum, h) => sum + h.duration_minutes, 0)
  const completedLessons = lessonProgress.filter((l) => l.status === "completed").length
  const totalLessons = lessonProgress.length

  // Topic performance
  const topicPerformance = topicProgress.map((t) => ({
    topicId: t.topic_id,
    attempts: t.attempts,
    accuracy: t.attempts > 0 ? (t.total_correct / t.attempts) * 100 : 0,
    bestScore: t.best_score,
  }))

  // Recent activity (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const recentActivity = history.filter((h) => new Date(h.created_at) >= sevenDaysAgo)

  return {
    totalQuestions,
    totalCorrect,
    accuracy: Math.round(accuracy),
    totalStudyTime,
    completedLessons,
    totalLessons,
    topicPerformance,
    recentActivity,
    streak: calculateStreak(history),
  }
}

function calculateStreak(history: StudyHistory[]): number {
  if (history.length === 0) return 0

  const dates = new Set(history.map((h) => new Date(h.created_at).toDateString()))
  const sortedDates = Array.from(dates).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  let streak = 0
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()

  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0
  }

  for (let i = 0; i < sortedDates.length; i++) {
    const current = new Date(sortedDates[i])
    const expected = new Date()
    expected.setDate(expected.getDate() - i)

    if (current.toDateString() === expected.toDateString()) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export async function getStudyTimeByDay(userId: string, days: number = 7) {
  const date = new Date()
  date.setDate(date.getDate() - days)

  const { data, error } = await supabase
    .from("study_history")
    .select("duration_minutes, created_at")
    .eq("user_id", userId)
    .gte("created_at", date.toISOString())
    .order("created_at", { ascending: true })

  if (error) return []

  // Group by day
  const byDay: Record<string, number> = {}
  data.forEach((h) => {
    const day = new Date(h.created_at).toLocaleDateString("en-US", { weekday: "short" })
    byDay[day] = (byDay[day] || 0) + h.duration_minutes
  })

  return Object.entries(byDay).map(([day, minutes]) => ({ day, minutes }))
}