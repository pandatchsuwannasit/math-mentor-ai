"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { GuestGuard } from "@/components/guest-guard"
import { registerUser, getPostAuthRedirect, isValidEmail } from "@/lib/auth"
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

export default function RegisterPage() {
  const router = useRouter()
  const { refresh } = useAuth()
  const { t } = useLanguage()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError("")

    if (!isValidEmail(email)) {
      setError(t.app.errors.invalidEmail)
      return
    }

    if (password !== confirmPassword) {
      setError(t.app.errors.passwordsDoNotMatch)
      return
    }

    setLoading(true)
    const result = registerUser({ fullName, email, password })
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
            {t.app.register.subtitle}
          </p>

          <form onSubmit={handleSubmit} className="mt-6">
            <div>
              <label htmlFor="fullName" className={labelClassName}>
                {t.app.common.fullName}
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t.app.register.fullNamePlaceholder}
                className={inputClassName}
                required
                autoComplete="name"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="email" className={labelClassName}>
                {t.app.common.email}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.app.register.emailPlaceholder}
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
                placeholder={t.app.register.passwordPlaceholder}
                className={inputClassName}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="confirmPassword" className={labelClassName}>
                {t.app.register.confirmPassword}
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t.app.register.confirmPasswordPlaceholder}
                className={inputClassName}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            {error && <p className={errorClassName}>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={primaryButtonClassName}
            >
              {loading ? t.app.register.creatingAccount : t.app.register.submit}
            </button>
          </form>

          <Link href="/login" className={secondaryLinkClassName}>
            {t.app.register.signIn}
          </Link>
        </div>
      </main>
    </GuestGuard>
  )
}
