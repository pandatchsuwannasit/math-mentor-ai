"use client"

import Link from "next/link"
import { BookOpen, Clock, Target, Sparkles } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardShell } from "@/components/dashboard-shell"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/components/language-provider"
import { getSubjectBgTint, getSubjectColor, getSubjectTextColor, innerCardClassName, panelClassName } from "@/lib/dashboard-utils"
import { getCurriculumTopicsForLevel, CURRICULUM_LABELS, gradeToCurriculum } from "@/lib/curriculum"

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => {
          const progress = user.stats.subjectProgress[topic.subject] ?? 0
          return (
            <article key={topic.id} className={panelClassName}>
              <span
                className={`mb-4 flex size-12 items-center justify-center rounded-xl ${getSubjectBgTint(topic.subject)}`}
              >
                <BookOpen className={`size-6 ${getSubjectTextColor(topic.subject)}`} />
              </span>
              <h2 className="text-lg font-semibold text-white">{topic.title}</h2>
              <p className="mt-1 text-sm text-slate-400">
                {topic.description}
              </p>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-slate-400">{t.app.common.mastery}</span>
                  <span className="text-white">{progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                  <div
                    className={`h-full rounded-full ${getSubjectColor(topic.subject)}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <Link
                href={`/quiz/${topic.id}`}
                className="mt-5 block w-full rounded-lg bg-cyan-500 p-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-400 text-center"
              >
                {t.app.practicePage.startQuiz}
              </Link>
            </article>
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
