import type { QuizQuestion } from "@/lib/question-bank/types"

export interface QuizAnswerResult {
  isCorrect: boolean
  score: number
  heartsAfter: number
  scoreDetails: {
    correct: number
    incorrect: number
  }
  selectedAnswerIndex: number
  correctAnswerIndex: number
}

export function getQuestionAnswerIndex(question: QuizQuestion): number {
  return question.answer
}

export function isAnswerCorrect(question: QuizQuestion, selectedAnswerIndex: number): boolean {
  return getQuestionAnswerIndex(question) === selectedAnswerIndex
}

export function shuffleQuestionChoices<T extends QuizQuestion>(question: T, random: () => number = Math.random): T {
  const originalAnswer = question.choices[question.answer]
  const shuffledChoices = [...question.choices]
  for (let i = shuffledChoices.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[shuffledChoices[i], shuffledChoices[j]] = [shuffledChoices[j], shuffledChoices[i]]
  }
  const newAnswerIndex = shuffledChoices.indexOf(originalAnswer)
  return {
    ...question,
    choices: shuffledChoices,
    answer: newAnswerIndex,
  }
}

export function calculateScore(questions: QuizQuestion[], answers: number[]): number {
  return answers.reduce((acc, answer, index) => acc + (isAnswerCorrect(questions[index], answer) ? 1 : 0), 0)
}

export function getWrongQuestionIds(questions: QuizQuestion[], answers: number[]): string[] {
  return questions.filter((question, index) => !isAnswerCorrect(question, answers[index])).map((question) => question.id)
}

export function runQuizFlow(question: QuizQuestion, selectedAnswerIndex: number, hearts: number): QuizAnswerResult {
  const isCorrect = isAnswerCorrect(question, selectedAnswerIndex)
  const nextHearts = isCorrect ? hearts : hearts - 1
  const score = isCorrect ? 1 : 0

  return {
    isCorrect,
    score,
    heartsAfter: Math.max(nextHearts, 0),
    scoreDetails: {
      correct: score,
      incorrect: isCorrect ? 0 : 1,
    },
    selectedAnswerIndex,
    correctAnswerIndex: getQuestionAnswerIndex(question),
  }
}
