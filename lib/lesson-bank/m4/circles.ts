import type { Lesson } from "../types"

export const M4_CIRCLES_LESSON: Lesson = {
  id: "m4-circles",
  curriculum: "M4",
  topicId: "m4-circles",
  title: "วงกลม",
  description: "สมบัติวงกลม",
  estimatedReadingTime: 10,
  difficulty: "medium",
  learningObjectives: ["คำนวณพื้นที่วงกลม", "เข้าใจมุมตรงกลาง"],
  prerequisites: ["m1-basic-geometry"],
  keywords: ["วงกลม", "รัศมี", "พื้นที่"],
  introduction: "วงกลมเป็นรูปทรงที่มีจุดศูนย์กลางและรัศมี",
  concepts: [
    { title: "สมบัติวงกลม", content: "เส้นผ่านศูนย์กลาง = 2r, เส้นรอบวง = 2πr, พื้นที่ = πr²" },
  ],
  examples: [
    { question: "หาพื้นที่วงกลมรัศมี 7", solution: "A = π × 7² = 49π", answer: "49π" },
  ],
  summary: ["เส้นรอบวง = 2πr", "พื้นที่ = πr²"],
  commonMistakes: ["สับสนเส้นผ่านศูนย์กลางกับเส้นรอบวง"],
  formulas: [{ name: "พื้นที่วงกลม", formula: "A = πr²", description: "π × รัศมี²" }],
  relatedTopics: ["m1-basic-geometry", "m4-coordinate-geometry"],
  quizTopicId: "m4-circles",
  version: 1,
}
export default M4_CIRCLES_LESSON