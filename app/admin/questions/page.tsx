"use client"

import { motion } from "framer-motion"
import { HelpCircle, Search, Filter, Plus } from "lucide-react"
import { QUESTION_BANK } from "@/lib/question-bank"

export default function QuestionsPage() {
  const allQuestions = Object.entries(QUESTION_BANK).flatMap(([curriculum, topics]) =>
    Object.entries(topics).flatMap(([topicId, questions]) =>
      questions.map((q) => ({ ...q, curriculum, topicId }))
    )
  )

  const totalQuestions = allQuestions.length
  const easyCount = allQuestions.filter((q) => q.difficulty === "easy").length
  const mediumCount = allQuestions.filter((q) => q.difficulty === "medium").length
  const hardCount = allQuestions.filter((q) => q.difficulty === "hard").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Question Bank</h1>
          <p className="mt-2 text-slate-400">Browse and manage all questions</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-400">
          <Plus className="size-4" />
          Add Question
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-400">Total Questions</p>
          <p className="mt-1 text-2xl font-bold text-white">{totalQuestions}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-400">Easy</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">{easyCount}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-400">Medium</p>
          <p className="mt-1 text-2xl font-bold text-amber-400">{mediumCount}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-400">Hard</p>
          <p className="mt-1 text-2xl font-bold text-red-400">{hardCount}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, topic, or keyword..."
            className="w-full rounded-lg border border-slate-800 bg-slate-900/50 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>
        <select className="rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm text-slate-400 focus:border-cyan-500 focus:outline-none">
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select className="rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm text-slate-400 focus:border-cyan-500 focus:outline-none">
          <option value="">All Curricula</option>
          <option value="M1">M1</option>
          <option value="M2">M2</option>
          <option value="M3">M3</option>
          <option value="M4">M4</option>
          <option value="M5">M5</option>
          <option value="M6">M6</option>
        </select>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {allQuestions.slice(0, 20).map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-800 px-2 py-1 text-xs font-mono text-slate-300">
                    {question.id}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      question.difficulty === "easy"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : question.difficulty === "medium"
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {question.difficulty}
                  </span>
                  <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-xs font-medium text-cyan-400">
                    {question.curriculum}
                  </span>
                </div>
                <p className="mt-2 text-sm text-white">{question.question}</p>
                <p className="mt-1 text-xs text-slate-500">Topic: {question.topicId}</p>
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg border border-slate-800 px-3 py-1 text-xs text-slate-400 hover:border-cyan-500/30 hover:text-white">
                  Edit
                </button>
                <button className="rounded-lg border border-red-500/30 px-3 py-1 text-xs text-red-400 hover:bg-red-500/10">
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {allQuestions.length > 20 && (
        <div className="text-center text-sm text-slate-400">
          Showing 20 of {allQuestions.length} questions
        </div>
      )}
    </div>
  )
}