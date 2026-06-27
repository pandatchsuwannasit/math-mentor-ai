import type { Lesson } from "../types"

export const M4_COORDINATE_GEOMETRY_LESSON: Lesson = {
  id: "m4-coordinate-geometry",
  curriculum: "M4",
  topicId: "m4-coordinate-geometry",
  title: "เรขาคณิตพิกัด",
  description: "กราฟสมการในระนาบ",
  estimatedReadingTime: 10,
  difficulty: "medium",
  learningObjectives: ["วาดกราฟสมการ", "หาจุดตัดกับแกน"],
  prerequisites: ["m1-linear-equations"],
  keywords: ["พิกัด", "กราฟ", "แกน"],
  introduction: "เรขาคณิตพิกัดเป็นการใช้ระบบพิกัดx-y วิเคราะห์รูปทรง",
  concepts: [
    { title: "ระยะระหว่างจุด", content: "d = √((x₂-x₁)² + (y₂-y₁)²)" },
  ],
  examples: [
    { question: "หาระยะระหว่าง (0,0) กับ (3,4)", solution: "d = √(9+16) = 5", answer: "5" },
  ],
  summary: ["ใช้ระยะระหว่างจุด", "หาจุดกลาง"],
  commonMistakes: ["ลืมยกกำลังสอง"],
  formulas: [{ name: "ระยะระหว่างจุด", formula: "d = √((x₂-x₁)² + (y₂-y₁)²)", description: "ระยะระหว่างจุดสองจุด" }],
  relatedTopics: ["m1-linear-equations", "m4-sequences"],
  quizTopicId: "m4-coordinate-geometry",
  version: 1,
}
export default M4_COORDINATE_GEOMETRY_LESSON