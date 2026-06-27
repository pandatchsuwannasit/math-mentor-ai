import { supabase } from "@/lib/supabase/client"
import type { User } from "@/lib/supabase/database.types"

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) return null
  return data
}

export async function createUser(user: Partial<User>): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .insert(user)
    .select()
    .single()

  if (error) return null
  return data
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single()

  if (error) return null
  return data
}

export async function deleteUser(userId: string): Promise<boolean> {
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", userId)

  return !error
}