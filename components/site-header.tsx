"use client"

import { useState } from "react"
import Link from "next/link"
import { Brain, Moon, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { LanguageSwitcher } from "@/components/language-switcher"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

  const navLinks = [
    { label: t.nav.home, href: "#home" },
    { label: t.nav.features, href: "#features" },
    { label: t.nav.howItWorks, href: "#how-it-works" },
    { label: t.nav.examPrep, href: "#exam-prep" },
    { label: t.nav.contact, href: "#contact" },
  ]

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-slate-950/50 px-4 py-3 shadow-[0_10px_40px_rgba(2,8,23,0.32)] backdrop-blur-xl sm:px-6 lg:mt-4 lg:px-8">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl bg-brand/15 text-brand">
            <Brain className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Math Mentor <span className="text-brand">AI</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative text-sm font-medium transition-colors duration-300 ease-out hover:text-foreground ${
                i === 0 ? "text-white" : "text-slate-400"
              }`}
            >
              {link.label}
              {i === 0 && (
                <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-brand" />
              )}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <button
            aria-label={t.nav.toggleTheme}
            className="flex size-9 items-center justify-center rounded-full text-slate-400 transition-colors duration-300 ease-out hover:bg-white/10 hover:text-white"
          >
            <Moon className="size-5" />
          </button>
          <Link href="/login">
          <Button         
            variant="outline"
            className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
          >
            {t.nav.login}
          </Button>             
        </Link>
         
          <Link href="/register">
            <Button className="rounded-xl bg-gradient-to-r from-brand to-brand-blue text-primary-foreground shadow-lg shadow-brand/20 hover:opacity-95">
              {t.nav.signUp}
            </Button>
          </Link>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            aria-label={t.nav.toggleMenu}
            onClick={() => setOpen((v) => !v)}
            className="flex size-9 items-center justify-center rounded-lg text-foreground"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="mx-4 rounded-2xl border border-border bg-card/95 p-4 backdrop-blur lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
              onClick={() => window.location.href = "/login"}
            >
              {t.nav.login}
            </Button>
            <Button
              className="w-full rounded-xl bg-gradient-to-r from-brand to-brand-blue text-primary-foreground shadow-lg shadow-brand/20"
              onClick={() => (window.location.href = "/register")}
            >
              {t.nav.signUp}
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
