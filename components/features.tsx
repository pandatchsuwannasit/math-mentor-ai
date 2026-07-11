import { BrainCircuit, Route, BarChart3, GraduationCap, FileText, PieChart } from "lucide-react"

const FEATURES = [
  {
    icon: BrainCircuit,
    title: "AI-generated Practice Questions",
    description: "Unlimited personalized questions tailored to your learning level and goals.",
    tint: "bg-brand/10 text-brand",
  },
  {
    icon: Route,
    title: "Personalized Learning Paths",
    description: "AI creates custom study plans that adapt to your progress and pace.",
    tint: "bg-emerald-500/10 text-emerald-500",
  },
  {
    icon: BarChart3,
    title: "Strength & Weakness Analysis",
    description: "Detailed insights into your performance to help you focus on what matters.",
    tint: "bg-violet-500/10 text-violet-500",
  },
  {
    icon: GraduationCap,
    title: "Exam Preparation (A-Level, NETSAT)",
    description: "Specialized preparation for A-Level Mathematics and NETSAT exams.",
    tint: "bg-orange-500/10 text-orange-500",
  },
  {
    icon: FileText,
    title: "Step-by-Step Solutions",
    description: "Detailed, easy-to-understand solutions for every question you attempt.",
    tint: "bg-sky-500/10 text-sky-500",
  },
  {
    icon: PieChart,
    title: "Learning Statistics Dashboard",
    description: "Track your progress with beautiful charts and meaningful analytics.",
    tint: "bg-teal-500/10 text-teal-500",
  },
]

export function Features() {
  return (
    <section
      id="features"
      className="relative z-10 -mt-12 rounded-t-[2.5rem] bg-section-light text-section-light-foreground"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md"
            >
              <span className={`mb-4 flex size-12 items-center justify-center rounded-xl ${feature.tint}`}>
                <feature.icon className="size-6" />
              </span>
              <h3 className="text-pretty text-base font-bold leading-snug">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-section-light-muted">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
