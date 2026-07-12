import type { Grade, Subject, CurriculumLevel } from "./types"

export type CurriculumTopic = {
  id: string
  title: string
  description: string
  subject: Subject
}

export const GRADE_LABELS: Record<Grade, string> = {
  "Grade 7": "Grade 7 (M1)",
  "Grade 8": "Grade 8 (M2)",
  "Grade 9": "Grade 9 (M3)",
  "Grade 10": "Grade 10 (M4)",
  "Grade 11": "Grade 11 (M5)",
  "Grade 12": "Grade 12 (M6)",
}

export const CURRICULUM_LABELS: Record<CurriculumLevel, string> = {
  M1: "ม.1",
  M2: "ม.2",
  M3: "ม.3",
  M4: "ม.4",
  M5: "ม.5",
  M6: "ม.6",
}

export const CURRICULUM_BY_LEVEL: Record<CurriculumLevel, CurriculumTopic[]> = {
  M1: [
    { id: "m1-integers", title: "Integers", description: "Add, subtract, multiply, and divide integers with confidence", subject: "Algebra" },
    { id: "m1-fractions", title: "Fractions", description: "Add, simplify, and work with fractions", subject: "Algebra" },
    { id: "m1-decimals", title: "Decimals", description: "Add, subtract, and multiply decimals accurately", subject: "Algebra" },
    { id: "m1-linear-equations", title: "Linear Equations", description: "Solve one-step and two-step linear equations", subject: "Algebra" },
    { id: "m1-ratio", title: "Ratio", description: "Simplify ratios and solve ratio word problems", subject: "Algebra" },
    { id: "m1-percentage", title: "Percentage", description: "Find percentages and use them in real contexts", subject: "Algebra" },
    { id: "m1-geometry", title: "Geometry", description: "Recognize angles, lines, and triangle facts", subject: "Geometry" },
    { id: "m1-area", title: "Area", description: "Calculate the area of rectangles and triangles", subject: "Geometry" },
    { id: "m1-volume", title: "Volume", description: "Find the volume of cubes and cuboids", subject: "Geometry" },
    { id: "m1-graphs", title: "Graphs", description: "Read coordinates and understand the coordinate plane", subject: "Statistics" },
    { id: "m1-statistics", title: "Statistics", description: "Find the mean, median, mode, and range", subject: "Statistics" },
    { id: "m1-basic-probability", title: "Basic Probability", description: "Describe simple outcomes and probability", subject: "Statistics" },
  ],
  M2: [
    { id: "m2-polynomials", title: "พหุนาม", description: "การบวกลบพหุนาม การคูณพหุนาม", subject: "Algebra" },
    { id: "m2-factoring", title: "การแยกตัวประกอบ", description: "การแยกตัวประกอบพหุนาม", subject: "Algebra" },
    { id: "m2-pythagorean", title: "ทฤษฎีพีทาโกรัส", description: "ความสัมพันธ์ด้านในสามเหลี่ยมมุมฉาก", subject: "Geometry" },
    { id: "m2-probability", title: "ความน่าจะเป็น", description: "การคำนวณความน่าจะเป็นพื้นฐาน", subject: "Statistics" },
  ],
  M3: [
    { id: "m3-quadratics", title: "สมการกำลังสอง", description: "การแก้สมการกำลังสอง แยกตัวประกอบ สูตร quadratic", subject: "Algebra" },
    { id: "m3-functions", title: "ฟังก์ชัน", description: "ฟังก์ชันต่างๆ การประยุกต์ใช้", subject: "Algebra" },
    { id: "m3-trigonometry", title: "ตรีโกณมิติ", description: "sin cos tan ของมุม 30 45 60 องศา", subject: "Trigonometry" },
    { id: "m3-triangle-trig", title: "ตรีโกณมิติสามเหลี่ยม", description: "การประยุกต์ใช้ในสามเหลี่ยมมุมฉาก", subject: "Trigonometry" },
    { id: "m3-geometry-apps", title: "การประยุกต์เรขาคณิต", description: "พื้นที่ ปริมาตร การคำนวณ", subject: "Geometry" },
  ],
  M4: [
    { id: "m4-advanced-algebra", title: "พีชคณิตขั้นสูง", description: "สมการ radicals การแก้สมการซับซ้อน", subject: "Algebra" },
    { id: "m4-sequences", title: "ลำดับและอนุกรม", description: "ลำดับเลขคณิต ลำดับเรขาคณิต", subject: "Algebra" },
    { id: "m4-coordinate-geometry", title: "เรขาคณิตพิกัด", description: "ระยะระหว่างจุด เส้นตรง ในระบบพิกัด", subject: "Geometry" },
    { id: "m4-circles", title: "วงกลม", description: "สมมติติวงกลม มุม inscribed", subject: "Geometry" },
    { id: "m4-statistics-advanced", title: "สถิติขั้นสูง", description: "การกระจาย ความเบี่ยงเบน", subject: "Statistics" },
  ],
  M5: [
    { id: "m5-trigonometry-advanced", title: "ตรีโกณมิติขั้นสูง", description: "เอกลักษณ์ตรีโกณ มุมอ้างอิง", subject: "Trigonometry" },
    { id: "m5-calculus-basics", title: "แคลคูลัสพื้นฐาน", description: "ลิมิต อัตราการเปลี่ยนแปลง", subject: "Calculus" },
    { id: "m5-derivatives", title: "อนุพันธ์", description: "กฎอนุพันธ์ การประยุกต์ใช้อนุพันธ์", subject: "Calculus" },
    { id: "m5-probability-advanced", title: "ความน่าจะเป็นขั้นสูง", description: "การแจกแจง ความน่าจะเป็นแบบมีเงื่อนไข", subject: "Statistics" },
  ],
  M6: [
    { id: "m6-limits", title: "ลิมิต", description: "ลิมิตของฟังก์ชัน การหาลิมิต", subject: "Calculus" },
    { id: "m6-derivatives-advanced", title: "อนุพันธ์ขั้นสูง", description: "กฎอนุพันธ์ต่างๆ การใช้งาน", subject: "Calculus" },
    { id: "m6-integrals", title: "ปริพันธ์", description: " definite integral การคำนวณพื้นที่", subject: "Calculus" },
    { id: "m6-applications", title: "การประยุกต์แคลคูลัส", description: "ประยุกต์ใช้ในปัญหาต่างๆ", subject: "Calculus" },
    { id: "m6-advanced-probability", title: "ความน่าจะเป็นขั้นสูง", description: "การแจกแจง binomial normal", subject: "Statistics" },
  ],
}

export function getCurriculumTopicsForGrade(grade: Grade): CurriculumTopic[] {
  const level = gradeToCurriculum(grade)
  return CURRICULUM_BY_LEVEL[level]
}

export function getCurriculumTopicsForLevel(level: CurriculumLevel): CurriculumTopic[] {
  return CURRICULUM_BY_LEVEL[level]
}

export function getAllCurriculumTopics(): CurriculumTopic[] {
  return Object.values(CURRICULUM_BY_LEVEL).flat()
}

export function gradeToCurriculum(grade: Grade): CurriculumLevel {
  const map: Record<Grade, CurriculumLevel> = {
    "Grade 7": "M1",
    "Grade 8": "M2",
    "Grade 9": "M3",
    "Grade 10": "M4",
    "Grade 11": "M5",
    "Grade 12": "M6",
  }
  return map[grade]
}

export function curriculumToGrade(curriculum: CurriculumLevel): Grade {
  const map: Record<CurriculumLevel, Grade> = {
    M1: "Grade 7",
    M2: "Grade 8",
    M3: "Grade 9",
    M4: "Grade 10",
    M5: "Grade 11",
    M6: "Grade 12",
  }
  return map[curriculum]
}