import type { Lesson } from "../types"

export const M3_FUNCTIONS_LESSON: Lesson = {
  id: "m3-functions",
  curriculum: "M3",
  topicId: "m3-functions",
  title: "ฟังก์ชัน",
  description: "ความสัมพันธ์ระหว่างตัวแปร",
  estimatedReadingTime: 12,
  difficulty: "medium",
  learningObjectives: ["เข้าใจฟังก์ชัน", "วาดกราฟฟังก์ชันพื้นฐาน"],
  prerequisites: ["m1-linear-equations"],
  keywords: ["ฟังก์ชัน", "โดเมน", "เรนจ์", "กราฟ"],
  introduction: "ฟังก์ชันเป็นความสัมพันธ์ที่แต่ละค่าในโดเมนมีค่าเรนจ์เพียงค่าเดียว",
  concepts: [
    { title: "ความหมายของฟังก์ชัน", content: "f: X → Y แต่ละ x มี f(x) เพียงค่าเดียว" },
    { title: "โดเมนและเรนจ์", content: "โดเมน = ค่า x ที่เป็นไปได้, เรนจ์ = ค่า f(x) ที่ได้" },
  ],
  examples: [
    { question: "ถ้า f(x) = 2x + 1 หา f(3)", solution: "f(3) = 2(3) + 1 = 7", answer: "7" },
  ],
  summary: ["แต่ละ x มี f(x) เพียงค่าเดียว", "โดเมน→เรนจ์"],
  commonMistakes: ["สับสนโดเมนกับเรนจ์"],
  formulas: [{ name: "ฟังก์ชันเชิงเส้น", formula: "f(x) = mx + b", description: "m = ความชัน, b = ระยะตัด" }],
  relatedTopics: ["m1-linear-equations", "m3-quadratics"],
  quizTopicId: "m3-functions",
  version: 1,
}
export default M3_FUNCTIONS_LESSON