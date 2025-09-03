import type { Language } from '@/lib/i18n'

export type Theme = 'light' | 'dark'

/**
 * Client-side cookie utilities
 */

export function setThemeCookie(theme: Theme) {
  if (typeof document !== 'undefined') {
    document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`
  }
}

export function setLanguageCookie(language: Language) {
  if (typeof document !== 'undefined') {
    document.cookie = `language=${language}; path=/; max-age=31536000; SameSite=Lax`
  }
}

export function getThemeFromDocument(): Theme {
  if (typeof document !== 'undefined') {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  }
  return 'light'
}

/**
 * Detect initial theme preference with fallback chain
 */
export function detectInitialTheme(): Theme {
  // 1. Check localStorage
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') {
      return saved
    }
  }
  
  // 2. Check system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
  }
  
  return 'light'
}

/**
 * Detect initial language preference with fallback chain
 */
export function detectInitialLanguage(): Language {
  // 1. Check localStorage
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('language')
    if (saved === 'en' || saved === 'zh') {
      return saved
    }
  }
  
  // 2. Check browser language
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.toLowerCase()
    if (browserLang.startsWith('zh')) {
      return 'zh'
    }
  }
  
  return 'en'
}