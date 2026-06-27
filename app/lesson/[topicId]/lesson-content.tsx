"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, BookOpen, CheckCircle2, Clock, PlayCircle, Target } from "lucide-react"
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
      if (progress > 80 && !isCompleted) setShowCompleteBtn(true)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [topicId, isCompleted])

  if (!user?.onboarding?.completed) return null

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto size-12 animate-pulse text-cyan-400" />
          <p className="mt-4 text-sm text-slate-400">กำลังโหลดบทเรียน...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    const isDev = process.env.NODE_ENV === "development"
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-white">ไม่พบบทเรียนนี้</h2>
        <p className="mt-2 text-slate-400">กรุณาตรวจสอบ URL หรือกลับไปหน้าเรียน</p>
        {isDev && (
          <div className="mt-4 space-y-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm font-medium text-red-400">Diagnostics (Development Mode)</p>
            <p className="text-xs text-slate-400">Requested Topic ID: <span className="font-mono text-red-300">{topicId}</span></p>
            <p className="text-xs text-slate-400">Lesson exists in registry: <span className="text-red-300">{Object.keys(lessonLoaders).includes(topicId) ? "Yes" : "No"}</span></p>
            <p className="text-xs text-slate-400">Curriculum topic exists: <span className="text-red-300">{getAllCurriculumTopics().some((t: { id: string }) => t.id === topicId) ? "Yes" : "No"}</span></p>
            <p className="text-xs text-slate-400">Question bank exists: <span className="text-red-300">{getQuestionsForTopic(topicId).length > 0 ? "Yes" : "No"}</span></p>
            <p className="text-xs text-slate-400">Registered lessons: {Object.keys(lessonLoaders).join(", ")}</p>
          </div>
        )}
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
    if (d === "easy") return "ง่าย"
    if (d === "medium") return "ปานกลาง"
    return "ยาก"
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-medium text-cyan-400">
            {lesson.curriculum}
          </span>
          <span className="rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-300">
            {difficultyLabel(lesson.difficulty)}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="size-3.5" />
            {lesson.estimatedReadingTime} นาที
          </span>
          {isCompleted && (
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <CheckCircle2 className="size-3.5" />
              เรียนจบแล้ว
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-white">{lesson.title}</h1>
        <p className="mt-2 text-slate-400">{lesson.description}</p>
      </div>

      {/* Introduction */}
      <section className={panelClassName}>
        <h2 className="mb-3 text-lg font-semibold text-white">บทนำ</h2>
        <p className="text-sm leading-relaxed text-slate-300">{lesson.introduction}</p>
      </section>

      {/* Learning Objectives */}
      <section className={panelClassName}>
        <h2 className="mb-3 text-lg font-semibold text-white">จุดประสงค์การเรียนรู้</h2>
        <ul className="space-y-2">
          {lesson.learningObjectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <Target className="mt-0.5 size-4 shrink-0 text-cyan-400" />
              {obj}
            </li>
          ))}
        </ul>
      </section>

      {/* Concepts */}
      <section className={panelClassName}>
        <h2 className="mb-4 text-lg font-semibold text-white">แนวคิดหลัก</h2>
        <div className="space-y-4">
          {lesson.concepts.map((concept, i) => (
            <div key={i} className={innerCardClassName}>
              <h3 className="mb-2 font-medium text-white">{concept.title}</h3>
              <p className="text-sm leading-relaxed text-slate-300">{concept.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formulas */}
      {lesson.formulas.length > 0 && (
        <section className={panelClassName}>
          <h2 className="mb-4 text-lg font-semibold text-white">สูตรที่เกี่ยวข้อง</h2>
          <div className="grid gap-3">
            {lesson.formulas.map((f, i) => (
              <div key={i} className={innerCardClassName}>
                <div className="mb-1 font-mono text-sm text-cyan-400">{f.formula}</div>
                <div className="text-xs text-slate-400">{f.description}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Examples */}
      <section className={panelClassName}>
        <h2 className="mb-4 text-lg font-semibold text-white">ตัวอย่างการแก้ปัญหา</h2>
        <div className="space-y-4">
          {lesson.examples.map((ex, i) => (
            <div key={i} className={innerCardClassName}>
              <p className="mb-2 text-sm font-medium text-white">ตัวอย่าง {i + 1}: {ex.question}</p>
              <div className="rounded-lg bg-slate-900/50 p-3">
                <p className="text-xs text-slate-400">วิธีทำ:</p>
                <p className="text-sm text-slate-300">{ex.solution}</p>
              </div>
              <p className="mt-2 text-sm font-medium text-emerald-400">คำตอบ: {ex.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Common Mistakes */}
      {lesson.commonMistakes.length > 0 && (
        <section className={panelClassName}>
          <h2 className="mb-4 text-lg font-semibold text-white">ข้อผิดพลาดที่พบบ่อย</h2>
          <ul className="space-y-2">
            {lesson.commonMistakes.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-red-300">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-red-400" />
                {m}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Summary */}
      <section className={panelClassName}>
        <h2 className="mb-3 text-lg font-semibold text-white">สรุป</h2>
        <ul className="space-y-2">
          {lesson.summary.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-cyan-400" />
              {s}
            </li>
          ))}
        </ul>
      </section>

      {/* Related Topics */}
      {lesson.relatedTopics.length > 0 && (
        <section className={panelClassName}>
          <h2 className="mb-3 text-lg font-semibold text-white">หัวข้อที่เกี่ยวข้อง</h2>
          <div className="flex flex-wrap gap-2">
            {lesson.relatedTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => router.push(`/lesson/${topic}`)}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-cyan-500 hover:text-cyan-400"
              >
                {topic}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3">
        {!isCompleted && showCompleteBtn && (
          <button
            onClick={handleMarkComplete}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-400"
          >
            <CheckCircle2 className="size-5" />
            ทำเครื่องหมายว่าอ่านจบแล้ว
          </button>
        )}

        <button
          onClick={() => router.push(`/quiz/${relatedQuiz}`)}
          className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-cyan-400"
        >
          <PlayCircle className="size-5" />
          เริ่มทำโจทย์
          <ArrowRight className="size-4" />
        </button>

        <div className="flex gap-3">
          {prevTopic && (
            <button
              onClick={() => router.push(`/lesson/${prevTopic}`)}
              className="flex-1 rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-slate-600"
            >
              ← บทเรียนก่อนหน้า
            </button>
          )}
          {nextTopic && (
            <button
              onClick={() => router.push(`/lesson/${nextTopic}`)}
              className="flex-1 rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-cyan-500 hover:text-cyan-400"
            >
              บทเรียนถัดไป →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}