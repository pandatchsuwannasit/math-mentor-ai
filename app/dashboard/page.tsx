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
  Sparkles,
  BookMarked,
  Heart,
  Zap,
  ChevronRight,
  Brain,
  ArrowRight,
  Star,
  GraduationCap,
  Timer,
  Trophy,
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardShell } from "@/components/dashboard-shell"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/components/language-provider"
import { useGamification } from "@/hooks/use-gamification"
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
import { getAllLessonProgress, getNextLesson } from "@/lib/lesson-bank"
import { DashboardCharts } from "@/components/dashboard-charts"
import { AICoachCard } from "@/components/ai-coach-card"
import { WeakTopicsCard } from "@/components/weak-topics-card"
import { StrongTopicsCard } from "@/components/strong-topics-card"
import { DailyPlanCard } from "@/components/daily-plan-card"
import { ForecastCard } from "@/components/forecast-card"
import { MistakeCard } from "@/components/mistake-card"
import { ReviewCard } from "@/components/review-card"
import { SkillCard } from "@/components/skill-card"
import { LearningMemoryCard } from "@/components/learning-memory-card"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardShell>
        <DashboardContent />
      </DashboardShell>
    </AuthGuard>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  accent,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  color: string
  accent: string
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#1E293B] bg-[#0F172A]/80 p-4 transition-all duration-300 hover:border-[#334155] hover:shadow-lg hover:shadow-black/20 card-hover">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[#64748B]">{label}</p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-[#F8FAFC]">{value}</p>
        </div>
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
          <Icon className="size-5 text-white" />
        </div>
      </div>
    </div>
  )
}

function QuickActionCard({
  title,
  description,
  href,
  icon: Icon,
  gradient,
  badge,
}: {
  title: string
  description: string
  href: string
  icon: React.ElementType
  gradient: string
  badge?: string
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-[#1E293B] bg-[#0F172A]/80 p-5 transition-all duration-300 hover:border-[#334155] hover:shadow-lg hover:shadow-black/20 card-hover"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
            <Icon className="size-6 text-white" />
          </div>
          {badge && (
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/20">
              {badge}
            </span>
          )}
        </div>
        <h3 className="text-base font-semibold text-[#F8FAFC] group-hover:text-cyan-400 transition-colors">{title}</h3>
        <p className="mt-1 text-sm text-[#64748B]">{description}</p>
        <div className="mt-4 flex items-center gap-1 text-xs font-medium text-cyan-400 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1">
          <span>Go now</span>
          <ArrowRight className="size-3.5" />
        </div>
      </div>
    </Link>
  )
}

function ActivityCard({
  activity,
  t,
}: {
  activity: { id: string; title: string; status: string; questions: number; date: string; score?: number; completed: number }
  t: any
}) {
  return (
    <div className="group rounded-2xl border border-[#1E293B] bg-[#0F172A]/60 p-4 transition-all duration-200 hover:border-[#334155] hover:bg-[#0F172A] card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[#F8FAFC] truncate">{activity.title}</h3>
            {activity.status === "completed" ? (
              <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
            ) : (
              <span className="shrink-0 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400 ring-1 ring-amber-500/20">
                {t.app.dashboardPage.activeLabel}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-[#64748B]">
            {activity.questions} {t.app.common.questions} · {activity.date}
          </p>
        </div>
        {activity.status === "completed" && activity.score !== undefined ? (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
            <span className="text-lg font-bold text-emerald-400">{activity.score}%</span>
          </div>
        ) : (
          <div className="text-right shrink-0">
            <p className="text-xs text-[#64748B]">{activity.completed}/{activity.questions}</p>
            <p className="text-[10px] text-[#64748B]">{t.app.common.completed}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function DashboardContent() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const { xp, level, levelProgress, hearts, streak } = useGamification()
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

  const allLessonProgress = getAllLessonProgress()
  const studyingLessonId = Object.entries(allLessonProgress).find(([, p]) => p.status === "studying")?.[0]
  const lastCompletedLessonId = Object.entries(allLessonProgress).find(([, p]) => p.status === "completed")?.[0]
  const recommendedLessonId = studyingLessonId || lastCompletedLessonId || currentTopics[0]?.id

  return (
    <div className="space-y-8">
      {/* ===== WELCOME SECTION ===== */}
      <section className="relative overflow-hidden rounded-3xl border border-[#1E293B] bg-gradient-to-br from-[#0F172A] via-[#0F172A] to-cyan-500/5 p-6 sm:p-8">
        {/* Background decoration */}
        <div className="absolute -top-24 -right-24 size-64 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 size-48 rounded-full bg-gradient-to-br from-violet-500/5 to-cyan-500/5 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400 ring-1 ring-cyan-500/20">
                <Sparkles className="size-3" />
                {t.app.dashboardPage.eyebrow}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                <TrendingUp className="size-3" />
                {stats.streak} day streak
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#F8FAFC] sm:text-4xl">
              {t.app.dashboardPage.welcome(user.fullName.split(" ")[0])}
            </h1>
            <p className="mt-2 max-w-xl text-base text-[#64748B] leading-relaxed">
              {curriculumLabel} · {onboarding.learningGoal}
            </p>
          </div>

          <div className="flex gap-3">
            {recommendedLessonId && (
              <Link
                href={`/lesson/${recommendedLessonId}`}
                className="btn-primary inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-[1.02]"
              >
                <BookOpen className="size-4" />
                Continue Learning
                <ChevronRight className="size-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Level & XP Bar */}
        <div className="relative mt-6 rounded-2xl border border-[#1E293B] bg-[#0B1121]/60 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/20">
                <Zap className="size-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#64748B]">Level</span>
                  <span className="text-2xl font-bold text-[#F8FAFC]">{level}</span>
                </div>
                <p className="text-sm font-semibold text-cyan-400">{xp.toLocaleString()} XP</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[#F59E0B]">
                <Flame className="size-5" />
                <span className="text-base font-bold">{streak}</span>
                <span className="text-sm text-[#64748B]">days</span>
              </div>
              <div className="flex items-center gap-2 text-[#EF4444]">
                <Heart className="size-5" />
                <span className="text-base font-bold">{hearts}</span>
                <span className="text-sm text-[#64748B]">/5</span>
              </div>
              <div className="flex items-center gap-2 text-[#22C55E]">
                <Trophy className="size-5" />
                <span className="text-sm font-semibold text-[#F8FAFC]">{completedTopics}/{currentTopics.length}</span>
                <span className="text-sm text-[#64748B]">topics</span>
              </div>
            </div>
          </div>
          {levelProgress && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#64748B]">Next level</span>
                <span className="text-xs text-[#64748B]">{levelProgress.current.toLocaleString()} / {levelProgress.next.toLocaleString()} XP</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[#1E293B] ring-1 ring-inset ring-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 shadow-sm shadow-cyan-500/20"
                  style={{ width: `${levelProgress.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== STATISTICS CARDS ===== */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-[#F8FAFC]">Today's Progress</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={Target} label={t.app.dashboardPage.overallProgress} value={`${stats.overallProgress}%`} color="from-cyan-500 to-blue-500" accent="from-cyan-500 to-blue-500" />
          <StatCard icon={Timer} label={t.app.dashboardPage.studyTimeLabel} value={formatStudyTime(stats.studyTimeMinutes)} color="from-violet-500 to-purple-500" accent="from-violet-500 to-purple-500" />
          <StatCard icon={GraduationCap} label={t.app.dashboardPage.questionsDoneLabel} value={stats.questionsDone} color="from-emerald-500 to-teal-500" accent="from-emerald-500 to-teal-500" />
          <StatCard icon={Star} label={t.app.dashboardPage.accuracyLabel} value={`${stats.accuracy}%`} color="from-amber-500 to-orange-500" accent="from-amber-500 to-orange-500" />
        </div>
      </section>

      {/* ===== AI STUDY COACH SECTION ===== */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AICoachCard />
        </div>
        <div className="space-y-6">
          <DailyPlanCard />
          <ForecastCard />
        </div>
      </section>

      {/* ===== WEAK/STRONG TOPICS ===== */}
      <section className="grid gap-6 lg:grid-cols-2">
        <WeakTopicsCard />
        <StrongTopicsCard />
      </section>

      {/* ===== LEARNING INTELLIGENCE ===== */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SkillCard />
        </div>
        <div className="space-y-6">
          <MistakeCard />
          <LearningMemoryCard />
        </div>
      </section>

      <section>
        <ReviewCard />
      </section>

      {/* ===== QUICK ACTIONS ===== */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-[#F8FAFC]">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard
            title="Continue Learning"
            description={recommendedLessonId ? "Pick up where you left off" : "Start your first lesson"}
            href={`/lesson/${recommendedLessonId || currentTopics[0]?.id}`}
            icon={BookOpen}
            gradient="from-cyan-500 to-blue-500"
            badge="Continue"
          />
          <QuickActionCard
            title="Practice Quiz"
            description="Test your knowledge with a quiz"
            href="/practice"
            icon={GraduationCap}
            gradient="from-emerald-500 to-teal-500"
          />
          <QuickActionCard
            title="AI Tutor"
            description="Ask AI anything about math"
            href="/dashboard/ai"
            icon={Brain}
            gradient="from-violet-500 to-purple-500"
          />
        </div>
      </section>

      {/* ===== ANALYTICS CHARTS ===== */}
      <section className="rounded-2xl border border-[#1E293B] bg-[#0F172A]/80 p-5 sm:p-6">
        <DashboardCharts user={user} />
      </section>

      {/* ===== SUBJECT MASTERY & OVERVIEW ===== */}
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl border border-[#1E293B] bg-[#0F172A]/80 p-5 sm:p-6">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#F8FAFC]">{t.app.dashboardPage.learningProgress}</h2>
              <p className="text-sm text-[#64748B]">{t.app.dashboardPage.performanceLast7Days}</p>
            </div>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
              <TrendingUp className="size-3.5" />
              {t.app.dashboardPage.gettingStarted}
            </span>
          </div>

          {/* Progress Chart */}
          <div className="mb-6 rounded-xl border border-[#1E293B] bg-[#0B1121]/60 p-4">
            <div className="relative">
              <svg viewBox={`0 0 ${chartW} ${chartH}`} className="h-32 w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="progressFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={areaPath} fill="url(#progressFill)" />
                <path d={linePath} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </div>
            <div className="mt-2 flex justify-between text-xs text-[#64748B]">
              {DAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>

          {/* Subject Mastery */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-[#CBD5E1]">{t.app.dashboardPage.subjectMastery}</h3>
            <div className="space-y-4">
              {onboarding.subjects.map((subject) => {
                const value = stats.subjectProgress[subject] ?? 0
                return (
                  <div key={subject}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="font-medium text-[#CBD5E1]">{subject}</span>
                      <span className="font-semibold text-[#F8FAFC]">{value}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-[#1E293B] ring-1 ring-inset ring-white/5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getSubjectColor(subject)}`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Learning Profile */}
        <section className="rounded-2xl border border-[#1E293B] bg-[#0F172A]/80 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-[#F8FAFC]">{t.app.dashboardPage.quickOverview}</h2>
          <p className="mt-1 text-sm text-[#64748B]">{t.app.dashboardPage.learningProfile}</p>

          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-[#1E293B] bg-[#0B1121]/60 p-4 transition-all hover:border-[#334155] card-hover">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 size-5 text-cyan-400" />
                <div>
                  <p className="text-sm font-semibold text-[#F8FAFC]">{t.app.dashboardPage.focusSubjects}</p>
                  <p className="mt-1 text-xs text-[#64748B]">{onboarding.learningGoal}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-[#1E293B] bg-[#0B1121]/60 p-4 transition-all hover:border-[#334155] card-hover">
              <div className="flex items-start gap-3">
                <BookMarked className="mt-0.5 size-5 text-cyan-400" />
                <div>
                  <p className="text-sm font-semibold text-[#F8FAFC]">Current Curriculum</p>
                  <p className="mt-1 text-xs text-[#64748B]">{curriculumLabel}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-[#1E293B] bg-[#0B1121]/60 p-4 transition-all hover:border-[#334155] card-hover">
              <div className="flex items-start gap-3">
                <BookOpen className="mt-0.5 size-5 text-cyan-400" />
                <div>
                  <p className="text-sm font-semibold text-[#F8FAFC]">{t.app.dashboardPage.focusSubjects}</p>
                  <p className="mt-1 text-xs text-[#64748B]">{onboarding.subjects.join(", ")}</p>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/practice"
            className="btn-primary mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 p-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-500/30"
          >
            {t.app.dashboardPage.startPractice}
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </div>

      {/* ===== RECENT ACTIVITIES ===== */}
      <section className="rounded-2xl border border-[#1E293B] bg-[#0F172A]/80 p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#F8FAFC]">{t.app.dashboardPage.recentActivities}</h2>
            <p className="text-sm text-[#64748B]">{t.app.dashboardPage.latestPracticeSessions}</p>
          </div>
          <Link
            href="/progress"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300"
          >
            {t.app.dashboardPage.viewProgress}
            <BarChart3 className="size-4" />
          </Link>
        </div>

        {activities.length === 0 ? (
          <div className="rounded-xl border border-[#1E293B] bg-[#0B1121]/60 p-8 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-cyan-500/10 mb-4">
              <BookOpen className="size-8 text-cyan-400" />
            </div>
            <p className="text-sm text-[#64748B]">{t.app.dashboardPage.noActivities}</p>
            <Link
              href="/practice"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20"
            >
              {t.app.dashboardPage.goToPractice}
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} t={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}