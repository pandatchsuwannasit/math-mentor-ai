"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Lightbulb,
  Loader2,
  RotateCcw,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardShell } from "@/components/dashboard-shell"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/components/language-provider"
import type { QuizResult, QuizSubjectConfig } from "@/lib/quiz-data"
import type { User } from "@/lib/types"
import { innerCardClassName, panelClassName } from "@/lib/dashboard-utils"
import { getQuestionsForTopic, saveTopicProgress, getTopicProgress } from "@/lib/question-bank"

const USERS_KEY = "mathmentor-users"
const QUIZ_RESULTS_KEY = "mathmentor-quiz-results"

export function SubjectQuiz({ config, topicId }: { config?: QuizSubjectConfig; topicId?: string }) {
  return (
    <AuthGuard>
      <DashboardShell>
        <QuizContent config={config} topicId={topicId} />
      </DashboardShell>
    </AuthGuard>
  )
}

function QuizContent({ config, topicId }: { config?: QuizSubjectConfig; topicId?: string }) {
  const router = useRouter()
  const { user, refresh, setUser } = useAuth()
  const { t } = useLanguage()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [startTime] = useState(Date.now())
  const [showHints, setShowHints] = useState(false)
  const [hintStep, setHintStep] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state for better UX
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  // Topic-based quiz mode (must be before conditional returns)
  const topicQuestions = topicId ? getQuestionsForTopic(topicId) : []
  const rawQuestions = config?.questions || topicQuestions
  
  // Normalize questions first
  const normalizedRaw = rawQuestions.map((q) => ({
    id: (q as any).id || crypto.randomUUID(),
    question: (q as any).question || (q as any).content || "",
    options: (q as any).options || (q as any).choices || [],
    correctAnswer: (q as any).correctAnswer ?? (q as any).answer ?? 0,
    explanation: (q as any).explanation || "",
    hints: (q as any).hints || [],
  }))
  
  // Randomize: select up to 10 questions and shuffle answer choices
  const questions = useMemo(() => {
    const shuffled = [...normalizedRaw].sort(() => Math.random() - 0.5).slice(0, 10)
    return shuffled.map((q) => ({
      ...q,
      options: shuffleArray([...q.options]),
    }))
  }, [topicId, config?.questions])

  if (!user?.onboarding?.completed) return null

  const activeUser = user

  // Diagnostic logging
  console.log("topicId", topicId)
  console.log("questions", questions.length)

  // Defensive validation
  if (!questions || questions.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-white">ไม่พบคำถามสำหรับบทเรียนนี้</h2>
        <p className="mt-2 text-slate-400">กรุณาตรวจสอบ Question Bank และ Topic ID</p>
        <p className="mt-2 text-sm text-slate-500">Topic ID: {topicId}</p>
      </div>
    )
  }

  if (currentQuestion < 0 || currentQuestion >= questions.length) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-white">ข้อผิดพลาดของดัชนีคำถาม</h2>
        <p className="mt-2 text-slate-400">กรุณาลองใหม่อีกครั้ง</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto size-12 animate-spin text-cyan-400" />
          <p className="mt-4 text-sm text-slate-400">กำลังโหลดคำถาม...</p>
        </div>
      </div>
    )
  }
  
  const question = questions[currentQuestion]
  const isLastQuestion = currentQuestion === questions.length - 1

  const normalizedQuestions = questions
  const normalizedQuestion = normalizedQuestions[currentQuestion]

  function handleAnswer(answerIndex: number) {
    setSelectedAnswer(answerIndex)
  }

  function handleNext() {
    if (selectedAnswer === null) return

    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)
    setSelectedAnswer(null)

    if (isLastQuestion) {
      const score = getScore(newAnswers, config, normalizedQuestions)
      const timeSpentMinutes = Math.round((Date.now() - startTime) / 60000)
      const percentage = Math.round((score / questions.length) * 100)

      const result: QuizResult = {
        quizId: crypto.randomUUID(),
        subject: (config?.subject || "Algebra") as import("@/lib/types").Subject,
        score,
        total: questions.length,
        percentage,
        completedAt: new Date().toISOString(),
        answers: newAnswers,
        timeSpentMinutes,
      }

      const updatedUser = saveQuizProgress({
        userId: activeUser.id,
        subject: (config?.subject || "Algebra") as import("@/lib/types").Subject,
        title: config?.title || topicId || "Quiz",
        questionCount: questions.length,
        score,
        percentage,
        timeSpentMinutes,
      })

      // Save topic-specific progress
      if (topicId) {
        const existingProgress = getTopicProgress(topicId)
        saveTopicProgress(topicId, {
          completed: true,
          score,
          attempts: (existingProgress?.attempts || 0) + 1,
          bestScore: Math.max(existingProgress?.bestScore || 0, percentage),
          lastAttempt: new Date().toISOString(),
        })
      }

      if (updatedUser) {
        setUser(updatedUser)
        refresh()
      }

      saveQuizResult(result)
      setShowResult(true)
      return
    }

    setCurrentQuestion(currentQuestion + 1)
  }

  function handleRestart() {
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer(null)
    setShowResult(false)
  }

  function handleBackToPractice() {
    router.push("/practice")
  }

  function handleToggleHints() {
    if (showHints) {
      setShowHints(false)
      setHintStep(0)
    } else {
      setShowHints(true)
      setHintStep(0)
    }
  }

  function handleNextHint() {
    const hints = normalizedQuestion.hints
    if (hints && hintStep < hints.length - 1) {
      setHintStep(hintStep + 1)
    }
  }

  function handlePrevHint() {
    if (hintStep > 0) {
      setHintStep(hintStep - 1)
    }
  }

  if (showResult) {
    const score = getScore(answers, config, normalizedQuestions)
    const percentage = Math.round((score / questions.length) * 100)
    const timeSpentMinutes = Math.round((Date.now() - startTime) / 60000)

    return (
      <>
        <div className="mb-6">
          <p className="text-sm font-medium text-cyan-400">{t.app.quiz.completeEyebrow}</p>
          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            {t.app.quiz.resultsTitle((config?.subject || "Algebra") as import("@/lib/types").Subject)}
          </h1>
          <p className="mt-2 text-slate-400">
            {t.app.quiz.resultsDescription((config?.subject || "Algebra") as import("@/lib/types").Subject)}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ResultCard label={t.app.quiz.score} value={`${score}/${questions.length}`} icon={Target} color="text-cyan-400" />
          <ResultCard label={t.app.quiz.accuracyLabel} value={`${percentage}%`} icon={TrendingUp} color="text-emerald-400" />
          <ResultCard label={t.app.quiz.time} value={`${timeSpentMinutes}m`} icon={Clock} color="text-violet-400" />
          <ResultCard label={t.app.quiz.status} value={t.app.common.done} icon={CheckCircle2} color="text-emerald-400" />
        </div>

        <section className={panelClassName}>
          <h2 className="mb-4 text-lg font-semibold text-white">{t.app.quiz.reviewTitle}</h2>
          <div className="space-y-4">
            {normalizedQuestions.map((item, index) => {
              const isCorrect = answers[index] === item.correctAnswer
              return (
                <div key={item.id} className={innerCardClassName}>
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" />
                    ) : (
                      <XCircle className="mt-0.5 size-5 shrink-0 text-red-400" />
                    )}
                    <div className="flex-1">
                      <p className="mb-2 text-sm font-medium text-white">
                        {t.app.quiz.questionCount(index + 1, questions.length)}. {item.question}
                      </p>
                      <div className="space-y-1">
                        {item.options.map((option: string, optionIndex: number) => {
                          const isSelected = answers[index] === optionIndex
                          const isCorrectOption = optionIndex === item.correctAnswer
                          return (
                            <div
                              key={option}
                              className={`rounded border p-2 text-xs ${
                                isCorrectOption
                                  ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                                  : isSelected && !isCorrect
                                    ? "border-red-500/30 bg-red-500/20 text-red-400"
                                    : "border-transparent bg-slate-800/50 text-slate-400"
                              }`}
                            >
                              {option}
                              {isCorrectOption && ` - ${t.app.common.correct}`}
                              {isSelected && !isCorrect && ` - ${t.app.common.yourAnswer}`}
                            </div>
                          )
                        })}
                      </div>
                      <p className="mt-2 text-xs text-slate-400">
                        <span className="font-medium text-cyan-400">{t.app.common.explanation}:</span>{" "}
                        {item.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleRestart}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-600 p-3 text-white transition-colors hover:bg-slate-800"
          >
            <RotateCcw className="size-4" />
            {t.app.quiz.retake}
          </button>
          <button
            type="button"
            onClick={handleBackToPractice}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-500 p-3 font-semibold text-white transition-colors hover:bg-cyan-400"
          >
            {t.app.quiz.backToPractice}
            <ArrowRight className="size-4" />
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="mb-6">
        <p className="text-sm font-medium text-cyan-400">{config?.title || topicId || "แบบทดสอบ"}</p>
        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
          {t.app.quiz.questionCount(currentQuestion + 1, questions.length)}
        </h1>
        <p className="mt-2 text-slate-400">{config?.description || "ทดสอบความรู้ของคุณ"}</p>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex justify-between text-xs text-slate-400">
          <span>{t.app.quiz.progressLabel}</span>
          <span>{Math.round((currentQuestion / questions.length) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-cyan-500 transition-all duration-300"
            style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Hint panel */}
      {showHints && normalizedQuestion.hints && normalizedQuestion.hints.length > 0 && (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-5 text-amber-400" />
              <h3 className="text-sm font-semibold text-amber-300">{t.app.quiz.hintTitle}</h3>
            </div>
            <button
              type="button"
              onClick={handleToggleHints}
              className="text-xs text-amber-400 hover:text-amber-300"
            >
              {t.app.quiz.hideHint}
            </button>
          </div>
          <div className="rounded-lg bg-slate-900/50 p-3">
            <p className="text-sm text-amber-200">{normalizedQuestion.hints[hintStep]}</p>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevHint}
              disabled={hintStep === 0}
              className="rounded border border-amber-500/30 px-3 py-1 text-xs text-amber-400 transition-colors hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t.app.quiz.previous}
            </button>
            <span className="text-xs text-amber-400">
              {t.app.quiz.hintStep(hintStep + 1, normalizedQuestion.hints.length)}
            </span>
            <button
              type="button"
              onClick={handleNextHint}
              disabled={hintStep >= normalizedQuestion.hints.length - 1}
              className="rounded border border-amber-500/30 px-3 py-1 text-xs text-amber-400 transition-colors hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t.app.quiz.next}
            </button>
          </div>
        </div>
      )}

      <section className={panelClassName}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{normalizedQuestion.question}</h2>
          {normalizedQuestion.hints && normalizedQuestion.hints.length > 0 && !showHints && (
            <button
              type="button"
              onClick={handleToggleHints}
              className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 px-3 py-1.5 text-xs font-medium text-amber-400 transition-colors hover:bg-amber-500/20"
            >
              <Lightbulb className="size-3.5" />
              {t.app.quiz.showHint}
            </button>
          )}
        </div>

        <div className="space-y-3">
          {normalizedQuestion.options.map((option: string, index: number) => (
            <button
              key={option}
              type="button"
              onClick={() => handleAnswer(index)}
              className={`w-full rounded-xl border p-4 text-left transition-all ${
                selectedAnswer === index
                  ? "border-cyan-500 bg-cyan-500/10 text-white"
                  : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-6 items-center justify-center rounded-full border-2 text-xs font-medium ${
                    selectedAnswer === index
                      ? "border-cyan-500 bg-cyan-500 text-white"
                      : "border-slate-600 text-slate-400"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-sm">{option}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1)
                setSelectedAnswer(null)
              }
            }}
            disabled={currentQuestion === 0}
            className="rounded-lg border border-slate-600 px-4 py-2 text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t.app.quiz.previous}
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLastQuestion ? t.app.quiz.submit : t.app.quiz.next}
            <ArrowRight className="size-4" />
          </button>
        </div>
      </section>
    </>
  )
}

function ResultCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: string
  icon: LucideIcon
  color: string
}) {
  return (
    <div className={innerCardClassName}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-slate-400">{label}</span>
        <Icon className={`size-4 ${color}`} />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}

function getScore(answers: number[], config: QuizSubjectConfig | undefined, questions: { correctAnswer: number }[]) {
  return answers.reduce((acc, answer, index) => {
    return acc + (answer === questions[index].correctAnswer ? 1 : 0)
  }, 0)
}

function saveQuizProgress({
  userId,
  subject,
  title,
  questionCount,
  score,
  percentage,
  timeSpentMinutes,
}: {
  userId: string
  subject: QuizSubjectConfig["subject"]
  title: string
  questionCount: number
  score: number
  percentage: number
  timeSpentMinutes: number
}): User | null {
  const users = getStoredUsers()
  const userIndex = users.findIndex((entry) => entry.id === userId)
  if (userIndex === -1) return null

  const user = users[userIndex]
  const previousQuestions = user.stats.questionsDone
  const nextQuestionsDone = previousQuestions + questionCount
  const previousCorrect = Math.round((user.stats.accuracy / 100) * previousQuestions)
  const nextAccuracy = Math.round(((previousCorrect + score) / nextQuestionsDone) * 100)
  const nextSubjectProgress = {
    ...user.stats.subjectProgress,
    [subject]: Math.max(user.stats.subjectProgress[subject] ?? 0, percentage),
  }
  const selectedSubjects = user.onboarding?.subjects ?? []
  const progressValues = selectedSubjects.map((item) => nextSubjectProgress[item] ?? 0)
  const nextOverallProgress =
    progressValues.length > 0
      ? Math.round(progressValues.reduce((total, value) => total + value, 0) / progressValues.length)
      : user.stats.overallProgress

  users[userIndex] = {
    ...user,
    stats: {
      ...user.stats,
      questionsDone: nextQuestionsDone,
      studyTimeMinutes: user.stats.studyTimeMinutes + timeSpentMinutes,
      accuracy: nextAccuracy,
      overallProgress: nextOverallProgress,
      subjectProgress: nextSubjectProgress,
    },
    activities: [
      {
        id: crypto.randomUUID(),
        title,
        type: "quiz",
        score: percentage,
        questions: questionCount,
        completed: questionCount,
        date: "Just now",
        status: "completed",
      },
      ...user.activities,
    ],
  }

  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return users[userIndex]
}

function saveQuizResult(result: QuizResult) {
  const quizResults = JSON.parse(window.localStorage.getItem(QUIZ_RESULTS_KEY) || "[]") as QuizResult[]
  quizResults.push(result)
  window.localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(quizResults))
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function getStoredUsers(): User[] {
  try {
    return JSON.parse(window.localStorage.getItem(USERS_KEY) || "[]") as User[]
  } catch {
    return []
  }
}
