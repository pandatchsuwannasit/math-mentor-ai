import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"

export default function Page() {
  return (
    <main className="relative min-h-screen bg-navy-deep page-enter">
      <SiteHeader />
      <Hero />
      <Features />

      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="glass-panel overflow-hidden p-8 sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">How it works</p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                เรียนอย่างมีทิศทางและเห็นความก้าวหน้าในทุกสัปดาห์
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-slate-400">
                ระบบจะวิเคราะห์พฤติกรรมการเรียนของคุณและคัดเลือกโจทย์ที่ช่วยเสริมจุดอ่อนให้มีประสิทธิภาพที่สุด
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { title: "1. เริ่มต้น", text: "ตอบคำถามและให้ระบบรู้ระดับของคุณ" },
                { title: "2. ปรับตัว", text: "AI เลือกโจทย์ที่เหมาะกับความสามารถล่าสุด" },
                { title: "3. พัฒนา", text: "ติดตามผลลัพธ์และรับแผนเรียนต่อไป" },
              ].map((step) => (
                <div key={step.title} className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="exam-prep" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-panel p-8 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Exam prep</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">เตรียมสอบอย่างมั่นใจด้วยโจทย์ที่ตรงเป้า</h2>
            <p className="mt-4 text-lg text-slate-400">
              เหมาะสำหรับ A-Level, NETSAT และการทดสอบคณิตศาสตร์ระดับมัธยมปลายที่ต้องการชิงคะแนนสูง
            </p>
          </div>
          <div className="glass-panel p-8 sm:p-10">
            <div className="flex items-center justify-between rounded-2xl border border-brand/20 bg-brand/10 px-4 py-3">
              <div>
                <p className="text-sm text-slate-300">ความคืบหน้าในสัปดาห์นี้</p>
                <p className="text-xl font-semibold text-white">82% จบแผนการเรียน</p>
              </div>
              <div className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-brand">+14%</div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                "เฉลยทีละขั้นตอน",
                "ระบบทบทวนแบบค่อยเป็นค่อยไป",
                "ข้อสอบจำลองสั้นและรวดเร็ว",
                "ติดตามจุดอ่อนแบบเรียลไทม์",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="glass-panel flex flex-col gap-6 p-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left sm:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Ready to begin</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">เริ่มต้นการเรียนคณิตศาสตร์ที่เรียบง่ายและฉลาดขึ้นวันนี้</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="/login" className="rounded-2xl bg-gradient-to-r from-brand to-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/20">
              เริ่มเรียนเลย
            </a>
            <a href="/register" className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200">
              สร้างบัญชี
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
