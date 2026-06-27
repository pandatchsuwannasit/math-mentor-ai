import type { StudyPlan, StudyPlanTask } from "./types"
import { getAllLessonProgress } from "@/lib/lesson-bank"
import { getAllTopicProgress, getQuestionsForTopic } from "@/lib/question-bank"
import { getAllCurriculumTopics } from "@/lib/curriculum"

export function generateStudyPlan(user: { stats: { accuracy: number; streak: number }; onboarding: { currentCurriculum?: string } | null }): StudyPlan {
  if (!user.onboarding) {
    return {
      tasks: [],
      estimatedMinutes: 0,
      difficulty: "medium",
      expectedXP: 0,
      completionRate: 0,
    }
  }

  const tasks: StudyPlanTask[] = []
  const currentCurriculum = user.onboarding.currentCurriculum || "M1"
  const curriculumTopics = getAllCurriculumTopics().filter((t) => t.id.startsWith(currentCurriculum.toLowerCase()))
  const allLessonProgress = getAllLessonProgress()
  const allTopicProgress = getAllTopicProgress()

  // Task 1: Continue or start a lesson
  const incompleteLesson = curriculumTopics.find((t) => {
    const progress = allLessonProgress[t.id]
    return !progress || progress.status !== "completed"
  })

  if (incompleteLesson) {
    tasks.push({
      id: `lesson-${incompleteLesson.id}`,
      type: "lesson",
      title: `Read: ${incompleteLesson.title}`,
      description: incompleteLesson.description,
      topicId: incompleteLesson.id,
      estimatedMinutes: 15,
      difficulty: "medium",
      xpReward: 50,
      completed: false,
    })
  }

  // Task 2: Practice quiz
  const practiceTopic = incompleteLesson?.id || curriculumTopics[0]?.id || ""
  if (practiceTopic) {
    const questions = getQuestionsForTopic(practiceTopic)
    const questionCount = Math.min(10, questions.length)
    tasks.push({
      id: `quiz-${practiceTopic}`,
      type: "quiz",
      title: `Practice Quiz`,
      description: `Answer ${questionCount} questions on ${practiceTopic}`,
      topicId: practiceTopic,
      estimatedMinutes: questionCount * 2,
      difficulty: user.stats.accuracy < 60 ? "easy" : "medium",
      xpReward: questionCount * 10,
      completed: false,
    })
  }

  // Task 3: Review mistakes (if any wrong answers)
  const wrongQuestions = allTopicProgress[practiceTopic]?.wrongQuestionIds || []
  if (wrongQuestions.length > 0) {
    tasks.push({
      id: `review-${practiceTopic}`,
      type: "review",
      title: "Review Mistakes",
      description: `Review ${Math.min(5, wrongQuestions.length)} questions you got wrong`,
      topicId: practiceTopic,
      estimatedMinutes: 5,
      difficulty: "medium",
      xpReward: 20,
      completed: false,
    })
  }

  // Calculate totals
  const estimatedMinutes = tasks.reduce((sum, task) => sum + task.estimatedMinutes, 0)
  const expectedXP = tasks.reduce((sum, task) => sum + task.xpReward, 0)
  const difficulties = tasks.map((t) => t.difficulty)
  const difficulty = difficulties.includes("hard") ? "hard" : difficulties.includes("medium") ? "medium" : "easy"

  return {
    tasks,
    estimatedMinutes,
    difficulty,
    expectedXP,
    completionRate: 0,
  }
}