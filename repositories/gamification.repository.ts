import { supabase } from "@/lib/supabase/client"
import type { XP, Achievement, DailyMission, StudyHistory } from "@/lib/supabase/database.types"

export async function getXP(userId: string): Promise<XP | null> {
  const { data, error } = await supabase
    .from("xp")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error) return null
  return data
}

export async function updateXP(userId: string, xp: number, level: number): Promise<XP | null> {
  const { data, error } = await supabase
    .from("xp")
    .upsert({ user_id: userId, total_xp: xp, level }, { onConflict: "user_id" })
    .select()
    .single()

  if (error) return null
  return data
}

export async function getAchievements(userId: string): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_id", userId)

  if (error) return []
  return data
}

export async function unlockAchievement(userId: string, achievementId: string): Promise<Achievement | null> {
  const { data, error } = await supabase
    .from("achievements")
    .insert({ user_id: userId, achievement_id: achievementId })
    .select()
    .single()

  if (error) return null
  return data
}

export async function getDailyMissions(userId: string, date: string): Promise<DailyMission[]> {
  const { data, error } = await supabase
    .from("daily_missions")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)

  if (error) return []
  return data
}

export async function updateDailyMission(userId: string, missionId: string, current: number): Promise<DailyMission | null> {
  const { data, error } = await supabase
    .from("daily_missions")
    .update({ current })
    .eq("user_id", userId)
    .eq("id", missionId)
    .select()
    .single()

  if (error) return null
  return data
}

export async function recordStudyHistory(history: Omit<StudyHistory, "id" | "created_at">): Promise<StudyHistory | null> {
  const { data, error } = await supabase
    .from("study_history")
    .insert(history)
    .select()
    .single()

  if (error) return null
  return data
}

export async function getStudyHistory(userId: string, days: number = 7): Promise<StudyHistory[]> {
  const date = new Date()
  date.setDate(date.getDate() - days)

  const { data, error } = await supabase
    .from("study_history")
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", date.toISOString())
    .order("created_at", { ascending: false })

  if (error) return []
  return data
}