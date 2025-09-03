import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { ThemeScript } from "@/components/theme-script"
import { getThemeFromCookies, getLanguageFromCookies } from "@/lib/cookies"
import { StructuredData } from "./structured-data"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "SubTally - Manage Your Digital Subscriptions",
    template: "%s | SubTally"
  },
  description: "Track and manage all your digital subscriptions in one place. Monitor spending, get billing reminders, and take control of your recurring payments.",
  keywords: ["subtally", "subscription tracker", "subscription management", "billing tracker", "recurring payments", "digital subscriptions", "expense tracking", "budget management"],
  authors: [{ name: "SubTally" }],
  creator: "SubTally",
  publisher: "SubTally",
  
  // Open Graph (Facebook, LinkedIn)
  openGraph: {
    title: "SubTally - Manage Your Digital Subscriptions",
    description: "Track and manage all your digital subscriptions in one place. Monitor spending, get billing reminders, and take control of your recurring payments.",
    url: "https://subtally.com",
    siteName: "SubTally",
    images: [
      {
        url: "https://subtally.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "SubTally Dashboard - Subscription Management Interface"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  
  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "SubTally - Manage Your Digital Subscriptions",
    description: "Track and manage all your digital subscriptions in one place. Monitor spending, get billing reminders, and take control of your recurring payments.",
    images: ["https://subtally.com/twitter-image.png"],
  },
  
  // App-specific
  applicationName: "SubTally",
  category: "productivity",
  classification: "Business",
  
  // Technical SEO
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Manifest for PWA
  manifest: "/manifest.webmanifest",
  
  // Alternate languages for i18n
  alternates: {
    languages: {
      'en': '/en',
      'zh': '/zh',
    },
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get initial preferences from cookies for SSR
  const initialTheme = await getThemeFromCookies()
  const initialLanguage = await getLanguageFromCookies()
  
  return (
    <html 
      lang={initialLanguage} 
      className={`${inter.variable} antialiased ${initialTheme === 'dark' ? 'dark' : ''}`}
    >
      <head>
        <ThemeScript />
        <StructuredData />
      </head>
      <body className="font-sans">
        <ThemeProvider initialTheme={initialTheme}>
          <LanguageProvider initialLanguage={initialLanguage}>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
