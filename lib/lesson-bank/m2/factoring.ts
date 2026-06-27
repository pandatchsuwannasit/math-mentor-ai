import type { Lesson } from "../types"

export const M2_FACTORING_LESSON: Lesson = {
  id: "m2-factoring",
  curriculum: "M2",
  topicId: "m2-factoring",
  title: "แยกตัวประกอบ",
  description: "การแยกตัวประกอบพหุนาม",
  estimatedReadingTime: 12,
  difficulty: "medium",
  learningObjectives: ["แยกตัวประกอบพหุนามได้", "ใช้แยกตัวประกอบแก้สมการ"],
  prerequisites: ["m2-polynomials"],
  keywords: ["แยกตัวประกอบ", "พหุนาม", "ตัวประกอบ"],
  introduction: "การแยกตัวประกอบเป็นการเขียนพหุนามเป็นผลคูณของพหุนามที่มีดีกรีต่ำกว่า",
  concepts: [
    { title: "แยกตัวประกอบจากตัวประกอบร่วม", content: "หาตัวประกอบร่วมของพจน์ทั้งหมดแล้วนำออก" },
    { title: "แยกตัวประกอบแบบกลุ่ม", content: "จัดกลุ่มพจน์แล้วแยกตัวประกอบร่วม" },
  ],
  examples: [
    { question: "แยกตัวประกอบ: 2x² + 8x", solution: "ตัวประกอบร่วม = 2x\n2x(x + 4)", answer: "2x(x + 4)" },
  ],
  summary: ["หาตัวประกอบร่วม", "แยกออกจากพหุนาม"],
  commonMistakes: ["ลืมตัวประกอบร่วมทั้งหมด"],
  formulas: [{ name: "แยกตัวประกอบ", formula: "ax² + bx = x(ax + b)", description: "แยกตัวประกอบร่วม x" }],
  relatedTopics: ["m2-polynomials", "m2-pythagorean"],
  quizTopicId: "m2-factoring",
  version: 1,
}
export default M2_FACTORING_LESSON