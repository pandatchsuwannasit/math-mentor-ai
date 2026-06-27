import { supabase } from "@/lib/supabase/client"
import type { TopicProgress, QuestionProgress, MistakePattern, Skill } from "@/lib/supabase/database.types"

export async function getTopicProgress(userId: string): Promise<TopicProgress[]> {
  const { data, error } = await supabase
    .from("topic_progress")
    .select("*")
    .eq("user_id", userId)

  if (error) return []
  return data
}

export async function getTopicProgressById(userId: string, topicId: string): Promise<TopicProgress | null> {
  const { data, error } = await supabase
    .from("topic_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("topic_id", topicId)
    .single()

  if (error) return null
  return data
}

export async function saveTopicProgress(progress: Partial<TopicProgress> & { user_id: string; topic_id: string }): Promise<TopicProgress | null> {
  const { data, error } = await supabase
    .from("topic_progress")
    .upsert(progress, { onConflict: "user_id,topic_id" })
    .select()
    .single()

  if (error) return null
  return data
}

export async function recordQuestionProgress(progress: Omit<QuestionProgress, "id" | "created_at">): Promise<QuestionProgress | null> {
  const { data, error } = await supabase
    .from("question_progress")
    .insert(progress)
    .select()
    .single()

  if (error) return null
  return data
}

export async function getQuestionProgress(userId: string, topicId?: string): Promise<QuestionProgress[]> {
  let query = supabase.from("question_progress").select("*").eq("user_id", userId)
  if (topicId) {
    query = query.eq("topic_id", topicId)
  }
  const { data, error } = await query

  if (error) return []
  return data
}

export async function saveMistakePattern(mistake: Partial<MistakePattern> & { user_id: string; topic_id: string; type: string }): Promise<MistakePattern | null> {
  const { data, error } = await supabase
    .from("mistake_patterns")
    .upsert(mistake, { onConflict: "user_id,topic_id,type" })
    .select()
    .single()

  if (error) return null
  return data
}

export async function getMistakePatterns(userId: string): Promise<MistakePattern[]> {
  const { data, error } = await supabase
    .from("mistake_patterns")
    .select("*")
    .eq("user_id", userId)

  if (error) return []
  return data
}

export async function saveSkill(skill: Partial<Skill> & { user_id: string; topic_id: string; name: string }): Promise<Skill | null> {
  const { data, error } = await supabase
    .from("skills")
    .upsert(skill, { onConflict: "user_id,topic_id,name" })
    .select()
    .single()

  if (error) return null
  return data
}

export async function getSkills(userId: string, topicId?: string): Promise<Skill[]> {
  let query = supabase.from("skills").select("*").eq("user_id", userId)
  if (topicId) {
    query = query.eq("topic_id", topicId)
  }
  const { data, error } = await query

  if (error) return []
  return data
}