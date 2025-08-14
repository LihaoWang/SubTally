"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import type { Subscription } from "@/app/page"
import { getServiceIcon } from "@/lib/service-icons"

interface SubscriptionListProps {
  subscriptions: Subscription[]
  onDelete: (id: string) => void
  viewPeriod: "weekly" | "monthly" | "yearly"
}

export function SubscriptionList({ subscriptions, onDelete, viewPeriod }: SubscriptionListProps) {
  const convertAmount = (amount: number, fromPeriod: string, toPeriod: string) => {
    const rates = {
      weekly: 52,
      monthly: 12,
      yearly: 1,
    }

    const yearlyAmount = amount * (rates[fromPeriod as keyof typeof rates] || 1)
    return yearlyAmount / (rates[toPeriod as keyof typeof rates] || 1)
  }

  if (subscriptions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <p className="text-lg mb-2">No subscriptions yet</p>
          <p className="text-sm">Add your first subscription to get started tracking your spending.</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Subscriptions</h3>
      <div className="grid gap-4">
        {subscriptions.map((subscription) => {
          const ServiceIcon = getServiceIcon(subscription.name)
          const displayAmount = convertAmount(subscription.amount, subscription.period, viewPeriod)

          return (
            <Card key={subscription.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <ServiceIcon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{subscription.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {subscription.period}
                      </Badge>
                    </div>

                    <p className="text-2xl font-bold mb-1">
                      ${displayAmount.toFixed(2)}
                      <span className="text-sm font-normal text-muted-foreground ml-1">/{viewPeriod.slice(0, -2)}</span>
                    </p>

                    {subscription.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{subscription.description}</p>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(subscription.id)}
                  className="text-muted-foreground hover:text-destructive flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
