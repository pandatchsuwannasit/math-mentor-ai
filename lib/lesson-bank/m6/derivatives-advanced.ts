import type { Lesson } from "../types"

export const M6_DERIVATIVES_ADVANCED_LESSON: Lesson = {
  id: "m6-derivatives-advanced",
  curriculum: "M6",
  topicId: "m6-derivatives-advanced",
  title: "อนุพันธ์ขั้นสูง",
  description: "กฎลูกโซ่และอนุพันธ์อันดับสูง",
  estimatedReadingTime: 12,
  difficulty: "hard",
  learningObjectives: ["ใช้กฎลูกโซ่", "คำนวณอนุพันธ์อันดับสูง"],
  prerequisites: ["m5-derivatives"],
  keywords: ["อนุพันธ์", "ลูกโซ่", "อันดับสูง"],
  introduction: "อนุพันธ์ขั้นสูงช่วยคำนวณฟังก์ชันซับซ้อน",
  concepts: [{ title: "กฎลูกโซ่", content: "d/dx[f(g(x))] = f'(g(x)) × g'(x)" }],
  examples: [{ question: "หาอนุพันธ์ของ sin(x²)", solution: "ใช้ลูกโซ่: cos(x²) × 2x", answer: "2x cos(x²)" }],
  summary: ["ใช้ลูกโซ่", "อนุพันธ์อันดับสูง"],
  commonMistakes: ["ลืมคูณกับ g'(x)"],
  formulas: [{ name: "ลูกโซ่", formula: "f'(g(x)) = f'(u) × g'(x)", description: "อนุพันธ์ของฟังก์ชันซ้อน" }],
  relatedTopics: ["m5-derivatives", "m6-integrals"],
  quizTopicId: "m6-derivatives-advanced",
  version: 1,
}
export default M6_DERIVATIVES_ADVANCED_LESSON