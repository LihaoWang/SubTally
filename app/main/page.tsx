"use client"

import { useState, useEffect } from "react"
import { SubscriptionList } from "@/components/subscription-list"
import { SpendingOverview } from "@/components/spending-overview"
import { Navbar } from "@/components/navbar"
import { SubscriptionModal } from "@/components/subscription-modal"
import { OnboardingModal } from "@/components/onboarding-modal"
import { useLanguage } from "@/contexts/language-context"
import { detectBaseCurrency, getBaseCurrency, setBaseCurrency } from "@/lib/exchange-rates"

export interface Subscription {
  id: string
  name: string
  amount: number
  period: "weekly" | "monthly" | "yearly"
  currency: string
  description: string
  icon?: string
  createdAt: Date
  nextBillingDate: Date
}

const STORAGE_KEY = "opensubtracker-data"
const USER_INTERACTION_KEY = "opensubtracker-has-interacted"

const createExampleSubscriptions = (): Subscription[] => {
  const today = new Date()
  return [
    {
      id: "example-netflix",
      name: "Netflix",
      amount: 15.99,
      period: "monthly",
      currency: "USD",
      description: "Premium streaming plan",
      icon: "tv",
      createdAt: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      nextBillingDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    },
    {
      id: "example-spotify",
      name: "Spotify",
      amount: 9.99,
      period: "monthly",
      currency: "USD", 
      description: "Music streaming premium",
      icon: "music",
      createdAt: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      nextBillingDate: new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
    },
    {
      id: "example-github",
      name: "GitHub Pro",
      amount: 4.00,
      period: "monthly",
      currency: "USD",
      description: "Developer tools and collaboration",
      icon: "code",
      createdAt: new Date(today.getTime() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
      nextBillingDate: new Date(today.getTime() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
    },
    {
      id: "example-adobe",
      name: "Adobe Creative Cloud",
      amount: 52.99,
      period: "monthly", 
      currency: "USD",
      description: "Design and creative software suite",
      icon: "palette",
      createdAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      nextBillingDate: new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    },
    {
      id: "example-notion",
      name: "Notion",
      amount: 8.00,
      period: "monthly",
      currency: "EUR",
      description: "All-in-one workspace for notes and collaboration",
      icon: "file-text",
      createdAt: new Date(today.getTime() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      nextBillingDate: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
    },
  ]
}

const hasUserInteracted = (): boolean => {
  try {
    return localStorage.getItem(USER_INTERACTION_KEY) === "true"
  } catch {
    return false
  }
}

const setUserInteracted = () => {
  try {
    localStorage.setItem(USER_INTERACTION_KEY, "true")
  } catch (error) {
    console.error("Failed to set user interaction flag:", error)
  }
}

const saveToLocalStorage = (subscriptions: Subscription[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions))
  } catch (error) {
    console.error("Failed to save to localStorage:", error)
  }
}

const loadFromLocalStorage = (): Subscription[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Convert createdAt strings back to Date objects and add default currency if missing
      return parsed.map((sub: any) => ({
        ...sub,
        currency: sub.currency || "USD", // Default to USD for existing subscriptions
        createdAt: new Date(sub.createdAt),
        nextBillingDate: new Date(sub.nextBillingDate),
      }))
    }
  } catch (error) {
    console.error("Failed to load from localStorage:", error)
  }
  return []
}

export default function AppPage() {
  const { t } = useLanguage()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [viewPeriod, setViewPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly")
  const [isLoaded, setIsLoaded] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  const [baseCurrency, setBaseCurrencyState] = useState<string>("USD")
  const [showExamples, setShowExamples] = useState<boolean>(false)
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false)

  useEffect(() => {
    const storedSubscriptions = loadFromLocalStorage()
    const userInteracted = hasUserInteracted()
    
    // Show examples if user has no subscriptions and hasn't interacted yet
    const shouldShowExamples = storedSubscriptions.length === 0 && !userInteracted
    setShowExamples(shouldShowExamples)
    
    if (shouldShowExamples) {
      // For display purposes, combine real subscriptions with examples
      const exampleSubs = createExampleSubscriptions()
      setSubscriptions(exampleSubs)
    } else {
      setSubscriptions(storedSubscriptions)
    }
    
    // Initialize base currency
    const savedBaseCurrency = getBaseCurrency()
    if (savedBaseCurrency === 'USD' && storedSubscriptions.length > 0) {
      // If still using default USD and we have subscriptions, auto-detect
      const detectedCurrency = detectBaseCurrency(storedSubscriptions)
      setBaseCurrency(detectedCurrency)
      setBaseCurrencyState(detectedCurrency)
    } else {
      setBaseCurrencyState(savedBaseCurrency)
    }
    
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded && !showExamples) {
      // Only save to localStorage if we're not showing examples
      saveToLocalStorage(subscriptions)
    }
  }, [subscriptions, isLoaded, showExamples])

  const handleFirstInteraction = () => {
    if (showExamples) {
      setUserInteracted()
      setShowExamples(false)
      setSubscriptions([]) // Clear examples
    }
  }

  const addSubscription = (subscription: Omit<Subscription, "id" | "createdAt">) => {
    handleFirstInteraction()
    
    const newSubscription: Subscription = {
      ...subscription,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setSubscriptions((prev) => [...prev, newSubscription])
  }

  const deleteSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id))
  }

  const editSubscription = (subscription: Subscription) => {
    if (showExamples && subscription.id.startsWith("example-")) {
      // User clicked on an example, show onboarding
      setShowOnboarding(true)
      return
    }
    
    setEditingSubscription(subscription)
    setIsModalOpen(true)
  }

  const handleAddClick = () => {
    if (showExamples) {
      setShowOnboarding(true)
      return
    }
    setIsModalOpen(true)
  }

  const handleStartUsingApp = () => {
    handleFirstInteraction()
    setShowOnboarding(false)
    setIsModalOpen(true)
  }

  const updateSubscription = (updatedData: Omit<Subscription, "id" | "createdAt">) => {
    if (editingSubscription) {
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === editingSubscription.id
            ? { ...sub, ...updatedData }
            : sub
        )
      )
    } else {
      addSubscription(updatedData)
    }
    setEditingSubscription(null)
    setIsModalOpen(false)
  }

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      setEditingSubscription(null)
    }
  }

  const updateBaseCurrency = (currency: string) => {
    setBaseCurrency(currency)
    setBaseCurrencyState(currency)
  }

  const handleImportData = (importedData: any[]) => {
    handleFirstInteraction()
    
    // Convert string dates back to Date objects for internal use and add default currency if missing
    const convertedData: Subscription[] = importedData.map((sub) => ({
      ...sub,
      currency: sub.currency || "USD", // Default to USD for imported subscriptions
      createdAt: new Date(sub.createdAt || new Date()),
      nextBillingDate: new Date(sub.nextBillingDate),
    }))
    setSubscriptions(convertedData)
  }

  const handleDeleteAllData = () => {
    // Clear all subscriptions
    setSubscriptions([])
    // Clear localStorage
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(USER_INTERACTION_KEY)
      localStorage.removeItem('language')
      localStorage.removeItem('baseCurrency')
    } catch (error) {
      console.error("Failed to clear localStorage:", error)
    }
    // Reset states
    setShowExamples(true)
    setBaseCurrencyState("USD")
    setBaseCurrency("USD")
    
    // Show examples again for the fresh start
    const exampleSubs = createExampleSubscriptions()
    setSubscriptions(exampleSubs)
  }

  const subscriptionsForNavbar = subscriptions.map((sub) => ({
    ...sub,
    nextBillingDate: sub.nextBillingDate.toISOString().split("T")[0],
  }))

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("app.loadingSubscriptions")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onAddClick={handleAddClick}
        subscriptions={subscriptionsForNavbar}
        onImportData={handleImportData}
        baseCurrency={baseCurrency}
        onBaseCurrencyChange={updateBaseCurrency}
        onDeleteAllData={handleDeleteAllData}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Spending Overview */}
          <SpendingOverview 
            subscriptions={subscriptions} 
            viewPeriod={viewPeriod} 
            onViewPeriodChange={setViewPeriod}
            baseCurrency={baseCurrency}
            onBaseCurrencyChange={updateBaseCurrency}
          />

          {/* Subscription List */}
          <SubscriptionList subscriptions={subscriptions} onDelete={deleteSubscription} onEdit={editSubscription} viewPeriod={viewPeriod} showExamples={showExamples} />
        </div>
      </div>

      <SubscriptionModal 
        open={isModalOpen} 
        onOpenChange={handleModalClose} 
        onSubmit={updateSubscription} 
        editingSubscription={editingSubscription}
        baseCurrency={baseCurrency}
      />

      <OnboardingModal
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
        onStartUsingApp={handleStartUsingApp}
      />
    </div>
  )
}
