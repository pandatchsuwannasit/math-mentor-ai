import { getAdaptiveQuestions } from "../lib/question-bank"
import { runQuizFlow, validateQuestionAnswerMapping } from "../lib/quiz/answer-utils"

interface QuizRunSummary {
  quizIndex: number
  topicId: string
  questions: number
  mismatches: number
}

function runRandomizedQuestionBankQuizSuite(): QuizRunSummary[] {
  const topics = ["m1-integers", "m1-linear-equations", "m2-factoring", "m2-pythagorean", "m3-quadratics", "m3-functions"]
  const summaries: QuizRunSummary[] = []

  for (let quizIndex = 0; quizIndex < 100; quizIndex += 1) {
    const topicId = topics[Math.floor(Math.random() * topics.length)]
    const accuracy = Math.floor(Math.random() * 101)
    const questions = getAdaptiveQuestions(topicId, accuracy, 10)
    let mismatches = 0

    for (const question of questions) {
      const mapping = validateQuestionAnswerMapping(question)
      if (!mapping.isValid || mapping.correctChoice === undefined) {
        mismatches += 1
        continue
      }

      const selectedIndex = Math.floor(Math.random() * question.choices.length)
      const result = runQuizFlow(question, selectedIndex, 5)
      const expectedCorrect = mapping.answerIndex === selectedIndex

      if (result.isCorrect !== expectedCorrect || result.correctAnswerIndex !== mapping.answerIndex) {
        mismatches += 1
        continue
      }

      if (question.choices[mapping.answerIndex] !== mapping.correctChoice) {
        mismatches += 1
      }
    }

    summaries.push({ quizIndex, topicId, questions: questions.length, mismatches })
  }

  return summaries
}

function main(): void {
  const summaries = runRandomizedQuestionBankQuizSuite()
  const totalMismatches = summaries.reduce((sum, entry) => sum + entry.mismatches, 0)

  console.log(`Randomized Question Bank quiz runs: ${summaries.length}`)
  console.log(`Total mismatches: ${totalMismatches}`)

  if (totalMismatches > 0) {
    console.error("Question Bank quiz validation failed")
    process.exit(1)
  }

  console.log("Question Bank quiz validation passed with zero mismatches")
}

main()
