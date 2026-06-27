import type { MistakePattern } from "./types"

const MISTAKE_KEY = "mathmentor-mistake-patterns"

export function recordMistake(topicId: string, mistakeType: MistakePattern["type"]) {
  if (typeof window === "undefined") return

  const patterns = getMistakePatterns()
  const existing = patterns.find((p) => p.topicId === topicId && p.type === mistakeType)

  if (existing) {
    existing.count += 1
    existing.lastSeen = Date.now()
  } else {
    patterns.push({
      id: `mistake-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      topicId,
      type: mistakeType,
      count: 1,
      lastSeen: Date.now(),
    })
  }

  localStorage.setItem(MISTAKE_KEY, JSON.stringify(patterns))
}

export function getMistakePatterns(): MistakePattern[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(MISTAKE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function getMistakesForTopic(topicId: string): MistakePattern[] {
  return getMistakePatterns().filter((p) => p.topicId === topicId)
}

export function getMostCommonMistake(): MistakePattern | null {
  const patterns = getMistakePatterns()
  if (patterns.length === 0) return null
  return patterns.sort((a, b) => b.count - a.count)[0]
}

export function clearMistakes(topicId?: string) {
  if (typeof window === "undefined") return
  if (topicId) {
    const patterns = getMistakePatterns().filter((p) => p.topicId !== topicId)
    localStorage.setItem(MISTAKE_KEY, JSON.stringify(patterns))
  } else {
    localStorage.removeItem(MISTAKE_KEY)
  }
}

export function getMistakeTypeLabel(type: MistakePattern["type"]): string {
  const labels: Record<MistakePattern["type"], string> = {
    sign: "Sign error",
    fraction: "Fraction mistake",
    "move-term": "Forgot to move term",
    formula: "Wrong formula",
    concept: "Concept misunderstanding",
    careless: "Careless mistake",
  }
  return labels[type]
}