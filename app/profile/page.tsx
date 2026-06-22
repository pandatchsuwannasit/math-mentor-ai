"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardShell } from "@/components/dashboard-shell"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/components/language-provider"
import { updateUserProfile } from "@/lib/auth"
import {
  errorClassName,
  inputClassName,
  labelClassName,
  selectChipClassName,
} from "@/lib/form-styles"
import { innerCardClassName, panelClassName } from "@/lib/dashboard-utils"
import {
  GRADES,
  SUBJECTS,
  LEARNING_GOALS,
  type Grade,
  type Subject,
  type LearningGoal,
} from "@/lib/types"

export default function ProfilePage() {
  return (
    <AuthGuard>
      <DashboardShell>
        <ProfileContent />
      </DashboardShell>
    </AuthGuard>
  )
}

function ProfileContent() {
  const { user, refresh, setUser } = useAuth()
  const { t } = useLanguage()
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState("")
  const [grade, setGrade] = useState<Grade | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [learningGoal, setLearningGoal] = useState<LearningGoal | null>(null)
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)

  if (!user?.onboarding?.completed) return null

  function startEditing() {
    setFullName(user!.fullName)
    setGrade(user!.onboarding!.grade)
    setSubjects([...user!.onboarding!.subjects])
    setLearningGoal(user!.onboarding!.learningGoal)
    setError("")
    setSaved(false)
    setEditing(true)
  }

  function toggleSubject(subject: Subject) {
    setSubjects((current) =>
      current.includes(subject)
        ? current.filter((item) => item !== subject)
        : [...current, subject]
    )
  }

  function handleSave() {
    setError("")
    setSaved(false)

    if (!fullName.trim()) {
      setError(t.app.errors.fullNameRequired)
      return
    }

    if (!grade || !learningGoal) {
      setError(t.app.errors.completeProfile)
      return
    }

    if (subjects.length === 0) {
      setError(t.app.errors.selectSubject)
      return
    }

    const updated = updateUserProfile(user!.id, {
      fullName,
      grade,
      subjects,
      learningGoal,
    })

    if (!updated) {
      setError(t.app.errors.saveProfileFailed)
      return
    }

    setUser(updated)
    refresh()
    setEditing(false)
    setSaved(true)
  }

  const onboarding = user.onboarding

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-400">{t.app.profilePage.eyebrow}</p>
          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            {t.app.profilePage.title}
          </h1>
          <p className="mt-2 text-slate-400">
            {t.app.profilePage.description}
          </p>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={startEditing}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-400"
          >
            {t.app.profilePage.editProfile}
          </button>
        )}
      </div>

      {saved && (
        <p className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {t.app.profilePage.updated}
        </p>
      )}

      {editing ? (
        <section className={panelClassName}>
          <div className="space-y-5">
            <div>
              <label htmlFor="fullName" className={labelClassName}>
                {t.app.common.fullName}
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClassName}
              />
            </div>

            <div>
              <p className={`${labelClassName} mb-3`}>{t.app.common.email}</p>
              <p className="mt-2 rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-slate-400">
                {user.email}
              </p>
            </div>

            <div>
              <p className={`${labelClassName} mb-3`}>{t.app.common.gradeLevel}</p>
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
            </div>

            <div>
              <p className={`${labelClassName} mb-3`}>{t.app.common.subjects}</p>
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
            </div>

            <div>
              <p className={`${labelClassName} mb-3`}>{t.app.common.learningGoal}</p>
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
            </div>

            {error && <p className={errorClassName}>{error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 rounded-lg border border-slate-600 p-3 text-white transition-colors hover:bg-slate-800"
              >
                {t.app.common.cancel}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 rounded-lg bg-cyan-500 p-3 font-semibold text-white transition-colors hover:bg-cyan-400"
              >
                {t.app.common.saveChanges}
              </button>
            </div>
          </div>
        </section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className={panelClassName}>
            <h2 className="text-lg font-semibold text-white">
              {t.app.profilePage.accountInformation}
            </h2>
            <dl className="mt-4 space-y-4">
              <div className={innerCardClassName}>
                <dt className="text-xs text-slate-400">{t.app.common.fullName}</dt>
                <dd className="mt-1 font-medium text-white">{user.fullName}</dd>
              </div>
              <div className={innerCardClassName}>
                <dt className="text-xs text-slate-400">{t.app.common.email}</dt>
                <dd className="mt-1 font-medium text-white">{user.email}</dd>
              </div>
            </dl>
          </section>

          <section className={panelClassName}>
            <h2 className="text-lg font-semibold text-white">
              {t.app.profilePage.learningPreferences}
            </h2>
            <dl className="mt-4 space-y-4">
              <div className={innerCardClassName}>
                <dt className="text-xs text-slate-400">{t.app.common.gradeLevel}</dt>
                <dd className="mt-1 font-medium text-white">{onboarding.grade}</dd>
              </div>
              <div className={innerCardClassName}>
                <dt className="text-xs text-slate-400">{t.app.common.learningGoal}</dt>
                <dd className="mt-1 font-medium text-white">
                  {onboarding.learningGoal}
                </dd>
              </div>
              <div className={innerCardClassName}>
                <dt className="text-xs text-slate-400">{t.app.common.subjects}</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {onboarding.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400"
                    >
                      {subject}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      )}
    </>
  )
}
