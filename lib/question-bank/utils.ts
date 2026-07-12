import type { QuizQuestion, LearningStats, TopicProgress, TopicMetadata } from "./types"
import { getQuestionsForTopic, getAllTopicProgress } from "./index"

/** Upgrade legacy questions (missing new fields) to full QuizQuestion format */
export function upgradeQuestion(q: Partial<QuizQuestion>): QuizQuestion {
  return {
    id: q.id || crypto.randomUUID(),
    curriculum: q.curriculum || "M1",
    topicId: q.topicId || "",
    topicName: q.topicName || "",
    difficulty: q.difficulty || "medium",
    question: q.question || "",
    choices: q.choices || [],
    answer: q.answer ?? 0,
    explanation: q.explanation || "",
    solutionSteps: q.solutionSteps || [],
    hints: q.hints || [],
    estimatedTime: q.estimatedTime || 60,
    learningObjective: q.learningObjective || "ฝึกทักษะการแก้โจทย์คณิตศาสตร์",
    tags: q.tags || [q.curriculum || "", q.topicId || ""],
    source: "Math Mentor AI",
    version: q.version || 1,
  }
}

/** Upgrade an entire topic's questions */
export function upgradeTopicQuestions(questions: Partial<QuizQuestion>[]): QuizQuestion[] {
  return questions.map(upgradeQuestion)
}

/** Get difficulty distribution based on student accuracy */
export function getDifficultyDistribution(accuracy: number): Record<string, number> {
  if (accuracy < 50) return { easy: 0.7, medium: 0.3, hard: 0 }
  if (accuracy < 80) return { easy: 0.3, medium: 0.5, hard: 0.2 }
  return { easy: 0.1, medium: 0.3, hard: 0.6 }
}

/** Calculate accuracy from correct/total */
export function calcAccuracy(correct: number, total: number): number {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

/** Get learning stats for dashboard */
export function getLearningStats(): LearningStats {
  const allProgress = getAllTopicProgress()
  let totalCorrect = 0
  let totalWrong = 0
  let totalTime = 0
  const topicAccuracy: Record<string, number> = {}
  const topicProgress: Record<string, number> = {}
  const weakTopics: string[] = []
  const strongTopics: string[] = []

  for (const [topicId, progress] of Object.entries(allProgress)) {
    const correct = progress.totalCorrect || 0
    const wrong = progress.totalWrong || 0
    const total = correct + wrong
    const acc = calcAccuracy(correct, total)

    totalCorrect += correct
    totalWrong += wrong
    totalTime += progress.totalTimeMinutes || 0
    topicAccuracy[topicId] = acc
    topicProgress[topicId] = progress.bestScore || 0

    if (total >= 3 && acc < 60) weakTopics.push(topicId)
    if (total >= 15 && acc > 90) strongTopics.push(topicId)
  }

  const overallAccuracy = calcAccuracy(totalCorrect, totalCorrect + totalWrong)

  // Find recommended topic (least accurate non-completed topic)
  const sortedTopics = Object.entries(topicAccuracy)
    .filter(([id, acc]) => {
      const p = allProgress[id]
      return !p?.completed || (p.totalCorrect + p.totalWrong < 10)
    })
    .sort(([, a], [, b]) => a - b)

  return {
    overallAccuracy,
    totalQuestionsAnswered: totalCorrect + totalWrong,
    totalStudyTimeMinutes: totalTime,
    weakTopics,
    strongTopics,
    recommendedTopic: sortedTopics[0]?.[0] || null,
    topicAccuracy,
    topicProgress,
    currentStreak: 0,
    longestStreak: 0,
  }
}

/** Build topic metadata for learner objectives */
export function getTopicMetadata(): TopicMetadata[] {
  return [
    { id: "m1-integers", title: "จำนวนเต็ม", description: "การบวกลบคูณหารจำนวนเต็ม", curriculum: "M1", subject: "Algebra", objectives: ["เข้าใจจำนวนเต็มบวกและลบ", "สามารถบวกลบคูณหารจำนวนเต็มได้"], prerequisites: [], questionCount: 15 },
    { id: "m1-exponents", title: "เลขยกกำลัง", description: "กฎเลขยกกำลัง การคำนวณ", curriculum: "M1", subject: "Algebra", objectives: ["เข้าใจความหมายของเลขยกกำลัง", "ใช้กฎเลขยกกำลังในการคำนวณ"], prerequisites: ["m1-integers"], questionCount: 15 },
    { id: "m1-linear-equations", title: "สมการเชิงเส้น", description: "การแก้สมการเชิงเส้นตัวแปรเดียว", curriculum: "M1", subject: "Algebra", objectives: ["แก้สมการเชิงเส้นตัวแปรเดียวได้", "ตรวจสอบคำตอบได้"], prerequisites: ["m1-integers"], questionCount: 15 },
    { id: "m1-basic-geometry", title: "เรขาคณิตพื้นฐาน", description: "มุม เส้นตรง รูปทรงพื้นฐาน", curriculum: "M1", subject: "Geometry", objectives: ["รู้จักรูปทรงเรขาคณิตพื้นฐาน", "คำนวณพื้นที่และปริมาตรได้"], prerequisites: [], questionCount: 15 },
    { id: "m1-data-basics", title: "สถิติเบื้องต้น", description: "ค่าเฉลี่ย มัธยฐาน ฐานนิยม", curriculum: "M1", subject: "Statistics", objectives: ["หาค่าเฉลี่ย มัธยฐาน ฐานนิยมได้", "อ่านกราฟพื้นฐานได้"], prerequisites: [], questionCount: 15 },
    { id: "m2-polynomials", title: "พหุนาม", description: "การบวกลบพหุนาม", curriculum: "M2", subject: "Algebra", objectives: ["บวกลบพหุนามได้", "คูณพหุนามได้"], prerequisites: ["m1-integers", "m1-exponents"], questionCount: 15 },
    { id: "m2-factoring", title: "การแยกตัวประกอบ", description: "แยกตัวประกอบพหุนาม", curriculum: "M2", subject: "Algebra", objectives: ["แยกตัวประกอบโดยดึงตัวร่วมได้", "แยกผลต่างกำลังสองได้"], prerequisites: ["m2-polynomials"], questionCount: 15 },
    { id: "m2-pythagorean", title: "ทฤษฎีพีทาโกรัส", description: "ความสัมพันธ์ด้านสามเหลี่ยมมุมฉาก", curriculum: "M2", subject: "Geometry", objectives: ["เข้าใจความสัมพันธ์ a²+b²=c²", "ประยุกต์ใช้แก้ปัญหาได้"], prerequisites: ["m1-basic-geometry"], questionCount: 15 },
    { id: "m2-probability", title: "ความน่าจะเป็น", description: "ความน่าจะเป็นเบื้องต้น", curriculum: "M2", subject: "Statistics", objectives: ["คำนวณความน่าจะเป็นได้", "เข้าใจเหตุการณ์ต่างๆ"], prerequisites: ["m1-data-basics"], questionCount: 15 },
    { id: "m3-quadratics", title: "สมการกำลังสอง", description: "การแก้สมการกำลังสอง", curriculum: "M3", subject: "Algebra", objectives: ["แยกตัวประกอบสมการกำลังสองได้", "ใช้สูตร quadratic ได้"], prerequisites: ["m2-polynomials", "m2-factoring"], questionCount: 15 },
    { id: "m3-functions", title: "ฟังก์ชัน", description: "ฟังก์ชันและการประยุกต์", curriculum: "M3", subject: "Algebra", objectives: ["เข้าใจนิยามฟังก์ชัน", "หาค่าฟังก์ชันได้"], prerequisites: ["m3-quadratics"], questionCount: 15 },
    { id: "m3-trigonometry", title: "ตรีโกณมิติ", description: "sin cos tan มุมมาตรฐาน", curriculum: "M3", subject: "Trigonometry", objectives: ["รู้ค่า sin cos tan ของมุมมาตรฐาน", "ใช้เอกลักษณ์ตรีโกณได้"], prerequisites: ["m1-basic-geometry"], questionCount: 15 },
    { id: "m3-triangle-trig", title: "ตรีโกณมิติสามเหลี่ยม", description: "การประยุกต์ในสามเหลี่ยมมุมฉาก", curriculum: "M3", subject: "Trigonometry", objectives: ["ใช้อัตราส่วนตรีโกณในสามเหลี่ยมได้"], prerequisites: ["m3-trigonometry"], questionCount: 15 },
    { id: "m3-geometry-apps", title: "การประยุกต์เรขาคณิต", description: "พื้นที่ ปริมาตร", curriculum: "M3", subject: "Geometry", objectives: ["คำนวณพื้นที่ผิวและปริมาตรได้"], prerequisites: ["m1-basic-geometry"], questionCount: 15 },
    { id: "m4-advanced-algebra", title: "พีชคณิตขั้นสูง", description: "สมการ radicals ค่าสัมบูรณ์", curriculum: "M4", subject: "Algebra", objectives: ["แก้สมการที่มีรากได้", "แก้สมการค่าสัมบูรณ์ได้"], prerequisites: ["m3-quadratics"], questionCount: 15 },
    { id: "m4-sequences", title: "ลำดับและอนุกรม", description: "ลำดับเลขคณิตและเรขาคณิต", curriculum: "M4", subject: "Algebra", objectives: ["หาพจน์ของลำดับได้", "หาผลรวมอนุกรมได้"], prerequisites: ["m2-polynomials"], questionCount: 15 },
    { id: "m4-coordinate-geometry", title: "เรขาคณิตพิกัด", description: "ระยะทาง จุดกึ่งกลาง เส้นตรง", curriculum: "M4", subject: "Geometry", objectives: ["หาระยะทางระหว่างจุดได้", "หาสมการเส้นตรงได้"], prerequisites: ["m3-geometry-apps"], questionCount: 15 },
    { id: "m4-circles", title: "วงกลม", description: "สมการวงกลม มุมในวงกลม", curriculum: "M4", subject: "Geometry", objectives: ["เขียนสมการวงกลมได้", "เข้าใจสมบัติของวงกลม"], prerequisites: ["m4-coordinate-geometry"], questionCount: 15 },
    { id: "m4-statistics-advanced", title: "สถิติขั้นสูง", description: "การกระจาย ความน่าจะเป็น", curriculum: "M4", subject: "Statistics", objectives: ["คำนวณส่วนเบี่ยงเบนมาตรฐานได้", "อ่านค่า Z-score ได้"], prerequisites: ["m2-probability"], questionCount: 15 },
    { id: "m5-trigonometry-advanced", title: "ตรีโกณมิติขั้นสูง", description: "เอกลักษณ์ มุมอ้างอิง", curriculum: "M5", subject: "Trigonometry", objectives: ["ใช้สูตรมุมสองเท่าได้", "หาค่าฟังก์ชันตรีโกณของมุม >90°"], prerequisites: ["m3-trigonometry"], questionCount: 15 },
    { id: "m5-calculus-basics", title: "แคลคูลัสพื้นฐาน", description: "ลิมิต อัตราการเปลี่ยนแปลง", curriculum: "M5", subject: "Calculus", objectives: ["หาค่าลิมิตได้", "เข้าใจความหมายของอนุพันธ์"], prerequisites: ["m3-functions"], questionCount: 15 },
    { id: "m5-derivatives", title: "อนุพันธ์", description: "กฎอนุพันธ์และการประยุกต์", curriculum: "M5", subject: "Calculus", objectives: ["หาอนุพันธ์ของฟังก์ชันต่างๆได้", "ใช้กฎลูกโซ่ กฎผลคูณ กฎผลหารได้"], prerequisites: ["m5-calculus-basics"], questionCount: 15 },
    { id: "m5-probability-advanced", title: "ความน่าจะเป็นขั้นสูง", description: "การแจกแจงความน่าจะเป็น", curriculum: "M5", subject: "Statistics", objectives: ["เข้าใจการแจกแจงปกติ", "คำนวณความน่าจะเป็นแบบมีเงื่อนไขได้"], prerequisites: ["m4-statistics-advanced"], questionCount: 15 },
    { id: "m6-limits", title: "ลิมิต", description: "ลิมิตของฟังก์ชัน", curriculum: "M6", subject: "Calculus", objectives: ["หาลิมิตที่ค่าใดๆได้", "ใช้ทฤษฎีลิมิตในการแก้ปัญหา"], prerequisites: ["m5-calculus-basics"], questionCount: 15 },
    { id: "m6-derivatives-advanced", title: "อนุพันธ์ขั้นสูง", description: "อนุพันธ์ของฟังก์ชันต่างๆ", curriculum: "M6", subject: "Calculus", objectives: ["หาอนุพันธ์ของฟังก์ชันประกอบได้", "หาอนุพันธ์ของฟังก์ชัน inverse trig"], prerequisites: ["m5-derivatives"], questionCount: 15 },
    { id: "m6-integrals", title: "ปริพันธ์", description: "การอินทิเกรต", curriculum: "M6", subject: "Calculus", objectives: ["หาปริพันธ์ไม่จำกัดเขตได้", "หาปริพันธ์จำกัดเขตและพื้นที่ใต้โค้งได้"], prerequisites: ["m6-derivatives-advanced"], questionCount: 15 },
    { id: "m6-applications", title: "การประยุกต์แคลคูลัส", description: "การประยุกต์ใช้แคลคูลัส", curriculum: "M6", subject: "Calculus", objectives: ["หาค่าสูงสุดต่ำสุดได้", "หาพื้นที่และปริมาตรโดยการอินทิเกรตได้"], prerequisites: ["m6-integrals"], questionCount: 15 },
    { id: "m6-advanced-probability", title: "ความน่าจะเป็นขั้นสูง", description: "Binomial Normal Poisson", curriculum: "M6", subject: "Statistics", objectives: ["เข้าใจการแจกแจง binomial, normal, poisson", "คำนวณค่าความคาดหวังและความแปรปรวนได้"], prerequisites: ["m5-probability-advanced"], questionCount: 15 },
  ]
}