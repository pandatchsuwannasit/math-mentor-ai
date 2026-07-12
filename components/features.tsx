import { BookOpen, BarChart3, Target, GraduationCap, CheckCircle2, Sparkles } from "lucide-react"

const FEATURES = [
  {
    icon: BookOpen,
    title: "โจทย์ฝึกที่สร้างด้วย AI",
    description: "โจทย์ไม่จำกัดที่ปรับให้เหมาะกับระดับและเป้าหมายการเรียนของคุณ",
  },
  {
    icon: Target,
    title: "เส้นทางการเรียนเฉพาะบุคคล",
    description: "AI สร้างแผนการเรียนที่ปรับตามความก้าวหน้าและจังหวะของคุณ",
  },
  {
    icon: BarChart3,
    title: "วิเคราะห์จุดแข็งจุดอ่อน",
    description: "ข้อมูลเชิงลึกเกี่ยวกับผลการเรียนเพื่อช่วยให้คุณโฟกัสในสิ่งที่สำคัญ",
  },
  {
    icon: GraduationCap,
    title: "เตรียมสอบ (A-Level, NETSAT)",
    description: "การเตรียมสอบเฉพาะทางสำหรับคณิตศาสตร์ A-Level และ NETSAT",
  },
  {
    icon: CheckCircle2,
    title: "เฉลยทีละขั้นตอน",
    description: "เฉลยที่ละเอียดและเข้าใจง่ายสำหรับทุกโจทย์ที่คุณทำ",
  },
  {
    icon: Sparkles,
    title: "แดชบอร์ดสถิติการเรียน",
    description: "ติดตามความก้าวหน้าด้วยกราฟสวยงามและการวิเคราะห์ที่มีความหมาย",
  },
]

export function Features() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            ทุกสิ่งที่คุณต้องการเพื่อเก่งคณิต
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            เครื่องมือครบครันที่ออกแบบมาเพื่อช่วยให้นักเรียนไทยพิชิตคณิตศาสตร์ระดับมัธยมปลายและการสอบเข้ามหาวิทยาลัย
          </p>
        </div>

        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_16px_60px_rgba(2,8,23,0.24)] transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:bg-white/10"
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <feature.icon className="size-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}