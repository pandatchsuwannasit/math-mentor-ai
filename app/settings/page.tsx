"use client"

import { useRouter } from "next/navigation"
import { Bell, Shield, Trash2, LogOut, Globe, User, Palette, Moon, Sun, Monitor, ChevronRight, Sparkles, Brain, Info, Mail, BookOpen } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardShell } from "@/components/dashboard-shell"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/components/language-provider"
import { innerCardClassName, panelClassName } from "@/lib/dashboard-utils"
import { useState } from "react"

export default function SettingsPage() {
  return (
    <AuthGuard>
      <DashboardShell>
        <SettingsContent />
      </DashboardShell>
    </AuthGuard>
  )
}

function SettingsCard({
  icon: Icon,
  title,
  description,
  action,
  gradient,
}: {
  icon: React.ElementType
  title: string
  description: string
  action: React.ReactNode
  gradient?: string
}) {
  return (
    <div className="group rounded-2xl border border-[#1E293B] bg-[#0F172A]/80 p-5 transition-all duration-200 hover:border-[#334155] hover:shadow-lg hover:shadow-black/20 card-hover">
      <div className="flex items-start gap-4">
        <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient || 'from-cyan-500/20 to-blue-500/20'} shadow-lg`}>
          <Icon className="size-5 text-cyan-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#F8FAFC]">{title}</p>
          <p className="mt-0.5 text-xs text-[#64748B] leading-relaxed">
            {description}
          </p>
        </div>
        <div className="shrink-0">
          {action}
        </div>
      </div>
    </div>
  )
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-[#1E293B] bg-[#0F172A]/80 p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#F8FAFC]">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-[#64748B]">{description}</p>
        )}
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </section>
  )
}

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-[#0F172A] ${
        enabled ? 'bg-cyan-500' : 'bg-[#334155]'
      }`}
    >
      <span
        className={`inline-block size-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          enabled ? 'translate-x-[22px]' : 'translate-x-[2px]'
        }`}
      />
    </button>
  )
}

function SettingsContent() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { t, lang, setLang } = useLanguage()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [autoPlay, setAutoPlay] = useState(false)

  if (!user) return null

  function handleLogout() {
    logout()
    router.push("/")
  }

  function handleLanguageChange(newLang: "th" | "en") {
    setLang(newLang)
    document.cookie = `mathmentor-language=${newLang};path=/;max-age=31536000`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400 ring-1 ring-cyan-500/20">
            <Sparkles className="size-3" />
            {t.app.settingsPage.eyebrow}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#F8FAFC] sm:text-4xl">
          {t.app.settingsPage.title}
        </h1>
        <p className="mt-2 text-base text-[#64748B]">
          {t.app.settingsPage.description}
        </p>
      </div>

      {/* Account Section */}
      <SettingsSection title={t.app.settingsPage.account} description="Your account information">
        <div className="group rounded-2xl border border-[#1E293B] bg-[#0B1121]/60 p-5 transition-all duration-200 hover:border-[#334155] card-hover">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 text-base font-bold text-white shadow-lg shadow-cyan-500/20">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#F8FAFC]">{user.fullName}</p>
              <p className="mt-0.5 text-xs text-[#64748B]">{user.email}</p>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                Active
              </span>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Language Section */}
      <SettingsSection title="🌐 ภาษา / Language" description="Choose your preferred language">
        <div className="group rounded-2xl border border-[#1E293B] bg-[#0B1121]/60 p-5 transition-all duration-200 hover:border-[#334155] card-hover">
          <div className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 shadow-lg">
              <Globe className="size-5 text-cyan-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#F8FAFC]">ภาษา / Language</p>
              <p className="mt-0.5 text-xs text-[#64748B]">
                {lang === "th" ? "เลือกภาษาที่ต้องการใช้" : "Select your preferred language"}
              </p>
            </div>
            <div className="shrink-0">
              <select
                value={lang}
                onChange={(e) => handleLanguageChange(e.target.value as "th" | "en")}
                className="rounded-xl border border-[#334155] bg-[#1E293B] px-4 py-2.5 text-sm font-medium text-[#F8FAFC] focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 cursor-pointer transition-colors hover:border-[#475569]"
              >
                <option value="th" className="bg-[#1E293B]">🇹🇭 ไทย</option>
                <option value="en" className="bg-[#1E293B]">🇺🇸 English</option>
              </select>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Preferences Section */}
      <SettingsSection title={t.app.settingsPage.preferences} description="Customize your experience">
        <SettingsCard
          icon={Bell}
          title={t.app.settingsPage.notifications}
          description={t.app.settingsPage.notificationsDescription}
          gradient="from-amber-500/20 to-orange-500/20"
          action={<ToggleSwitch enabled={notifications} onChange={setNotifications} />}
        />
        <SettingsCard
          icon={Moon}
          title="Dark Mode"
          description="Use dark theme for the interface"
          gradient="from-violet-500/20 to-purple-500/20"
          action={<ToggleSwitch enabled={darkMode} onChange={setDarkMode} />}
        />
        <SettingsCard
          icon={BookOpen}
          title="Auto-play Lessons"
          description="Automatically proceed to the next lesson"
          gradient="from-emerald-500/20 to-teal-500/20"
          action={<ToggleSwitch enabled={autoPlay} onChange={setAutoPlay} />}
        />
      </SettingsSection>

      {/* Privacy & Data Section */}
      <SettingsSection title="Privacy & Data" description="Manage your data and security">
        <SettingsCard
          icon={Shield}
          title={t.app.settingsPage.privacy}
          description={t.app.settingsPage.privacyDescription}
          gradient="from-cyan-500/20 to-blue-500/20"
          action={
            <span className="inline-flex items-center gap-1 rounded-full bg-[#1E293B] px-3 py-1.5 text-xs font-medium text-[#64748B]">
              {t.app.common.localStorage}
            </span>
          }
        />
        <SettingsCard
          icon={Trash2}
          title={t.app.settingsPage.clearData}
          description={t.app.settingsPage.clearDataDescription}
          gradient="from-red-500/20 to-rose-500/20"
          action={
            <span className="inline-flex items-center gap-1 rounded-full bg-[#1E293B] px-3 py-1.5 text-xs font-medium text-[#64748B]">
              {t.app.common.comingSoon}
            </span>
          }
        />
      </SettingsSection>

      {/* About Section */}
      <SettingsSection title="About" description="Information about Math Mentor AI">
        <SettingsCard
          icon={Brain}
          title="Math Mentor AI"
          description="Version 1.1.0 · AI-powered mathematics learning platform"
          gradient="from-cyan-500/20 to-blue-500/20"
          action={
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
              v1.1.0
            </span>
          }
        />
        <SettingsCard
          icon={Mail}
          title="Contact & Support"
          description="Reach out to our team for help or feedback"
          gradient="from-violet-500/20 to-purple-500/20"
          action={
            <span className="inline-flex items-center gap-1 rounded-full bg-[#1E293B] px-3 py-1.5 text-xs font-medium text-[#64748B]">
              support@mathmentor.ai
            </span>
          }
        />
      </SettingsSection>

      {/* Session Section */}
      <section className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/5 to-red-500/5 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-1">
          <LogOut className="size-4 text-red-400" />
          <h2 className="text-lg font-semibold text-[#F8FAFC]">{t.app.settingsPage.session}</h2>
        </div>
        <p className="mt-1 text-sm text-[#64748B]">
          {t.app.settingsPage.logoutDescription}
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleLogout}
            className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.02]"
          >
            <LogOut className="size-4" />
            {t.app.common.logout}
          </button>
          <span className="text-xs text-[#64748B]">
            You will be signed out and redirected to the home page.
          </span>
        </div>
      </section>
    </div>
  )
}