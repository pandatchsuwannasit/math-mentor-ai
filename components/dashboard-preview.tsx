"use client"

import Image from "next/image"
import {
  Brain,
  LayoutDashboard,
  PencilRuler,
  CalendarDays,
  BarChart3,
  FileText,
  Lightbulb,
  TrendingUp,
  Settings,
  HelpCircle,
  Clock,
  Target,
  Flame,
  ChevronDown,
  CalendarCheck,
  Sparkles,
} from "lucide-react"
import { useLanguage } from "@/components/language-provider"

const MASTERY = [
  { key: "algebra", value: 78, color: "oklch(0.65 0.18 280)" },
  { key: "calculus", value: 65, color: "oklch(0.72 0.15 220)" },
  { key: "geometry", value: 80, color: "oklch(0.78 0.16 150)" },
  { key: "trigonometry", value: 70, color: "oklch(0.8 0.16 85)" },
  { key: "statistics", value: 60, color: "oklch(0.7 0.18 25)" },
] as const

const MASTERY_LABELS: Record<string, { th: string; en: string }> = {
  algebra: { th: "พีชคณิต", en: "Algebra" },
  calculus: { th: "แคลคูลัส", en: "Calculus" },
  geometry: { th: "เรขาคณิต", en: "Geometry" },
  trigonometry: { th: "ตรีโกณมิติ", en: "Trigonometry" },
  statistics: { th: "สถิติ", en: "Statistics" },
}

const PROGRESS_POINTS = [12, 22, 30, 28, 45, 55, 50, 68, 72, 75]
const DAYS_TH = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."]
const DAYS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function buildLinePath(points: number[], width: number, height: number) {
  const max = 100
  const step = width / (points.length - 1)
  return points
    .map((p, i) => {
      const x = i * step
      const y = height - (p / max) * height
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")
}

export function DashboardPreview() {
  const { lang, t } = useLanguage()
  const d = t.dashboard

  const w = 300
  const h = 120
  const linePath = buildLinePath(PROGRESS_POINTS, w, h)
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`

  const sidebar = [
    { id: "dashboard", icon: LayoutDashboard, label: d.sidebar.dashboard, active: true },
    { id: "practice", icon: PencilRuler, label: d.sidebar.practice },
    { id: "study-plan", icon: CalendarDays, label: d.sidebar.studyPlan },
    { id: "analysis", icon: BarChart3, label: d.sidebar.analysis },
    { id: "exams", icon: FileText, label: d.sidebar.exams },
    { id: "solutions", icon: Lightbulb, label: d.sidebar.solutions },
    { id: "progress", icon: TrendingUp, label: d.sidebar.progress },
    { id: "settings", icon: Settings, label: d.sidebar.settings },
  ]

  const stats = [
    { label: d.stats.practiceQuestions, value: "126", delta: d.stats.fromLastWeek("+12%"), icon: HelpCircle, tint: "text-brand", deltaTone: "text-emerald-400" },
    { label: d.stats.studyTime, value: d.studyTimeShort, delta: d.stats.fromLastWeek("+8%"), icon: Clock, tint: "text-emerald-400", deltaTone: "text-emerald-400" },
    { label: d.stats.accuracy, value: "92%", delta: d.stats.fromLastWeek("+5%"), icon: Target, tint: "text-violet-400", deltaTone: "text-emerald-400" },
    { label: d.stats.streak, value: d.stats.streakValue, delta: d.stats.keepItUp, icon: Flame, tint: "text-orange-400", deltaTone: "text-orange-400" },
  ]

  const days = lang === "th" ? DAYS_TH : DAYS_EN

  // Donut stroke segments
  const radius = 42
  const circumference = 2 * Math.PI * radius
  let offsetAccum = 0
  const donutTotal = MASTERY.reduce((s, m) => s + m.value, 0)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card/70 shadow-2xl backdrop-blur-sm">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-44 shrink-0 flex-col gap-1 border-r border-border bg-sidebar/60 p-4 sm:flex">
          <div className="mb-4 flex items-center gap-2 px-1">
            <span className="flex size-7 items-center justify-center rounded-md bg-brand/15 text-brand">
              <Brain className="size-4" />
            </span>
            <span className="text-sm font-semibold">
              Math Mentor <span className="text-brand">AI</span>
            </span>
          </div>
          {sidebar.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium ${
                item.active ? "bg-brand/15 text-brand" : "text-muted-foreground"
              }`}
            >
              <item.icon className="size-4" />
              {item.label}
            </div>
          ))}
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          {/* Welcome row */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold sm:text-base">{d.welcome} 👋</h3>
              <p className="text-xs text-muted-foreground">{d.overview}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground sm:flex">
                {d.thisWeek}
                <ChevronDown className="size-3.5" />
              </div>
              <Image
                src="/avatars/alex.png"
                alt={d.profileAlt}
                width={32}
                height={32}
                className="size-8 rounded-full object-cover ring-2 ring-brand/40"
              />
            </div>
          </div>

          {/* Stat cards */}
          <div className="mb-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-background/40 p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">{s.label}</span>
                  <s.icon className={`size-3.5 ${s.tint}`} />
                </div>
                <div className="text-lg font-semibold leading-tight">{s.value}</div>
                <div className={`mt-0.5 text-[10px] ${s.deltaTone}`}>{s.delta}</div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="mb-4 grid gap-2.5 lg:grid-cols-2">
            {/* Learning Progress */}
            <div className="rounded-xl border border-border bg-background/40 p-3">
              <h4 className="mb-3 text-xs font-semibold">{d.learningProgress}</h4>
              <div className="flex gap-2">
                <div className="flex flex-col justify-between py-1 text-[8px] text-muted-foreground">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>
                <div className="relative flex-1">
                  <svg viewBox={`0 0 ${w} ${h}`} className="h-24 w-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.72 0.15 220)" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="oklch(0.72 0.15 220)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={areaPath} fill="url(#areaFill)" />
                    <path d={linePath} fill="none" stroke="oklch(0.72 0.15 220)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                  </svg>
                  <span className="absolute right-1 top-0 rounded-md bg-brand px-1.5 py-0.5 text-[8px] font-semibold text-brand-foreground">
                    75%
                  </span>
                </div>
              </div>
              <div className="mt-1 flex justify-between pl-7 text-[8px] text-muted-foreground">
                {days.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
            </div>

            {/* Subject Mastery */}
            <div className="rounded-xl border border-border bg-background/40 p-3">
              <h4 className="mb-3 text-xs font-semibold">{d.subjectMastery}</h4>
              <div className="flex items-center gap-3">
                <div className="relative size-24 shrink-0">
                  <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                    {MASTERY.map((m) => {
                      const fraction = m.value / donutTotal
                      const dash = fraction * circumference
                      const seg = (
                        <circle
                          key={m.key}
                          cx="50"
                          cy="50"
                          r={radius}
                          fill="none"
                          stroke={m.color}
                          strokeWidth="9"
                          strokeDasharray={`${dash} ${circumference - dash}`}
                          strokeDashoffset={-offsetAccum}
                        />
                      )
                      offsetAccum += dash
                      return seg
                    })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-base font-bold leading-none">72%</span>
                    <span className="text-[8px] text-muted-foreground">{d.overall}</span>
                  </div>
                </div>
                <ul className="flex-1 space-y-1">
                  {MASTERY.map((m) => (
                    <li key={m.key} className="flex items-center justify-between text-[10px]">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="size-1.5 rounded-full" style={{ backgroundColor: m.color }} />
                        {MASTERY_LABELS[m.key][lang]}
                      </span>
                      <span className="font-medium">{m.value}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid gap-2.5 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-background/40 p-3">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-xs font-semibold">{d.upcomingGoals}</h4>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Target className="size-3 text-brand" />
                  {d.goalTitle}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <CalendarCheck className="size-3" />
                  {d.dueIn}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-2/3 rounded-full bg-brand-blue" />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background/40 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-semibold">{d.aiRecommendation}</h4>
                  <p className="mt-1 text-[11px] font-medium">{d.aiRecText}</p>
                  <p className="text-[9px] text-muted-foreground">{d.aiRecSub}</p>
                </div>
                <Sparkles className="size-4 shrink-0 text-brand" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
