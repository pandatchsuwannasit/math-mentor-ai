"use client"

import Image from "next/image"
import { Sparkles, ArrowRight, BarChart3, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MathBackground } from "@/components/math-background"
import { DashboardPreview } from "@/components/dashboard-preview"
import { useLanguage } from "@/components/language-provider"

const AVATARS = [
  "/avatars/student-1.png",
  "/avatars/student-2.png",
  "/avatars/student-3.png",
  "/avatars/student-4.png",
]

export function Hero() {
  const { t } = useLanguage()

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-navy-deep pb-24 pt-28 sm:pt-32 lg:pb-32"
    >
      <MathBackground />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">
        {/* Left column */}
        <div className="fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
            <Sparkles className="size-4" />
            {t.hero.badge}
          </span>

          <h1 className="mt-6 text-pretty text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            {t.hero.titlePre}
            <span className="text-brand">{t.hero.titleAccent}</span>
          </h1>

          <p className="mt-4 text-balance text-xl font-medium text-foreground/90 sm:text-2xl">
            {t.hero.subtitle}
          </p>

          <p className="mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            {t.hero.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 rounded-xl bg-brand-blue px-6 text-base text-primary-foreground hover:bg-brand-blue/90"
            >
              {t.hero.startLearning}
              <ArrowRight className="size-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-border bg-transparent px-6 text-base text-foreground hover:bg-secondary"
            >
              {t.hero.viewStatistics}
              <BarChart3 className="size-5" />
            </Button>
          </div>

          {/* Social proof */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-3">
              {AVATARS.map((src, i) => (
                <Image
                  key={src}
                  src={src}
                  alt={`Student ${i + 1}`}
                  width={40}
                  height={40}
                  className="size-10 rounded-full border-2 border-navy-deep object-cover"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {t.hero.socialProof}
              </p>
            </div>
          </div>
        </div>

        {/* Right column - dashboard */}
        <div className="lg:pl-4 fade-in-up">
          <DashboardPreview />
        </div>
      </div>
    </section>
  )
}
