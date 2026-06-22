"use client"

import Link from "next/link"
import {
  TrendingUp,
  Clock,
  Target,
  Flame,
  BookOpen,
  BarChart3,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  BookMarked,
} from "lucide-react"
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
import { CURRICULUM_LABELS, gradeToCurriculum, getCurriculumTopicsForLevel } from "@/lib/curriculum"
import { getAllTopicProgress } from "@/lib/question-bank"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardShell>
        <DashboardContent />
      </DashboardShell>
    </AuthGuard>
  )
}

function DashboardContent() {
  const { user } = useAuth()
  const { t } = useLanguage()
  if (!user?.onboarding?.completed) return null

  const { onboarding, stats, activities } = user
  const chartW = 400
  const chartH = 120
  const linePath = buildLinePath(PROGRESS_POINTS, chartW, chartH)
  const areaPath = `${linePath} L${chartW},${chartH} L0,${chartH} Z`

  const currentCurriculum = onboarding.currentCurriculum || gradeToCurriculum(onboarding.grade)
  const curriculumLabel = CURRICULUM_LABELS[currentCurriculum]
  const currentTopics = getCurriculumTopicsForLevel(currentCurriculum)
  const topicProgressMap = getAllTopicProgress()
  const completedTopics = currentTopics.filter((t) => topicProgressMap[t.id]?.completed).length
  const topicScores = currentTopics.map((t) => topicProgressMap[t.id]?.bestScore).filter((s): s is number => typeof s === "number")
  const avgTopicScore = topicScores.length > 0 ? Math.round(topicScores.reduce((a, b) => a + b, 0) / topicScores.length) : 0

  return (
    <>
      <section className={`mb-6 sm:mb-8 ${panelClassName} sm:p-8`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-400">{t.app.dashboardPage.eyebrow}</p>
            <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
              {t.app.dashboardPage.welcome(user.fullName.split(" ")[0])}
            </h1>
            <p className="mt-2 max-w-xl text-slate-400">
              หลักสูตร: {curriculumLabel} · {onboarding.learningGoal}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className={`flex items-center gap-2 ${innerCardClassName}`}>
              <BookMarked className="size-5 text-cyan-400" />
              <div>
                <p className="text-xs text-slate-400">หลักสูตรที่กำลังเรียน</p>
                <p className="text-sm font-semibold text-white">
                  {curriculumLabel}
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-2 ${innerCardClassName}`}>
              <CheckCircle2 className="size-5 text-emerald-400" />
              <div>
                <p className="text-xs text-slate-400">หัวข้อที่เรียนแล้ว</p>
                <p className="text-sm font-semibold text-white">
                  {completedTopics} / {currentTopics.length}
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-2 ${innerCardClassName}`}>
              <Flame className="size-5 text-orange-400" />
              <div>
                <p className="text-xs text-slate-400">{t.app.dashboardPage.streakLabel}</p>
                <p className="text-sm font-semibold text-white">
                  {stats.streak} {t.app.common.days}
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-2 ${innerCardClassName}`}>
              <Target className="size-5 text-cyan-400" />
              <div>
                <p className="text-xs text-slate-400">{t.app.dashboardPage.accuracyLabel}</p>
                <p className="text-sm font-semibold text-white">
                  {stats.accuracy}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {onboarding.subjects.map((subject) => (
            <span
              key={subject}
              className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400"
            >
              {subject}
            </span>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className={`lg:col-span-2 ${panelClassName}`}>
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {t.app.dashboardPage.learningProgress}
              </h2>
              <p className="text-sm text-slate-400">
                {t.app.dashboardPage.performanceLast7Days}
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              <TrendingUp className="size-3.5" />
              {t.app.dashboardPage.gettingStarted}
            </span>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className={innerCardClassName}>
              <p className="text-xs text-slate-400">{t.app.dashboardPage.overallProgress}</p>
              <p className="mt-1 text-2xl font-bold text-white">
                {stats.overallProgress}%
              </p>
            </div>
            <div className={innerCardClassName}>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="size-3.5" />
                {t.app.dashboardPage.studyTimeLabel}
              </div>
              <p className="mt-1 text-2xl font-bold text-white">
                {formatStudyTime(stats.studyTimeMinutes)}
              </p>
            </div>
            <div className={`col-span-2 sm:col-span-1 ${innerCardClassName}`}>
              <p className="text-xs text-slate-400">{t.app.dashboardPage.questionsDoneLabel}</p>
              <p className="mt-1 text-2xl font-bold text-white">
                {stats.questionsDone}
              </p>
            </div>
            <div className={innerCardClassName}>
              <p className="text-xs text-slate-400">คะแนนเฉลี่ยหัวข้อ</p>
              <p className="mt-1 text-2xl font-bold text-white">
                {avgTopicScore}%
              </p>
            </div>
          </div>

          <div className={`mb-6 ${innerCardClassName}`}>
            <div className="relative">
              <svg
                viewBox={`0 0 ${chartW} ${chartH}`}
                className="h-28 w-full sm:h-32"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="progressFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={areaPath} fill="url(#progressFill)" />
                <path
                  d={linePath}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              {DAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-slate-300">
              {t.app.dashboardPage.subjectMastery}
            </h3>
            <div className="space-y-3">
              {onboarding.subjects.map((subject) => {
                const value = stats.subjectProgress[subject] ?? 0
                return (
                  <div key={subject}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-slate-300">{subject}</span>
                      <span className="font-medium text-white">{value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                      <div
                        className={`h-full rounded-full ${getSubjectColor(subject)}`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className={panelClassName}>
          <h2 className="text-lg font-semibold text-white">{t.app.dashboardPage.quickOverview}</h2>
          <p className="mt-1 text-sm text-slate-400">{t.app.dashboardPage.learningProfile}</p>

          <div className="mt-5 space-y-3">
            <div className={innerCardClassName}>
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 size-5 text-cyan-400" />
                <div>
                  <p className="text-sm font-medium text-white">{t.app.dashboardPage.focusSubjects}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {onboarding.learningGoal}
                  </p>
                </div>
              </div>
            </div>
            <div className={innerCardClassName}>
              <div className="flex items-start gap-3">
                <BookMarked className="mt-0.5 size-5 text-cyan-400" />
                <div>
                  <p className="text-sm font-medium text-white">หลักสูตรที่กำลังเรียน</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {curriculumLabel}
                  </p>
                </div>
              </div>
            </div>
            <div className={innerCardClassName}>
              <div className="flex items-start gap-3">
                <BookOpen className="mt-0.5 size-5 text-cyan-400" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {t.app.dashboardPage.focusSubjects}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {onboarding.subjects.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/practice"
            className="mt-5 block w-full rounded-lg bg-cyan-500 p-3 text-center text-sm font-semibold text-white transition-colors hover:bg-cyan-400"
          >
            {t.app.dashboardPage.startPractice}
          </Link>
        </section>
      </div>

      <section className={`mt-6 sm:mt-8 ${panelClassName}`}>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {t.app.dashboardPage.recentActivities}
            </h2>
            <p className="text-sm text-slate-400">
              {t.app.dashboardPage.latestPracticeSessions}
            </p>
          </div>
          <Link
            href="/progress"
            className="inline-flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300"
          >
            {t.app.dashboardPage.viewProgress}
            <BarChart3 className="size-4" />
          </Link>
        </div>

        {activities.length === 0 ? (
          <div className={`text-center ${innerCardClassName}`}>
            <p className="text-sm text-slate-400">
              {t.app.dashboardPage.noActivities}
            </p>
            <Link
              href="/practice"
              className="mt-3 inline-block text-sm font-medium text-cyan-400 hover:text-cyan-300"
            >
              {t.app.dashboardPage.goToPractice}
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {activities.map((activity) => (
              <article key={activity.id} className={innerCardClassName}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-medium text-white">
                    {activity.title}
                  </h3>
                  {activity.status === "completed" ? (
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
                  ) : (
                    <span className="shrink-0 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                      {t.app.dashboardPage.activeLabel}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {activity.questions} {t.app.common.questions} · {activity.date}
                </p>
                {activity.status === "completed" && activity.score !== undefined ? (
                  <p className="mt-3 text-2xl font-bold text-white">
                    {activity.score}%
                  </p>
                ) : (
                  <p className="mt-3 text-xs text-slate-400">
                    {activity.completed} {t.app.common.of} {activity.questions} {t.app.common.completed}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
