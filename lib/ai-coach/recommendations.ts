import type { Recommendation } from "./types"
import { getNextLesson, getPreviousLesson } from "@/lib/lesson-bank"
import { getAllTopicProgress } from "@/lib/question-bank"

export function getRecommendations(user: {
  stats: { accuracy: number; questionsDone: number }
  onboarding: { currentCurriculum?: string } | null
}): Recommendation[] {
  if (!user.onboarding) return []

  const recommendations: Recommendation[] = []
  const allTopicProgress = getAllTopicProgress()

  // Find weak topics (accuracy < 50%)
  const weakTopics = Object.entries(allTopicProgress)
    .filter(([, progress]) => progress.attempts > 0 && (progress.totalCorrect / (progress.totalCorrect + progress.totalWrong)) < 0.5)
    .sort((a, b) => {
      const accA = a[1].totalCorrect / (a[1].totalCorrect + a[1].totalWrong)
      const accB = b[1].totalCorrect / (b[1].totalCorrect + b[1].totalWrong)
      return accA - accB
    })
    .slice(0, 3)

  // Find strong topics (accuracy > 80%)
  const strongTopics = Object.entries(allTopicProgress)
    .filter(([, progress]) => progress.attempts > 0 && (progress.totalCorrect / (progress.totalCorrect + progress.totalWrong)) >= 0.8)
    .sort((a, b) => {
      const accA = a[1].totalCorrect / (a[1].totalCorrect + a[1].totalWrong)
      const accB = b[1].totalCorrect / (b[1].totalCorrect + b[1].totalWrong)
      return accB - accA
    })
    .slice(0, 3)

  // Recommendation 1: Review weak topics
  if (weakTopics.length > 0) {
    const [topicId, progress] = weakTopics[0]
    const accuracy = Math.round((progress.totalCorrect / (progress.totalCorrect + progress.totalWrong)) * 100)
    recommendations.push({
      type: "review-mistakes",
      title: "Review Weak Topic",
      description: `Your accuracy on this topic is ${accuracy}%. Review the lesson and practice more.`,
      topicId,
      reason: `Low accuracy (${accuracy}%)`,
      estimatedMinutes: 20,
      xpReward: 100,
    })
  }

  // Recommendation 2: Hard practice for advanced students
  if (user.stats.accuracy >= 70 && user.stats.questionsDone > 20) {
    const currentCurriculum = user.onboarding.currentCurriculum || "M1"
    const curriculumTopics = Object.keys(allTopicProgress).filter((id) => id.startsWith(currentCurriculum.toLowerCase()))
    const randomTopic = curriculumTopics[Math.floor(Math.random() * curriculumTopics.length)]

    if (randomTopic) {
      recommendations.push({
        type: "hard-practice",
        title: "Challenge Yourself",
        description: "Try harder questions to push your limits.",
        topicId: randomTopic,
        reason: "High accuracy - ready for challenge",
        estimatedMinutes: 15,
        xpReward: 150,
      })
    }
  }

  // Recommendation 3: Easy practice for struggling students
  if (user.stats.accuracy < 50) {
    const currentCurriculum = user.onboarding.currentCurriculum || "M1"
    const curriculumTopics = Object.keys(allTopicProgress).filter((id) => id.startsWith(currentCurriculum.toLowerCase()))
    const randomTopic = curriculumTopics[Math.floor(Math.random() * curriculumTopics.length)]

    if (randomTopic) {
      recommendations.push({
        type: "easy-practice",
        title: "Build Confidence",
        description: "Practice easier questions to strengthen your foundation.",
        topicId: randomTopic,
        reason: "Low accuracy - build confidence first",
        estimatedMinutes: 10,
        xpReward: 50,
      })
    }
  }

  // Recommendation 4: Continue lesson
  const allLessonProgress = getAllTopicProgress() // Using topic progress as placeholder
  const incompleteTopic = Object.keys(allTopicProgress).find((id) => {
    const progress = allTopicProgress[id]
    return progress && progress.bestScore < 100
  })

  if (incompleteTopic) {
    recommendations.push({
      type: "continue-lesson",
      title: "Continue Learning",
      description: "You have an incomplete lesson. Continue where you left off.",
      topicId: incompleteTopic,
      reason: "Incomplete lesson",
      estimatedMinutes: 15,
      xpReward: 50,
    })
  }

  // Recommendation 5: Next lesson in sequence
  const nextLesson = getNextLesson(incompleteTopic || "")
  if (nextLesson && recommendations.length < 5) {
    recommendations.push({
      type: "next-lesson",
      title: "Next Lesson",
      description: "Ready for the next topic?",
      topicId: nextLesson,
      reason: "Sequential learning",
      estimatedMinutes: 15,
      xpReward: 50,
    })
  }

  return recommendations.slice(0, 5)
}