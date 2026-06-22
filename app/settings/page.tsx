"use client"

import { useRouter } from "next/navigation"
import { Bell, Shield, Trash2, LogOut } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardShell } from "@/components/dashboard-shell"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/components/language-provider"
import { innerCardClassName, panelClassName } from "@/lib/dashboard-utils"

export default function SettingsPage() {
  return (
    <AuthGuard>
      <DashboardShell>
        <SettingsContent />
      </DashboardShell>
    </AuthGuard>
  )
}

function SettingsContent() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { t } = useLanguage()

  if (!user) return null

  function handleLogout() {
    logout()
    router.push("/")
  }

  const settingsSections = [
    {
      icon: Bell,
      title: t.app.settingsPage.notifications,
      description: t.app.settingsPage.notificationsDescription,
      action: t.app.common.comingSoon,
    },
    {
      icon: Shield,
      title: t.app.settingsPage.privacy,
      description: t.app.settingsPage.privacyDescription,
      action: t.app.common.localStorage,
    },
    {
      icon: Trash2,
      title: t.app.settingsPage.clearData,
      description: t.app.settingsPage.clearDataDescription,
      action: t.app.common.comingSoon,
    },
  ]

  return (
    <>
      <div className="mb-6">
        <p className="text-sm font-medium text-cyan-400">{t.app.settingsPage.eyebrow}</p>
        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
          {t.app.settingsPage.title}
        </h1>
        <p className="mt-2 text-slate-400">
          {t.app.settingsPage.description}
        </p>
      </div>

      <section className={`mb-6 ${panelClassName}`}>
        <h2 className="text-lg font-semibold text-white">{t.app.settingsPage.account}</h2>
        <div className={`mt-4 ${innerCardClassName}`}>
          <p className="text-sm text-white">{user.fullName}</p>
          <p className="mt-1 text-xs text-slate-400">{user.email}</p>
        </div>
      </section>

      <section className={`mb-6 ${panelClassName}`}>
        <h2 className="mb-4 text-lg font-semibold text-white">{t.app.settingsPage.preferences}</h2>
        <div className="space-y-3">
          {settingsSections.map((section) => (
            <div
              key={section.title}
              className={`flex items-start gap-4 ${innerCardClassName}`}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                <section.icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white">{section.title}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {section.description}
                </p>
              </div>
              <span className="shrink-0 text-xs text-slate-500">
                {section.action}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={panelClassName}>
        <h2 className="mb-4 text-lg font-semibold text-white">{t.app.settingsPage.session}</h2>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-600 p-3 text-white transition-colors hover:bg-slate-800 sm:w-auto sm:px-6"
        >
          <LogOut className="size-4" />
          {t.app.common.logout}
        </button>
        <p className="mt-3 text-xs text-slate-500">
          {t.app.settingsPage.logoutDescription}
        </p>
      </section>
    </>
  )
}
