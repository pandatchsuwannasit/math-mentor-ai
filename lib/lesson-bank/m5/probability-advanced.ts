import type { Lesson } from "../types"

export const M5_PROBABILITY_ADVANCED_LESSON: Lesson = {
  id: "m5-probability-advanced",
  curriculum: "M5",
  topicId: "m5-probability-advanced",
  title: "ความน่าจะเป็นขั้นสูง",
  description: "การแจกแจงและความน่าจะเป็น",
  estimatedReadingTime: 10,
  difficulty: "hard",
  learningObjectives: ["เข้าใจการแจกแจง", "คำนวณความน่าจะเป็นขั้นสูง"],
  prerequisites: ["m2-probability"],
  keywords: ["ความน่าจะเป็น", "แจกแจง", "เบอร์นูลี"],
  introduction: "ความน่าจะเป็นขั้นสูงใช้ในการ modeled กิจกรรมสุ่ม",
  concepts: [
    { title: "การแจกแจง", content: "การแจกแจงบอกความน่าจะเป็นของแต่ละผล" },
  ],
  examples: [
    { question: "โยนเหรียญ 2 ครั้ง โอกาสได้หัว 2 ครั้ง", solution: "P = 1/2 × 1/2 = 1/4", answer: "1/4" },
  ],
  summary: ["P(A∩B) = P(A)×P(B) หากอิสระ"],
  commonMistakes: ["บวกความน่าจะเป็นเกิน 1"],
  formulas: [{ name: "อิสระ", formula: "P(A∩B) = P(A)P(B)", description: "เหตุการณ์อิสระ" }],
  relatedTopics: ["m2-probability", "m5-derivatives"],
  quizTopicId: "m5-probability-advanced",
  version: 1,
}
export default M5_PROBABILITY_ADVANCED_LESSON