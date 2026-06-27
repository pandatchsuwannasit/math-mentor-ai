"use client"

import { useState, useEffect } from "react"
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
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/components/language-provider"
import { useGamification } from "@/hooks/use-gamification"
import { calculateLevel } from "@/lib/gamification"
import type { User } from "@/lib/types"
import { innerCardClassName, panelClassName } from "@/lib/dashboard-utils"
import { getQuestionsForTopic, getAdaptiveQuestions, saveTopicProgress, getTopicProgress } from "@/lib/question-bank"
import type { QuizQuestion } from "@/lib/question-bank/types"
import { QuizShell } from "./quiz-shell"
import { CelebrationModal } from "@/components/celebration-modal"

const USERS_KEY = "mathmentor-users"
const QUIZ_RESULTS_KEY = "mathmentor-quiz-results"

interface QuizResult {
  quizId: string
  subject: string
  score: number
  total: number
  percentage: number
  completedAt: string
  answers: number[]
  timeSpentMinutes: number
}

export function SubjectQuiz({ topicId }: { topicId?: string }) {
  return (
    <AuthGuard>
      <QuizShell>
        <QuizContent topicId={topicId} />
      </QuizShell>
    </AuthGuard>
  )
}

function QuizContent({ topicId }: { topicId?: string }) {
  const router = useRouter()
  const { user, refresh, setUser } = useAuth()
  const { t } = useLanguage()
  const { awardQuizXP, loseHeart, hearts } = useGamification()
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [startTime] = useState(Date.now())
  const [showHints, setShowHints] = useState(false)
  const [hintStep, setHintStep] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [quizHearts, setQuizHearts] = useState(5)
  const [quizEnded, setQuizEnded] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationData, setCelebrationData] = useState({ xp: 0, levelUp: false, newLevel: 1, achievement: "" })

  // Load and randomize questions on mount using adaptive difficulty
  useEffect(() => {
    const timer = setTimeout(() => {
      if (topicId) {
        const progress = getTopicProgress(topicId)
        const totalInTopic = getTotalForTopic(topicId)
        const accuracy = progress ? Math.round((progress.totalCorrect / (progress.totalCorrect + progress.totalWrong || 1)) * 100) : 50
        const recentIds = progress?.recentQuestionIds || []
        const adaptiveQs = getAdaptiveQuestions(topicId, accuracy, Math.min(10, totalInTopic), recentIds)
        setQuestions(adaptiveQs)
        setQuizHearts(user?.stats.hearts ?? 5)
      }
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [topicId, user?.stats.hearts])

  if (!user?.onboarding?.completed) return null

  const activeUser = user

  // Safety checks
  if (!topicId) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-white">ข้อผิดพลาด: ไม่พบหัวข้อ</h2>
        <p className="mt-2 text-slate-400">กรุณาเลือกหัวข้อจากหน้าเรียน</p>
      </div>
    )
  }

  if (!isLoading && questions.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-white">ไม่พบคำถามสำหรับบทเรียนนี้</h2>
        <p className="mt-2 text-slate-400">กรุณาตรวจสอบ Question Bank และ Topic ID</p>
        <p className="mt-2 text-sm text-slate-500">Topic ID: {topicId}</p>
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

  const currentQuestion = questions[currentQuestionIdx]
  const isLastQuestion = currentQuestionIdx === questions.length - 1

  function handleAnswer(answerIndex: number) {
    setSelectedAnswer(answerIndex)
  }

  function handleNext() {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === currentQuestion.answer
    if (!isCorrect) {
      const newHearts = quizHearts - 1
      setQuizHearts(newHearts)
      loseHeart()
      if (newHearts <= 0) {
        setQuizEnded(true)
        return
      }
    }

    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)
    setSelectedAnswer(null)

    if (isLastQuestion || quizEnded) {
      const score = getScore(newAnswers, questions)
      const timeSpentMinutes = Math.round((Date.now() - startTime) / 60000)
      const percentage = Math.round((score / questions.length) * 100)

      const result: QuizResult = {
        quizId: crypto.randomUUID(),
        subject: currentQuestion.curriculum,
        score,
        total: questions.length,
        percentage,
        completedAt: new Date().toISOString(),
        answers: newAnswers,
        timeSpentMinutes,
      }

      const wrongIds = getWrongIds(newAnswers)
      const scoreVal = getScore(newAnswers, questions)
      
      const updatedUser = saveQuizProgress({
        userId: activeUser.id,
        subject: currentQuestion.curriculum as any,
        title: currentQuestion.topicName || topicId || "Quiz",
        questionCount: questions.length,
        score: scoreVal,
        percentage,
        timeSpentMinutes,
        wrongIds,
      })

      if (topicId) {
        const existingProgress = getTopicProgress(topicId)
        const totalCorrect = (existingProgress?.totalCorrect || 0) + scoreVal
        const totalWrong = (existingProgress?.totalWrong || 0) + (questions.length - scoreVal)
        const existingRecent = existingProgress?.recentQuestionIds || []
        const newRecent = [...questions.map((q) => q.id), ...existingRecent].slice(0, 30)
        
        saveTopicProgress(topicId, {
          completed: true,
          score,
          attempts: (existingProgress?.attempts || 0) + 1,
          bestScore: Math.max(existingProgress?.bestScore || 0, percentage),
          lastAttempt: new Date().toISOString(),
          wrongQuestionIds: existingProgress?.wrongQuestionIds
            ? [...new Set([...existingProgress.wrongQuestionIds, ...wrongIds])]
            : wrongIds,
          totalCorrect,
          totalWrong,
          totalTimeMinutes: (existingProgress?.totalTimeMinutes || 0) + timeSpentMinutes,
          recentQuestionIds: newRecent,
        })
      }

      if (updatedUser) {
        setUser(updatedUser)
        refresh()
      }

      // Award XP
      const isPerfect = scoreVal === questions.length
      const xpEarned = scoreVal * 10 + (isPerfect ? 50 : 0)
      const xpBefore = user?.stats.xp || 0
      const xpAfter = xpBefore + xpEarned
      const oldLevel = calculateLevel(xpBefore)
      const newLevel = calculateLevel(xpAfter)
      const levelUp = newLevel > oldLevel

      awardQuizXP(scoreVal, questions.length)

      setCelebrationData({
        xp: xpEarned,
        levelUp,
        newLevel,
        achievement: isPerfect ? "🌟 Perfect Score!" : "",
      })
      setShowCelebration(true)

      saveQuizResult(result)
      setShowResult(true)
      return
    }

    setCurrentQuestionIdx(currentQuestionIdx + 1)
  }

  function getWrongIds(answers: number[]): string[] {
    return questions.filter((q, i) => answers[i] !== q.answer).map((q) => q.id)
  }

  function handleRestart() {
    setCurrentQuestionIdx(0)
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
    const hints = currentQuestion.hints
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
    const score = getScore(answers, questions)
    const percentage = Math.round((score / questions.length) * 100)
    const timeSpentMinutes = Math.round((Date.now() - startTime) / 60000)
    const isPerfect = score === questions.length

    return (
      <>
        <CelebrationModal
          isOpen={showCelebration}
          onClose={() => setShowCelebration(false)}
          title={isPerfect ? "Perfect Score!" : " Quiz Complete!"}
          xpEarned={celebrationData.xp}
          levelUp={celebrationData.levelUp}
          newLevel={celebrationData.newLevel}
          achievement={celebrationData.achievement}
        />

        <div className="mb-6">
          <p className="text-sm font-medium text-cyan-400">{t.app.quiz.completeEyebrow}</p>
          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            {t.app.quiz.resultsTitle(currentQuestion.curriculum as any)}
          </h1>
          <p className="mt-2 text-slate-400">
            {t.app.quiz.resultsDescription(currentQuestion.curriculum as any)}
          </p>
        </div>

        {isPerfect && (
          <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center">
            <p className="text-2xl">🌟</p>
            <p className="mt-1 text-sm font-semibold text-yellow-300">Perfect Score!</p>
            <p className="text-xs text-yellow-400">+50 XP Bonus</p>
          </div>
        )}

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ResultCard label={t.app.quiz.score} value={`${score}/${questions.length}`} icon={Target} color="text-cyan-400" />
          <ResultCard label={t.app.quiz.accuracyLabel} value={`${percentage}%`} icon={TrendingUp} color="text-emerald-400" />
          <ResultCard label={t.app.quiz.time} value={`${timeSpentMinutes}m`} icon={Clock} color="text-violet-400" />
          <ResultCard label={t.app.quiz.status} value={t.app.common.done} icon={CheckCircle2} color="text-emerald-400" />
        </div>

        <section className={panelClassName}>
          <h2 className="mb-4 text-lg font-semibold text-white">{t.app.quiz.reviewTitle}</h2>
          <div className="space-y-4">
            {questions.map((item, index) => {
              const isCorrect = answers[index] === item.answer
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
                        {item.choices.map((option: string, optionIndex: number) => {
                          const isSelected = answers[index] === optionIndex
                          const isCorrectOption = optionIndex === item.answer
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
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-400">{currentQuestion.topicName || topicId}</p>
            <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
              {t.app.quiz.questionCount(currentQuestionIdx + 1, questions.length)}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm text-red-400">
              <span className="text-lg">❤️</span>
              <span className="font-semibold">{quizHearts}</span>
            </div>
          </div>
        </div>
        <p className="mt-2 text-slate-400">
          ระดับ: {currentQuestion.difficulty === "easy" ? "ง่าย" : currentQuestion.difficulty === "medium" ? "ปานกลาง" : "ยาก"}
        </p>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex justify-between text-xs text-slate-400">
          <span>{t.app.quiz.progressLabel}</span>
          <span>{Math.round((currentQuestionIdx / questions.length) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-cyan-500 transition-all duration-300"
            style={{ width: `${(currentQuestionIdx / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {quizEnded && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center">
          <p className="text-lg font-semibold text-red-300">หัวใจหมดแล้ว!</p>
          <p className="mt-1 text-sm text-red-400">คุณสามารถเริ่มใหม่ได้เลย</p>
          <button
            type="button"
            onClick={() => {
              setQuizHearts(5)
              setQuizEnded(false)
              setCurrentQuestionIdx(0)
              setAnswers([])
              setSelectedAnswer(null)
            }}
            className="mt-3 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400"
          >
            ลองอีกครั้ง
          </button>
        </div>
      )}

      {/* Hint panel */}
      {showHints && currentQuestion.hints && currentQuestion.hints.length > 0 && (
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
            <p className="text-sm text-amber-200">{currentQuestion.hints[hintStep]}</p>
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
              {t.app.quiz.hintStep(hintStep + 1, currentQuestion.hints.length)}
            </span>
            <button
              type="button"
              onClick={handleNextHint}
              disabled={hintStep >= currentQuestion.hints.length - 1}
              className="rounded border border-amber-500/30 px-3 py-1 text-xs text-amber-400 transition-colors hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t.app.quiz.next}
            </button>
          </div>
        </div>
      )}

      <section className={panelClassName}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{currentQuestion.question}</h2>
          {currentQuestion.hints && currentQuestion.hints.length > 0 && !showHints && (
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
          {currentQuestion.choices.map((option: string, index: number) => (
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
              if (currentQuestionIdx > 0) {
                setCurrentQuestionIdx(currentQuestionIdx - 1)
                setSelectedAnswer(null)
              }
            }}
            disabled={currentQuestionIdx === 0}
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

function getScore(answers: number[], questions: QuizQuestion[]) {
  return answers.reduce((acc, answer, index) => {
    return acc + (answer === questions[index].answer ? 1 : 0)
  }, 0)
}

function getTotalForTopic(topicId: string): number {
  return getQuestionsForTopic(topicId).length
}

function saveQuizProgress({
  userId,
  subject,
  title,
  questionCount,
  score,
  percentage,
  timeSpentMinutes,
  wrongIds,
}: {
  userId: string
  subject: string
  title: string
  questionCount: number
  score: number
  percentage: number
  timeSpentMinutes: number
  wrongIds: string[]
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
    [subject]: Math.max(user.stats.subjectProgress[subject as keyof typeof user.stats.subjectProgress] ?? 0, percentage),
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

function getStoredUsers(): User[] {
  try {
    return JSON.parse(window.localStorage.getItem(USERS_KEY) || "[]") as User[]
  } catch {
    return []
  }
}