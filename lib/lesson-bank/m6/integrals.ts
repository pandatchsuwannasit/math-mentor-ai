import type { Lesson } from "../types"

export const M6_INTEGRALS_LESSON: Lesson = {
  id: "m6-integrals",
  curriculum: "M6",
  topicId: "m6-integrals",
  title: "ปริพันธ์",
  description: "แนวคิดปริพันธ์",
  estimatedReadingTime: 12,
  difficulty: "hard",
  learningObjectives: ["เข้าใจปริพันธ์", "คำนวณพื้นที่ใต้เส้น"],
  prerequisites: ["m6-derivatives-advanced"],
  keywords: ["ปริพันธ์", "พื้นที่", "อินทิกรัล"],
  introduction: "ปริพันธ์เป็นกระบวนการตรงข้ามกับอนุพันธ์",
  concepts: [{ title: "ปริพันธ์ไม่กำหนด", content: "∫f(x)dx = F(x) + C" }],
  examples: [{ question: "หาปริพันธ์ของ x²", solution: "∫x²dx = x³/3 + C", answer: "x³/3 + C" }],
  summary: ["เป็นตรงกันข้ามกับอนุพันธ์"],
  commonMistakes: ["ลืม +C"],
  formulas: [{ name: "กฎพจน์", formula: "∫xⁿdx = xⁿ⁺¹/(n+1) + C", description: "ปริพันธ์ของxⁿ" }],
  relatedTopics: ["m6-derivatives-advanced", "m6-applications"],
  quizTopicId: "m6-integrals",
  version: 1,
}
export default M6_INTEGRALS_LESSON