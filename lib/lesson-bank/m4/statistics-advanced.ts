import type { Lesson } from "../types"

export const M4_STATISTICS_ADVANCED_LESSON: Lesson = {
  id: "m4-statistics-advanced",
  curriculum: "M4",
  topicId: "m4-statistics-advanced",
  title: "สถิติขั้นสูง",
  description: "เบี่ยงเบนมาตรฐาน การกระจาย",
  estimatedReadingTime: 10,
  difficulty: "hard",
  learningObjectives: ["คำนวณเบี่ยงเบนมาตรฐาน", "เข้าใจการกระจายข้อมูล"],
  prerequisites: ["m1-data-basics"],
  keywords: ["สถิติ", "เบี่ยงเบน", "การกระจาย"],
  introduction: "สถิติขั้นสูงช่วยวิเคราะห์การกระจายของข้อมูล",
  concepts: [
    { title: "เบี่ยงเบนมาตรฐาน", content: "σ = √(Σ(x-μ)²/n)" },
  ],
  examples: [
    { question: "หาส่วนเบี่ยงเบนของ 2,4,6,8", solution: "μ = 5, σ² = 5, σ = √5", answer: "√5" },
  ],
  summary: ["μ = ค่าเฉลี่ย", "σ = เบี่ยงเบนมาตรฐาน"],
  commonMistakes: ["ลืมรากที่สอง"],
  formulas: [{ name: "เบี่ยงเบน", formula: "σ = √(Σ(x-μ)²/n)", description: "ส่วนเบี่ยงเบนมาตรฐาน" }],
  relatedTopics: ["m1-data-basics", "m4-sequences"],
  quizTopicId: "m4-statistics-advanced",
  version: 1,
}
export default M4_STATISTICS_ADVANCED_LESSON