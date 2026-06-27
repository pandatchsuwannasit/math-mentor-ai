import type { Lesson } from "../types"

export const M2_PROBABILITY_LESSON: Lesson = {
  id: "m2-probability",
  curriculum: "M2",
  topicId: "m2-probability",
  title: "ความน่าจะเป็น",
  description: "พื้นฐานความน่าจะเป็น",
  estimatedReadingTime: 10,
  difficulty: "easy",
  learningObjectives: ["คำนวณความน่าจะเป็นได้", "เข้าใจผลลัพธ์เท่าเทียมกัน"],
  prerequisites: ["m1-data-basics"],
  keywords: ["ความน่าจะเป็น", "ผลลัพธ์", "favore"],
  introduction: "ความน่าจะเป็นเป็นสาขาคณิตศาสตร์ที่ศึกษาเกี่ยวกับโอกาสของเหตุการณ์ต่างๆ",
  concepts: [
    { title: "ความน่าจะเป็น", content: "P(A) = จำนวนผลที่ favore ÷ จำนวนผลทั้งหมด" },
    { title: "ผลลัพธ์เท่าเทียมกัน", content: "ผลลัพธ์ที่มีโอกาสเท่ากัน เช่น โยนเหรียญ" },
  ],
  examples: [
    { question: "โยนลูกเต๋า 1 ลูก โอกาสได้เลขคู่เท่าไร?", solution: "เลขคู่ = 2,4,6 (3 ค่า)\nP = 3/6 = 1/2", answer: "1/2" },
  ],
  summary: ["P = favore ÷ ทั้งหมด", "ผลเท่าเทียมกัน = โอกาสเท่ากัน"],
  commonMistakes: ["บวกความน่าจะเป็นเกิน 1"],
  formulas: [{ name: "ความน่าจะเป็น", formula: "P(A) = n(A) / n(S)", description: "favore ÷ ทั้งหมด" }],
  relatedTopics: ["m1-data-basics", "m3-trigonometry"],
  quizTopicId: "m2-probability",
  version: 1,
}
export default M2_PROBABILITY_LESSON