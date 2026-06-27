import type { Lesson } from "../types"

export const M3_TRIGONOMETRY_LESSON: Lesson = {
  id: "m3-trigonometry",
  curriculum: "M3",
  topicId: "m3-trigonometry",
  title: "ตรีโกณมิติ",
  description: "sin cos tan พื้นฐาน",
  estimatedReadingTime: 12,
  difficulty: "medium",
  learningObjectives: ["เข้าใจsin cos tan", "ใช้ตรีโกณมิตร Pitagoras解决ปัญหา"],
  prerequisites: ["m2-pythagorean"],
  keywords: ["sin", "cos", "tan", "ตรีโกณมิติ"],
  introduction: "ตรีโกณมิติเป็นสาขาคณิตศาสตร์ที่ศึกษาเกี่ยวกับความสัมพันธ์ระหว่างมุมและด้านในสามเหลี่ยม",
  concepts: [
    { title: "sin cos tan", content: "sin = เหนือ/ตรงข้าม, cos = เหนือ/ใกล้, tan = ตรงข้าม/ใกล้" },
  ],
  examples: [
    { question: "ในสามเหลี่ยมมุมฉาก หา sin θ หากตรงข้าม = 3, ตรงข้าม = 4", solution: "ตรงข้าม = 5 (Pythagoras)\nsin θ = 3/5", answer: "3/5" },
  ],
  summary: ["sin = เหนือ/ตรงข้าม", "cos = เหนือ/ใกล้", "tan = ตรงข้าม/ใกล้"],
  commonMistakes: ["สับสนระหว่าง sin และ cos"],
  formulas: [{ name: "Pythagoras", formula: "sin²θ + cos²θ = 1", description: "ความสัมพันธ์พื้นฐาน" }],
  relatedTopics: ["m2-pythagorean", "m3-triangle-trig"],
  quizTopicId: "m3-trigonometry",
  version: 1,
}
export default M3_TRIGONOMETRY_LESSON