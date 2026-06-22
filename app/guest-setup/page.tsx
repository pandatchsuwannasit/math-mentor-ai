"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { GuestGuard } from "@/components/guest-guard"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/components/language-provider"
import { createGuestUser } from "@/lib/auth"
import { GRADE_LABELS } from "@/lib/curriculum"
import {
  cardClassName,
  errorClassName,
  selectChipClassName,
} from "@/lib/form-styles"
import type { Grade, LearningGoal } from "@/lib/types"

const GUEST_GRADES: Grade[] = [
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
]

const GUEST_GOALS = [
  "General Learning",
  "Exam Preparation",
  "A-Level Preparation",
] satisfies LearningGoal[]

type GuestLearningGoal = (typeof GUEST_GOALS)[number]

export default function GuestSetupPage() {
  return (
    <GuestGuard>
      <GuestSetupForm />
    </GuestGuard>
  )
}

function GuestSetupForm() {
  const router = useRouter()
  const { refresh } = useAuth()
  const { t } = useLanguage()
  const [step, setStep] = useState(1)
  const [grade, setGrade] = useState<Grade | null>(null)
  const [learningGoal, setLearningGoal] = useState<GuestLearningGoal | null>(null)
  const [error, setError] = useState("")

  function handleNext() {
    setError("")

    if (step === 1) {
      if (!grade) {
        setError(t.app.errors.selectGrade)
        return
      }

      setStep(2)
      return
    }

    if (!grade || !learningGoal) {
      setError(t.app.errors.selectLearningGoal)
      return
    }

    createGuestUser({ grade, learningGoal })
    refresh()
    router.push("/dashboard")
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8">
      <div className={cardClassName}>
        <div className="mb-6">
          <p className="text-sm font-medium text-cyan-400">{t.app.guestSetup.eyebrow}</p>
          <h1 className="mt-1 text-2xl font-bold text-white">
            {step === 1 ? t.app.guestSetup.selectGradeTitle : t.app.guestSetup.selectGoalTitle}
          </h1>
          <p className="mt-2 text-slate-400">
            {t.app.guestSetup.description}
          </p>
        </div>

        <div className="mb-4 flex gap-2">
          {[1, 2].map((value) => (
            <div
              key={value}
              className={`h-1.5 flex-1 rounded-full ${
                value <= step ? "bg-cyan-500" : "bg-slate-700"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {GUEST_GRADES.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setGrade(option)}
                className={selectChipClassName(grade === option)}
              >
                {GRADE_LABELS[option].replace("M", "ม.")}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 gap-3">
            {GUEST_GOALS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setLearningGoal(option)}
                className={selectChipClassName(learningGoal === option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {error && <p className={errorClassName}>{error}</p>}

        <div className="mt-6 flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 rounded-lg border border-slate-600 p-3 text-white transition-colors hover:bg-slate-800"
            >
              {t.app.onboarding.back}
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            className={`rounded-lg bg-cyan-500 p-3 font-semibold text-white transition-colors hover:bg-cyan-400 ${
              step === 1 ? "w-full" : "flex-1"
            }`}
          >
            {step === 1 ? t.app.common.continue : t.app.guestSetup.startAsGuest}
          </button>
        </div>
      </div>
    </main>
  )
}
