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
  Calendar,
  BookOpen,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/components/language-provider"
import { getInitial } from "@/lib/auth"

export function QuizShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    logout()
    router.push("/")
  }

  const NAV_ITEMS = [
    { href: "/dashboard", label: t.app.shell.nav.dashboard, icon: LayoutDashboard },
    { href: "/practice", label: t.app.shell.nav.practice, icon: PencilRuler },
    { href: "/study-plan", label: t.dashboard.sidebar.studyPlan, icon: Calendar },
    { href: "/curriculum", label: "📚 หลักสูตรการเรียน", icon: BookOpen },
    { href: "/progress", label: t.app.shell.nav.progress, icon: TrendingUp },
    { href: "/profile", label: t.app.shell.nav.profile, icon: User },
    { href: "/settings", label: t.app.shell.nav.settings, icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hamburger button - fixed position, always visible */}
      <button
        type="button"
        aria-label={t.app.shell.toggleMenu}
        onClick={() => setSidebarOpen((open) => !open)}
        className="fixed left-4 top-4 z-50 flex size-10 items-center justify-center rounded-lg bg-slate-800 text-slate-400 shadow-lg hover:bg-slate-700 hover:text-white"
      >
        <Menu className="size-5" />
      </button>

      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Slide-out sidebar drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 border-r border-slate-800 bg-slate-900 p-4 shadow-2xl transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400">
              <Brain className="size-5" />
            </span>
            <span className="text-lg font-semibold text-white">
              Math Mentor <span className="text-cyan-400">AI</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <Menu className="size-5" />
          </button>
        </div>

        {/* User profile */}
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 p-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-cyan-500 text-sm font-semibold text-white">
            {getInitial(user)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{user?.fullName}</p>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
              <p className="text-xs text-slate-400">{t.app.common.student}</p>
              {user?.isGuest && (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                  {t.app.common.guestMode}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
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

        {/* Logout */}
        <button
          type="button"
          onClick={() => {
            setSidebarOpen(false)
            logout()
            router.push("/")
          }}
          className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <LogOut className="size-4" />
          {t.app.common.logout}
        </button>
      </aside>

      {/* Quiz content - centered with max-width */}
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}