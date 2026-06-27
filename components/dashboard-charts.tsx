"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, Clock, BookOpen, Target, Flame, Trophy } from "lucide-react"
import { innerCardClassName, panelClassName } from "@/lib/dashboard-utils"
import type { User } from "@/lib/types"

const COLORS = {
  cyan: "#06b6d4",
  emerald: "#10b981",
  amber: "#f59e0b",
  rose: "#f43f5e",
  violet: "#8b5cf6",
}

interface DashboardChartsProps {
  user: User
}

export function DashboardCharts({ user }: DashboardChartsProps) {
  const { stats, onboarding } = user
  if (!onboarding) return null

  // Generate last 7 days data
  const last7Days = useMemo(() => {
    const days = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      days.push({
        date: date.toLocaleDateString("th-TH", { weekday: "short" }),
        fullDate: dateStr,
        accuracy: Math.floor(Math.random() * 30) + 60, // Placeholder - replace with real data
        studyTime: Math.floor(Math.random() * 60) + 20, // Placeholder - replace with real data
      })
    }
    return days
  }, [])

  // Difficulty distribution
  const difficultyData = useMemo(() => {
    // Placeholder - replace with real data from question bank
    return [
      { name: "ง่าย", value: 40, color: COLORS.emerald },
      { name: "ปานกลาง", value: 35, color: COLORS.amber },
      { name: "ยาก", value: 25, color: COLORS.rose },
    ]
  }, [])

  // Curriculum completion
  const curriculumProgress = useMemo(() => {
    const current = onboarding.currentCurriculum || "M1"
    const levels = ["M1", "M2", "M3", "M4", "M5", "M6"]
    const currentIndex = levels.indexOf(current)
    return {
      completed: currentIndex,
      total: 6,
      percentage: Math.round((currentIndex / 6) * 100),
    }
  }, [onboarding.currentCurriculum])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<BookOpen className="size-5" />}
          label="บทเรียนที่เรียนแล้ว"
          value={`${stats.lessonsCompleted || 0}`}
          subtext="บทเรียน"
          color="text-cyan-400"
          delay={0}
        />
        <StatCard
          icon={<Target className="size-5" />}
          label="โจทย์ที่ตอบแล้ว"
          value={`${stats.questionsDone || 0}`}
          subtext="ข้อ"
          color="text-emerald-400"
          delay={0.1}
        />
        <StatCard
          icon={<TrendingUp className="size-5" />}
          label="ความแม่นยำรวม"
          value={`${stats.accuracy || 0}%`}
          subtext="เฉลี่ย"
          color="text-violet-400"
          delay={0.2}
        />
        <StatCard
          icon={<Clock className="size-5" />}
          label="เวลาที่ใช้เรียน"
          value={formatStudyTime(stats.studyTimeMinutes)}
          subtext="รวม"
          color="text-amber-400"
          delay={0.3}
        />
        <StatCard
          icon={<Flame className="size-5" />}
          label="สตรีคปัจจุบัน"
          value={`${stats.streak || 0}`}
          subtext="วัน"
          color="text-orange-400"
          delay={0.4}
        />
        <StatCard
          icon={<Trophy className="size-5" />}
          label="ความสำเร็จ"
          value={`${stats.achievements?.length || 0}`}
          subtext="ปลดล็อค"
          color="text-yellow-400"
          delay={0.5}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Accuracy Line Chart */}
        <motion.div variants={item} className={panelClassName}>
          <h3 className="mb-4 text-sm font-medium text-slate-300">ความแม่นยำ 7 วันล่าสุด</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke={COLORS.cyan}
                strokeWidth={2}
                dot={{ fill: COLORS.cyan, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Study Time Bar Chart */}
        <motion.div variants={item} className={panelClassName}>
          <h3 className="mb-4 text-sm font-medium text-slate-300">เวลาที่ใช้เรียน 7 วันล่าสุด</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
              />
              <Bar dataKey="studyTime" fill={COLORS.emerald} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Curriculum Completion Radial */}
        <motion.div variants={item} className={panelClassName}>
          <h3 className="mb-4 text-sm font-medium text-slate-300">ความคืบหน้าหลักสูตร</h3>
          <div className="flex items-center justify-center">
            <div className="relative">
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="12"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke={COLORS.cyan}
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - curriculumProgress.percentage / 100)}`}
                  transform="rotate(-90 80 80)"
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <text
                  x="80"
                  y="80"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="24"
                  fontWeight="bold"
                >
                  {curriculumProgress.percentage}%
                </text>
                <text
                  x="80"
                  y="100"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="12"
                >
                  {curriculumProgress.completed}/{curriculumProgress.total} ระดับ
                </text>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Difficulty Distribution Pie Chart */}
        <motion.div variants={item} className={panelClassName}>
          <h3 className="mb-4 text-sm font-medium text-slate-300">การกระจายความยาก</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={difficultyData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {difficultyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-center gap-4">
            {difficultyData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-slate-400">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function StatCard({
  icon,
  label,
  value,
  subtext,
  color,
  delay,
}: {
  icon: React.ReactNode
  label: string
  value: string
  subtext: string
  color: string
  delay: number
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={innerCardClassName}
    >
      <div className="flex items-start justify-between">
        <div className={`rounded-lg bg-slate-800/50 p-2 ${color}`}>{icon}</div>
      </div>
      <div className="mt-3">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="mt-1 text-2xl font-bold text-white">{value}</p>
        <p className="mt-1 text-xs text-slate-500">{subtext}</p>
      </div>
    </motion.div>
  )
}

function formatStudyTime(minutes: number): string {
  if (minutes < 60) return `${minutes} นาที`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours} ชม. ${mins} นาที` : `${hours} ชม.`
}