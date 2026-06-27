import type { Lesson } from "../types"

export const M6_LIMITS_LESSON: Lesson = {
  id: "m6-limits",
  curriculum: "M6",
  topicId: "m6-limits",
  title: "จำกัด",
  description: "แนวคิดจำกัด",
  estimatedReadingTime: 10,
  difficulty: "hard",
  learningObjectives: ["เข้าใจแนวคิดจำกัด"],
  prerequisites: ["m5-calculus-basics"],
  keywords: ["จำกัด", "趋近"],
  introduction: "จำกัดเป็นแนวคิดพื้นฐานของแคลคูลัส",
  concepts: [{ title: "จำกัด", content: "lim(x→a) f(x) = L" }],
  examples: [{ question: "lim(x→2) (x²-4)/(x-2)", solution: "แยกตัวประกอบ: (x-2)(x+2)/(x-2) = x+2\nlim = 4", answer: "4" }],
  summary: ["จำกัดเมื่อ x趋近 a"],
  commonMistakes: ["ใส่ x=a ตรงๆ"],
  formulas: [{ name: "จำกัด", formula: "lim(x→a) f(x)", description: "ค่าเมื่อ x趋近 a" }],
  relatedTopics: ["m5-calculus-basics", "m6-derivatives-advanced"],
  quizTopicId: "m6-limits",
  version: 1,
}
export default M6_LIMITS_LESSON