"use client"

import { Languages } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import type { Lang } from "@/lib/i18n"

const OPTIONS: { value: Lang; label: string }[] = [
  { value: "th", label: "TH" },
  { value: "en", label: "EN" },
]

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useLanguage()

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className={`flex items-center gap-1 rounded-full border border-border bg-secondary/50 p-0.5 ${className}`}
    >
      <Languages className="ml-1.5 size-3.5 text-muted-foreground" aria-hidden="true" />
      {OPTIONS.map((opt) => {
        const isActive = lang === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setLang(opt.value)}
            aria-pressed={isActive}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
              isActive
                ? "bg-brand text-brand-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
