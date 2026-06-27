import type { Lesson } from "../types"

export const M3_QUADRATICS_LESSON: Lesson = {
  id: "m3-quadratics",
  curriculum: "M3",
  topicId: "m3-quadratics",
  title: "สมการกำลังสอง",
  description: "การแก้สมการกำลังสอง",
  estimatedReadingTime: 12,
  difficulty: "medium",
  learningObjectives: ["แก้สมการกำลังสองได้", "ใช้สูตรการแก้สมการกำลังสอง"],
  prerequisites: ["m2-factoring"],
  keywords: ["กำลังสอง", "พหุนาม", "สูตร"],
  introduction: "สมการกำลังสองเป็นสมการที่มีตัวแปรอยู่ยอดกำลัง 2",
  concepts: [
    { title: "รูปของสมการกำลังสอง", content: "ax² + bx + c = 0 โดย a ≠ 0" },
    { title: "สูตรการแก้", content: "x = (-b ± √(b²-4ac)) / 2a" },
  ],
  examples: [
    { question: "หาค่า x: x² - 5x + 6 = 0", solution: "แยกตัวประกอบ: (x-2)(x-3) = 0\nx = 2 หรือ x = 3", answer: "x = 2, 3" },
  ],
  summary: ["ใช้สูตรหรือแยกตัวประกอบ", "ตรวจสอบคำตอบ"],
  commonMistakes: ["ลืมเปลี่ยนเครื่องหมายในสูตร"],
  formulas: [{ name: "สูตรกำลังสอง", formula: "x = (-b ± √(b²-4ac)) / 2a", description: "สูตรการแก้สมการกำลังสอง" }],
  relatedTopics: ["m2-factoring", "m3-functions"],
  quizTopicId: "m3-quadratics",
  version: 1,
}
export default M3_QUADRATICS_LESSON