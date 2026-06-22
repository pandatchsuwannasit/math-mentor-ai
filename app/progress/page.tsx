"use client"

import { TrendingUp, Clock, Target, Flame, HelpCircle } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardShell } from "@/components/dashboard-shell"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/components/language-provider"
import { formatStudyTime } from "@/lib/auth"
import {
  buildLinePath,
  DAYS,
  getSubjectColor,
  innerCardClassName,
  panelClassName,
  PROGRESS_POINTS,
} from "@/lib/dashboard-utils"

export default function ProgressPage() {
  return (
    <AuthGuard>
      <DashboardShell>
        <ProgressContent />
      </DashboardShell>
    </AuthGuard>
  )
}

function ProgressContent() {
  const { user } = useAuth()
  const { t } = useLanguage()
  if (!user?.onboarding?.completed) return null

  const { stats, onboarding } = user
  const chartW = 400
  const chartH = 120
  const linePath = buildLinePath(PROGRESS_POINTS, chartW, chartH)
  const areaPath = `${linePath} L${chartW},${chartH} L0,${chartH} Z`

  const statCards = [
    {
      label: t.app.progressPage.questionsDoneLabel,
      value: String(stats.questionsDone),
      icon: HelpCircle,
      color: "text-cyan-400",
    },
    {
      label: t.app.progressPage.studyTimeLabel,
      value: formatStudyTime(stats.studyTimeMinutes),
      icon: Clock,
      color: "text-emerald-400",
    },
    {
      label: t.app.progressPage.accuracyLabel,
      value: `${stats.accuracy}%`,
      icon: Target,
      color: "text-violet-400",
    },
    {
      label: t.app.progressPage.streakLabel,
      value: `${stats.streak} ${t.app.common.days}`,
      icon: Flame,
      color: "text-orange-400",
    },
  ]

  return (
    <>
      <div className="mb-6">
        <p className="text-sm font-medium text-cyan-400">{t.app.progressPage.eyebrow}</p>
        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
          {t.app.progressPage.title}
        </h1>
        <p className="mt-2 text-slate-400">
          {t.app.progressPage.description(onboarding.subjects.join(", "))}
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className={innerCardClassName}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">{card.label}</span>
              <card.icon className={`size-4 ${card.color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={panelClassName}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {t.app.progressPage.weeklyProgress}
            </h2>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
              <TrendingUp className="size-3.5" />
              {stats.overallProgress}% {t.app.progressPage.overallProgressLabel}
            </span>
          </div>
          <div className={innerCardClassName}>
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="h-32 w-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="progressPageFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#progressPageFill)" />
              <path
                d={linePath}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              {DAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>
        </section>

        <section className={panelClassName}>
          <h2 className="mb-4 text-lg font-semibold text-white">
            {t.app.progressPage.subjectBreakdown}
          </h2>
          <div className="space-y-4">
            {onboarding.subjects.map((subject) => {
              const value = stats.subjectProgress[subject] ?? 0
              return (
                <div key={subject}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-slate-300">{subject}</span>
                    <span className="font-medium text-white">{value}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className={`h-full rounded-full ${getSubjectColor(subject)}`}
                      style={{ width: `${Math.max(value, 2)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      <section className={`mt-6 ${panelClassName}`}>
        <h2 className="text-lg font-semibold text-white">{t.app.progressPage.learningProfile}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className={innerCardClassName}>
            <p className="text-xs text-slate-400">{t.app.progressPage.gradeLabel}</p>
            <p className="mt-1 font-medium text-white">{onboarding.grade}</p>
          </div>
          <div className={innerCardClassName}>
            <p className="text-xs text-slate-400">{t.app.progressPage.goalLabel}</p>
            <p className="mt-1 font-medium text-white">
              {onboarding.learningGoal}
            </p>
          </div>
          <div className={innerCardClassName}>
            <p className="text-xs text-slate-400">{t.app.common.subjects}</p>
            <p className="mt-1 font-medium text-white">
              {t.app.progressPage.selectedCount(onboarding.subjects.length)}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
