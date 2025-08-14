"use client"

import { useState, useEffect } from "react"
import { SubscriptionForm } from "@/components/subscription-form"
import { SubscriptionList } from "@/components/subscription-list"
import { SpendingOverview } from "@/components/spending-overview"
import { Card } from "@/components/ui/card"

export interface Subscription {
  id: string
  name: string
  amount: number
  period: "weekly" | "monthly" | "yearly"
  description: string
  icon?: string
  createdAt: Date
}

const STORAGE_KEY = "subscription-tracker-data"

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
      // Convert createdAt strings back to Date objects
      return parsed.map((sub: any) => ({
        ...sub,
        createdAt: new Date(sub.createdAt),
      }))
    }
  } catch (error) {
    console.error("Failed to load from localStorage:", error)
  }
  return []
}

export default function Home() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [viewPeriod, setViewPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const storedSubscriptions = loadFromLocalStorage()
    setSubscriptions(storedSubscriptions)
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      saveToLocalStorage(subscriptions)
    }
  }, [subscriptions, isLoaded])

  const addSubscription = (subscription: Omit<Subscription, "id" | "createdAt">) => {
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

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your subscriptions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Subscription Tracker</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Keep track of all your digital subscriptions and monitor your spending across different time periods.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Add Subscription Form */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Add Subscription</h2>
              <SubscriptionForm onSubmit={addSubscription} />
            </Card>
          </div>

          {/* Subscriptions Overview */}
          <div className="lg:col-span-2 space-y-6">
            <SpendingOverview
              subscriptions={subscriptions}
              viewPeriod={viewPeriod}
              onViewPeriodChange={setViewPeriod}
            />

            <SubscriptionList subscriptions={subscriptions} onDelete={deleteSubscription} viewPeriod={viewPeriod} />
          </div>
        </div>
      </div>
    </div>
  )
}
