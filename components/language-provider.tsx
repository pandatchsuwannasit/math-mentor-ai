"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { translations, DEFAULT_LANG, type Lang } from "@/lib/i18n"

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (typeof translations)[Lang]
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = "mathmentor-lang"

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG)

  // Restore persisted language on mount
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null
    if (stored && (stored === "th" || stored === "en")) {
      setLangState(stored)
    }
  }, [])

  // Keep <html lang> in sync for accessibility/SEO
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return ctx
}
