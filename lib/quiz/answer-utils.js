export function getQuestionAnswerIndex(question) {
  return question.answer
}

export function isAnswerCorrect(question, selectedAnswerIndex) {
  return getQuestionAnswerIndex(question) === selectedAnswerIndex
}

export function shuffleQuestionChoices(question, random = Math.random) {
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

export function calculateScore(questions, answers) {
  return answers.reduce((acc, answer, index) => acc + (isAnswerCorrect(questions[index], answer) ? 1 : 0), 0)
}

export function getWrongQuestionIds(questions, answers) {
  return questions.filter((question, index) => !isAnswerCorrect(question, answers[index])).map((question) => question.id)
}

export function runQuizFlow(question, selectedAnswerIndex, hearts) {
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
