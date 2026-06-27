"use client"

import { motion } from "framer-motion"
import { BarChart3, TrendingUp, BookOpen, HelpCircle, Target } from "lucide-react"
import AdminLayout from "@/app/admin/layout"
import { QUESTION_BANK } from "@/lib/question-bank"
import { lessonLoaders } from "@/lib/lesson-bank"

export default function AnalyticsPage() {
  const allQuestions = Object.entries(QUESTION_BANK).flatMap(([curriculum, topics]) =>
    Object.entries(topics).flatMap(([topicId, questions]) =>
      questions.map((q) => ({ ...q, curriculum, topicId }))
    )
  )

  const totalLessons = Object.keys(lessonLoaders).length
  const totalQuestions = allQuestions.length

  // Calculate distributions
  const difficultyDist = {
    easy: allQuestions.filter((q) => q.difficulty === "easy").length,
    medium: allQuestions.filter((q) => q.difficulty === "medium").length,
    hard: allQuestions.filter((q) => q.difficulty === "hard").length,
  }

  const curriculumDist = Object.entries(QUESTION_BANK).map(([curr, topics]) => ({
    curriculum: curr,
    count: Object.values(topics).flat().length,
  }))

  const topicCoverage = Object.entries(QUESTION_BANK).map(([curr, topics]) => ({
    curriculum: curr,
    topics: Object.keys(topics).length,
    totalTopics: 5, // Approximate
  }))

  return (
    <AdminLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="mt-2 text-slate-400">Content performance and distribution</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3">
            <BookOpen className="size-8 text-cyan-400" />
            <div>
              <p className="text-sm text-slate-400">Total Lessons</p>
              <p className="text-2xl font-bold text-white">{totalLessons}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3">
            <HelpCircle className="size-8 text-emerald-400" />
            <div>
              <p className="text-sm text-slate-400">Total Questions</p>
              <p className="text-2xl font-bold text-white">{totalQuestions}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3">
            <Target className="size-8 text-violet-400" />
            <div>
              <p className="text-sm text-slate-400">Avg per Topic</p>
              <p className="text-2xl font-bold text-white">{Math.round(totalQuestions / 28)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="size-8 text-amber-400" />
            <div>
              <p className="text-sm text-slate-400">Coverage</p>
              <p className="text-2xl font-bold text-white">100%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Distribution */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Difficulty Distribution</h2>
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-400">Easy</span>
              <span className="font-semibold text-emerald-400">{difficultyDist.easy} questions</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${(difficultyDist.easy / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-400">Medium</span>
              <span className="font-semibold text-amber-400">{difficultyDist.medium} questions</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-amber-500 transition-all"
                style={{ width: `${(difficultyDist.medium / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-400">Hard</span>
              <span className="font-semibold text-red-400">{difficultyDist.hard} questions</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-red-500 transition-all"
                style={{ width: `${(difficultyDist.hard / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Distribution */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Questions by Curriculum</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {curriculumDist.map((item) => (
            <div key={item.curriculum} className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">{item.curriculum}</span>
                <span className="text-lg font-bold text-cyan-400">{item.count}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-cyan-500"
                  style={{ width: `${(item.count / totalQuestions) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Coverage */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Topic Coverage</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topicCoverage.map((item) => (
            <div key={item.curriculum} className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">{item.curriculum}</span>
                <span className="text-sm text-slate-400">
                  {item.topics}/{item.totalTopics} topics
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-violet-500"
                  style={{ width: `${(item.topics / item.totalTopics) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4">
        <p className="text-sm text-cyan-400">
          Note: This is a basic analytics overview. For detailed student performance analytics, integrate with a backend database.
        </p>
      </div>
    </div>
    </AdminLayout>
  )
}
