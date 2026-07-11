"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
  Brain,
  LayoutDashboard,
  PencilRuler,
  TrendingUp,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Calendar,
  BookOpen,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/components/language-provider"
import { getInitial } from "@/lib/auth"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleLogout() {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400">
              <Brain className="size-5" />
            </span>
            <span className="text-base font-semibold text-white">
              Math Mentor <span className="text-cyan-400">AI</span>
            </span>
          </Link>
          <button
            type="button"
            aria-label={t.app.shell.toggleMenu}
            onClick={() => setMobileOpen((open) => !open)}
            className="flex size-9 items-center justify-center rounded-lg text-white"
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <button
            type="button"
            aria-label={t.app.shell.closeMenu}
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 border-r border-slate-800 bg-slate-900 p-4">
            <NavContent
              pathname={pathname}
              userName={user?.fullName}
              isGuest={user?.isGuest}
              initial={getInitial(user)}
              onNavigate={() => setMobileOpen(false)}
              onLogout={handleLogout}
            />
          </aside>
        </div>
      )}

      <div className="mx-auto flex max-w-7xl">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900 p-4 lg:flex">
          <Link href="/dashboard" className="mb-8 flex items-center gap-2 px-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400">
              <Brain className="size-5" />
            </span>
            <span className="text-lg font-semibold text-white">
              Math Mentor <span className="text-cyan-400">AI</span>
            </span>
          </Link>
          <NavContent
            pathname={pathname}
            userName={user?.fullName}
            isGuest={user?.isGuest}
            initial={getInitial(user)}
            onLogout={handleLogout}
          />
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}

function NavContent({
  pathname,
  userName,
  isGuest,
  initial,
  onNavigate,
  onLogout,
}: {
  pathname: string
  userName?: string
  isGuest?: boolean
  initial: string
  onNavigate?: () => void
  onLogout: () => void
}) {
  const { t } = useLanguage()

  const NAV_ITEMS = [
    { href: "/dashboard", label: t.app.shell.nav.dashboard, icon: LayoutDashboard },
    { href: "/practice", label: t.app.shell.nav.practice, icon: PencilRuler },
    { href: "/study-plan", label: t.dashboard.sidebar.studyPlan, icon: Calendar },
    { href: "/curriculum", label: "📚 หลักสูตรการเรียน", icon: BookOpen },
    { href: "/progress", label: t.app.shell.nav.progress, icon: TrendingUp },
    { href: "/profile", label: t.app.shell.nav.profile, icon: User },
    { href: "/settings", label: t.app.shell.nav.settings, icon: Settings },
    { href: "/dashboard/ai", label: "🤖 AI Tutor", icon: Brain },
  ]

  return (
    <>
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 p-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-cyan-500 text-sm font-semibold text-white">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{userName}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
            <p className="text-xs text-slate-400">{t.app.common.student}</p>
            {isGuest && (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                {t.app.common.guestMode}
              </span>
            )}
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-cyan-500/15 text-cyan-400"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <button
        type="button"
        onClick={() => {
          onNavigate?.()
          onLogout()
        }}
        className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
      >
        <LogOut className="size-4" />
        {t.app.common.logout}
      </button>
    </>
  )
}