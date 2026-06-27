"use client"

import { useEffect } from "react"
import { CheckCircle2, Star, Zap, Trophy, X } from "lucide-react"
import { useGamification } from "@/hooks/use-gamification"

interface CelebrationModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  xpEarned?: number
  achievement?: string
  levelUp?: boolean
  newLevel?: number
}

export function CelebrationModal({
  isOpen,
  onClose,
  title,
  subtitle,
  xpEarned = 0,
  achievement,
  levelUp = false,
  newLevel = 1,
}: CelebrationModalProps) {
  const { achievements } = useGamification()

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 4000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative max-w-md rounded-2xl border border-cyan-500/30 bg-slate-900 p-6 text-center shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <X className="size-5" />
        </button>

        <div className="mb-4 text-6xl">🎉</div>

        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}

        {levelUp && (
          <div className="mt-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
            <div className="flex items-center justify-center gap-2">
              <Star className="size-6 text-yellow-400" />
              <p className="text-lg font-bold text-yellow-300">Level Up!</p>
            </div>
            <p className="mt-1 text-sm text-yellow-400">คุณเลื่อนไปเป็น Level {newLevel} แล้ว!</p>
          </div>
        )}

        {xpEarned > 0 && (
          <div className="mt-4 flex items-center justify-center gap-2 text-cyan-400">
            <Zap className="size-5" />
            <span className="text-lg font-bold">+{xpEarned} XP</span>
          </div>
        )}

        {achievement && (
          <div className="mt-4 rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="size-6 text-purple-400" />
              <p className="text-sm font-semibold text-purple-300">ปลดล็อคความสำเร็จ!</p>
            </div>
            <p className="mt-1 text-xs text-purple-400">{achievement}</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-cyan-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-400"
        >
          ดูก่อน
        </button>
      </div>
    </div>
  )
}