import type { Lesson } from "../types"

export const M3_TRIANGLE_TRIG_LESSON: Lesson = {
  id: "m3-triangle-trig",
  curriculum: "M3",
  topicId: "m3-triangle-trig",
  title: "ตรีโกณมิติในสามเหลี่ยม",
  description: "ใช้ sin cos tan ในสามเหลี่ยม",
  estimatedReadingTime: 10,
  difficulty: "medium",
  learningObjectives: ["ใช้ตรีโกณมิตรหาด้านในสามเหลี่ยม"],
  prerequisites: ["m3-trigonometry"],
  keywords: ["sin", "cos", "tan", "สามเหลี่ยม"],
  introduction: "ใช้ตรีโกณมิตร解决ปัญหาด้านในสามเหลี่ยม",
  concepts: [
    { title: "ใช้ในสามเหลี่ยม", content: "sin = เหนือ/ตรงข้าม, cos = เหนือ/ใกล้, tan = ตรงข้าม/ใกล้" },
  ],
  examples: [
    { question: "หาด้านใกล้หากตรงข้าม=3, มุม=30°", solution: "tan 30° = 3/ใกล้\nใกล้ = 3/tan30°", answer: "3√3" },
  ],
  summary: ["ใช้ sin cos tan หาด้าน"],
  commonMistakes: ["ใช้มุมผิด"],
  formulas: [{ name: "tan", formula: "tan θ = ตรงข้าม/ใกล้", description: "ใช้หาด้านใกล้" }],
  relatedTopics: ["m3-trigonometry", "m2-pythagorean"],
  quizTopicId: "m3-triangle-trig",
  version: 1,
}
export default M3_TRIANGLE_TRIG_LESSON