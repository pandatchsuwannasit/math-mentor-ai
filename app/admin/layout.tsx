"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AdminGuard } from "@/components/admin-guard"
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  FileEdit,
  BarChart3,
  Upload,
  Settings,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/lessons", label: "Lessons", icon: BookOpen },
  { href: "/admin/questions", label: "Question Bank", icon: HelpCircle },
  { href: "/admin/question-editor", label: "Question Editor", icon: FileEdit },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/import-export", label: "Import / Export", icon: Upload },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-800 bg-slate-900 transition-transform duration-200 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
            <Link href="/admin" className="text-lg font-bold text-white">
              Admin Panel
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="size-5 text-slate-400" />
            </button>
          </div>

          <nav className="space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="size-5" />
                  {item.label}
                  {isActive && <ChevronRight className="ml-auto size-4" />}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-800 bg-slate-900/95 px-4 backdrop-blur">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="size-6 text-slate-400" />
            </button>
            <div className="ml-auto flex items-center gap-4">
              <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white">
                Back to Dashboard
              </Link>
            </div>
          </header>

          {/* Page content */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </AdminGuard>
  )
}