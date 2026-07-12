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

export function validateQuestionAnswerMapping(question: QuizQuestion): { isValid: boolean; answerIndex: number; correctChoice: string | undefined } {
  const answerIndex = getQuestionAnswerIndex(question)
  const isValid = Number.isInteger(answerIndex) && answerIndex >= 0 && answerIndex < question.choices.length
  const correctChoice = isValid ? question.choices[answerIndex] : undefined
  return {
    isValid: isValid && typeof correctChoice === "string",
    answerIndex,
    correctChoice,
  }
}

export function isAnswerCorrect(question: QuizQuestion, selectedAnswerIndex: number): boolean {
  const mapping = validateQuestionAnswerMapping(question)
  if (!mapping.isValid) return false
  return mapping.answerIndex === selectedAnswerIndex
}

export function shuffleQuestionChoices<T extends QuizQuestion>(question: T, random: () => number = Math.random): T {
  const mapping = validateQuestionAnswerMapping(question)
  if (!mapping.isValid || mapping.correctChoice === undefined) {
    throw new Error(`Invalid quiz answer mapping before shuffle: ${question.id}`)
  }

  const shuffledChoices = [...question.choices]
  for (let i = shuffledChoices.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[shuffledChoices[i], shuffledChoices[j]] = [shuffledChoices[j], shuffledChoices[i]]
  }

  const newAnswerIndex = shuffledChoices.indexOf(mapping.correctChoice)
  if (newAnswerIndex < 0) {
    throw new Error(`Unable to remap correct answer for question: ${question.id}`)
  }

  const shuffledQuestion = {
    ...question,
    choices: shuffledChoices,
    answer: newAnswerIndex,
  }

  const postShuffleMapping = validateQuestionAnswerMapping(shuffledQuestion)
  if (!postShuffleMapping.isValid || postShuffleMapping.correctChoice !== mapping.correctChoice) {
    throw new Error(`Answer mapping became invalid after shuffle: ${question.id}`)
  }

  return shuffledQuestion
}

export function calculateScore(questions: QuizQuestion[], answers: number[]): number {
  return answers.reduce((acc, answer, index) => acc + (isAnswerCorrect(questions[index], answer) ? 1 : 0), 0)
}

export function getWrongQuestionIds(questions: QuizQuestion[], answers: number[]): string[] {
  return questions.filter((question, index) => !isAnswerCorrect(question, answers[index])).map((question) => question.id)
}

export function runQuizFlow(question: QuizQuestion, selectedAnswerIndex: number, hearts: number): QuizAnswerResult {
  const mapping = validateQuestionAnswerMapping(question)
  const isCorrect = mapping.isValid && mapping.answerIndex === selectedAnswerIndex
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
    correctAnswerIndex: mapping.answerIndex,
  }
}
