import assert from "node:assert/strict"
import { shuffleQuestionChoices, getQuestionAnswerIndex, isAnswerCorrect, calculateScore, getWrongQuestionIds, runQuizFlow } from "../lib/quiz/answer-utils.ts"

function createQuestion() {
  const answer = Math.floor(Math.random() * 4)
  const choices = ["A", "B", "C", "D"].map((label, index) => `${label}-${index}`)
  return {
    id: `q-${Math.random().toString(36).slice(2)}`,
    curriculum: "M1",
    topicId: "m1-integers",
    topicName: "จำนวนเต็ม",
    difficulty: "easy",
    question: "Sample question",
    choices,
    answer,
    explanation: "Explain",
    hints: ["Hint 1", "Hint 2"],
    estimatedTime: 60,
    learningObjective: "Practice",
    tags: ["quiz"],
    source: "Math Mentor AI",
    version: 1,
  }
}

let mismatches = 0

for (let i = 0; i < 1000; i += 1) {
  const baseQuestion = createQuestion()
  const shuffledQuestion = shuffleQuestionChoices(baseQuestion, () => Math.random())
  const hint = shuffledQuestion.hints[0] ?? ""
  const selectedAnswer = Math.floor(Math.random() * shuffledQuestion.choices.length)
  const result = runQuizFlow(shuffledQuestion, selectedAnswer, 5)
  const expectedCorrect = isAnswerCorrect(shuffledQuestion, selectedAnswer)

  if (result.isCorrect !== expectedCorrect) {
    mismatches += 1
    continue
  }

  if (result.score !== (expectedCorrect ? 1 : 0)) {
    mismatches += 1
    continue
  }

  if (result.heartsAfter !== (expectedCorrect ? 5 : 4)) {
    mismatches += 1
    continue
  }

  if (result.scoreDetails.correct !== (expectedCorrect ? 1 : 0)) {
    mismatches += 1
    continue
  }

  if (getQuestionAnswerIndex(shuffledQuestion) !== shuffledQuestion.answer) {
    mismatches += 1
    continue
  }

  const answers = [selectedAnswer]
  const score = calculateScore([shuffledQuestion], answers)
  const wrongIds = getWrongQuestionIds([shuffledQuestion], answers)
  if (score !== (expectedCorrect ? 1 : 0) || wrongIds.length !== (expectedCorrect ? 0 : 1)) {
    mismatches += 1
    continue
  }

  if (!hint) {
    mismatches += 1
  }
}

assert.equal(mismatches, 0, `Expected 0 mismatches, received ${mismatches}`)
console.log(`Quiz flow randomized integration test passed: 1000 iterations, 0 mismatches`)
