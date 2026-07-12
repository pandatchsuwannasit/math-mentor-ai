import { getCurriculumTopicsForLevel } from "../lib/curriculum.ts"
import { getQuestionsForTopic } from "../lib/question-bank/index.ts"

const REQUIRED_TOPICS = [
  "m1-integers",
  "m1-fractions",
  "m1-decimals",
  "m1-linear-equations",
  "m1-ratio",
  "m1-percentage",
  "m1-geometry",
  "m1-area",
  "m1-volume",
  "m1-graphs",
  "m1-statistics",
  "m1-basic-probability",
]

function main() {
  const grade7Topics = getCurriculumTopicsForLevel("M1").map((topic) => topic.id)
  const missingTopics = REQUIRED_TOPICS.filter((topicId) => !grade7Topics.includes(topicId))

  if (missingTopics.length > 0) {
    throw new Error(`Missing Grade 7 topics: ${missingTopics.join(", ")}`)
  }

  const questions = REQUIRED_TOPICS.flatMap((topicId) => getQuestionsForTopic(topicId))
  const incomplete = questions.filter((question) => {
    const hasExplanation = Boolean(question.explanation?.trim())
    const hasSteps = Array.isArray(question.solutionSteps) && question.solutionSteps.length > 0
    const hasTopic = Boolean(question.topicName?.trim())
    return !hasExplanation || !hasSteps || !hasTopic
  })

  if (incomplete.length > 0) {
    throw new Error(`Incomplete Grade 7 quiz data: ${incomplete.slice(0, 3).map((q) => q.id).join(", ")}`)
  }

  console.log(`Grade 7 quiz data verified: ${questions.length} questions across ${REQUIRED_TOPICS.length} topics`)
}

main()
