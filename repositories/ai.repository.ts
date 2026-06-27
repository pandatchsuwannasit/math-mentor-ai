import { supabase } from "@/lib/supabase/client"
import type { LearningMemory, MistakePattern, Skill } from "@/lib/supabase/database.types"

export async function getLearningMemory(userId: string): Promise<LearningMemory | null> {
  const { data, error } = await supabase
    .from("learning_memory")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error) return null
  return data
}

export async function saveLearningMemory(memory: Partial<LearningMemory> & { user_id: string }): Promise<LearningMemory | null> {
  const { data, error } = await supabase
    .from("learning_memory")
    .upsert(memory, { onConflict: "user_id" })
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
    .order("count", { ascending: false })

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

export async function getSkills(userId: string, topicId?: string): Promise<Skill[]> {
  let query = supabase.from("skills").select("*").eq("user_id", userId)
  if (topicId) {
    query = query.eq("topic_id", topicId)
  }
  const { data, error } = await query

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