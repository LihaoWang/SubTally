"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Language, translations, getNestedTranslation } from "@/lib/i18n"
import { setLanguageCookie } from "@/lib/client-cookies"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
  initialLanguage: Language
}

export function LanguageProvider({ children, initialLanguage }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(initialLanguage)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    // Save to both localStorage and cookies
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('language', lang)
    }
    setLanguageCookie(lang)
  }

  const t = (key: string, params?: Record<string, string>): string => {
    return getNestedTranslation(translations[language], key, params)
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
