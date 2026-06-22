import type { Subject } from "./types"

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  hints?: string[]
}

export interface QuizResult {
  quizId: string
  subject: Subject
  score: number
  total: number
  percentage: number
  completedAt: string
  answers: number[]
  timeSpentMinutes: number
}

export type QuizSubjectConfig = {
  subject: Subject
  slug: string
  title: string
  description: string
  questions: QuizQuestion[]
  curriculum?: string
}

const ALGEBRA_QUESTIONS: QuizQuestion[] = [
  {
    id: "algebra-1",
    question: "หาค่า x: 2x + 5 = 15",
    options: ["x = 5", "x = 10", "x = 7.5", "x = 4"],
    correctAnswer: 0,
    explanation: "ลบ 5 จากทั้งสองด้านเพื่อได้ 2x = 10 จากนั้นหารด้วย 2 เพื่อได้ x = 5",
    hints: [
      "ขั้นที่ 1: เราต้องการแยกตัวแปร x ออกจากอีกด้านหนึ่งของสมการ",
      "ขั้นที่ 2: ลบ 5 จากทั้งสองด้านของสมการ: 2x + 5 - 5 = 15 - 5 จะได้ 2x = 10",
      "ขั้นที่ 3: หารทั้งสองด้านด้วย 2: 2x / 2 = 10 / 2 ดังนั้น x = 5",
    ],
  },
  {
    id: "algebra-2",
    question: "ลดรูป: 3(x + 4) - 2x",
    options: ["x + 12", "x + 4", "5x + 12", "x + 8"],
    correctAnswer: 0,
    explanation: "กระจาย 3 เพื่อได้ 3x + 12 จากนั้นรวม 3x - 2x เพื่อได้ x + 12",
    hints: [
      "ขั้นที่ 1: กระจาย 3 เข้าไปในวงเล็บ: 3(x + 4) = 3x + 12",
      "ขั้นที่ 2: เขียนนิพจน์ใหม่: 3x + 12 - 2x",
      "ขั้นที่ 3: รวมพจน์ที่เหมือนกัน: 3x - 2x = x ดังนั้นคำตอบคือ x + 12",
    ],
  },
  {
    id: "algebra-3",
    question: "คำตอบคืออะไรถ้า x^2 = 36?",
    options: ["x = 6 เท่านั้น", "x = -6 เท่านั้น", "x = 6 หรือ x = -6", "x = 18"],
    correctAnswer: 2,
    explanation: "ทั้ง 6 และ -6 เมื่อยกกำลังสองได้ 36 ดังนั้นสมการนี้มีสองคำตอบ",
    hints: [
      "ขั้นที่ 1: สมการ x^2 = 36 หมายถึงจำนวนที่เมื่อยกกำลังสองแล้วได้ 36",
      "ขั้นที่ 2: 6 × 6 = 36 ดังนั้น x = 6 เป็นคำตอบหนึ่ง",
      "ขั้นที่ 3: (-6) × (-6) = 36 เช่นกัน ดังนั้น x = -6 ก็เป็นคำตอบด้วย",
    ],
  },
  {
    id: "algebra-4",
    question: "หาค่า x: 5x - 3 = 2x + 9",
    options: ["x = 2", "x = 3", "x = 4", "x = 6"],
    correctAnswer: 2,
    explanation: "ลบ 2x เพื่อได้ 3x - 3 = 9 บวก 3 เพื่อได้ 3x = 12 จากนั้นหารด้วย 3",
    hints: [
      "ขั้นที่ 1: ย้ายพจน์ที่มีตัวแปร x ไปอยู่ด้านเดียวกัน: 5x - 2x - 3 = 9",
      "ขั้นที่ 2: รวมพจน์ x: 3x - 3 = 9 แล้วบวก 3 ทั้งสองด้าน: 3x = 12",
      "ขั้นที่ 3: หารทั้งสองด้านด้วย 3: x = 4",
    ],
  },
  {
    id: "algebra-5",
    question: "แยกตัวประกอบ: x^2 - 9",
    options: ["(x + 3)(x + 3)", "(x - 3)(x - 3)", "(x + 3)(x - 3)", "(x + 9)(x - 1)"],
    correctAnswer: 2,
    explanation: "นี้เป็นผลต่างของกำลังสอง: x^2 - 3^2 = (x + 3)(x - 3)",
    hints: [
      "ขั้นที่ 1: จำแนกรูปแบบ: x^2 - 9 เป็นผลต่างของกำลังสอง (a^2 - b^2)",
      "ขั้นที่ 2: เขียน 9 ในรูปกำลังสอง: 9 = 3^2 ดังนั้น a = x, b = 3",
      "ขั้นที่ 3: ใช้สูตร a^2 - b^2 = (a + b)(a - b): (x + 3)(x - 3)",
    ],
  },
  {
    id: "algebra-6",
    question: "หาค่า x: x / 4 + 3 = 7",
    options: ["x = 12", "x = 16", "x = 20", "x = 8"],
    correctAnswer: 1,
    explanation: "ลบ 3 เพื่อได้ x / 4 = 4 จากนั้นคูณทั้งสองด้านด้วย 4 เพื่อได้ x = 16",
    hints: [
      "ขั้นที่ 1: ย้ายค่าคงที่ไปอีกด้าน: x/4 + 3 - 3 = 7 - 3",
      "ขั้นที่ 2: เหลือ x/4 = 4",
      "ขั้นที่ 3: คูณทั้งสองด้านด้วย 4: x = 16",
    ],
  },
  {
    id: "algebra-7",
    question: "ความชันของเส้น y = 3x + 2 คืออะไร?",
    options: ["2", "3", "5", "1"],
    correctAnswer: 1,
    explanation: "ในรูปแบบ y = mx + b ค่าสัมประสิทธิ์ m คือความชัน",
    hints: [
      "ขั้นที่ 1: สมการเส้นตรงทั่วไปคือ y = mx + b โดย m คือความชัน",
      "ขั้นที่ 2: เทียบกับ y = 3x + 2 จะเห็นว่า m = 3",
      "ขั้นที่ 3: ดังนั้นความชันคือ 3",
    ],
  },
  {
    id: "algebra-8",
    question: "ลดรูป: (2x^3)(3x^2)",
    options: ["6x^5", "6x^6", "5x^5", "6x^4"],
    correctAnswer: 0,
    explanation: "คูณสัมประสิทธิ์และบวกเลขชี้กำลังของตัวเดียวกัน: 2 คูณ 3 = 6 และ x^(3+2) = x^5",
    hints: [
      "ขั้นที่ 1: คูณสัมประสิทธิ์: 2 × 3 = 6",
      "ขั้นที่ 2: คูณตัวแปร: x^3 × x^2 โดยบวกเลขชี้กำลัง = x^(3+2)",
      "ขั้นที่ 3: ดังนั้นคำตอบคือ 6x^5",
    ],
  },
  {
    id: "algebra-9",
    question: "หาค่า x: 4(x - 2) = 20",
    options: ["x = 5", "x = 6", "x = 7", "x = 8"],
    correctAnswer: 2,
    explanation: "หารด้วย 4 เพื่อได้ x - 2 = 5 จากนั้นบวก 2 เพื่อได้ x = 7",
    hints: [
      "ขั้นที่ 1: หารทั้งสองด้านด้วย 4: 4(x - 2)/4 = 20/4",
      "ขั้นที่ 2: เหลือ x - 2 = 5",
      "ขั้นที่ 3: บวก 2 ทั้งสองด้าน: x = 7",
    ],
  },
  {
    id: "algebra-10",
    question: "ถ้า f(x) = 2x + 1 f(3) คืออะไร?",
    options: ["6", "7", "8", "9"],
    correctAnswer: 1,
    explanation: "แทน x ด้วย 3: f(3) = 2(3) + 1 = 7",
    hints: [
      "ขั้นที่ 1: f(x) = 2x + 1 หมายถึงใส่ค่า x แล้วคำนวณผลลัพธ์",
      "ขั้นที่ 2: แทน x = 3: f(3) = 2(3) + 1",
      "ขั้นที่ 3: คำนวณ: 6 + 1 = 7",
    ],
  },
]

const GEOMETRY_QUESTIONS: QuizQuestion[] = [
  {
    id: "geometry-1",
    question: "ผลรวมของมุมภายในของสามเหลี่ยมคืออะไร?",
    options: ["90 องศา", "180 องศา", "270 องศา", "360 องศา"],
    correctAnswer: 1,
    explanation: "มุมภายในของสามเหลี่ยมทุกสามมุมมีผลรวมเสมอ 180 องศา",
  },
  {
    id: "geometry-2",
    question: "พื้นที่ของสี่เหลี่ยมผืนผ้าที่มีความยาว 8 และความกว้าง 5 คืออะไร?",
    options: ["13", "26", "40", "80"],
    correctAnswer: 2,
    explanation: "พื้นที่สี่เหลี่ยมผืนผ้าเป็นความยาวคูณความกว้าง ดังนั้น 8 คูณ 5 = 40",
  },
  {
    id: "geometry-3",
    question: "สามเหลี่ยมมุมฉากมีด้านตรง각 6 และ 8 ด้านตรงข้ามมุมฉากคืออะไร?",
    options: ["10", "12", "14", "16"],
    correctAnswer: 0,
    explanation: "ใช้ a^2 + b^2 = c^2: 6^2 + 8^2 = 36 + 64 = 100 ดังนั้น c = 10",
  },
  {
    id: "geometry-4",
    question: "เส้นรอบวงของวงกลมที่มีรัศมี 7 คืออะไร?",
    options: ["7 pi", "14 pi", "21 pi", "49 pi"],
    correctAnswer: 1,
    explanation: "เส้นรอบวงคือ 2 pi r ดังนั้น 2 pi คูณ 7 = 14 pi",
  },
  {
    id: "geometry-5",
    question: "พื้นที่ของสามเหลี่ยมที่มีฐาน 10 และความสูง 6 คืออะไร?",
    options: ["16", "30", "60", "120"],
    correctAnswer: 1,
    explanation: "พื้นที่สามเหลี่ยมคือ 1/2 คูณฐานคู่นความสูง ดังนั้น 1/2 คูณ 10 คูณ 6 = 30",
  },
  {
    id: "geometry-6",
    question: "รูปทรงใดที่มีด้านขนานเพียงหนึ่งคู่?",
    options: ["สี่เหลี่ยมผืนผ้า", "สี่เหลี่ยม rhombus", "สี่เหลี่ยมคางหมู", "สี่เหลี่ยมจัตุรัส"],
    correctAnswer: 2,
    explanation: "สี่เหลี่ยมคางหมูถูกนิยามเป็นสี่เหลี่ยมที่มีด้านขนานเพียงหนึ่งคู่",
  },
  {
    id: "geometry-7",
    question: "ขนาดมุมแต่ละมุมของสามเหลี่ยมด้านเท่ากันคืออะไร?",
    options: ["30 องศา", "45 องศา", "60 องศา", "90 องศา"],
    correctAnswer: 2,
    explanation: "สามเหลี่ยมด้านเท่ากันมีมุมเท่ากันสามมุม และ 180 หาร 3 ได้ 60",
  },
  {
    id: "geometry-8",
    question: "ปริมาตรของลูกบาศก์ที่มีความยาวด้าน 4 คืออะไร?",
    options: ["12", "16", "48", "64"],
    correctAnswer: 3,
    explanation: "ปริมาตรลูกบาศก์คือด้านยกกำลังสาม ดังนั้น 4^3 = 64",
  },
  {
    id: "geometry-9",
    question: "สองมุมเป็นมุมเสริมกัน หนึ่งมุมคือ 35 องศา อีกมุมคืออะไร?",
    options: ["45 องศา", "55 องศา", "65 องศา", "145 องศา"],
    correctAnswer: 1,
    explanation: "มุมเสริมกันมีผลรวม 90 องศา ดังนั้น 90 - 35 = 55",
  },
  {
    id: "geometry-10",
    question: "เส้นรอบรูปของสี่เหลี่ยมจัตุรัสที่มีความยาวด้าน 9 คืออะไร?",
    options: ["18", "27", "36", "81"],
    correctAnswer: 2,
    explanation: "สี่เหลี่ยมจัตุรัสมีด้านเท่ากันสี่ด้าน ดังนั้นเส้นรอบรูปคือ 4 คูณ 9 = 36",
  },
]

const TRIGONOMETRY_QUESTIONS: QuizQuestion[] = [
  {
    id: "trigonometry-1",
    question: "ในสามเหลี่ยมมุมฉาก sin(theta) เท่ากับอัตราส่วนใด?",
    options: ["ตรงข้าม / ตรงข้ามมุมฉาก", "ติดกัน / ตรงข้ามมุมฉาก", "ตรงข้าม / ติดกัน", "ตรงข้ามมุมฉาก / ตรงข้าม"],
    correctAnswer: 0,
    explanation: "ไซน์คืออัตราส่วนของด้านตรงข้ามมุมกับด้านตรงข้ามมุมฉาก",
  },
  {
    id: "trigonometry-2",
    question: "cos(0 องศา) คืออะไร?",
    options: ["0", "1/2", "1", "-1"],
    correctAnswer: 2,
    explanation: "บนวงกลมหน่วยพิกัด x ที่ 0 องศาคือ 1 ดังนั้น cos(0 องศา) = 1",
  },
  {
    id: "trigonometry-3",
    question: "sin(90 องศา) คืออะไร?",
    options: ["0", "1/2", "sqrt(3)/2", "1"],
    correctAnswer: 3,
    explanation: "ที่ 90 องศาบนวงกลมหน่วยพิกัด y คือ 1",
  },
  {
    id: "trigonometry-4",
    question: "เอกลักษณ์ใดเป็นจริงเสมอ?",
    options: ["sin^2(theta) + cos^2(theta) = 1", "sin(theta) + cos(theta) = 1", "tan(theta) = sin(theta) + cos(theta)", "cos^2(theta) - sin^2(theta) = 1"],
    correctAnswer: 0,
    explanation: "เอกลักษณ์พีทาโกรัสระบุว่า sin^2(theta) + cos^2(theta) = 1",
  },
  {
    id: "trigonometry-5",
    question: "tan(theta) ในรูปของไซน์และโคไซน์คืออะไร?",
    options: ["cos(theta) / sin(theta)", "sin(theta) / cos(theta)", "1 / sin(theta)", "1 / cos(theta)"],
    correctAnswer: 1,
    explanation: "แทนเจนต์ถูกนิยามเป็นไซน์หารโคไซน์เมื่อโคไซน์ไม่เป็นศูนย์",
  },
  {
    id: "trigonometry-6",
    question: "tan(45 องศา) คืออะไร?",
    options: ["0", "1", "sqrt(3)", "ไม่มีกำหนด"],
    correctAnswer: 1,
    explanation: "ในสามเหลี่ยม 45-45-90 ด้านตรงข้ามและด้านติดกันเท่ากัน ดังนั้นแทนเจนต์คือ 1",
  },
  {
    id: "trigonometry-7",
    question: "ในสามเหลี่ยม 30-60-90 sin(30 องศา) คืออะไร?",
    options: ["1/2", "sqrt(2)/2", "sqrt(3)/2", "1"],
    correctAnswer: 0,
    explanation: "ด้านตรงข้ามมุม 30 องศาคือครึ่งหนึ่งของด้านตรงข้ามมุมฉาก ดังนั้น sin(30 องศา) = 1/2",
  },
  {
    id: "trigonometry-8",
    question: "มุมใดที่มีมุมอ้างอิง 30 องศา?",
    options: ["120 องศา", "150 องศา", "200 องศา", "315 องศา"],
    correctAnswer: 1,
    explanation: "150 องศาห่างจาก 180 องศา 30 องศา ดังนั้นมุมอ้างอิงคือ 30 องศา",
  },
  {
    id: "trigonometry-9",
    question: "ช่วงของ y = sin(x) คืออะไร?",
    options: ["pi / 2", "pi", "2 pi", "4 pi"],
    correctAnswer: 2,
    explanation: "ฟังก์ชันไซน์ทำซ้ำทุก 2 pi เรเดียน",
  },
  {
    id: "trigonometry-10",
    question: "ถ้าด้านตรงข้าม = 3 และด้านติดกัน = 4 ในสามเหลี่ยมมุมฉาก tan(theta) คืออะไร?",
    options: ["3/5", "4/5", "3/4", "4/3"],
    correctAnswer: 2,
    explanation: "แทนเจนต์คือด้านตรงข้ามหารด้านติดกัน ดังนั้น tan(theta) = 3/4",
  },
]

const CALCULUS_QUESTIONS: QuizQuestion[] = [
  {
    id: "calculus-1",
    question: "อนุพันธ์ของ x^2 คืออะไร?",
    options: ["x", "2x", "x^3", "2"],
    correctAnswer: 1,
    explanation: "ใช้กฎกำลัง สมบัติอนุพันธ์ของ x^n คือ n x^(n-1) ดังนั้นอนุพันธ์ของ x^2 คือ 2x",
  },
  {
    id: "calculus-2",
    question: "อนุพันธ์ของ 5x + 3 คืออะไร?",
    options: ["5", "8", "5x", "3"],
    correctAnswer: 0,
    explanation: "อนุพันธ์ของ 5x คือ 5 และอนุพันธ์ของค่าคงที่ 3 คือ 0",
  },
  {
    id: "calculus-3",
    question: "ปริพันธ์ของ 2x dx คืออะไร?",
    options: ["x^2 + C", "2x^2 + C", "x + C", "2 + C"],
    correctAnswer: 0,
    explanation: "ย้อนกลับกฎกำลัง: ปริพันธ์ของ 2x คือ x^2 บวกค่าคงที่",
  },
  {
    id: "calculus-4",
    question: "อนุพันธ์แทนอะไรในกราฟ?",
    options: ["พื้นที่ใต้เส้นโค้ง", "ความชันของเส้นสัมผัส", "ความยาวของเส้นโค้ง", "จุดตัดแกน y"],
    correctAnswer: 1,
    explanation: "อนุพันธ์ให้อัตราการเปลี่ยนแปลงทันทีซึ่งเป็นความชันของเส้นสัมผัส",
  },
  {
    id: "calculus-5",
    question: "อนุพันธ์ของ sin(x) คืออะไร?",
    options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
    correctAnswer: 0,
    explanation: "กฎอนุพันธ์มาตรฐานคือ d/dx sin(x) = cos(x)",
  },
  {
    id: "calculus-6",
    question: "อนุพันธ์ของ cos(x) คืออะไร?",
    options: ["sin(x)", "-sin(x)", "cos(x)", "-cos(x)"],
    correctAnswer: 1,
    explanation: "กฎอนุพันธ์มาตรฐานคือ d/dx cos(x) = -sin(x)",
  },
  {
    id: "calculus-7",
    question: "หาลิมิต: lim x→2 ของ (x + 3)",
    options: ["2", "3", "5", "ไม่มีกำหนด"],
    correctAnswer: 2,
    explanation: "ฟังก์ชัน x + 3 เป็นฟังก์ชันต่อเนื่อง ดังนั้นแทน x = 2 ได้ 5",
  },
  {
    id: "calculus-8",
    question: "ปริพันธ์ของ 1 dx คืออะไร?",
    options: ["0 + C", "x + C", "1/x + C", "x^2 + C"],
    correctAnswer: 1,
    explanation: "อนุพันธ์ตรงข้ามของ 1 คือ x บวกค่าคงที่ของปริพันธ์",
  },
  {
    id: "calculus-9",
    question: "ถ้า f'(x) = 0 ที่จุดหนึ่ง จุดนั้นอาจเป็นอะไร?",
    options: ["จุดวิเคราะห์", "เป็นจุดมากที่สุดเสมอ", "เป็นจุดน้อยที่สุดเสมอ", "ไม่สำคัญ"],
    correctAnswer: 0,
    explanation: "จุดที่อนุพันธ์เป็นศูนย์เป็นจุดวิเคราะห์และอาจเป็นจุดมากที่สุด น้อยที่สุด หรือไม่ใช่",
  },
  {
    id: "calculus-10",
    question: "อนุพันธ์ของ e^x คืออะไร?",
    options: ["x e^(x-1)", "e^x", "ln(x)", "1 / x"],
    correctAnswer: 1,
    explanation: "ฟังก์ชันเลขชี้กำลัง e^x เป็นอนุพันธ์ของตัวเอง",
  },
]

const STATISTICS_QUESTIONS: QuizQuestion[] = [
  {
    id: "statistics-1",
    question: "ค่าเฉลี่ยของ 2, 4, 6, 8 คืออะไร?",
    options: ["4", "5", "6", "8"],
    correctAnswer: 1,
    explanation: "บวกค่าทั้งหมดได้ 20 จากนั้นหารด้วย 4 ค่าได้ 5",
  },
  {
    id: "statistics-2",
    question: "ค่ามัธยฐานของ 3, 7, 9, 12, 20 คืออะไร?",
    options: ["7", "9", "12", "10"],
    correctAnswer: 1,
    explanation: "ตัวเลขเรียงแล้วและค่ากลางคือ 9",
  },
  {
    id: "statistics-3",
    question: "ฐานนิยมของ 1, 2, 2, 3, 4 คืออะไร?",
    options: ["1", "2", "3", "ไม่มีฐานนิยม"],
    correctAnswer: 1,
    explanation: "ฐานนิยมคือค่าที่ปรากฏบ่อยที่สุด และ 2 ปรากฏสองครั้ง",
  },
  {
    id: "statistics-4",
    question: "ขนาดใดที่ได้รับผลกระทบมากที่สุดจากค่าผิดปกติที่extrem?",
    options: ["มัธยฐาน", "ฐานนิยม", "ค่าเฉลี่ย", "พิสัยเท่านั้น"],
    correctAnswer: 2,
    explanation: "ค่าเฉลี่ยใช้ทุกค่าทั้งหมด ดังนั้นค่าที่ผิดปกติหนึ่งค่าสามารถดึงขึ้นหรือลงได้",
  },
  {
    id: "statistics-5",
    question: "พิสัยของ 5, 8, 11, 20 คืออะไร?",
    options: ["5", "11", "15", "20"],
    correctAnswer: 2,
    explanation: "พิสัยคือค่าสูงสุดลบค่าต่ำสุด ดังนั้น 20 - 5 = 15",
  },
  {
    id: "statistics-6",
    question: "ความน่าจะเป็น 0 หมายถึงเหตุการณ์เป็นอะไร?",
    options: ["แน่นอน", "เป็นไปไม่ได้", "น่าจะเป็น", "มีโอกาสเท่ากัน"],
    correctAnswer: 1,
    explanation: "ความน่าจะเป็น 0 หมายถึงเหตุการณ์ไม่สามารถเกิดขึ้นได้",
  },
  {
    id: "statistics-7",
    question: "เหรียญที่ยุติธรรมถูกพลิกหนึ่งครั้ง ความน่าจะเป็นของการได้หัวคืออะไร?",
    options: ["0", "1/4", "1/2", "1"],
    correctAnswer: 2,
    explanation: "มีสองผลลัพธ์ที่มีโอกาสเท่ากันและหนึ่งคือหัว ดังนั้นความน่าจะเป็นคือ 1/2",
  },
  {
    id: "statistics-8",
    question: "ส่วนเบี่ยงเบนมาตรฐานที่ใหญ่ขึ้นมักหมายถึงอะไร?",
    options: ["ข้อมูลกระจายมากกว่า", "ข้อมูลเท่ากันทั้งหมด", "ค่าเฉลี่ยเป็นศูนย์", "มัธยฐานมากกว่า"],
    correctAnswer: 0,
    explanation: "ส่วนเบี่ยงเบนมาตรฐานวัดการกระจาย ดังนั้นค่าที่ใหญ่ขึ้นหมายถึงข้อมูลมีการเปลี่ยนแปลงมากกว่าค่าเฉลี่ย",
  },
  {
    id: "statistics-9",
    question: "กราฟใดดีที่สุดสำหรับแสดงส่วนของทั้งหมด?",
    options: ["แผนภูมิวงกลม", "กราฟ scatter", "กราฟเส้น", "กราฟ box"],
    correctAnswer: 0,
    explanation: "แผนภูมิวงกลมแสดงว่าหมวดหมู่ประกอบเป็นส่วนหนึ่งของทั้งหมด",
  },
  {
    id: "statistics-10",
    question: "ตัวอย่างคืออะไร?",
    options: ["กลุ่มทั้งหมดที่ศึกษา", "กลุ่มย่อยของประชากร", "ข้อมูลที่ผิดพลาดเท่านั้น", "ค่าที่ใหญ่ที่สุด"],
    correctAnswer: 1,
    explanation: "ตัวอย่างคือกลุ่มเล็กกว่าที่เลือกจากประชากรทั้งหมดเพื่อศึกษา",
  },
]

export const QUIZ_CONFIGS: Record<Subject, QuizSubjectConfig> = {
  Algebra: {
    subject: "Algebra",
    slug: "algebra",
    title: "แบบทดสอบพีชคณิต",
    description: "ทดสอบความรู้พีชคณิตของคุณ",
    questions: ALGEBRA_QUESTIONS,
    curriculum: "M1-M6",
  },
  Geometry: {
    subject: "Geometry",
    slug: "geometry",
    title: "แบบทดสอบเรขาคณิต",
    description: "ฝึกรูปทรง มุม พื้นที่ และปริมาตร",
    questions: GEOMETRY_QUESTIONS,
    curriculum: "M1-M6",
  },
  Trigonometry: {
    subject: "Trigonometry",
    slug: "trigonometry",
    title: "แบบทดสอบตรีโกณมิติ",
    description: "ทบทวนอัตราส่วน เอกลักษณ์ และพื้นฐานวงกลมหน่วย",
    questions: TRIGONOMETRY_QUESTIONS,
    curriculum: "M3-M6",
  },
  Calculus: {
    subject: "Calculus",
    slug: "calculus",
    title: "แบบทดสอบแคลคูลัส",
    description: "ฝึกลิมิต อนุพันธ์ และปริพันธ์",
    questions: CALCULUS_QUESTIONS,
    curriculum: "M5-M6",
  },
  Statistics: {
    subject: "Statistics",
    slug: "statistics",
    title: "แบบทดสอบสถิติ",
    description: "ทบทวนข้อมูล ความน่าจะเป็น และขนาดสรุป",
    questions: STATISTICS_QUESTIONS,
    curriculum: "M1-M6",
  },
}

export const ALGEBRA_QUIZ = ALGEBRA_QUESTIONS

export function getQuizConfig(subject: Subject): QuizSubjectConfig {
  return QUIZ_CONFIGS[subject]
}