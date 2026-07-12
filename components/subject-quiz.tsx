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
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
  Star,
  Trophy,
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
import { calculateScore, getWrongQuestionIds, getQuestionAnswerIndex, isAnswerCorrect, runQuizFlow } from "@/lib/quiz/answer-utils"

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
  const [animatingAnswer, setAnimatingAnswer] = useState<number | null>(null)

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
        <div className="text-center space-y-4">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 animate-pulse">
            <Loader2 className="size-8 text-cyan-400 animate-spin" />
          </div>
          <p className="text-sm text-[#64748B]">{t.app.common.loadingQuestions}</p>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIdx]
  const isLastQuestion = currentQuestionIdx === questions.length - 1

  function handleAnswer(answerIndex: number) {
    setAnimatingAnswer(answerIndex)
    setTimeout(() => setAnimatingAnswer(null), 200)
    setSelectedAnswer(answerIndex)

    if (process.env.NODE_ENV === "development") {
      const answerResult = runQuizFlow(currentQuestion, answerIndex, quizHearts)
      console.log("📝 [Quiz] Answer selected:", {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        choices: currentQuestion.choices,
        correctIndex: getQuestionAnswerIndex(currentQuestion),
        correctChoice: currentQuestion.choices[getQuestionAnswerIndex(currentQuestion)],
        userSelected: answerIndex,
        userChoice: currentQuestion.choices[answerIndex],
        isCorrect: answerResult.isCorrect,
      })
    }
  }

  function handleNext() {
    if (selectedAnswer === null) return

    const answerResult = runQuizFlow(currentQuestion, selectedAnswer, quizHearts)

    if (process.env.NODE_ENV === "development") {
      console.log("✅ [Quiz] Answer validation:", {
        questionId: currentQuestion.id,
        userSelected: selectedAnswer,
        userChoice: currentQuestion.choices[selectedAnswer],
        correctIndex: getQuestionAnswerIndex(currentQuestion),
        correctChoice: currentQuestion.choices[getQuestionAnswerIndex(currentQuestion)],
        isCorrect: answerResult.isCorrect,
        heartsBefore: quizHearts,
        heartsAfter: answerResult.heartsAfter,
      })
    }

    if (!answerResult.isCorrect) {
      const newHearts = answerResult.heartsAfter
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
      const score = calculateScore(questions, newAnswers)
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

      const wrongIds = getWrongQuestionIds(questions, newAnswers)
      const scoreVal = calculateScore(questions, newAnswers)
      
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
    const score = calculateScore(questions, answers)
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

        <div className="space-y-8">
          {/* Results Header */}
          <section className="relative overflow-hidden rounded-3xl border border-[#1E293B] bg-gradient-to-br from-[#0F172A] via-[#0F172A] to-cyan-500/5 p-6 sm:p-8">
            <div className="absolute -top-24 -right-24 size-64 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-3xl" />
            <div className="relative text-center">
              {isPerfect && (
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-400 ring-1 ring-amber-500/20">
                  <Sparkles className="size-3.5" />
                  Perfect Score! +50 XP
                </div>
              )}
              <p className="text-sm font-medium text-cyan-400">{t.app.quiz.completeEyebrow}</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#F8FAFC] sm:text-4xl">
                {t.app.quiz.resultsTitle(currentQuestion.curriculum as any)}
              </h1>
              <p className="mt-2 text-[#64748B]">
                {t.app.quiz.resultsDescription(currentQuestion.curriculum as any)}
              </p>
            </div>

            {/* Score Circle */}
            <div className="mt-6 flex justify-center">
              <div className="relative flex size-28 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 ring-2 ring-cyan-500/30">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#F8FAFC]">{percentage}%</p>
                  <p className="text-xs text-[#64748B]">{score}/{questions.length}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Result Stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-[#1E293B] bg-[#0F172A]/80 p-4 text-center card-hover">
              <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 mb-2">
                <Target className="size-5 text-cyan-400" />
              </div>
              <p className="text-xs text-[#64748B]">{t.app.quiz.score}</p>
              <p className="text-xl font-bold text-[#F8FAFC]">{score}/{questions.length}</p>
            </div>
            <div className="rounded-2xl border border-[#1E293B] bg-[#0F172A]/80 p-4 text-center card-hover">
              <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 mb-2">
                <TrendingUp className="size-5 text-emerald-400" />
              </div>
              <p className="text-xs text-[#64748B]">{t.app.quiz.accuracyLabel}</p>
              <p className="text-xl font-bold text-[#F8FAFC]">{percentage}%</p>
            </div>
            <div className="rounded-2xl border border-[#1E293B] bg-[#0F172A]/80 p-4 text-center card-hover">
              <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 mb-2">
                <Clock className="size-5 text-violet-400" />
              </div>
              <p className="text-xs text-[#64748B]">{t.app.quiz.time}</p>
              <p className="text-xl font-bold text-[#F8FAFC]">{timeSpentMinutes}m</p>
            </div>
            <div className="rounded-2xl border border-[#1E293B] bg-[#0F172A]/80 p-4 text-center card-hover">
              <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 mb-2">
                <CheckCircle2 className="size-5 text-emerald-400" />
              </div>
              <p className="text-xs text-[#64748B]">{t.app.quiz.status}</p>
              <p className="text-xl font-bold text-emerald-400">{t.app.common.done}</p>
            </div>
          </div>

          {/* Review Questions */}
          <section className="rounded-2xl border border-[#1E293B] bg-[#0F172A]/80 p-6 sm:p-8">
            <h2 className="mb-6 text-lg font-semibold text-[#F8FAFC]">{t.app.quiz.reviewTitle}</h2>
            <div className="space-y-4">
              {questions.map((item, index) => {
                const isCorrect = answers[index] === item.answer
                return (
                  <div key={item.id} className={`rounded-xl border p-5 transition-all ${
                    isCorrect ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'
                  }`}>
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" />
                      ) : (
                        <XCircle className="mt-0.5 size-5 shrink-0 text-red-400" />
                      )}
                      <div className="flex-1 space-y-3">
                        <p className="text-sm font-semibold text-[#F8FAFC]">
                          {t.app.quiz.questionCount(index + 1, questions.length)}. {item.question}
                        </p>
                        <div className="space-y-2">
                          {item.choices.map((option: string, optionIndex: number) => {
                            const isSelected = answers[index] === optionIndex
                            const isCorrectOption = optionIndex === item.answer
                            return (
                              <div
                                key={option}
                                className={`flex items-center gap-2 rounded-xl border p-3 text-sm transition-all ${
                                  isCorrectOption
                                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                    : isSelected && !isCorrect
                                      ? "border-red-500/30 bg-red-500/10 text-red-400"
                                      : "border-[#1E293B] bg-[#0B1121]/60 text-[#64748B]"
                                }`}
                              >
                                <span className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                  isCorrectOption
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : isSelected && !isCorrect
                                      ? "bg-red-500/20 text-red-400"
                                      : "bg-[#1E293B] text-[#64748B]"
                                }`}>
                                  {String.fromCharCode(65 + optionIndex)}
                                </span>
                                <span className="flex-1">{option}</span>
                                {isCorrectOption && <CheckCircle2 className="size-4 shrink-0" />}
                                {isSelected && !isCorrect && <XCircle className="size-4 shrink-0" />}
                              </div>
                            )
                          })}
                        </div>
                        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3">
                          <p className="text-xs text-[#64748B]">
                            <span className="font-medium text-cyan-400">{t.app.common.explanation}:</span>{" "}
                            <span className="text-[#CBD5E1]">{item.explanation}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleRestart}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#1E293B] px-5 py-3.5 text-sm font-medium text-[#F8FAFC] transition-all duration-200 hover:bg-[#1E293B] card-hover"
            >
              <RotateCcw className="size-4" />
              {t.app.quiz.retake}
            </button>
            <button
              type="button"
              onClick={handleBackToPractice}
              className="btn-primary flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-500/30"
            >
              {t.app.quiz.backToPractice}
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with progress and hearts */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-400">{currentQuestion.topicName || topicId}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#F8FAFC] sm:text-3xl">
            {t.app.quiz.questionCount(currentQuestionIdx + 1, questions.length)}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-400 ring-1 ring-red-500/20">
            <Heart className="size-4" />
            <span>{quizHearts}</span>
          </div>
          <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ${
            currentQuestion.difficulty === "easy"
              ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
              : currentQuestion.difficulty === "medium"
                ? "bg-amber-500/10 text-amber-400 ring-amber-500/20"
                : "bg-red-500/10 text-red-400 ring-red-500/20"
          }`}>
            {currentQuestion.difficulty === "easy" ? t.app.common.easy : currentQuestion.difficulty === "medium" ? t.app.common.medium : t.app.common.hard}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="mb-2 flex justify-between text-xs text-[#64748B]">
          <span>{t.app.quiz.progressLabel}</span>
          <span>{currentQuestionIdx + 1} / {questions.length}</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-[#1E293B] ring-1 ring-inset ring-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 shadow-sm shadow-cyan-500/20"
            style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Hearts depletion warning */}
      {quizEnded && (
        <div className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-500/5 p-6 text-center fade-in">
          <Heart className="mx-auto size-10 text-red-400" />
          <p className="mt-3 text-lg font-semibold text-red-300">{t.app.common.noHearts}</p>
          <p className="mt-1 text-sm text-red-400">{t.app.common.tryAgain}</p>
          <button
            type="button"
            onClick={() => {
              setQuizHearts(5)
              setQuizEnded(false)
              setCurrentQuestionIdx(0)
              setAnswers([])
              setSelectedAnswer(null)
            }}
            className="btn-primary mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-red-500/30"
          >
            <RotateCcw className="size-4" />
            {t.app.common.tryAgain}
          </button>
        </div>
      )}

      {/* Hint panel */}
      {showHints && currentQuestion.hints && currentQuestion.hints.length > 0 && (
        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-5 fade-in">
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
          <div className="rounded-xl border border-amber-500/10 bg-[#0B1121]/60 p-4">
            <p className="text-sm text-amber-200 leading-relaxed">{currentQuestion.hints[hintStep]}</p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevHint}
              disabled={hintStep === 0}
              className="flex items-center gap-1 rounded-lg border border-amber-500/30 px-3 py-1.5 text-xs text-amber-400 transition-all hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="size-3" />
              {t.app.quiz.previous}
            </button>
            <span className="text-xs text-amber-400">
              {t.app.quiz.hintStep(hintStep + 1, currentQuestion.hints.length)}
            </span>
            <button
              type="button"
              onClick={handleNextHint}
              disabled={hintStep >= currentQuestion.hints.length - 1}
              className="flex items-center gap-1 rounded-lg border border-amber-500/30 px-3 py-1.5 text-xs text-amber-400 transition-all hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t.app.quiz.next}
              <ChevronRight className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Question Card */}
      <section className="rounded-2xl border border-[#1E293B] bg-[#0F172A]/80 p-6 sm:p-8">
        {/* Question Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-[#F8FAFC] leading-relaxed">
            {currentQuestion.question}
          </h2>
          {currentQuestion.hints && currentQuestion.hints.length > 0 && !showHints && (
            <button
              type="button"
              onClick={handleToggleHints}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 px-3.5 py-2 text-xs font-medium text-amber-400 transition-all hover:bg-amber-500/20 card-hover"
            >
              <Lightbulb className="size-3.5" />
              {t.app.quiz.showHint}
            </button>
          )}
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {currentQuestion.choices.map((option: string, index: number) => (
            <button
              key={option}
              type="button"
              onClick={() => handleAnswer(index)}
              className={`group w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
                selectedAnswer === index
                  ? "border-cyan-500/50 bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-[#F8FAFC] shadow-lg shadow-cyan-500/10"
                  : "border-[#1E293B] bg-[#0B1121]/60 text-[#CBD5E1] hover:border-[#334155] hover:bg-[#0F172A]/80 hover:shadow-md"
              } ${animatingAnswer === index ? 'scale-[1.02]' : 'scale-100'}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                    selectedAnswer === index
                      ? "bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-md"
                      : "bg-[#1E293B] text-[#64748B] group-hover:bg-[#334155] group-hover:text-[#CBD5E1]"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-sm font-medium">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              if (currentQuestionIdx > 0) {
                setCurrentQuestionIdx(currentQuestionIdx - 1)
                setSelectedAnswer(null)
              }
            }}
            disabled={currentQuestionIdx === 0}
            className="flex items-center gap-1.5 rounded-xl border border-[#1E293B] px-4 py-2.5 text-sm font-medium text-[#64748B] transition-all duration-200 hover:border-[#334155] hover:text-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-40 card-hover"
          >
            <ChevronLeft className="size-4" />
            {t.app.quiz.previous}
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="btn-primary flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLastQuestion ? (
              <>
                <Trophy className="size-4" />
                {t.app.quiz.submit}
              </>
            ) : (
              <>
                {t.app.quiz.next}
                <ChevronRight className="size-4" />
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  )
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
        date: new Date().toLocaleDateString("th-TH"),
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