"use client"

import { useCallback } from "react"
import { useAuth } from "./use-auth"
import {
  XP_REWARDS,
  calculateLevel,
  getLevelProgress,
  getToday,
  checkStreak,
  checkAchievements,
} from "@/lib/gamification"
import type { User, UserStats } from "@/lib/types"

const USERS_KEY = "mathmentor-users"

export function useGamification() {
  const { user, refresh, setUser } = useAuth()

  const addXP = useCallback(
    (amount: number, reason: string) => {
      if (!user) return null
      const updated = addXPToUser(user, amount, reason)
      if (updated) {
        setUser(updated)
        refresh()
      }
      return updated
    },
    [user, setUser, refresh]
  )

  const awardQuizXP = useCallback(
    (score: number, total: number) => {
      if (!user) return null
      const isPerfect = score === total
      const xp = XP_REWARDS.correctAnswer * score + (isPerfect ? XP_REWARDS.perfectQuiz : 0)
      const updated = addXPToUser(user, xp, isPerfect ? "perfect_quiz" : "quiz_complete")
      if (updated) {
        if (isPerfect) {
          const stats = updated.stats
          const newPerfect = (stats.perfectQuizzes || 0) + 1
          const updatedStats = { ...stats, perfectQuizzes: newPerfect }
          const saved = saveUserStats(updated, updatedStats)
          if (saved) {
            setUser(saved)
            refresh()
            return saved
          }
        } else {
          setUser(updated)
          refresh()
        }
      }
      return updated
    },
    [user, setUser, refresh]
  )

  const awardLessonXP = useCallback(
    (topicId: string) => {
      if (!user) return null
      const updated = addXPToUser(user, XP_REWARDS.lessonComplete, "lesson_complete")
      if (updated) {
        const stats = updated.stats
        const newCompleted = (stats.lessonsCompleted || 0) + 1
        const updatedStats = { ...stats, lessonsCompleted: newCompleted }
        const saved = saveUserStats(updated, updatedStats)
        if (saved) {
          setUser(saved)
          refresh()
          return saved
        }
      }
      return updated
    },
    [user, setUser, refresh]
  )

  const loseHeart = useCallback(() => {
    if (!user || user.stats.hearts <= 0) return user
    const updated = {
      ...user,
      stats: { ...user.stats, hearts: user.stats.hearts - 1 },
    }
    saveUser(updated)
    setUser(updated)
    refresh()
    return updated
  }, [user, setUser, refresh])

  const refillHearts = useCallback(() => {
    if (!user) return
    const updated = {
      ...user,
      stats: { ...user.stats, hearts: 5 },
    }
    saveUser(updated)
    setUser(updated)
    refresh()
  }, [user, setUser, refresh])

  const level = user ? calculateLevel(user.stats.xp) : 1
  const levelProgress = user ? getLevelProgress(user.stats.xp) : null

  return {
    user,
    addXP,
    awardQuizXP,
    awardLessonXP,
    loseHeart,
    refillHearts,
    level,
    levelProgress,
    hearts: user?.stats.hearts ?? 5,
    xp: user?.stats.xp ?? 0,
    streak: user?.stats.streak ?? 0,
    longestStreak: user?.stats.longestStreak ?? 0,
    achievements: user?.stats.achievements ?? [],
  }
}

function addXPToUser(user: User, amount: number, reason: string): User | null {
  const stats = user.stats
  const newXP = (stats.xp || 0) + amount
  const newLevel = calculateLevel(newXP)
  const today = getToday()
  const lastStudy = stats.lastStudyDate
  const streakResult = checkStreak(lastStudy)

  const updatedStats: UserStats = {
    ...stats,
    xp: newXP,
    level: newLevel,
    streak: streakResult.streak > 0 ? (stats.streak || 0) + streakResult.streak : stats.streak || 0,
    longestStreak: Math.max(stats.longestStreak || 0, (stats.streak || 0) + streakResult.streak),
    lastStudyDate: streakResult.isNewDay ? today : lastStudy,
  }

  return saveUserStats(user, updatedStats)
}

function saveUserStats(user: User, stats: UserStats): User | null {
  const updated = { ...user, stats }
  saveUser(updated)
  return updated
}

function saveUser(user: User): void {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as User[]
    const idx = users.findIndex((u) => u.id === user.id)
    if (idx !== -1) {
      users[idx] = user
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
    }
  } catch {
    // ignore
  }
}