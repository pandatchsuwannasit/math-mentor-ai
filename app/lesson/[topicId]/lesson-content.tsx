"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, BookOpen, CheckCircle2, Clock, PlayCircle, Target, Sparkles, AlertTriangle, Lightbulb, ChevronLeft, ChevronRight, GraduationCap, FileText } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/components/language-provider"
import { useGamification } from "@/hooks/use-gamification"
import { getLesson, markLessonStarted, markLessonCompleted, getLessonProgress, getNextLesson, getPreviousLesson, updateScrollPosition, lessonLoaders } from "@/lib/lesson-bank"
import type { Lesson } from "@/lib/lesson-bank"
import { innerCardClassName, panelClassName } from "@/lib/dashboard-utils"
import { getQuestionsForTopic } from "@/lib/question-bank"
import { getAllCurriculumTopics } from "@/lib/curriculum"

interface LessonContentProps {
  topicId: string
}

export default function LessonContent({ topicId }: LessonContentProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { t } = useLanguage()
  const { awardLessonXP } = useGamification()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCompleteBtn, setShowCompleteBtn] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)

  useEffect(() => {
    const load = async () => {
      const data = await getLesson(topicId)
      setLesson(data)
      if (data) {
        markLessonStarted(topicId)
        const progress = getLessonProgress(topicId)
        setIsCompleted(progress?.status === "completed")
      }
      setIsLoading(false)
    }
    load()
  }, [topicId])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      updateScrollPosition(topicId, scrollTop)
      setReadingProgress(Math.min(progress, 100))
      if (progress > 80 && !isCompleted) setShowCompleteBtn(true)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [topicId, isCompleted])

  if (!user?.onboarding?.completed) return null

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 animate-pulse">
            <BookOpen className="size-8 text-cyan-400" />
          </div>
          <p className="text-sm text-[#64748B]">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    const isDev = process.env.NODE_ENV === "development"
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <AlertTriangle className="mx-auto size-12 text-red-400" />
          <h2 className="mt-4 text-xl font-bold text-[#F8FAFC]">Lesson not found</h2>
          <p className="mt-2 text-[#64748B]">Please check the URL or go back to lessons.</p>
          {isDev && (
            <div className="mt-6 space-y-2 rounded-xl border border-[#1E293B] bg-[#0B1121]/60 p-4 text-left">
              <p className="text-sm font-medium text-red-400">Diagnostics (Development Mode)</p>
              <p className="text-xs text-[#64748B]">Requested Topic ID: <span className="font-mono text-red-300">{topicId}</span></p>
              <p className="text-xs text-[#64748B]">Lesson exists in registry: <span className="text-red-300">{Object.keys(lessonLoaders).includes(topicId) ? "Yes" : "No"}</span></p>
              <p className="text-xs text-[#64748B]">Curriculum topic exists: <span className="text-red-300">{getAllCurriculumTopics().some((t: { id: string }) => t.id === topicId) ? "Yes" : "No"}</span></p>
              <p className="text-xs text-[#64748B]">Question bank exists: <span className="text-red-300">{getQuestionsForTopic(topicId).length > 0 ? "Yes" : "No"}</span></p>
              <p className="text-xs text-[#64748B]">Registered lessons: {Object.keys(lessonLoaders).join(", ")}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  const progress = getLessonProgress(topicId)
  const nextTopic = getNextLesson(topicId)
  const prevTopic = getPreviousLesson(topicId)
  const relatedQuiz = lesson.quizTopicId || topicId

  function handleMarkComplete() {
    markLessonCompleted(topicId)
    awardLessonXP(topicId)
    setIsCompleted(true)
    setShowCompleteBtn(false)
  }

  function difficultyLabel(d: string) {
    if (d === "easy") return "Beginner"
    if (d === "medium") return "Intermediate"
    return "Advanced"
  }

  function difficultyColor(d: string) {
    if (d === "easy") return "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
    if (d === "medium") return "bg-amber-500/10 text-amber-400 ring-amber-500/20"
    return "bg-red-500/10 text-red-400 ring-red-500/20"
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#1E293B]">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 shadow-sm shadow-cyan-500/20"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        {/* ===== HEADER ===== */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400 ring-1 ring-cyan-500/20">
              <FileText className="size-3" />
              {lesson.curriculum}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ring-1 ${difficultyColor(lesson.difficulty)}`}>
              {difficultyLabel(lesson.difficulty)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#1E293B] px-3 py-1 text-xs text-[#64748B]">
              <Clock className="size-3" />
              {lesson.estimatedReadingTime} min
            </span>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                <CheckCircle2 className="size-3" />
                Completed
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#F8FAFC] sm:text-4xl leading-tight">
            {lesson.title}
          </h1>
          <p className="mt-3 text-base text-[#64748B] leading-relaxed max-w-2xl">
            {lesson.description}
          </p>

          {progress?.status === "studying" && progress?.scrollPosition > 0 && (
            <div className="mt-4 flex items-center gap-2 text-xs text-[#64748B]">
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#1E293B]">
                <div className="h-full rounded-full bg-cyan-500" style={{ width: `${readingProgress}%` }} />
              </div>
              <span>{Math.round(readingProgress)}% complete</span>
            </div>
          )}
        </header>

        <div className="space-y-10">
          {/* ===== INTRODUCTION ===== */}
          <section className="rounded-2xl border border-[#1E293B] bg-[#0F172A]/80 p-6 sm:p-8">
            <h2 className="mb-4 text-xl font-semibold text-[#F8FAFC] flex items-center gap-2">
              <BookOpen className="size-5 text-cyan-400" />
              Introduction
            </h2>
            <div className="text-sm leading-relaxed text-[#CBD5E1] space-y-3">
              <p>{lesson.introduction}</p>
            </div>
          </section>

          {/* ===== LEARNING OBJECTIVES ===== */}
          <section className="rounded-2xl border border-[#1E293B] bg-[#0F172A]/80 p-6 sm:p-8">
            <h2 className="mb-5 text-xl font-semibold text-[#F8FAFC] flex items-center gap-2">
              <Target className="size-5 text-cyan-400" />
              Learning Objectives
            </h2>
            <ul className="space-y-3">
              {lesson.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#CBD5E1] leading-relaxed">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-semibold text-cyan-400">
                    {i + 1}
                  </span>
                  {obj}
                </li>
              ))}
            </ul>
          </section>

          {/* ===== CONCEPTS ===== */}
          <section className="rounded-2xl border border-[#1E293B] bg-[#0F172A]/80 p-6 sm:p-8">
            <h2 className="mb-6 text-xl font-semibold text-[#F8FAFC] flex items-center gap-2">
              <Lightbulb className="size-5 text-cyan-400" />
              Key Concepts
            </h2>
            <div className="space-y-6">
              {lesson.concepts.map((concept, i) => (
                <div key={i} className="rounded-xl border border-[#1E293B] bg-[#0B1121]/60 p-5 transition-all hover:border-[#334155] card-hover">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-sm font-bold text-cyan-400">
                      {i + 1}
                    </span>
                    <h3 className="text-base font-semibold text-[#F8FAFC]">{concept.title}</h3>
                  </div>
                  <div className="text-sm leading-relaxed text-[#CBD5E1]">
                    <p>{concept.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===== FORMULAS ===== */}
          {lesson.formulas.length > 0 && (
            <section className="rounded-2xl border border-[#1E293B] bg-[#0F172A]/80 p-6 sm:p-8">
              <h2 className="mb-6 text-xl font-semibold text-[#F8FAFC] flex items-center gap-2">
                <GraduationCap className="size-5 text-cyan-400" />
                Formulas
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {lesson.formulas.map((f, i) => (
                  <div key={i} className="group rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-5 transition-all hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/5 card-hover">
                    <div className="mb-2 font-mono text-base text-cyan-400">{f.formula}</div>
                    <p className="text-xs text-[#64748B]">{f.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ===== EXAMPLES ===== */}
          <section className="rounded-2xl border border-[#1E293B] bg-[#0F172A]/80 p-6 sm:p-8">
            <h2 className="mb-6 text-xl font-semibold text-[#F8FAFC] flex items-center gap-2">
              <FileText className="size-5 text-cyan-400" />
              Worked Examples
            </h2>
            <div className="space-y-6">
              {lesson.examples.map((ex, i) => (
                <div key={i} className="rounded-xl border border-[#1E293B] overflow-hidden">
                  {/* Example Question */}
                  <div className="bg-gradient-to-r from-cyan-500/5 to-blue-500/5 p-5 border-b border-[#1E293B]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="text-xs font-medium text-cyan-400">Example</span>
                    </div>
                    <p className="text-base font-medium text-[#F8FAFC]">{ex.question}</p>
                  </div>
                  {/* Solution */}
                  <div className="bg-[#0B1121]/60 p-5 border-b border-[#1E293B]">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="size-4 text-cyan-400" />
                      <span className="text-xs font-medium text-cyan-400">Solution</span>
                    </div>
                    <p className="text-sm leading-relaxed text-[#CBD5E1]">{ex.solution}</p>
                  </div>
                  {/* Answer */}
                  <div className="bg-emerald-500/5 p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-400" />
                      <span className="text-xs font-medium text-emerald-400">Answer:</span>
                      <span className="text-sm font-semibold text-[#F8FAFC]">{ex.answer}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===== COMMON MISTAKES ===== */}
          {lesson.commonMistakes.length > 0 && (
            <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 sm:p-8">
              <h2 className="mb-5 text-xl font-semibold text-red-400 flex items-center gap-2">
                <AlertTriangle className="size-5" />
                Common Mistakes
              </h2>
              <ul className="space-y-3">
                {lesson.commonMistakes.map((m, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#CBD5E1] leading-relaxed">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-xs font-bold text-red-400">
                      !
                    </span>
                    {m}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ===== SUMMARY ===== */}
          <section className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 p-6 sm:p-8">
            <h2 className="mb-5 text-xl font-semibold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="size-5" />
              Summary
            </h2>
            <ul className="space-y-3">
              {lesson.summary.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#CBD5E1] leading-relaxed">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                  {s}
                </li>
              ))}
            </ul>
          </section>

          {/* ===== RELATED TOPICS ===== */}
          {lesson.relatedTopics.length > 0 && (
            <section className="rounded-2xl border border-[#1E293B] bg-[#0F172A]/80 p-6 sm:p-8">
              <h2 className="mb-4 text-lg font-semibold text-[#F8FAFC]">Related Topics</h2>
              <div className="flex flex-wrap gap-2">
                {lesson.relatedTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => router.push(`/lesson/${topic}`)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#1E293B] px-4 py-2 text-sm text-[#64748B] transition-all duration-200 hover:border-cyan-500/30 hover:bg-cyan-500/5 hover:text-cyan-400 card-hover"
                  >
                    <BookOpen className="size-3.5" />
                    {topic}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* ===== ACTIONS ===== */}
          <div className="space-y-4 pt-4">
            {!isCompleted && showCompleteBtn && (
              <button
                onClick={handleMarkComplete}
                className="btn-primary flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.01]"
              >
                <CheckCircle2 className="size-5" />
                Mark as Complete
              </button>
            )}

            <button
              onClick={() => router.push(`/quiz/${relatedQuiz}`)}
              className="btn-primary flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-[1.01]"
            >
              <PlayCircle className="size-5" />
              Start Practice Quiz
              <ArrowRight className="size-4" />
            </button>

            <div className="flex gap-3">
              {prevTopic && (
                <button
                  onClick={() => router.push(`/lesson/${prevTopic}`)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#1E293B] px-4 py-3 text-sm font-medium text-[#64748B] transition-all duration-200 hover:border-[#334155] hover:text-[#F8FAFC] card-hover"
                >
                  <ChevronLeft className="size-4" />
                  Previous Lesson
                </button>
              )}
              {nextTopic && (
                <button
                  onClick={() => router.push(`/lesson/${nextTopic}`)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#1E293B] px-4 py-3 text-sm font-medium text-[#64748B] transition-all duration-200 hover:border-cyan-500/30 hover:text-cyan-400 card-hover"
                >
                  Next Lesson
                  <ChevronRight className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}