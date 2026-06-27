"use client"

import { useState, useEffect } from "react"
import { BookOpen, CheckCircle2, RotateCcw, PlayCircle } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardShell } from "@/components/dashboard-shell"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/components/language-provider"
import { panelClassName } from "@/lib/dashboard-utils"
import type { CurriculumLevel } from "@/lib/types"
import { CURRICULUM_BY_LEVEL, CURRICULUM_LABELS, getCurriculumTopicsForLevel } from "@/lib/curriculum"
import { getLessonProgress } from "@/lib/lesson-bank"

export default function CurriculumPage() {
  return (
    <AuthGuard>
      <DashboardShell>
        <CurriculumContent />
      </DashboardShell>
    </AuthGuard>
  )
}

function CurriculumContent() {
  const { user, refresh, setUser } = useAuth()
  const { t } = useLanguage()

  const [selectedCurriculum, setSelectedCurriculum] = useState<CurriculumLevel | null>(null)
  const [success, setSuccess] = useState(false)

  const currentCurriculum = user?.onboarding?.currentCurriculum
  const userGrade = user?.onboarding?.grade

  useEffect(() => {
    if (currentCurriculum) {
      setSelectedCurriculum(currentCurriculum)
    } else if (userGrade) {
      const defaultCurriculum = gradeToCurriculum(userGrade)
      setSelectedCurriculum(defaultCurriculum)
    }
  }, [currentCurriculum, userGrade])

  function gradeToCurriculum(grade: string): CurriculumLevel {
    const map: Record<string, CurriculumLevel> = {
      "Grade 7": "M1",
      "Grade 8": "M2",
      "Grade 9": "M3",
      "Grade 10": "M4",
      "Grade 11": "M5",
      "Grade 12": "M6",
    }
    return map[grade] || "M1"
  }

  function handleSelectCurriculum(level: CurriculumLevel) {
    setSelectedCurriculum(level)
    setSuccess(false)
  }

  function handleSaveCurriculum() {
    if (!selectedCurriculum || !user) return

    const updatedUser = {
      ...user,
      onboarding: {
        ...user.onboarding!,
        currentCurriculum: selectedCurriculum,
      },
    }

    const users = JSON.parse(localStorage.getItem("mathmentor-users") || "[]")
    const userIndex = users.findIndex((u: { id: string }) => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex] = updatedUser
      localStorage.setItem("mathmentor-users", JSON.stringify(users))
    }

    setUser(updatedUser)
    refresh()
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  function handleRestoreDefault() {
    if (!user || !user.onboarding?.grade) return

    const defaultCurriculum = gradeToCurriculum(user.onboarding.grade)
    setSelectedCurriculum(defaultCurriculum)
    handleSaveCurriculum()
  }

  const curriculumLevels: CurriculumLevel[] = ["M1", "M2", "M3", "M4", "M5", "M6"]

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-medium text-cyan-400">📚 หลักสูตรการเรียน</p>
        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">เลือกหลักสูตรการเรียน</h1>
        <p className="mt-2 text-slate-400">เลือกหลักสูตรที่ต้องการศึกษา สามารถเรียนจากระดับอื่นได้ตลอดเวลา</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
          <CheckCircle2 className="size-5 shrink-0" />
          <span>เปลี่ยนหลักสูตรเรียบร้อยแล้ว</span>
        </div>
      )}

      {/* Current Curriculum Display */}
      <section className={`mb-6 ${panelClassName}`}>
        <h2 className="mb-4 text-lg font-semibold text-white">📊 หลักสูตรปัจจุบัน</h2>
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4">
          <p className="text-sm text-cyan-300">ระดับชั้นของคุณ: <span className="font-semibold text-white">{user?.onboarding?.grade || "ไม่ระบุ"}</span></p>
          <p className="mt-2 text-sm text-cyan-300">กำลังเรียน: <span className="font-semibold text-white">{CURRICULUM_LABELS[selectedCurriculum || "M1"]}</span></p>
        </div>
      </section>

      {/* Curriculum Selection */}
      <section className={`mb-6 ${panelClassName}`}>
        <h2 className="mb-4 text-lg font-semibold text-white">เลือกหลักสูตร</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {curriculumLevels.map((level) => {
            const topics = getCurriculumTopicsForLevel(level)
            const progress = user?.stats?.curriculumProgress?.[level] || 0
            const isSelected = selectedCurriculum === level
            const isCurrent = currentCurriculum === level

            const completedLessons = topics.filter((t) => getLessonProgress(t.id)?.status === "completed").length

            return (
              <div
                key={level}
                onClick={() => handleSelectCurriculum(level)}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  isSelected
                    ? "border-cyan-500 bg-cyan-500/15"
                    : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{CURRICULUM_LABELS[level]}</h3>
                  {isCurrent && (
                    <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-xs font-medium text-cyan-400">
                      ปัจจุบัน
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>บทเรียน:</span>
                    <span className="font-medium text-white">{topics.length}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>หัวข้อ:</span>
                    <span className="font-medium text-white">{topics.length * 3}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>บทเรียนที่เรียนแล้ว:</span>
                    <span className="font-medium text-emerald-400">{completedLessons}/{topics.length}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>ความคืบหน้า:</span>
                    <span className="font-medium text-white">{progress}%</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="h-full rounded-full bg-cyan-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {isSelected && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSaveCurriculum()
                      }}
                      className="w-full rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-cyan-400"
                    >
                      เลือกหลักสูตรนี้
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Restore Default Button */}
      {currentCurriculum && currentCurriculum !== gradeToCurriculum(user?.onboarding?.grade || "Grade 7") && (
        <section className={panelClassName}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">กลับไปใช้ระดับชั้นของฉัน</h3>
              <p className="mt-1 text-xs text-slate-400">
                คืนค่าหลักสูตรให้ตรงกับระดับชั้นของคุณ ({user?.onboarding?.grade})
              </p>
            </div>
            <button
              type="button"
              onClick={handleRestoreDefault}
              className="flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800"
            >
              <RotateCcw className="size-3.5" />
              คืนค่า
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
