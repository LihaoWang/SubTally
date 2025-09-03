"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { setThemeCookie, getThemeFromDocument } from "@/lib/client-cookies"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  initialTheme: Theme
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(initialTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Sync with what the script already applied
    const documentTheme = getThemeFromDocument()
    if (documentTheme !== theme) {
      setThemeState(documentTheme)
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme)
    setThemeCookie(newTheme)

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  // Remove the effect that was applying theme classes - the script already handles this

  const contextValue = {
    theme,
    setTheme,
    toggleTheme,
  }

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
