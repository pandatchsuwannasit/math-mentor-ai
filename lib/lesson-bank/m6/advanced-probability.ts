import type { Lesson } from "../types"

export const M6_ADVANCED_PROBABILITY_LESSON: Lesson = {
  id: "m6-advanced-probability",
  curriculum: "M6",
  topicId: "m6-advanced-probability",
  title: "ความน่าจะเป็นขั้นสูง",
  description: "การแจกแจงและสถิติ",
  estimatedReadingTime: 10,
  difficulty: "hard",
  learningObjectives: ["ใช้การแจกแจง", "คำนวณความน่าจะเป็นซับซ้อน"],
  prerequisites: ["m5-probability-advanced"],
  keywords: ["ความน่าจะเป็น", "แจกแจง", "เบอร์นูลี"],
  introduction: "ความน่าจะเป็นขั้นสูงใช้ในการ modeled กิจกรรมสุ่ม",
  concepts: [{ title: "การแจกแจง", content: "การแจกแจงบอกความน่าจะเป็นของแต่ละผล" }],
  examples: [{ question: "โยนเหรียญ 2 ครั้ง โอกาสได้หัว 2 ครั้ง", solution: "P = 1/2 × 1/2 = 1/4", answer: "1/4" }],
  summary: ["P(A∩B) = P(A)×P(B) หากอิสระ"],
  commonMistakes: ["บวกความน่าจะเป็นเกิน 1"],
  formulas: [{ name: "อิสระ", formula: "P(A∩B) = P(A)P(B)", description: "เหตุการณ์อิสระ" }],
  relatedTopics: ["m5-probability-advanced", "m6-applications"],
  quizTopicId: "m6-advanced-probability",
  version: 1,
}
export default M6_ADVANCED_PROBABILITY_LESSON