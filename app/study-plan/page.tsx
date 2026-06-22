"use client"

import { BookOpen, Calendar, Clock, Target, TrendingUp } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardShell } from "@/components/dashboard-shell"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/components/language-provider"
import { formatStudyTime } from "@/lib/auth"
import { innerCardClassName, panelClassName } from "@/lib/dashboard-utils"

export default function StudyPlanPage() {
  return (
    <AuthGuard>
      <DashboardShell>
        <StudyPlanContent />
      </DashboardShell>
    </AuthGuard>
  )
}

function StudyPlanContent() {
  const { user } = useAuth()
  const { t } = useLanguage()
  if (!user?.onboarding?.completed) return null

  const { onboarding, stats } = user

  const weekDays = [
    t.app.studyPlanPage.monday,
    t.app.studyPlanPage.tuesday,
    t.app.studyPlanPage.wednesday,
    t.app.studyPlanPage.thursday,
    t.app.studyPlanPage.friday,
    t.app.studyPlanPage.saturday,
    t.app.studyPlanPage.sunday,
  ]

  const dailyGoalMinutes = 30

  return (
    <>
      <div className="mb-6">
        <p className="text-sm font-medium text-cyan-400">{t.app.studyPlanPage.eyebrow}</p>
        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
          {t.app.studyPlanPage.title}
        </h1>
        <p className="mt-2 text-slate-400">
          {t.app.studyPlanPage.description}
        </p>
      </div>

      {/* Stats overview */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className={innerCardClassName}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">{t.app.studyPlanPage.dailyGoal}</span>
            <Clock className="size-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white">{dailyGoalMinutes}{t.app.studyPlanPage.minutesLabel}</p>
        </div>
        <div className={innerCardClassName}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">{t.app.common.questionsDone}</span>
            <BookOpen className="size-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.questionsDone}</p>
        </div>
        <div className={innerCardClassName}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">{t.app.common.studyTime}</span>
            <TrendingUp className="size-4 text-violet-400" />
          </div>
          <p className="text-2xl font-bold text-white">{formatStudyTime(stats.studyTimeMinutes)}</p>
        </div>
        <div className={innerCardClassName}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">{t.app.common.accuracy}</span>
            <Target className="size-4 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.accuracy}%</p>
        </div>
      </div>

      {/* Weekly Schedule */}
      <section className={panelClassName}>
        <h2 className="mb-4 text-lg font-semibold text-white">{t.app.studyPlanPage.weeklySchedule}</h2>
        <div className="grid gap-3 sm:grid-cols-7">
          {weekDays.map((day, index) => {
            const isActive = index < 5
            return (
              <div
                key={day}
                className={`rounded-xl border p-3 text-center transition-colors ${
                  isActive
                    ? "border-cyan-500/30 bg-cyan-500/10"
                    : "border-slate-700 bg-slate-800/50"
                }`}
              >
                <p className="text-xs font-medium text-slate-400">{day}</p>
                <div className="mt-2 space-y-1">
                  {isActive ? (
                    <>
                      <div className="rounded bg-cyan-500/20 px-2 py-1 text-[10px] text-cyan-400">
                        {dailyGoalMinutes}{t.app.studyPlanPage.minutesLabel}
                      </div>
                      <div className="rounded bg-emerald-500/20 px-2 py-1 text-[10px] text-emerald-400">
                        {onboarding.subjects[0]}
                      </div>
                    </>
                  ) : (
                    <p className="text-[10px] text-slate-600">{t.app.common.comingSoon}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Subjects overview */}
      <section className={`mt-6 ${panelClassName}`}>
        <h2 className="mb-4 text-lg font-semibold text-white">{t.app.studyPlanPage.myStudyPlan}</h2>
        <div className="space-y-3">
          {onboarding.subjects.map((subject) => {
            const progress = stats.subjectProgress[subject] ?? 0
            return (
              <div key={subject} className={innerCardClassName}>
                <div className="flex items-center gap-3">
                  <Calendar className="size-5 text-cyan-400" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">{subject}</p>
                      <span className="text-xs text-slate-400">{progress}%</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-700">
                      <div
                        className="h-full rounded-full bg-cyan-500 transition-all"
                        style={{ width: `${Math.max(progress, 2)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}