export type Lang = "th" | "en"

export const LANGS: Lang[] = ["th", "en"]
export const DEFAULT_LANG: Lang = "th"

type Dict = {
  nav: {
    home: string
    features: string
    howItWorks: string
    examPrep: string
    contact: string
    login: string
    signUp: string
    resources: string
    toggleTheme: string
    toggleMenu: string
    language: string
  }
  hero: {
    badge: string
    titlePre: string
    titleAccent: string
    subtitle: string
    description: string
    startLearning: string
    viewStatistics: string
    socialProof: string
  }
  dashboard: {
    sidebar: {
      dashboard: string
      practice: string
      studyPlan: string
      analysis: string
      exams: string
      solutions: string
      progress: string
      settings: string
    }
    welcome: string
    overview: string
    thisWeek: string
    profileAlt: string
    stats: {
      practiceQuestions: string
      studyTime: string
      accuracy: string
      streak: string
      streakValue: string
      fromLastWeek: (n: string) => string
      keepItUp: string
    }
    studyTimeShort: string
    learningProgress: string
    subjectMastery: string
    overall: string
    upcomingGoals: string
    goalTitle: string
    dueIn: string
    aiRecommendation: string
    aiRecText: string
    aiRecSub: string
  }
  features: {
    heading: string
    subheading: string
    items: { title: string; description: string }[]
  }
  aiLearning: {
    tag: string
    heading: string
    description: string
    items: { title: string; description: string }[]
  }
  skills: {
    tag: string
    heading: string
    description: string
    masteryLabel: string
    items: { name: string; description: string }[]
  }
  exam: {
    tag: string
    heading: string
    description: string
    items: { title: string; description: string; tag: string }[]
  }
  assistant: {
    tag: string
    heading: string
    description: string
    items: { title: string; description: string }[]
  }
  statsDashboard: {
    tag: string
    heading: string
    description: string
    accuracyRate: string
    studyTime: string
    learningProgress: string
    weakestTopics: string
    strongestTopics: string
    thisMonth: string
    accuracyValue: string
    studyTimeValue: string
    progressValue: string
  }
  contact: {
    tag: string
    heading: string
    description: string
    name: string
    namePlaceholder: string
    email: string
    emailPlaceholder: string
    message: string
    messagePlaceholder: string
    send: string
    emailUs: string
    callUs: string
    visitUs: string
    address: string
  }
  footer: {
    tagline: string
    product: string
    company: string
    legal: string
    rights: string
    links: {
      product: string[]
      company: string[]
      legal: string[]
    }
  }
}

export const translations: Record<Lang, Dict> = {
  th: {
    nav: {
      home: "หน้าแรก",
      features: "ฟีเจอร์",
      howItWorks: "วิธีการทำงาน",
      examPrep: "เตรียมสอบ",
      contact: "ติดต่อเรา",
      login: "เข้าสู่ระบบ",
      signUp: "สมัครสมาชิก",
      resources: "แหล่งเรียนรู้",
      toggleTheme: "สลับโหมดมืด",
      toggleMenu: "เปิดเมนู",
      language: "ภาษา",
    },
    hero: {
      badge: "การเรียนคณิตศาสตร์ด้วย AI",
      titlePre: "Math Mentor ",
      titleAccent: "AI",
      subtitle: "เรียนคณิตศาสตร์เฉพาะบุคคล ขับเคลื่อนด้วย AI",
      description:
        "สัมผัสอนาคตของการเรียนรู้ด้วยโจทย์ที่สร้างโดย AI เส้นทางการเรียนเฉพาะบุคคล และข้อมูลเชิงลึกอัจฉริยะที่ช่วยให้คุณเชี่ยวชาญคณิตศาสตร์อย่างมั่นใจ",
      startLearning: "เริ่มเรียนเลย",
      viewStatistics: "ดูสถิติ",
      socialProof: "นักเรียนกว่า 2,500+ คนกำลังเรียนอย่างชาญฉลาด",
    },
    dashboard: {
      sidebar: {
        dashboard: "แดชบอร์ด",
        practice: "ฝึกทำโจทย์",
        studyPlan: "แผนการเรียน",
        analysis: "วิเคราะห์",
        exams: "ข้อสอบ",
        solutions: "เฉลย",
        progress: "ความก้าวหน้า",
        settings: "ตั้งค่า",
      },
      welcome: "ยินดีต้อนรับกลับมา, อเล็กซ์!",
      overview: "นี่คือภาพรวมการเรียนของคุณ",
      thisWeek: "สัปดาห์นี้",
      profileAlt: "โปรไฟล์ของอเล็กซ์",
      stats: {
        practiceQuestions: "โจทย์ที่ฝึกทำ",
        studyTime: "เวลาเรียน",
        accuracy: "ความแม่นยำ",
        streak: "ต่อเนื่อง",
        streakValue: "7 วัน",
        fromLastWeek: (n) => `${n} จากสัปดาห์ก่อน`,
        keepItUp: "ทำต่อไปนะ!",
      },
      studyTimeShort: "8 ชม. 42 น.",
      learningProgress: "ความก้าวหน้าการเรียน",
      subjectMastery: "ความเชี่ยวชาญรายวิชา",
      overall: "โดยรวม",
      upcomingGoals: "เป้าหมายที่จะถึง",
      goalTitle: "ทำชุดฝึกแคลคูลัสให้เสร็จ",
      dueIn: "ครบกำหนดใน 2 วัน",
      aiRecommendation: "คำแนะนำจาก AI",
      aiRecText: "เน้นเรื่องเอกลักษณ์ตรีโกณมิติ",
      aiRecSub: "อ้างอิงจากผลการเรียนล่าสุดของคุณ",
    },
    features: {
      heading: "ทุกสิ่งที่คุณต้องการเพื่อเก่งคณิต",
      subheading:
        "เครื่องมือครบครันที่ออกแบบมาเพื่อช่วยให้นักเรียนไทยพิชิตคณิตศาสตร์ระดับมัธยมปลายและการสอบเข้ามหาวิทยาลัย",
      items: [
        {
          title: "โจทย์ฝึกที่สร้างด้วย AI",
          description: "โจทย์ไม่จำกัดที่ปรับให้เหมาะกับระดับและเป้าหมายการเรียนของคุณ",
        },
        {
          title: "เส้นทางการเรียนเฉพาะบุคคล",
          description: "AI สร้างแผนการเรียนที่ปรับตามความก้าวหน้าและจังหวะของคุณ",
        },
        {
          title: "วิเคราะห์จุดแข็งจุดอ่อน",
          description: "ข้อมูลเชิงลึกเกี่ยวกับผลการเรียนเพื่อช่วยให้คุณโฟกัสในสิ่งที่สำคัญ",
        },
        {
          title: "เตรียมสอบ (A-Level, NETSAT)",
          description: "การเตรียมสอบเฉพาะทางสำหรับคณิตศาสตร์ A-Level และ NETSAT",
        },
        {
          title: "เฉลยทีละขั้นตอน",
          description: "เฉลยที่ละเอียดและเข้าใจง่ายสำหรับทุกโจทย์ที่คุณทำ",
        },
        {
          title: "แดชบอร์ดสถิติการเรียน",
          description: "ติดตามความก้าวหน้าด้วยกราฟสวยงามและการวิเคราะห์ที่มีความหมาย",
        },
      ],
    },
    aiLearning: {
      tag: "AI เรียนรู้เฉพาะบุคคล",
      heading: "การเรียนที่ปรับให้เหมาะกับคุณ ด้วย AI",
      description:
        "ระบบ AI ของเราวิเคราะห์รูปแบบการเรียนรู้ของคุณ แล้วสร้างประสบการณ์การเรียนที่ออกแบบมาเพื่อคุณโดยเฉพาะ",
      items: [
        {
          title: "วิเคราะห์จุดแข็งและจุดอ่อน",
          description: "AI ประเมินผลการทำโจทย์ของคุณอย่างละเอียดเพื่อระบุว่าควรพัฒนาตรงไหน",
        },
        {
          title: "สร้างแบบฝึกหัดคณิตเฉพาะบุคคล",
          description: "สร้างโจทย์คณิตศาสตร์ที่ตรงกับระดับและหัวข้อที่คุณต้องฝึกมากที่สุด",
        },
        {
          title: "ระบบปรับระดับความยากอัตโนมัติ",
          description: "ความยากของโจทย์จะปรับขึ้นลงตามผลการทำของคุณแบบเรียลไทม์",
        },
      ],
    },
    skills: {
      tag: "วิเคราะห์ทักษะคณิตศาสตร์",
      heading: "ครอบคลุมทุกหัวข้อคณิตศาสตร์",
      description:
        "ติดตามและพัฒนาความเชี่ยวชาญในทุกสาขาของคณิตศาสตร์ที่จำเป็นต่อการสอบและการแข่งขัน",
      masteryLabel: "ความเชี่ยวชาญ",
      items: [
        { name: "พีชคณิต", description: "สมการ ฟังก์ชัน และนิพจน์พีชคณิต" },
        { name: "เรขาคณิต", description: "รูปทรง พื้นที่ ปริมาตร และการพิสูจน์" },
        { name: "ตรีโกณมิติ", description: "ฟังก์ชันตรีโกณ เอกลักษณ์ และกราฟ" },
        { name: "สถิติ", description: "การวิเคราะห์ข้อมูล การกระจาย และการสุ่ม" },
        { name: "ความน่าจะเป็น", description: "เหตุการณ์ การจัดหมู่ และการเรียงสับเปลี่ยน" },
        { name: "แคลคูลัส", description: "ลิมิต อนุพันธ์ และการอินทิเกรต" },
      ],
    },
    exam: {
      tag: "เตรียมสอบ",
      heading: "พร้อมพิชิตทุกสนามสอบ",
      description:
        "หลักสูตรเตรียมสอบเฉพาะทางที่ออกแบบตามโครงสร้างข้อสอบจริง พร้อมข้อสอบเก่าและแนวข้อสอบล่าสุด",
      items: [
        {
          title: "คณิตศาสตร์ A-Level",
          description: "ครอบคลุมเนื้อหาตามหลักสูตรพร้อมแนวข้อสอบและการจับเวลาเสมือนจริง",
          tag: "ยอดนิยม",
        },
        {
          title: "คณิตศาสตร์ NETSAT",
          description: "ฝึกทำโจทย์ตามรูปแบบ NETSAT พร้อมเทคนิคการทำข้อสอบให้ทันเวลา",
          tag: "ใหม่",
        },
        {
          title: "การแข่งขันคณิตศาสตร์",
          description: "โจทย์ท้าทายระดับสูงเพื่อเตรียมตัวสำหรับการแข่งขันระดับชาติ",
          tag: "",
        },
        {
          title: "เตรียมสอบโอลิมปิก",
          description: "โจทย์ระดับโอลิมปิกพร้อมเทคนิคการพิสูจน์และการแก้ปัญหาเชิงลึก",
          tag: "",
        },
      ],
    },
    assistant: {
      tag: "ผู้ช่วยเรียนรู้ AI",
      heading: "มีติวเตอร์ AI อยู่ข้างคุณตลอดเวลา",
      description:
        "ผู้ช่วย AI ที่พร้อมช่วยเหลือทุกขั้นตอน ตั้งแต่การให้คำใบ้ไปจนถึงการวิเคราะห์ข้อผิดพลาด",
      items: [
        {
          title: "เฉลยทีละขั้นตอน",
          description: "อธิบายวิธีแก้โจทย์อย่างละเอียดทีละขั้น เข้าใจง่ายและเป็นระบบ",
        },
        {
          title: "ระบบให้คำใบ้",
          description: "รับคำใบ้ทีละนิดเมื่อติดขัด โดยไม่เฉลยคำตอบทั้งหมดทันที",
        },
        {
          title: "วิเคราะห์ข้อผิดพลาด",
          description: "AI ชี้จุดที่คุณเข้าใจผิดและอธิบายแนวคิดที่ถูกต้อง",
        },
        {
          title: "คำแนะนำการเรียน",
          description: "แนะนำหัวข้อและแบบฝึกหัดที่ควรทบทวนต่อไปเพื่อพัฒนาอย่างต่อเนื่อง",
        },
      ],
    },
    statsDashboard: {
      tag: "แดชบอร์ดสถิติ",
      heading: "เห็นความก้าวหน้าของคุณอย่างชัดเจน",
      description:
        "ติดตามทุกตัวชี้วัดสำคัญในที่เดียว เพื่อให้คุณรู้ว่าควรพัฒนาตรงไหนและภูมิใจกับสิ่งที่ทำได้",
      accuracyRate: "อัตราความแม่นยำ",
      studyTime: "เวลาเรียนสะสม",
      learningProgress: "ความก้าวหน้าการเรียน",
      weakestTopics: "หัวข้อที่ต้องพัฒนา",
      strongestTopics: "หัวข้อที่ทำได้ดี",
      thisMonth: "เดือนนี้",
      accuracyValue: "92%",
      studyTimeValue: "8 ชม. 42 น.",
      progressValue: "75%",
    },
    contact: {
      tag: "ติดต่อเรา",
      heading: "มีคำถาม? เราพร้อมช่วยเหลือ",
      description: "ติดต่อทีมงานของเราเพื่อสอบถามข้อมูลเพิ่มเติม หรือเริ่มต้นการเรียนรู้กับ Math Mentor AI",
      name: "ชื่อ",
      namePlaceholder: "กรอกชื่อของคุณ",
      email: "อีเมล",
      emailPlaceholder: "you@example.com",
      message: "ข้อความ",
      messagePlaceholder: "เราจะช่วยอะไรคุณได้บ้าง?",
      send: "ส่งข้อความ",
      emailUs: "อีเมล",
      callUs: "โทรหาเรา",
      visitUs: "ที่อยู่",
      address: "กรุงเทพมหานคร ประเทศไทย",
    },
    footer: {
      tagline: "เรียนคณิตศาสตร์เฉพาะบุคคล ขับเคลื่อนด้วย AI สำหรับนักเรียนไทย",
      product: "ผลิตภัณฑ์",
      company: "บริษัท",
      legal: "กฎหมาย",
      rights: "สงวนลิขสิทธิ์",
      links: {
        product: ["ฟีเจอร์", "เตรียมสอบ", "ราคา", "แดชบอร์ด"],
        company: ["เกี่ยวกับเรา", "บล็อก", "ร่วมงานกับเรา", "ติดต่อ"],
        legal: ["ความเป็นส่วนตัว", "เงื่อนไขการใช้งาน", "นโยบายคุกกี้"],
      },
    },
  },
  en: {
    nav: {
      home: "Home",
      features: "Features",
      howItWorks: "How It Works",
      examPrep: "Exam Preparation",
      contact: "Contact",
      login: "Login",
      signUp: "Sign Up",
      resources: "Resources",
      toggleTheme: "Toggle dark mode",
      toggleMenu: "Toggle menu",
      language: "Language",
    },
    hero: {
      badge: "AI-Powered Mathematics Learning",
      titlePre: "Math Mentor ",
      titleAccent: "AI",
      subtitle: "Personalized Mathematics Learning Powered by AI",
      description:
        "Experience the future of learning with AI-generated questions, personalized study paths, and intelligent insights that help you master mathematics with confidence.",
      startLearning: "Start Learning",
      viewStatistics: "View Statistics",
      socialProof: "2,500+ students are learning smarter",
    },
    dashboard: {
      sidebar: {
        dashboard: "Dashboard",
        practice: "Practice",
        studyPlan: "Study Plan",
        analysis: "Analysis",
        exams: "Exams",
        solutions: "Solutions",
        progress: "Progress",
        settings: "Settings",
      },
      welcome: "Welcome back, Alex!",
      overview: "Here's your learning overview",
      thisWeek: "This Week",
      profileAlt: "Alex's profile",
      stats: {
        practiceQuestions: "Practice Questions",
        studyTime: "Study Time",
        accuracy: "Accuracy",
        streak: "Streak",
        streakValue: "7 Days",
        fromLastWeek: (n) => `${n} from last week`,
        keepItUp: "Keep it up!",
      },
      studyTimeShort: "8h 42m",
      learningProgress: "Learning Progress",
      subjectMastery: "Subject Mastery",
      overall: "Overall",
      upcomingGoals: "Upcoming Goals",
      goalTitle: "Complete Calculus Practice Set",
      dueIn: "Due in 2 days",
      aiRecommendation: "AI Recommendation",
      aiRecText: "Focus on Trigonometric Identities",
      aiRecSub: "Based on your recent performance",
    },
    features: {
      heading: "Everything you need to excel at math",
      subheading:
        "A complete toolkit designed to help Thai students conquer high school mathematics and university entrance exams.",
      items: [
        {
          title: "AI-generated Practice Questions",
          description: "Unlimited personalized questions tailored to your learning level and goals.",
        },
        {
          title: "Personalized Learning Paths",
          description: "AI creates custom study plans that adapt to your progress and pace.",
        },
        {
          title: "Strength & Weakness Analysis",
          description: "Detailed insights into your performance to help you focus on what matters.",
        },
        {
          title: "Exam Preparation (A-Level, NETSAT)",
          description: "Specialized preparation for A-Level Mathematics and NETSAT exams.",
        },
        {
          title: "Step-by-Step Solutions",
          description: "Detailed, easy-to-understand solutions for every question you attempt.",
        },
        {
          title: "Learning Statistics Dashboard",
          description: "Track your progress with beautiful charts and meaningful analytics.",
        },
      ],
    },
    aiLearning: {
      tag: "AI Personalized Learning",
      heading: "Learning tailored to you, powered by AI",
      description:
        "Our AI analyzes how you learn and builds a study experience designed specifically around your needs.",
      items: [
        {
          title: "Analyze strengths and weaknesses",
          description: "AI evaluates your performance in detail to pinpoint exactly where to improve.",
        },
        {
          title: "Generate personalized math exercises",
          description: "Creates math problems matched to your level and the topics you need most.",
        },
        {
          title: "Adaptive difficulty system",
          description: "Problem difficulty scales up or down in real time based on your performance.",
        },
      ],
    },
    skills: {
      tag: "Mathematics Skill Analysis",
      heading: "Covering every mathematics topic",
      description:
        "Track and build mastery across every branch of mathematics essential for exams and competitions.",
      masteryLabel: "Mastery",
      items: [
        { name: "Algebra", description: "Equations, functions, and algebraic expressions." },
        { name: "Geometry", description: "Shapes, area, volume, and proofs." },
        { name: "Trigonometry", description: "Trig functions, identities, and graphs." },
        { name: "Statistics", description: "Data analysis, distributions, and sampling." },
        { name: "Probability", description: "Events, combinations, and permutations." },
        { name: "Calculus", description: "Limits, derivatives, and integration." },
      ],
    },
    exam: {
      tag: "Exam Preparation",
      heading: "Ready to conquer every exam",
      description:
        "Specialized prep courses built around real exam structures, with past papers and the latest question formats.",
      items: [
        {
          title: "A-Level Mathematics",
          description: "Full curriculum coverage with practice papers and realistic timed simulations.",
          tag: "Popular",
        },
        {
          title: "NETSAT Mathematics",
          description: "Practice in the NETSAT format with techniques to finish on time.",
          tag: "New",
        },
        {
          title: "Mathematics Competitions",
          description: "High-level challenge problems to prepare for national competitions.",
          tag: "",
        },
        {
          title: "Olympiad Preparation",
          description: "Olympiad-level problems with proof techniques and deep problem solving.",
          tag: "",
        },
      ],
    },
    assistant: {
      tag: "AI Learning Assistant",
      heading: "An AI tutor by your side, anytime",
      description:
        "An AI assistant ready to help at every step, from giving hints to analyzing your mistakes.",
      items: [
        {
          title: "Step-by-step solutions",
          description: "Detailed explanations that walk through each step clearly and systematically.",
        },
        {
          title: "Hint system",
          description: "Get nudged with hints when you're stuck, without revealing the full answer.",
        },
        {
          title: "Error analysis",
          description: "AI identifies your misconceptions and explains the correct concepts.",
        },
        {
          title: "Learning recommendations",
          description: "Suggests topics and exercises to review next for continuous improvement.",
        },
      ],
    },
    statsDashboard: {
      tag: "Statistics Dashboard",
      heading: "See your progress with crystal clarity",
      description:
        "Track every key metric in one place so you know exactly where to improve and what to be proud of.",
      accuracyRate: "Accuracy Rate",
      studyTime: "Study Time",
      learningProgress: "Learning Progress",
      weakestTopics: "Weakest Topics",
      strongestTopics: "Strongest Topics",
      thisMonth: "This Month",
      accuracyValue: "92%",
      studyTimeValue: "8h 42m",
      progressValue: "75%",
    },
    contact: {
      tag: "Contact",
      heading: "Have questions? We're here to help",
      description: "Reach out to our team for more information or to start learning with Math Mentor AI.",
      name: "Name",
      namePlaceholder: "Enter your name",
      email: "Email",
      emailPlaceholder: "you@example.com",
      message: "Message",
      messagePlaceholder: "How can we help you?",
      send: "Send Message",
      emailUs: "Email Us",
      callUs: "Call Us",
      visitUs: "Visit Us",
      address: "Bangkok, Thailand",
    },
    footer: {
      tagline: "Personalized mathematics learning powered by AI, built for Thai students.",
      product: "Product",
      company: "Company",
      legal: "Legal",
      rights: "All rights reserved.",
      links: {
        product: ["Features", "Exam Prep", "Pricing", "Dashboard"],
        company: ["About", "Blog", "Careers", "Contact"],
        legal: ["Privacy", "Terms of Service", "Cookie Policy"],
      },
    },
  },
}
