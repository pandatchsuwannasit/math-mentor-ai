import type { Lesson } from "../types"

export const M4_SEQUENCES_LESSON: Lesson = {
  id: "m4-sequences",
  curriculum: "M4",
  topicId: "m4-sequences",
  title: "ลำดับและอนุกรม",
  description: "ลำดับเลขคณิต ลำดับเลขเรขา",
  estimatedReadingTime: 10,
  difficulty: "medium",
  learningObjectives: ["หาเลขทศนิยมของลำดับ", "คำนวณผลรวมอนุกรม"],
  prerequisites: ["m1-linear-equations"],
  keywords: ["ลำดับ", "อนุกรม", "เลขทศนิยม"],
  introduction: "ลำดับเป็นรายการตัวเลขที่เรียงตามกฎ",
  concepts: [
    { title: "ลำดับเลขคณิต", content: "aₙ = a₁ + (n-1)d" },
    { title: "ลำดับเลขเรขา", content: "aₙ = a₁ × r^(n-1)" },
  ],
  examples: [
    { question: "หาลำดับเลขคณิต a₁=2, d=3 หา a₅", solution: "a₅ = 2 + 4×3 = 14", answer: "14" },
  ],
  summary: ["aₙ = a₁ + (n-1)d", "aₙ = a₁ × r^(n-1)"],
  commonMistakes: ["สับสนสูตร"],
  formulas: [{ name: "เลขคณิต", formula: "aₙ = a₁ + (n-1)d", description: "n เป็นเลขทศนิยม" }],
  relatedTopics: ["m1-linear-equations", "m4-advanced-algebra"],
  quizTopicId: "m4-sequences",
  version: 1,
}
export default M4_SEQUENCES_LESSON