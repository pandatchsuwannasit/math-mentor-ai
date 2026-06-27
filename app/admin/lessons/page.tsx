"use client"

import { motion } from "framer-motion"
import { BookOpen, Search, Filter } from "lucide-react"
import { lessonLoaders } from "@/lib/lesson-bank"
import { getAllCurriculumTopics } from "@/lib/curriculum"

export default function LessonsPage() {
  const curriculumTopics = getAllCurriculumTopics()
  const registeredLessons = Object.keys(lessonLoaders)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Lesson Management</h1>
        <p className="mt-2 text-slate-400">View and manage all lessons</p>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search lessons..."
            className="w-full rounded-lg border border-slate-800 bg-slate-900/50 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm text-slate-400 hover:border-cyan-500/30 hover:text-white">
          <Filter className="size-4" />
          Filter
        </button>
      </div>

      {/* Lessons Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {curriculumTopics.map((topic, index) => {
          const isRegistered = registeredLessons.includes(topic.id)
          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-xl border p-6 backdrop-blur ${
                isRegistered
                  ? "border-slate-800 bg-slate-900/50 hover:border-cyan-500/30"
                  : "border-red-500/30 bg-red-500/5"
              }`}
            >
              <div className="flex items-start justify-between">
                <BookOpen className={`size-6 ${isRegistered ? "text-cyan-400" : "text-red-400"}`} />
                {isRegistered ? (
                  <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                    Active
                  </span>
                ) : (
                  <span className="rounded-full bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400">
                    Missing
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{topic.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{topic.description}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-xs font-medium text-cyan-400">
                  {topic.subject}
                </span>
                <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
                  {topic.id}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}