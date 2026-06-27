"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import {
  getCurrentUser,
  loginUser,
  logout as clearSession,
} from "@/lib/auth"
import type { User } from "@/lib/types"

type AuthContextValue = {
  user: User | null
  ready: boolean
  loading: boolean
  refresh: () => void
  signIn: (
    email: string,
    password: string
  ) => { success: true; user: User } | { success: false; error: string }
  signOut: () => void
  /** @deprecated Use signOut() instead */
  logout: () => void
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setUser(getCurrentUser())
    setReady(true)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const signIn = useCallback(
    (
      email: string,
      password: string
    ): { success: true; user: User } | { success: false; error: string } => {
      const result = loginUser(email, password)
      if (result.success) {
        setUser(result.user)
      }
      return result
    },
    []
  )

  const signOut = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const logout = signOut

  return (
    <AuthContext.Provider
      value={{ user, ready, loading, refresh, signIn, signOut, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return ctx
}
