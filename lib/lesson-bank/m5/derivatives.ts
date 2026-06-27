import type { Lesson } from "../types"

export const M5_DERIVATIVES_LESSON: Lesson = {
  id: "m5-derivatives",
  curriculum: "M5",
  topicId: "m5-derivatives",
  title: "อนุพันธ์",
  description: "กฎอนุพันธ์และการประยุกต์",
  estimatedReadingTime: 12,
  difficulty: "hard",
  learningObjectives: ["คำนวณอนุพันธ์ได้", "ใช้อนุพันธ์หาความชัน"],
  prerequisites: ["m5-calculus-basics"],
  keywords: ["อนุพันธ์", "ความชัน", "กฎ"],
  introduction: "อนุพันธ์ใช้หาความชันของฟังก์ชัน",
  concepts: [
    { title: "กฎอนุพันธ์", content: "d/dx[f±g] = f'±g', d/dx[fg] = f'g + fg'" },
  ],
  examples: [
    { question: "หาอนุพันธ์ของ x³ + 2x", solution: "3x² + 2", answer: "3x² + 2" },
  ],
  summary: ["ใช้กฎพจน์", "รวม/คูณได้"],
  commonMistakes: ["ลืมลดเลขชี้กำลัง"],
  formulas: [{ name: "กฎพจน์", formula: "d/dx(xⁿ) = nxⁿ⁻¹", description: "อนุพันธ์ของxⁿ" }],
  relatedTopics: ["m5-calculus-basics", "m5-probability-advanced"],
  quizTopicId: "m5-derivatives",
  version: 1,
}
export default M5_DERIVATIVES_LESSON