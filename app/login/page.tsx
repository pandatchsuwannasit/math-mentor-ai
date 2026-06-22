"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { GuestGuard } from "@/components/guest-guard"
import { loginUser, getPostAuthRedirect } from "@/lib/auth"
import {
  cardClassName,
  errorClassName,
  inputClassName,
  labelClassName,
  primaryButtonClassName,
  secondaryLinkClassName,
} from "@/lib/form-styles"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/components/language-provider"

export default function LoginPage() {
  const router = useRouter()
  const { refresh } = useAuth()
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    setLoading(true)

    const result = loginUser(email, password)
    setLoading(false)

    if (!result.success) {
      setError(result.error)
      return
    }

    refresh()
    router.push(getPostAuthRedirect(result.user))
  }

  return (
    <GuestGuard>
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className={cardClassName}>
          <h1 className="text-center text-3xl font-bold text-white">
            {t.app.common.appName}
          </h1>
          <p className="mt-2 text-center text-slate-400">
            {t.app.login.subtitle}
          </p>

          <form onSubmit={handleSubmit} className="mt-6">
            <div>
              <label htmlFor="email" className={labelClassName}>
                {t.app.common.email}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.app.login.emailPlaceholder}
                className={inputClassName}
                required
                autoComplete="email"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="password" className={labelClassName}>
                {t.app.common.password}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.app.login.passwordPlaceholder}
                className={inputClassName}
                required
                autoComplete="current-password"
              />
            </div>

            {error && <p className={errorClassName}>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={primaryButtonClassName}
            >
              {loading ? t.app.login.signingIn : t.app.login.submit}
            </button>
          </form>

          <Link href="/guest-setup" className={secondaryLinkClassName}>
            {t.app.login.continueAsGuest}
          </Link>

          <Link href="/register" className={secondaryLinkClassName}>
            {t.app.login.createAccount}
          </Link>
        </div>
      </main>
    </GuestGuard>
  )
}
