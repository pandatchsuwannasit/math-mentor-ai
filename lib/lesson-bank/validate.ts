import { getAllCurriculumTopics } from "@/lib/curriculum"
import { lessonLoaders, getLesson } from "@/lib/lesson-bank"
import type { Lesson } from "@/lib/lesson-bank"

export interface LessonValidationReport {
  valid: boolean
  errors: string[]
  warnings: string[]
  info: string[]
}

export async function validateLessonBank(): Promise<LessonValidationReport> {
  const errors: string[] = []
  const warnings: string[] = []
  const info: string[] = []

  const curriculumTopics = getAllCurriculumTopics()
  const registeredIds = Object.keys(lessonLoaders)
  const curriculumIds = curriculumTopics.map((t) => t.id)

  // Check for missing lessons
  const missingLessons = curriculumIds.filter((id) => !registeredIds.includes(id))
  if (missingLessons.length > 0) {
    errors.push(`Missing lessons for curriculum topics: ${missingLessons.join(", ")}`)
  }

  // Check for orphan lessons (registered but not in curriculum)
  const orphanLessons = registeredIds.filter((id) => !curriculumIds.includes(id))
  if (orphanLessons.length > 0) {
    warnings.push(`Orphan lessons (not in curriculum): ${orphanLessons.join(", ")}`)
  }

  // Check for duplicate registrations
  const duplicates = registeredIds.filter((id, index) => registeredIds.indexOf(id) !== index)
  if (duplicates.length > 0) {
    errors.push(`Duplicate lesson registrations: ${duplicates.join(", ")}`)
  }

  // Validate each lesson can be loaded
  for (const id of registeredIds) {
    try {
      const lesson = await getLesson(id)
      if (!lesson) {
        errors.push(`Lesson "${id}" registered but returned null when loaded`)
        continue
      }
      if (lesson.id !== id) {
        errors.push(`Lesson "${id}" has mismatched id: "${lesson.id}"`)
      }
      if (lesson.topicId !== id) {
        warnings.push(`Lesson "${id}" has mismatched topicId: "${lesson.topicId}"`)
      }
      info.push(`✓ ${id}: "${lesson.title}" (${lesson.curriculum})`)
    } catch (e) {
      errors.push(`Lesson "${id}" failed to load: ${e}`)
    }
  }

  // Check next/previous lesson references
  const sequence = [
    "m1-integers", "m1-exponents", "m1-linear-equations",
    "m1-basic-geometry", "m1-data-basics",
    "m2-polynomials", "m2-factoring", "m2-pythagorean", "m2-probability",
    "m3-quadratics", "m3-functions", "m3-trigonometry", "m3-triangle-trig", "m3-geometry-apps",
    "m4-advanced-algebra", "m4-sequences", "m4-coordinate-geometry", "m4-circles", "m4-statistics-advanced",
    "m5-trigonometry-advanced", "m5-calculus-basics", "m5-derivatives", "m5-probability-advanced",
    "m6-limits", "m6-derivatives-advanced", "m6-integrals", "m6-applications", "m6-advanced-probability",
  ]

  for (let i = 0; i < sequence.length; i++) {
    const current = sequence[i]
    if (!registeredIds.includes(current)) {
      warnings.push(`Sequence references missing lesson: ${current}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    info,
  }
}

export function createPlaceholderLesson(topicId: string): Lesson {
  const curriculum = topicId.split("-")[0] as Lesson["curriculum"]
  return {
    id: topicId,
    curriculum,
    topicId,
    title: `บทเรียน: ${topicId}`,
    description: "บทเรียนนี้กำลังอยู่ในขั้นตอนการพัฒนา",
    estimatedReadingTime: 5,
    difficulty: "medium",
    learningObjectives: ["กำลังพัฒนา"],
    prerequisites: [],
    keywords: [],
    introduction: "บทเรียนนี้กำลังอยู่ในขั้นตอนการพัฒนา กรุณากลับมาใหม่ในภายหลัง",
    concepts: [],
    examples: [],
    summary: [],
    commonMistakes: [],
    formulas: [],
    relatedTopics: [],
    quizTopicId: topicId,
    version: 1,
  }
}