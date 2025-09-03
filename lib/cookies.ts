import type { Language } from '@/lib/i18n'

export type Theme = 'light' | 'dark'

/**
 * Server-side cookie utilities - these are imported in server components only
 */
export async function getThemeFromCookies(): Promise<Theme> {
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const theme = cookieStore.get('theme')?.value
    return theme === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export async function getLanguageFromCookies(): Promise<Language> {
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const language = cookieStore.get('language')?.value
    return language === 'zh' ? 'zh' : 'en'
  } catch {
    return 'en'
  }
}

// Client-side utilities moved to lib/client-cookies.ts