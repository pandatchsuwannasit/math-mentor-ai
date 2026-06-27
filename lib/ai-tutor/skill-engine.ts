import type { Skill } from "./types"

const SKILL_KEY = "mathmentor-skills"

export function updateSkill(topicId: string, skillName: string, correct: boolean) {
  if (typeof window === "undefined") return

  const skills = getSkills()
  const existing = skills.find((s) => s.topicId === topicId && s.name === skillName)

  if (existing) {
    existing.practicedCount += 1
    existing.lastPracticed = Date.now()
    if (correct) {
      existing.mastery = Math.min(100, existing.mastery + 5)
    } else {
      existing.mastery = Math.max(0, existing.mastery - 3)
    }
  } else {
    skills.push({
      id: `skill-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      topicId,
      name: skillName,
      mastery: correct ? 10 : 0,
      practicedCount: 1,
      lastPracticed: Date.now(),
    })
  }

  localStorage.setItem(SKILL_KEY, JSON.stringify(skills))
}

export function getSkills(): Skill[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(SKILL_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function getSkillsForTopic(topicId: string): Skill[] {
  return getSkills().filter((s) => s.topicId === topicId)
}

export function getWeakSkills(topicId?: string): Skill[] {
  const skills = topicId ? getSkillsForTopic(topicId) : getSkills()
  return skills.filter((s) => s.mastery < 50).sort((a, b) => a.mastery - b.mastery)
}

export function getStrongSkills(topicId?: string): Skill[] {
  const skills = topicId ? getSkillsForTopic(topicId) : getSkills()
  return skills.filter((s) => s.mastery >= 80).sort((a, b) => b.mastery - a.mastery)
}

export function getSkillMastery(topicId: string): number {
  const skills = getSkillsForTopic(topicId)
  if (skills.length === 0) return 0
  return Math.round(skills.reduce((sum, s) => sum + s.mastery, 0) / skills.length)
}

export function clearSkills(topicId?: string) {
  if (typeof window === "undefined") return
  if (topicId) {
    const skills = getSkills().filter((s) => s.topicId !== topicId)
    localStorage.setItem(SKILL_KEY, JSON.stringify(skills))
  } else {
    localStorage.removeItem(SKILL_KEY)
  }
}