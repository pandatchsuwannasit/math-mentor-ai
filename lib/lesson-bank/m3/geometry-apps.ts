import type { Lesson } from "../types"

export const M3_GEOMETRY_APPS_LESSON: Lesson = {
  id: "m3-geometry-apps",
  curriculum: "M3",
  topicId: "m3-geometry-apps",
  title: "เรขาคณิตประยุกต์",
  description: "ใช้เรขาคณิต解决ปัญหา",
  estimatedReadingTime: 10,
  difficulty: "medium",
  learningObjectives: ["ใช้เรขาคณิต解决ปัญหาชีวิตจริง"],
  prerequisites: ["m1-basic-geometry"],
  keywords: ["เรขาคณิต", "ประยุกต์", "ปัญหา"],
  introduction: "เรขาคณิตประยุกต์เป็นการใช้ความรู้เรขาคณิต解决ปัญหาต่างๆ",
  concepts: [
    { title: "การประมาณ", content: "ใช้พีทาโกรัสและตรีโกณมิตรประมาณระยะทาง" },
  ],
  examples: [
    { question: "หาความสูงของอาคารจากเงา", solution: "ใช้มุมและระยะเงาคำนวณ", answer: "ขึ้นอยู่กับข้อมูล" },
  ],
  summary: ["ใช้สูตรเรขาคณิต", "ประมาณค่าได้"],
  commonMistakes: ["ใช้สูตรผิดประเภทสามเหลี่ยม"],
  formulas: [{ name: "พีทาโกรัส", formula: "a² + b² = c²", description: "หาด้านในสามเหลี่ยมมุมฉาก" }],
  relatedTopics: ["m1-basic-geometry", "m2-pythagorean"],
  quizTopicId: "m3-geometry-apps",
  version: 1,
}
export default M3_GEOMETRY_APPS_LESSON