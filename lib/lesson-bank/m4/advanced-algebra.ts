import type { Lesson } from "../types"

export const M4_ADVANCED_ALGEBRA_LESSON: Lesson = {
  id: "m4-advanced-algebra",
  curriculum: "M4",
  topicId: "m4-advanced-algebra",
  title: "พีชคณิตขั้นสูง",
  description: "สมการและอสมการขั้นสูง",
  estimatedReadingTime: 12,
  difficulty: "hard",
  learningObjectives: ["แก้สมการขั้นสูง", "ใช้อสมการ"],
  prerequisites: ["m3-quadratics"],
  keywords: ["สมการ", "อสมการ", "พีชคณิต"],
  introduction: "พีชคณิตขั้นสูงเป็นการขยายความรู้พีชคณิตพื้นฐาน",
  concepts: [
    { title: "สมการที่มีตัวแปรในตัวหาร", content: "ต้องตรวจสอบเงื่อนไขตัวหารไม่เป็น 0" },
  ],
  examples: [
    { question: "หาค่า x: 1/x + 1/(x+1) = 1", solution: "ใช้ตัวหารร่วมน้อย", answer: "x = 1" },
  ],
  summary: ["ตรวจสอบเงื่อนไข", "ใช้ตัวหารร่วมน้อย"],
  commonMistakes: ["ลืมตรวจสอบเงื่อนไข"],
  formulas: [],
  relatedTopics: ["m3-quadratics", "m4-sequences"],
  quizTopicId: "m4-advanced-algebra",
  version: 1,
}
export default M4_ADVANCED_ALGEBRA_LESSON