import type { Forecast } from "./types"

export function generateForecast(current: {
  accuracy: number
  mastery: number
  xp: number
  level: number
  studyMinutes: number
}): Forecast {
  // Simple linear projection based on study time
  // Assumes 1% accuracy improvement per 10 minutes of focused study
  const accuracyImprovement = Math.min(current.studyMinutes / 10, 10)
  const expectedAccuracy = Math.min(100, Math.round(current.accuracy + accuracyImprovement))

  // Mastery improves slightly slower
  const masteryImprovement = Math.min(current.studyMinutes / 15, 8)
  const expectedMastery = Math.min(100, Math.round(current.mastery + masteryImprovement))

  // XP: roughly 10 XP per minute of study
  const xpGain = current.studyMinutes * 10
  const expectedXP = current.xp + xpGain

  // Level: every 200 XP = 1 level
  const currentLevelFromXP = Math.floor(current.xp / 200) + 1
  const expectedLevelFromXP = Math.floor(expectedXP / 200) + 1
  const expectedLevel = Math.max(current.level, expectedLevelFromXP)

  const improvementPercent = current.accuracy > 0 ? Math.round((accuracyImprovement / current.accuracy) * 100) : 0

  return {
    currentAccuracy: current.accuracy,
    expectedAccuracy,
    currentMastery: current.mastery,
    expectedMastery,
    currentXP: current.xp,
    expectedXP,
    currentLevel: current.level,
    expectedLevel,
    improvementPercent,
  }
}