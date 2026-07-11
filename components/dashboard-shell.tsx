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
  ChevronLeft,
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
  const [collapsed, setCollapsed] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  function handleLogout() {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-[#0B1121]">
      {/* Mobile header */}
      <header className="sticky top-0 z-40 border-b border-[#1E293B] bg-[#0F172A]/95 backdrop-blur-sm lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/20">
              <Brain className="size-5" />
            </span>
            <span className="text-base font-semibold text-[#F8FAFC]">
              Math Mentor <span className="text-cyan-400">AI</span>
            </span>
          </Link>
          <button
            type="button"
            aria-label={t.app.shell.toggleMenu}
            onClick={() => setMobileOpen((open) => !open)}
            className="flex size-10 items-center justify-center rounded-xl text-[#94A3B8] hover:bg-[#1E293B] transition-colors"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <button
            type="button"
            aria-label={t.app.shell.closeMenu}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 border-r border-[#1E293B] bg-[#0F172A] p-5 animate-in slide-in-from-left duration-300">
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
        <aside
          className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-[#1E293B] bg-[#0F172A] lg:flex transition-all duration-300 ease-in-out ${
            collapsed ? 'w-[72px]' : 'w-64'
          }`}
        >
          {/* Logo */}
          <div className={`flex items-center border-b border-[#1E293B] px-4 py-5 ${collapsed ? 'justify-center' : 'px-5'}`}>
            <Link href="/dashboard" className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-white/10">
                <Brain className="size-5" />
              </span>
              {!collapsed && (
                <span className="text-lg font-bold tracking-tight text-[#F8FAFC]">
                  Math <span className="text-cyan-400">Mentor</span>
                </span>
              )}
            </Link>
          </div>

          <NavContent
            pathname={pathname}
            userName={user?.fullName}
            isGuest={user?.isGuest}
            initial={getInitial(user)}
            onLogout={handleLogout}
            collapsed={collapsed}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
          />

          {/* Collapse button */}
          <div className="border-t border-[#1E293B] px-3 py-3">
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-[#64748B] transition-all duration-200 hover:bg-[#1E293B] hover:text-[#F8FAFC]"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft className={`size-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
              {!collapsed && <span>Collapse</span>}
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 animate-in fade-in duration-500">
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
  collapsed = false,
  hoveredItem,
  setHoveredItem,
}: {
  pathname: string
  userName?: string
  isGuest?: boolean
  initial: string
  onNavigate?: () => void
  onLogout: () => void
  collapsed?: boolean
  hoveredItem?: string | null
  setHoveredItem?: (id: string | null) => void
}) {
  const { t } = useLanguage()

  const NAV_ITEMS = [
    { id: "dashboard", href: "/dashboard", label: t.app.shell.nav.dashboard, icon: LayoutDashboard },
    { id: "practice", href: "/practice", label: t.app.shell.nav.practice, icon: PencilRuler },
    { id: "study-plan", href: "/study-plan", label: "Study Plan", icon: Calendar },
    { id: "curriculum", href: "/curriculum", label: "Curriculum", icon: BookOpen },
    { id: "progress", href: "/progress", label: t.app.shell.nav.progress, icon: TrendingUp },
    { id: "profile", href: "/profile", label: t.app.shell.nav.profile, icon: User },
    { id: "ai-tutor", href: "/dashboard/ai", label: "AI Tutor", icon: Brain },
    { id: "settings", href: "/settings", label: t.app.shell.nav.settings, icon: Settings },
  ]

  return (
    <>
      {/* User profile card */}
      {!collapsed && (
        <div className="mx-3 mt-4 mb-5">
          <div className="group flex items-center gap-3 rounded-2xl border border-[#1E293B] bg-[#0B1121]/60 p-3 transition-all duration-200 hover:border-[#334155] hover:bg-[#0B1121]">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#F8FAFC]">{userName}</p>
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-[#64748B]">{t.app.common.student}</span>
                {isGuest && (
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                    {t.app.common.guestMode}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex flex-1 flex-col gap-1 px-3 pb-4">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          const isHovered = hoveredItem === item.id
          return (
            <div key={item.id} className="relative">
              <Link
                href={item.href}
                onClick={onNavigate}
                onMouseEnter={() => setHoveredItem?.(item.id)}
                onMouseLeave={() => setHoveredItem?.(null)}
                className={`group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 ${
                  collapsed ? 'justify-center gap-0 px-2 py-3' : 'gap-3 px-3 py-2.5'
                } ${
                  active
                    ? "bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-400 shadow-sm"
                    : "text-[#64748B] hover:bg-[#1E293B]/80 hover:text-[#F8FAFC]"
                }`}
              >
                {/* Active indicator */}
                {active && (
                  <span className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-cyan-400 to-blue-500 shadow-sm shadow-cyan-500/30" />
                )}

                {/* Icon */}
                <item.icon
                  className={`shrink-0 transition-all duration-200 ${
                    collapsed ? 'size-6' : 'size-5'
                  } ${
                    active
                      ? ''
                      : 'group-hover:scale-110 group-hover:text-[#F8FAFC]'
                  }`}
                />

                {/* Label */}
                {!collapsed && <span>{item.label}</span>}

                {/* Tooltip on collapsed */}
                {collapsed && isHovered && (
                  <div className="absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg bg-[#1E293B] px-3 py-2 text-sm font-medium text-[#F8FAFC] shadow-xl ring-1 ring-white/10 animate-in fade-in slide-in-from-left-2 duration-150">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1E293B]" />
                  </div>
                )}
              </Link>
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-[#1E293B] px-3 py-3">
        <button
          type="button"
          onClick={() => {
            onNavigate?.()
            onLogout()
          }}
          onMouseEnter={() => setHoveredItem?.("logout")}
          onMouseLeave={() => setHoveredItem?.(null)}
          className={`group relative flex w-full items-center rounded-xl text-sm font-medium text-[#64748B] transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 ${
            collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5'
          }`}
        >
          <LogOut className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${collapsed ? 'size-6' : 'size-5'}`} />
          {!collapsed && <span>{t.app.common.logout}</span>}
          {collapsed && hoveredItem === "logout" && (
            <div className="absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg bg-[#1E293B] px-3 py-2 text-sm font-medium text-red-400 shadow-xl ring-1 ring-white/10 animate-in fade-in slide-in-from-left-2 duration-150">
              {t.app.common.logout}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1E293B]" />
            </div>
          )}
        </button>
      </div>
    </>
  )
}