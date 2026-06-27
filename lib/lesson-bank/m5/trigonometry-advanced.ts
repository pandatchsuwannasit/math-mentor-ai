import type { Lesson } from "../types"

export const M5_TRIGONOMETRY_ADVANCED_LESSON: Lesson = {
  id: "m5-trigonometry-advanced",
  curriculum: "M5",
  topicId: "m5-trigonometry-advanced",
  title: "ตรีโกณมิติขั้นสูง",
  description: "สูตรตรีโกณมิติ",
  estimatedReadingTime: 10,
  difficulty: "hard",
  learningObjectives: ["ใช้สูตรตรีโกณมิติ"],
  prerequisites: ["m3-trigonometry"],
  keywords: ["sin", "cos", "tan", "สูตร"],
  introduction: "สูตรตรีโกณนิติช่วยคำนวณมุมต่างๆ",
  concepts: [{ title: "สูตร", content: "sin(A±B), cos(A±B), tan(A±B)" }],
  examples: [{ question: "sin(45°+30°)", solution: "ใช้สูตร sin(A+B)", answer: "(√6+√2)/4" }],
  summary: ["ใช้สูตรเพิ่มมุม"],
  commonMistakes: ["สับสนเครื่องหมาย"],
  formulas: [{ name: "sin(A+B)", formula: "sinA cosB + cosA sinB", description: "สูตรsinมุมรวม" }],
  relatedTopics: ["m3-trigonometry", "m5-calculus-basics"],
  quizTopicId: "m5-trigonometry-advanced",
  version: 1,
}
export default M5_TRIGONOMETRY_ADVANCED_LESSON