"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { getPostAuthRedirect } from "@/lib/auth"

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="size-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
    </div>
  )
}

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, ready } = useAuth()

  useEffect(() => {
    if (!ready || !user) return
    router.replace(getPostAuthRedirect(user))
  }, [user, ready, router])

  // While loading auth state → spinner
  if (!ready) return <LoadingSpinner />

  // User is authenticated → redirecting, show spinner (never blank/null)
  if (user) return <LoadingSpinner />

  // No user → show children (e.g. login form)
  return <>{children}</>
}
