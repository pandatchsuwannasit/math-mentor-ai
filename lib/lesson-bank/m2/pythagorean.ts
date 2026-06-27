import type { Lesson } from "../types"

export const M2_PYTHAGOREAN_LESSON: Lesson = {
  id: "m2-pythagorean",
  curriculum: "M2",
  topicId: "m2-pythagorean",
  title: "ทฤษฎีบทพีทาโกรัส",
  description: "ความสัมพันธ์ด้านในสามเหลี่ยมมุมฉาก",
  estimatedReadingTime: 10,
  difficulty: "medium",
  learningObjectives: ["ใช้ทฤษฎีบทพีทาโกรัส", "หาความยาวด้านในสามเหลี่ยมมุมฉาก"],
  prerequisites: ["m1-basic-geometry"],
  keywords: ["พีทาโกรัส", "สามเหลี่ยมมุมฉาก", "ด้านตรงข้าม"],
  introduction: "ทฤษฎีบทพีทาโกรassis เป็นกฎพื้นฐานในเรขาคณิตที่อธิบายความสัมพันธ์ระหว่างด้านในสามเหลี่ยมมุมฉาก",
  concepts: [
    { title: "ทฤษฎีบทพีทาโกรัส", content: "a² + b² = c² โดย c เป็นด้านตรงข้ามมุมฉาก" },
    { title: "การใช้งาน", content: "ใช้หาความยาวด้านที่ไม่รู้ เมื่อทราบด้านสองด้าน" },
  ],
  examples: [
    { question: "สามเหลี่ยมมุมฉากด้าน 3 และ 4 ด้านตรงข้ามเท่าไร?", solution: "c² = 3² + 4² = 9 + 16 = 25\nc = 5", answer: "5" },
  ],
  summary: ["a² + b² = c²", "c = ด้านตรงข้ามมุมฉาก"],
  commonMistakes: ["ใช้กับสามเหลี่ยมที่ไม่ใช่มุมฉาก"],
  formulas: [{ name: "พีทาโกรัส", formula: "a² + b² = c²", description: "ด้านตรงข้าม² = ผลรวมด้านอื่น²" }],
  relatedTopics: ["m1-basic-geometry", "m2-factoring"],
  quizTopicId: "m2-pythagorean",
  version: 1,
}
export default M2_PYTHAGOREAN_LESSON