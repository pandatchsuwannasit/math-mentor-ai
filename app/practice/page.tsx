"use client"

import Link from "next/link"
import { BookOpen, Clock, Target, Sparkles, CheckCircle2, Lock } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardShell } from "@/components/dashboard-shell"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/components/language-provider"
import { getSubjectBgTint, getSubjectColor, getSubjectTextColor, innerCardClassName, panelClassName } from "@/lib/dashboard-utils"
import { getCurriculumTopicsForLevel, CURRICULUM_LABELS, gradeToCurriculum } from "@/lib/curriculum"
import { getLessonProgress, getNextLesson, getPreviousLesson } from "@/lib/lesson-bank"

export default function PracticePage() {
  return (
    <AuthGuard>
      <DashboardShell>
        <PracticeContent />
      </DashboardShell>
    </AuthGuard>
  )
}

function PracticeContent() {
  const { user } = useAuth()
  const { t } = useLanguage()
  if (!user?.onboarding?.completed) return null

  const { onboarding } = user
  const currentCurriculum = onboarding.currentCurriculum || gradeToCurriculum(onboarding.grade)
  const topics = getCurriculumTopicsForLevel(currentCurriculum)

  return (
    <>
      <div className="mb-6">
        <p className="text-sm font-medium text-cyan-400">{t.app.practicePage.eyebrow}</p>
        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
          {t.app.practicePage.title}
        </h1>
        <p className="mt-2 text-slate-400">
          หลักสูตร: {CURRICULUM_LABELS[currentCurriculum]}
        </p>
      </div>

      {/* Learning Path */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">เส้นทางการเรียน</h2>
        <p className="mt-1 text-sm text-slate-400">เรียนตามลำดับเพื่อผลลัพธ์ที่ดีที่สุด</p>
      </div>

      <div className="mb-8 space-y-3">
        {topics.map((topic, index) => {
          const lessonProgress = getLessonProgress(topic.id)
          const isCompleted = lessonProgress?.status === "completed"
          const isStudying = lessonProgress?.status === "studying"
          const prevTopic = index > 0 ? topics[index - 1] : null
          const prevCompleted = prevTopic ? getLessonProgress(prevTopic.id)?.status === "completed" : true
          const isLocked = !prevCompleted && index > 0

          return (
            <div
              key={topic.id}
              className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                isCompleted
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : isStudying
                    ? "border-cyan-500/30 bg-cyan-500/5"
                    : isLocked
                      ? "border-slate-700 bg-slate-800/30 opacity-60"
                      : "border-slate-700 bg-slate-800/50"
              }`}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full">
                {isCompleted ? (
                  <span className="text-2xl">✅</span>
                ) : isStudying ? (
                  <span className="text-2xl">📖</span>
                ) : isLocked ? (
                  <Lock className="size-5 text-slate-500" />
                ) : (
                  <span className="text-lg text-slate-400">{index + 1}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-semibold ${isLocked ? "text-slate-500" : "text-white"}`}>
                  {topic.title}
                </h3>
                <p className="mt-0.5 text-xs text-slate-400">{topic.description}</p>
              </div>

              <div className="flex shrink-0 gap-2">
                {!isLocked && (
                  <Link
                    href={`/lesson/${topic.id}`}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      isCompleted
                        ? "border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                        : "border border-slate-600 text-white hover:bg-slate-800"
                    }`}
                  >
                    {isCompleted ? "เรียนแล้ว" : "เรียน"}
                  </Link>
                )}
                {!isLocked && (
                  <Link
                    href={`/quiz/${topic.id}`}
                    className="rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-cyan-400"
                  >
                    โจทย์
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <section className={`mt-6 ${panelClassName}`}>
        <h2 className="text-lg font-semibold text-white">{t.app.practicePage.tipsTitle}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className={innerCardClassName}>
            <Clock className="mb-2 size-5 text-cyan-400" />
            <p className="text-sm font-medium text-white">{t.app.practicePage.studyDaily}</p>
            <p className="mt-1 text-xs text-slate-400">
              {t.app.practicePage.studyDailyDescription}
            </p>
          </div>
          <div className={innerCardClassName}>
            <Target className="mb-2 size-5 text-cyan-400" />
            <p className="text-sm font-medium text-white">{t.app.practicePage.focusWeakAreas}</p>
            <p className="mt-1 text-xs text-slate-400">
              {t.app.practicePage.focusWeakAreasDescription(user.onboarding.learningGoal)}
            </p>
          </div>
          <div className={innerCardClassName}>
            <Sparkles className="mb-2 size-5 text-cyan-400" />
            <p className="text-sm font-medium text-white">{t.app.practicePage.aiAdapts}</p>
            <p className="mt-1 text-xs text-slate-400">
              {t.app.practicePage.aiAdaptsDescription}
            </p>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="mt-4 inline-block text-sm font-medium text-cyan-400 hover:text-cyan-300"
        >
          {t.app.practicePage.backToDashboard}
        </Link>
      </section>
    </>
  )
}
