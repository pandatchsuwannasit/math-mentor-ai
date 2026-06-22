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
    { id: "m1-integers", title: "จำนวนเต็ม", description: "การบวกลบคูณหารจำนวนเต็ม ลำดับขั้นตอน", subject: "Algebra" },
    { id: "m1-exponents", title: "เลขยกกำลัง", description: "กฎเลขยกกำลัง การคำนวณและลดรูป", subject: "Algebra" },
    { id: "m1-linear-equations", title: "สมการเชิงเส้น", description: "การแก้สมการเชิงเส้นตัวแปรเดียว", subject: "Algebra" },
    { id: "m1-basic-geometry", title: "เรขาคณิตพื้นฐาน", description: "มุม เส้นตรง รูปทรงพื้นฐาน พื้นที่", subject: "Geometry" },
    { id: "m1-data-basics", title: "สถิติเบื้องต้น", description: "ค่าเฉลี่ย มัธยฐาน ฐานนิยม กราฟ", subject: "Statistics" },
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
    { id: "m3-trigonometry", title: "ตรีโกณมิติ", description: "sin cos tan ของมุม特别 30 45 60", subject: "Trigonometry" },
    { id: "m3-triangle-trig", title: "ตรีโกณมิติสามเหลี่ยม", description: "การประยุกต์ใช้ในสามเหลี่ยมมุมฉาก", subject: "Trigonometry" },
    { id: "m3-geometry-apps", title: "การประยุกต์เรขาคณิต", description: "พื้นที่ ปริมาตร การคำนวณ", subject: "Geometry" },
  ],
  M4: [
    { id: "m4-advanced-algebra", title: "พีชคณิตขั้นสูง", description: "สม方程 radicals การแก้สมการซับซ้อน", subject: "Algebra" },
    { id: "m4-sequences", title: "ลำดับและอนุกรม", description: "ลำดับเลขคณิต ลำดับเลขเรียง成分", subject: "Algebra" },
    { id: "m4-coordinate-geometry", title: "เรขาคณิตพิกัด", description: "ระยะระหว่างจุด เส้นตรง ในระบบพิกัด", subject: "Geometry" },
    { id: "m4-circles", title: "วงกลม", description: "สมมติติวงกลม มุม inscribed", subject: "Geometry" },
    { id: "m4-statistics-advanced", title: "สถิติขั้นสูง", description: "การกระจาย ความเบี่ยงเบน", subject: "Statistics" },
  ],
  M5: [
    { id: "m5-trigonometry-advanced", title: "ตรีโกณมิติขั้นสูง", description: "เอกลักษณ์ตรีโกณ มุมอ้างอิง", subject: "Trigonometry" },
    { id: "m5-calculus-basics", title: "แคลคูลัสพื้นฐาน", description: "ลิมิต อัตราการเปลี่ยนแปลง", subject: "Calculus" },
    { id: "m5-derivatives", title: "อนุพันธ์", description: "กฎอนุพันธ์ การ导数的应用", subject: "Calculus" },
    { id: "m5-probability-advanced", title: "ความน่าจะเป็นขั้นสูง", description: "การแจกแจง ความน่าจะเป็นусловная", subject: "Statistics" },
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