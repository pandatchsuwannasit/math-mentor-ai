import type { AIAnalysis } from "./types"
import type { User } from "@/lib/types"
import type { TopicProgress } from "@/lib/question-bank/types"
import { getAllLessonProgress, getNextLesson } from "@/lib/lesson-bank"
import { getAllTopicProgress, getQuestionsForTopic } from "@/lib/question-bank"
import { getAllCurriculumTopics } from "@/lib/curriculum"

export function analyzeStudent(user: User): AIAnalysis {
  const { stats, onboarding } = user
  if (!onboarding) {
    return {
      overallMastery: 0,
      estimatedSkill: 0,
      weakTopics: [],
      strongTopics: [],
      recommendedTopic: "",
      recommendedLesson: "",
      recommendedQuiz: "",
      studyPriority: "low",
      estimatedStudyMinutes: 15,
      motivationMessage: "Complete your onboarding to get personalized recommendations!",
    }
  }
  const allLessonProgress = getAllLessonProgress()
  const allTopicProgress = getAllTopicProgress()
  const curriculumTopics = getAllCurriculumTopics()

  // Calculate topic accuracies
  const topicAccuracies: Record<string, number> = {}
  const topicMastery: Record<string, number> = {}

  curriculumTopics.forEach((topic) => {
    const progress = allTopicProgress[topic.id]
    if (progress && progress.attempts > 0) {
      topicAccuracies[topic.id] = progress.totalCorrect / (progress.totalCorrect + progress.totalWrong)
      topicMastery[topic.id] = progress.bestScore / 100
    } else {
      topicAccuracies[topic.id] = 0
      topicMastery[topic.id] = 0
    }
  })

  // Identify weak and strong topics
  const sortedByMastery = Object.entries(topicMastery).sort((a, b) => a[1] - b[1])
  const weakTopics = sortedByMastery.filter(([, mastery]) => mastery < 0.5).map(([id]) => id)
  const strongTopics = sortedByMastery.filter(([, mastery]) => mastery >= 0.8).map(([id]) => id)

  // Calculate overall mastery
  const masteryValues = Object.values(topicMastery)
  const overallMastery = masteryValues.length > 0
    ? masteryValues.reduce((sum, m) => sum + m, 0) / masteryValues.length
    : 0

  // Estimate skill level (0-100)
  const estimatedSkill = Math.round(
    overallMastery * 40 + // 40% from mastery
    Math.min(stats.accuracy, 100) * 0.3 + // 30% from accuracy
    Math.min(stats.streak * 2, 20) + // 20% from streak (max 20)
    Math.min(stats.lessonsCompleted * 2, 10) // 10% from lessons (max 10)
  )

  // Determine study priority
  let studyPriority: "high" | "medium" | "low" = "low"
  if (stats.accuracy < 50 || weakTopics.length > 3) {
    studyPriority = "high"
  } else if (stats.accuracy < 70 || weakTopics.length > 0) {
    studyPriority = "medium"
  }

  // Find recommended topic
  const currentCurriculum = onboarding.currentCurriculum || "M1"
  const currentTopics = curriculumTopics.filter((t) => {
    const level = t.id.split("-")[0]
    return level === currentCurriculum.toLowerCase()
  })

  // Priority: weak topic in current curriculum > incomplete lesson > next in sequence
  let recommendedTopic = currentTopics[0]?.id || ""
  let recommendedLesson = recommendedTopic
  let recommendedQuiz = recommendedTopic

  // Check for weak topics in current curriculum
  const weakInCurrent = weakTopics.find((id) => currentTopics.some((t) => t.id === id))
  if (weakInCurrent) {
    recommendedTopic = weakInCurrent
    recommendedLesson = weakInCurrent
    recommendedQuiz = weakInCurrent
  } else {
    // Find incomplete lesson
    const incompleteLesson = currentTopics.find((t) => {
      const progress = allLessonProgress[t.id]
      return !progress || progress.status !== "completed"
    })

    if (incompleteLesson) {
      recommendedLesson = incompleteLesson.id
      recommendedTopic = incompleteLesson.id
      recommendedQuiz = incompleteLesson.id
    } else {
      // Get next lesson in sequence
      const lastCompleted = Object.entries(allLessonProgress)
        .filter(([, p]) => p.status === "completed")
        .sort((a, b) => b[1].completedAt?.localeCompare(a[1].completedAt || "") || 0)[0]

      if (lastCompleted) {
        const nextLesson = getNextLesson(lastCompleted[0])
        if (nextLesson) {
          recommendedLesson = nextLesson
          recommendedTopic = nextLesson
          recommendedQuiz = nextLesson
        }
      }
    }
  }

  // Estimate study time
  const estimatedStudyMinutes = Math.max(15, Math.round(weakTopics.length * 10 + (100 - estimatedSkill) / 5))

  // Generate motivation message
  const motivationMessage = generateMotivationMessage({
    overallMastery,
    estimatedSkill,
    weakTopics,
    strongTopics,
    studyPriority,
    stats,
    recommendedTopic,
  })

  return {
    overallMastery: Math.round(overallMastery * 100),
    estimatedSkill,
    weakTopics: weakTopics.slice(0, 5),
    strongTopics: strongTopics.slice(0, 5),
    recommendedTopic,
    recommendedLesson: recommendedLesson,
    recommendedQuiz,
    studyPriority,
    estimatedStudyMinutes,
    motivationMessage,
  }
}

function generateMotivationMessage(data: {
  overallMastery: number
  estimatedSkill: number
  weakTopics: string[]
  strongTopics: string[]
  studyPriority: string
  stats: User["stats"]
  recommendedTopic: string
}): string {
  const { overallMastery, estimatedSkill, weakTopics, strongTopics, studyPriority, stats, recommendedTopic } = data

  // Level-based messages
  if (stats.level >= 10) {
    return " phenomenal effort! You're becoming a mathematics master. Keep pushing forward!"
  }

  if (stats.level >= 5) {
    return "Great progress! You're building strong mathematical foundations."
  }

  // Priority-based messages
  if (studyPriority === "high" && weakTopics.length > 0) {
    const topicName = recommendedTopic.split("-").slice(1).join(" ")
    return `Focusing on ${topicName} today will give you the biggest improvement. You've got this!`
  }

  // Streak messages
  if (stats.streak >= 7) {
    return `Amazing ${stats.streak}-day streak! Your consistency is paying off.`
  }

  if (stats.streak >= 3) {
    return `Great ${stats.streak}-day streak! Keep the momentum going.`
  }

  // Improvement messages
  if (stats.accuracy >= 80) {
    return "Excellent accuracy! You're mastering these concepts quickly."
  }

  if (stats.accuracy >= 60) {
    return "Good progress! A little more practice and you'll master this topic."
  }

  // Default encouragement
  const topicName = recommendedTopic.split("-").slice(1).join(" ")
  return `Let's work on ${topicName} today. Every step forward counts!`
}