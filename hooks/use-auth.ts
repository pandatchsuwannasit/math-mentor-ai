"use client"

import { useCallback, useEffect, useState } from "react"
import { getCurrentUser, logout as clearSession } from "@/lib/auth"
import type { User } from "@/lib/types"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  const refresh = useCallback(() => {
    setUser(getCurrentUser())
    setReady(true)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  return { user, ready, refresh, logout, setUser }
}
