export type { Lesson, LessonProgress, Formula, LessonConcept, LessonExample } from "./types"

import type { Lesson, LessonProgress } from "./types"
import { M1_INTEGERS_LESSON } from "./m1/integers"
import { M1_EXPONENTS_LESSON } from "./m1/exponents"
import { M1_LINEAR_EQUATIONS_LESSON } from "./m1/linear-equations"
import { M1_BASIC_GEOMETRY_LESSON } from "./m1/basic-geometry"
import { M1_DATA_BASICS_LESSON } from "./m1/data-basics"
import { M2_POLYNOMIALS_LESSON } from "./m2/polynomials"
import { M2_FACTORING_LESSON } from "./m2/factoring"
import { M2_PYTHAGOREAN_LESSON } from "./m2/pythagorean"
import { M2_PROBABILITY_LESSON } from "./m2/probability"
import { M3_QUADRATICS_LESSON } from "./m3/quadratics"
import { M3_FUNCTIONS_LESSON } from "./m3/functions"
import { M3_TRIGONOMETRY_LESSON } from "./m3/trigonometry"
import { M3_TRIANGLE_TRIG_LESSON } from "./m3/triangle-trig"
import { M3_GEOMETRY_APPS_LESSON } from "./m3/geometry-apps"
import { M4_ADVANCED_ALGEBRA_LESSON } from "./m4/advanced-algebra"
import { M4_SEQUENCES_LESSON } from "./m4/sequences"
import { M4_COORDINATE_GEOMETRY_LESSON } from "./m4/coordinate-geometry"
import { M4_CIRCLES_LESSON } from "./m4/circles"
import { M4_STATISTICS_ADVANCED_LESSON } from "./m4/statistics-advanced"
import { M5_TRIGONOMETRY_ADVANCED_LESSON } from "./m5/trigonometry-advanced"
import { M5_CALCULUS_BASICS_LESSON } from "./m5/calculus-basics"
import { M5_DERIVATIVES_LESSON } from "./m5/derivatives"
import { M5_PROBABILITY_ADVANCED_LESSON } from "./m5/probability-advanced"
import { M6_LIMITS_LESSON } from "./m6/limits"
import { M6_DERIVATIVES_ADVANCED_LESSON } from "./m6/derivatives-advanced"
import { M6_INTEGRALS_LESSON } from "./m6/integrals"
import { M6_APPLICATIONS_LESSON } from "./m6/applications"
import { M6_ADVANCED_PROBABILITY_LESSON } from "./m6/advanced-probability"

const PROGRESS_KEY = "mathmentor-lesson-progress"

// Lazy-loaded lesson registry
export const lessonLoaders: Record<string, () => Promise<{ default: () => Lesson }>> = {}

export function registerLesson(topicId: string, loader: () => Promise<{ default: () => Lesson }>) {
  lessonLoaders[topicId] = loader
}

// Register built-in lessons
registerLesson("m1-integers", async () => {
  return { default: () => M1_INTEGERS_LESSON }
})

registerLesson("m1-exponents", async () => {
  return { default: () => M1_EXPONENTS_LESSON }
})

registerLesson("m1-linear-equations", async () => {
  return { default: () => M1_LINEAR_EQUATIONS_LESSON }
})

registerLesson("m1-basic-geometry", async () => {
  return { default: () => M1_BASIC_GEOMETRY_LESSON }
})

registerLesson("m1-data-basics", async () => {
  return { default: () => M1_DATA_BASICS_LESSON }
})

registerLesson("m2-polynomials", async () => {
  return { default: () => M2_POLYNOMIALS_LESSON }
})

registerLesson("m2-factoring", async () => {
  return { default: () => M2_FACTORING_LESSON }
})

registerLesson("m2-pythagorean", async () => {
  return { default: () => M2_PYTHAGOREAN_LESSON }
})

registerLesson("m2-probability", async () => {
  return { default: () => M2_PROBABILITY_LESSON }
})

registerLesson("m3-quadratics", async () => {
  return { default: () => M3_QUADRATICS_LESSON }
})

registerLesson("m3-functions", async () => {
  return { default: () => M3_FUNCTIONS_LESSON }
})

registerLesson("m3-trigonometry", async () => {
  return { default: () => M3_TRIGONOMETRY_LESSON }
})

registerLesson("m3-triangle-trig", async () => {
  return { default: () => M3_TRIANGLE_TRIG_LESSON }
})

registerLesson("m3-geometry-apps", async () => {
  return { default: () => M3_GEOMETRY_APPS_LESSON }
})

registerLesson("m4-advanced-algebra", async () => {
  return { default: () => M4_ADVANCED_ALGEBRA_LESSON }
})

registerLesson("m4-sequences", async () => {
  return { default: () => M4_SEQUENCES_LESSON }
})

registerLesson("m4-coordinate-geometry", async () => {
  return { default: () => M4_COORDINATE_GEOMETRY_LESSON }
})

registerLesson("m4-circles", async () => {
  return { default: () => M4_CIRCLES_LESSON }
})

registerLesson("m4-statistics-advanced", async () => {
  return { default: () => M4_STATISTICS_ADVANCED_LESSON }
})

registerLesson("m5-trigonometry-advanced", async () => {
  return { default: () => M5_TRIGONOMETRY_ADVANCED_LESSON }
})

registerLesson("m5-calculus-basics", async () => {
  return { default: () => M5_CALCULUS_BASICS_LESSON }
})

registerLesson("m5-derivatives", async () => {
  return { default: () => M5_DERIVATIVES_LESSON }
})

registerLesson("m5-probability-advanced", async () => {
  return { default: () => M5_PROBABILITY_ADVANCED_LESSON }
})

registerLesson("m6-limits", async () => {
  return { default: () => M6_LIMITS_LESSON }
})

registerLesson("m6-derivatives-advanced", async () => {
  return { default: () => M6_DERIVATIVES_ADVANCED_LESSON }
})

registerLesson("m6-integrals", async () => {
  return { default: () => M6_INTEGRALS_LESSON }
})

registerLesson("m6-applications", async () => {
  return { default: () => M6_APPLICATIONS_LESSON }
})

registerLesson("m6-advanced-probability", async () => {
  return { default: () => M6_ADVANCED_PROBABILITY_LESSON }
})

export async function getLesson(topicId: string): Promise<Lesson | null> {
  const loader = lessonLoaders[topicId]
  if (!loader) return null
  try {
    const mod = await loader()
    return mod.default()
  } catch {
    return null
  }
}

export function getLessonProgress(topicId: string): LessonProgress | null {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY)
    if (!stored) return null
    const all: Record<string, LessonProgress> = JSON.parse(stored)
    return all[topicId] || null
  } catch {
    return null
  }
}

export function getAllLessonProgress(): Record<string, LessonProgress> {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY)
    if (!stored) return {}
    return JSON.parse(stored)
  } catch {
    return {}
  }
}

export function saveLessonProgress(topicId: string, progress: LessonProgress): void {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY)
    const all: Record<string, LessonProgress> = stored ? JSON.parse(stored) : {}
    all[topicId] = progress
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all))
  } catch {
    // ignore
  }
}

export function markLessonStarted(topicId: string): LessonProgress {
  const existing = getLessonProgress(topicId)
  const progress: LessonProgress = {
    lessonId: topicId,
    status: "studying",
    startedAt: existing?.startedAt || new Date().toISOString(),
    scrollPosition: existing?.scrollPosition || 0,
    timeSpentMinutes: existing?.timeSpentMinutes || 0,
  }
  saveLessonProgress(topicId, progress)
  return progress
}

export function markLessonCompleted(topicId: string): LessonProgress {
  const existing = getLessonProgress(topicId) || markLessonStarted(topicId)
  const progress: LessonProgress = {
    ...existing,
    lessonId: topicId,
    status: "completed",
    completedAt: new Date().toISOString(),
  }
  saveLessonProgress(topicId, progress)
  return progress
}

export function updateScrollPosition(topicId: string, position: number): void {
  const existing = getLessonProgress(topicId) || {
    lessonId: topicId,
    status: "not-started" as const,
    scrollPosition: 0,
    timeSpentMinutes: 0,
  }
  saveLessonProgress(topicId, {
    ...existing,
    scrollPosition: position,
  })
}

export function isLessonUnlocked(topicId: string, allProgress: Record<string, LessonProgress>): boolean {
  // In a real system, check prerequisites here
  // For now, all lessons are unlocked
  return true
}

export function getNextLesson(currentTopicId: string): string | null {
  // Order defined by curriculum sequence
  const sequence = [
    "m1-integers", "m1-exponents", "m1-linear-equations",
    "m1-basic-geometry", "m1-data-basics",
    "m2-polynomials", "m2-factoring", "m2-pythagorean", "m2-probability",
    "m3-quadratics", "m3-functions", "m3-trigonometry", "m3-triangle-trig", "m3-geometry-apps",
    "m4-advanced-algebra", "m4-sequences", "m4-coordinate-geometry", "m4-circles", "m4-statistics-advanced",
    "m5-trigonometry-advanced", "m5-calculus-basics", "m5-derivatives", "m5-probability-advanced",
    "m6-limits", "m6-derivatives-advanced", "m6-integrals", "m6-applications", "m6-advanced-probability",
  ]
  const idx = sequence.indexOf(currentTopicId)
  if (idx >= 0 && idx < sequence.length - 1) return sequence[idx + 1]
  return null
}

export function getPreviousLesson(currentTopicId: string): string | null {
  const sequence = [
    "m1-integers", "m1-exponents", "m1-linear-equations",
    "m1-basic-geometry", "m1-data-basics",
    "m2-polynomials", "m2-factoring", "m2-pythagorean", "m2-probability",
    "m3-quadratics", "m3-functions", "m3-trigonometry", "m3-triangle-trig", "m3-geometry-apps",
    "m4-advanced-algebra", "m4-sequences", "m4-coordinate-geometry", "m4-circles", "m4-statistics-advanced",
    "m5-trigonometry-advanced", "m5-calculus-basics", "m5-derivatives", "m5-probability-advanced",
    "m6-limits", "m6-derivatives-advanced", "m6-integrals", "m6-applications", "m6-advanced-probability",
  ]
  const idx = sequence.indexOf(currentTopicId)
  if (idx > 0) return sequence[idx - 1]
  return null
}