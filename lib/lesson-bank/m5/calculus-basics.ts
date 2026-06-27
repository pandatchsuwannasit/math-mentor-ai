import type { Lesson } from "../types"

export const M5_CALCULUS_BASICS_LESSON: Lesson = {
  id: "m5-calculus-basics",
  curriculum: "M5",
  topicId: "m5-calculus-basics",
  title: "แคลคูลัสพื้นฐาน",
  description: "จำกัดและอนุพันธ์",
  estimatedReadingTime: 12,
  difficulty: "hard",
  learningObjectives: ["เข้าใจอนุพันธ์", "คำนวณจำกัดเบื้องต้น"],
  prerequisites: ["m3-functions"],
  keywords: ["อนุพันธ์", "จำกัด", "ความชัน"],
  introduction: "แคลคูลัสเป็นสาขาคณิตศาสตร์ที่ศึกษาเกี่ยวกับการเปลี่ยนแปลง",
  concepts: [
    { title: "อนุพันธ์", content: "f'(x) = จำกัดเมื่อ h→0 ของ (f(x+h)-f(x))/h" },
  ],
  examples: [
    { question: "หาอนุพันธ์ของ x²", solution: "f'(x) = 2x", answer: "2x" },
  ],
  summary: ["อนุพันธ์ = ความชัน", "ใช้กฎพจน์"],
  commonMistakes: ["ลืมลดเลขชี้กำลัง"],
  formulas: [{ name: "กฎพจน์", formula: "d/dx(xⁿ) = nxⁿ⁻¹", description: "อนุพันธ์ของxⁿ" }],
  relatedTopics: ["m3-functions", "m5-derivatives"],
  quizTopicId: "m5-calculus-basics",
  version: 1,
}
export default M5_CALCULUS_BASICS_LESSON