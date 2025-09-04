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
    default: "SubTally - Privacy-First Subscription Tracker & Manager",
    template: "%s | SubTally - Subscription Management"
  },
  description: "Take control of your digital subscriptions with SubTally - a privacy-first, offline subscription tracker. Monitor spending, get billing alerts, and manage recurring payments without sharing your data.",
  keywords: [
    "subscription tracker", "subscription management", "privacy-first subscription tracker", 
    "billing tracker", "recurring payments", "digital subscriptions", "expense tracking", 
    "budget management", "offline subscription manager", "privacy subscription app",
    "subscription reminder", "spending analysis", "subscription analytics", 
    "personal finance", "subscription organizer", "billing alerts"
  ],
  authors: [{ name: "SubTally", url: "https://subtally.com" }],
  creator: "SubTally",
  publisher: "SubTally",
  
  // Open Graph (Facebook, LinkedIn)
  openGraph: {
    title: "SubTally - Privacy-First Subscription Tracker & Manager",
    description: "Take control of your digital subscriptions with SubTally - a privacy-first, offline subscription tracker. Monitor spending, get billing alerts, and manage recurring payments without sharing your data.",
    url: "https://subtally.com",
    siteName: "SubTally",
    images: [
      {
        url: "https://files.leo63.xyz/banner1.png",
        width: 1200,
        height: 630,
        alt: "SubTally Dashboard - Privacy-first subscription tracker showing subscription overview, spending analysis, and billing management interface"
      }
    ],
    locale: "en_US",
    type: "website",
    countryName: "Global",
  },
  
  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "SubTally - Privacy-First Subscription Tracker & Manager",
    description: "Take control of your digital subscriptions with SubTally - a privacy-first, offline subscription tracker. Monitor spending, get billing alerts, and manage recurring payments without sharing your data.",
    images: ["https://files.leo63.xyz/banner1.png"],
    creator: "@SubTally",
    site: "@SubTally",
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
    canonical: "https://subtally.com",
    languages: {
      'en': 'https://subtally.com/en',
      'zh': 'https://subtally.com/zh',
    },
  },
  
  // Additional SEO
  metadataBase: new URL('https://subtally.com'),
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
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
