import type { Subject } from "./types"

const SUBJECT_COLORS: Record<Subject, string> = {
  Algebra: "bg-violet-500",
  Geometry: "bg-emerald-500",
  Calculus: "bg-cyan-500",
  Trigonometry: "bg-amber-500",
  Statistics: "bg-rose-500",
}

const SUBJECT_TEXT_COLORS: Record<Subject, string> = {
  Algebra: "text-violet-500",
  Geometry: "text-emerald-500",
  Calculus: "text-cyan-500",
  Trigonometry: "text-amber-500",
  Statistics: "text-rose-500",
}

const SUBJECT_BG_TINTS: Record<Subject, string> = {
  Algebra: "bg-violet-500/10",
  Geometry: "bg-emerald-500/10",
  Calculus: "bg-cyan-500/10",
  Trigonometry: "bg-amber-500/10",
  Statistics: "bg-rose-500/10",
}

export function getSubjectColor(subject: Subject): string {
  return SUBJECT_COLORS[subject]
}

export function getSubjectTextColor(subject: Subject): string {
  return SUBJECT_TEXT_COLORS[subject]
}

export function getSubjectBgTint(subject: Subject): string {
  return SUBJECT_BG_TINTS[subject]
}

export const PROGRESS_POINTS = [12, 22, 30, 28, 45, 55, 50, 68, 72, 75]
export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function buildLinePath(points: number[], width: number, height: number) {
  const max = 100
  const step = width / (points.length - 1)
  return points
    .map((p, i) => {
      const x = i * step
      const y = height - (p / max) * height
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")
}

export const panelClassName =
  "rounded-2xl border border-slate-700 bg-slate-900 p-6"

export const innerCardClassName =
  "rounded-xl border border-slate-700 bg-slate-800 p-4"
