"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

type AuthGuardProps = {
  children: React.ReactNode
  requireOnboarding?: boolean
}

export function AuthGuard({
  children,
  requireOnboarding = true,
}: AuthGuardProps) {
  const router = useRouter()
  const { user, ready } = useAuth()

  useEffect(() => {
    if (!ready) return

    if (!user) {
      router.replace("/login")
      return
    }

    if (requireOnboarding && !user.onboarding?.completed) {
      router.replace("/onboarding")
      return
    }

    if (!requireOnboarding && user.onboarding?.completed) {
      router.replace("/dashboard")
    }
  }, [user, ready, requireOnboarding, router])

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="size-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      </div>
    )
  }

  if (requireOnboarding && !user.onboarding?.completed) {
    return null
  }

  if (!requireOnboarding && user.onboarding?.completed) {
    return null
  }

  return <>{children}</>
}
