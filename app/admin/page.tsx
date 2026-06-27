"use client"

import { motion } from "framer-motion"
import { BookOpen, HelpCircle, CheckCircle2, AlertTriangle, Clock, TrendingUp } from "lucide-react"
import { validateAll } from "@/lib/question-bank/validate"
import { validateLessonBank } from "@/lib/lesson-bank/validate"
import { lessonLoaders } from "@/lib/lesson-bank"
import { QUESTION_BANK } from "@/lib/question-bank"

function StatCard({
  icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  subtext: string
  color: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur"
    >
      <div className={`inline-flex rounded-lg bg-slate-800/50 p-2 ${color}`}>{icon}</div>
      <div className="mt-4">
        <p className="text-sm text-slate-400">{label}</p>
        <p className="mt-1 text-3xl font-bold text-white">{value}</p>
        <p className="mt-1 text-xs text-slate-500">{subtext}</p>
      </div>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const totalLessons = Object.keys(lessonLoaders).length
  const totalQuestions = Object.values(QUESTION_BANK).reduce((sum, topics) => sum + Object.values(topics).flat().length, 0)
  const totalTopics = Object.keys(QUESTION_BANK).reduce((sum, topics) => sum + Object.keys(topics).length, 0)
  const curriculumLevels = 6

  const validation = validateAll()
  const lessonValidation = validateLessonBank()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-2 text-slate-400">Content management overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<BookOpen className="size-6" />}
          label="Total Lessons"
          value={totalLessons}
          subtext="Across all levels"
          color="text-cyan-400"
        />
        <StatCard
          icon={<HelpCircle className="size-6" />}
          label="Total Questions"
          value={totalQuestions}
          subtext={`${totalTopics} topics`}
          color="text-emerald-400"
        />
        <StatCard
          icon={<CheckCircle2 className="size-6" />}
          label="Curriculum Levels"
          value={curriculumLevels}
          subtext="M1 - M6"
          color="text-violet-400"
        />
        <StatCard
          icon={validation.valid ? <CheckCircle2 className="size-6" /> : <AlertTriangle className="size-6" />}
          label="Validation Status"
          value={validation.valid ? "Passed" : "Failed"}
          subtext={validation.valid ? "All checks passed" : `${validation.errors.length} errors`}
          color={validation.valid ? "text-emerald-400" : "text-red-400"}
        />
      </div>

      {(validation.errors.length > 0 || validation.warnings.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-red-500/30 bg-red-500/5 p-6"
        >
          <h2 className="text-lg font-semibold text-white">Validation Report</h2>
          <div className="mt-4 space-y-2">
            {validation.errors.map((error, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-red-400">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            ))}
            {validation.warnings.map((warning, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-yellow-400">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <span>{warning}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <motion.a
          href="/admin/lessons"
          whileHover={{ scale: 1.02 }}
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur transition-colors hover:border-cyan-500/30"
        >
          <BookOpen className="size-8 text-cyan-400" />
          <h3 className="mt-4 text-lg font-semibold text-white">Manage Lessons</h3>
          <p className="mt-2 text-sm text-slate-400">View and edit lesson content</p>
        </motion.a>

        <motion.a
          href="/admin/questions"
          whileHover={{ scale: 1.02 }}
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur transition-colors hover:border-emerald-500/30"
        >
          <HelpCircle className="size-8 text-emerald-400" />
          <h3 className="mt-4 text-lg font-semibold text-white">Question Bank</h3>
          <p className="mt-2 text-sm text-slate-400">Browse and manage questions</p>
        </motion.a>

        <motion.a
          href="/admin/analytics"
          whileHover={{ scale: 1.02 }}
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur transition-colors hover:border-violet-500/30"
        >
          <TrendingUp className="size-8 text-violet-400" />
          <h3 className="mt-4 text-lg font-semibold text-white">Analytics</h3>
          <p className="mt-2 text-sm text-slate-400">View content performance</p>
        </motion.a>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Clock className="size-4" />
        <span>Last updated: {new Date().toLocaleString("th-TH")}</span>
      </div>
    </div>
  )
}