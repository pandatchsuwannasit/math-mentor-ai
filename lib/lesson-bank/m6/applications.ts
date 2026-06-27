import type { Lesson } from "../types"

export const M6_APPLICATIONS_LESSON: Lesson = {
  id: "m6-applications",
  curriculum: "M6",
  topicId: "m6-applications",
  title: "ประยุกต์แคลคูลัส",
  description: "ใช้แคลคูลัส解决ปัญหา",
  estimatedReadingTime: 12,
  difficulty: "hard",
  learningObjectives: ["ใช้อนุพันธ์และปริพันธ์解决ปัญหา"],
  prerequisites: ["m6-integrals"],
  keywords: ["แคลคูลัส", "ประยุกต์", "ปัญหา"],
  introduction: "ใช้แคลคูลัส解决ปัญหาชีวิตจริง",
  concepts: [{ title: "พื้นที่ใต้เส้น", content: "∫f(x)dx = พื้นที่ใต้ f(x)" }],
  examples: [{ question: "หาพื้นที่ใต้ y=x² จาก 0 ถึง 2", solution: "∫₀² x²dx = [x³/3]₀² = 8/3", answer: "8/3" }],
  summary: ["ใช้ปริพันธ์หาพื้นที่"],
  commonMistakes: ["ลืมขอบเขตการ整合"],
  formulas: [{ name: "พื้นที่", formula: "∫ₐᵇ f(x)dx", description: "พื้นที่ใต้ f(x) จาก a ถึง b" }],
  relatedTopics: ["m6-integrals", "m6-advanced-probability"],
  quizTopicId: "m6-applications",
  version: 1,
}
export default M6_APPLICATIONS_LESSON