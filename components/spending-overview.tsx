"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Subscription } from "@/app/page"

interface SpendingOverviewProps {
  subscriptions: Subscription[]
  viewPeriod: "weekly" | "monthly" | "yearly"
  onViewPeriodChange: (period: "weekly" | "monthly" | "yearly") => void
}

export function SpendingOverview({ subscriptions, viewPeriod, onViewPeriodChange }: SpendingOverviewProps) {
  const convertAmount = (amount: number, fromPeriod: string, toPeriod: string) => {
    const rates = {
      weekly: 52,
      monthly: 12,
      yearly: 1,
    }

    const yearlyAmount = amount * (rates[fromPeriod as keyof typeof rates] || 1)
    return yearlyAmount / (rates[toPeriod as keyof typeof rates] || 1)
  }

  const totalSpending = subscriptions.reduce((total, subscription) => {
    return total + convertAmount(subscription.amount, subscription.period, viewPeriod)
  }, 0)

  const periodLabels = {
    weekly: "Week",
    monthly: "Month",
    yearly: "Year",
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold">Spending Overview</h2>

        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          {(["weekly", "monthly", "yearly"] as const).map((period) => (
            <Button
              key={period}
              variant={viewPeriod === period ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewPeriodChange(period)}
              className="capitalize"
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      <div className="text-center">
        <div className="text-4xl font-bold mb-2">${totalSpending.toFixed(2)}</div>
        <p className="text-muted-foreground">Total spending per {periodLabels[viewPeriod].toLowerCase()}</p>

        {subscriptions.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold">
                  ${convertAmount(totalSpending, viewPeriod, "weekly").toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">Weekly</div>
              </div>
              <div>
                <div className="text-lg font-semibold">
                  ${convertAmount(totalSpending, viewPeriod, "monthly").toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">Monthly</div>
              </div>
              <div>
                <div className="text-lg font-semibold">
                  ${convertAmount(totalSpending, viewPeriod, "yearly").toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">Yearly</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
