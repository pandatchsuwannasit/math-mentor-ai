import { supabase } from "@/lib/supabase/client"
import type { LessonProgress } from "@/lib/supabase/database.types"

export async function getLessonProgress(userId: string): Promise<LessonProgress[]> {
  const { data, error } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", userId)

  if (error) return []
  return data
}

export async function getLessonProgressById(userId: string, lessonId: string): Promise<LessonProgress | null> {
  const { data, error } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .single()

  if (error) return null
  return data
}

export async function saveLessonProgress(progress: Partial<LessonProgress> & { user_id: string; lesson_id: string }): Promise<LessonProgress | null> {
  const { data, error } = await supabase
    .from("lesson_progress")
    .upsert(progress, { onConflict: "user_id,lesson_id" })
    .select()
    .single()

  if (error) return null
  return data
}

export async function deleteLessonProgress(userId: string, lessonId: string): Promise<boolean> {
  const { error } = await supabase
    .from("lesson_progress")
    .delete()
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)

  return !error
}