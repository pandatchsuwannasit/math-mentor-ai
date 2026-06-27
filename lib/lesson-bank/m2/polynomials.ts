import type { Lesson } from "../types"

export const M2_POLYNOMIALS_LESSON: Lesson = {
  id: "m2-polynomials",
  curriculum: "M2",
  topicId: "m2-polynomials",
  title: "พหุนาม",
  description: "การบวกลบคูณพหุนาม",
  estimatedReadingTime: 12,
  difficulty: "medium",
  learningObjectives: ["เข้าใจพหุนาม", "บวกลบคูณพหุนามได้", "แยกตัวประกอบพหุนาม"],
  prerequisites: ["m1-integers", "m1-exponents"],
  keywords: ["พหุนาม", "ดีกรี", "ตัวประกอบ", "สมการ"],
  introduction: "พหุนามเป็นนิพจน์ทางคณิตศาสตร์ที่ประกอบด้วยตัวแปรและเลขชี้กำลังเป็นจำนวนเต็มบวก",
  concepts: [
    { title: "ความหมายของพหุนาม", content: "พหุนามมีรูป aₙxⁿ + aₙ₋₁xⁿ⁻¹ + ... + a₁x + a₀ โดย aₙ ≠ 0" },
    { title: "ดีกรีของพหุนาม", content: "ดีกรี = เลขชี้กำลังสูงสุด เช่น 3x² + 2x + 1 มีดีกรี 2" },
    { title: "การบวกลบพหุนาม", content: "รวมพจน์ที่มีตัวแปรและเลขชี้กำลังเหมือนกัน" },
  ],
  examples: [
    { question: "บวก: (2x² + 3x + 1) + (x² - 2x + 4)", solution: "รวมพจน์เหมือนกัน: 3x² + x + 5", answer: "3x² + x + 5" },
    { question: "ลบ: (3x² + 5x - 2) - (x² + 2x - 1)", solution: "เปลี่ยนเครื่องหมายแล้วรวม: 2x² + 3x - 1", answer: "2x² + 3x - 1" },
  ],
  summary: ["รวมพจน์เหมือนกัน", "ดีกรี = เลขชี้กำลังสูงสุด", "ลบ = เปลี่ยนเครื่องหมายแล้วรวม"],
  commonMistakes: ["รวมพจน์ที่ไม่เหมือนกัน", "ลืมเปลี่ยนเครื่องหมายทั้งหมด"],
  formulas: [{ name: "พหุนาม", formula: "aₙxⁿ + ... + a₀", description: "นิพจน์ที่มีตัวแปรและเลขชี้กำลังเป็นจำนวนเต็มบวก" }],
  relatedTopics: ["m1-exponents", "m2-factoring"],
  quizTopicId: "m2-polynomials",
  version: 1,
}
export default M2_POLYNOMIALS_LESSON