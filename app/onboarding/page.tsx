"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { completeOnboarding } from "@/lib/auth"
import {
  errorClassName,
  selectChipClassName,
} from "@/lib/form-styles"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/components/language-provider"
import {
  GRADES,
  SUBJECTS,
  LEARNING_GOALS,
  type Grade,
  type Subject,
  type LearningGoal,
} from "@/lib/types"

export default function OnboardingPage() {
  return (
    <AuthGuard requireOnboarding={false}>
      <OnboardingForm />
    </AuthGuard>
  )
}

function OnboardingForm() {
  const router = useRouter()
  const { user, refresh } = useAuth()
  const { t } = useLanguage()
  const [step, setStep] = useState(1)
  const [grade, setGrade] = useState<Grade | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [learningGoal, setLearningGoal] = useState<LearningGoal | null>(null)
  const [error, setError] = useState("")

  function toggleSubject(subject: Subject) {
    setSubjects((current) =>
      current.includes(subject)
        ? current.filter((item) => item !== subject)
        : [...current, subject]
    )
  }

  function handleNext() {
    setError("")

    if (step === 1 && !grade) {
      setError(t.app.errors.selectGrade)
      return
    }

    if (step === 2 && subjects.length === 0) {
      setError(t.app.errors.selectSubject)
      return
    }

    if (step === 3) {
      if (!learningGoal) {
        setError(t.app.errors.selectLearningGoal)
        return
      }

      if (!user) return

      completeOnboarding(user.id, { grade: grade!, subjects, learningGoal })
      refresh()
      router.push("/dashboard")
      return
    }

    setStep((current) => current + 1)
  }

  const stepLabel = t.app.onboarding.stepLabel(step, 3)
  const titleKey = step === 1 ? "gradeQuestion" : step === 2 ? "subjectsQuestion" : "goalQuestion"

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8">
      <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-8">
        <div className="mb-6">
          <p className="text-sm font-medium text-cyan-400">
            {stepLabel}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white">
            {t.app.onboarding[titleKey]}
          </h1>
          <p className="mt-2 text-slate-400">
            {t.app.onboarding.helpPersonalize}
          </p>
        </div>

        <div className="mb-4 flex gap-2">
          {[1, 2, 3].map((value) => (
            <div
              key={value}
              className={`h-1.5 flex-1 rounded-full ${
                value <= step ? "bg-cyan-500" : "bg-slate-700"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {GRADES.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setGrade(option)}
                className={selectChipClassName(grade === option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SUBJECTS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggleSubject(option)}
                className={selectChipClassName(subjects.includes(option))}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 gap-3">
            {LEARNING_GOALS.map((option) => (
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
              onClick={() => setStep((current) => current - 1)}
              className="flex-1 rounded-lg border border-slate-600 p-3 text-white transition-colors hover:bg-slate-800"
            >
              {t.app.onboarding.back}
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            className={`rounded-lg bg-cyan-500 p-3 font-semibold text-white transition-colors hover:bg-cyan-400 ${step === 1 ? "w-full" : "flex-1"}`}
          >
            {step === 3 ? t.app.onboarding.completeSetup : t.app.common.continue}
          </button>
        </div>
      </div>
    </main>
  )
}
