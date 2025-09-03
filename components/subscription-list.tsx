"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2, Clock, Edit } from "lucide-react"
import type { Subscription } from "@/app/main/page"
import { getServiceIcon } from "@/lib/service-icons"
import { useLanguage } from "@/contexts/language-context"
import { formatCurrency } from "@/lib/currency"
import { useState } from "react"

interface SubscriptionListProps {
  subscriptions: Subscription[]
  onDelete: (id: string) => void
  onEdit: (subscription: Subscription) => void
  viewPeriod: "weekly" | "monthly" | "yearly"
  showExamples?: boolean
}

export function SubscriptionList({ subscriptions, onDelete, onEdit, viewPeriod, showExamples = false }: SubscriptionListProps) {
  const { t } = useLanguage()
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; name: string } | null>(null)

  const convertAmount = (amount: number, fromPeriod: string, toPeriod: string) => {
    const rates = {
      weekly: 52,
      monthly: 12,
      yearly: 1,
    }

    const yearlyAmount = amount * (rates[fromPeriod as keyof typeof rates] || 1)
    return yearlyAmount / (rates[toPeriod as keyof typeof rates] || 1)
  }

  const isDueSoon = (billingDate: Date) => {
    const today = new Date()
    const diffTime = billingDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays >= 0
  }

  const formatBillingDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    })
  }

  const handleDeleteClick = (subscription: Subscription) => {
    setDeleteConfirmation({ id: subscription.id, name: subscription.name })
  }

  const handleConfirmDelete = () => {
    if (deleteConfirmation) {
      onDelete(deleteConfirmation.id)
      setDeleteConfirmation(null)
    }
  }

  if (subscriptions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <p className="text-lg mb-2">{t("subscriptions.noSubscriptions")}</p>
          <p className="text-sm">{t("subscriptions.noSubscriptionsDesc")}</p>
        </div>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t("subscriptions.title")}</h3>
        <div className="grid gap-4">
          {subscriptions.map((subscription) => {
            const ServiceIcon = getServiceIcon(subscription.name)
            const displayAmount = convertAmount(subscription.amount, subscription.period, viewPeriod)
            const dueSoon = isDueSoon(subscription.nextBillingDate)
            const isExample = showExamples && subscription.id.startsWith("example-")

            return (
              <Card 
                key={subscription.id} 
                className={`p-4 transition-all ${isExample ? 'opacity-75 border-dashed border-2 border-muted bg-muted/20' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <ServiceIcon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start flex-col gap-1 mb-1 sm:flex-row sm:items-center sm:gap-2">
                        <h4 className="font-medium truncate">{subscription.name}</h4>
                        <div className="flex items-center gap-1 flex-wrap">
                          {isExample && (
                            <Badge variant="outline" className="text-xs border-muted-foreground/30 text-muted-foreground">
                              Demo
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {t(`form.${subscription.period}`)}
                          </Badge>
                          {dueSoon && (
                            <Badge variant="destructive" className="text-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {t("subscriptions.dueSoon")}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-xl sm:text-2xl font-bold mb-1 break-words">
                        {formatCurrency(displayAmount, subscription.currency)}
                        <span className="text-sm font-normal text-muted-foreground ml-1">
                          /{viewPeriod.slice(0, -2)}
                        </span>
                      </p>

                      <p className="text-sm text-muted-foreground mb-1">
                        {t("subscriptions.nextBilling")} {formatBillingDate(subscription.nextBillingDate)}
                      </p>

                      {subscription.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{subscription.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(subscription)}
                      disabled={isExample}
                      className={`p-2 ${isExample ? 'opacity-50 cursor-not-allowed' : 'text-muted-foreground hover:text-blue-600'}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(subscription)}
                      disabled={isExample}
                      className={`p-2 ${isExample ? 'opacity-50 cursor-not-allowed' : 'text-muted-foreground hover:text-destructive'}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      <AlertDialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("subscriptions.deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("subscriptions.deleteConfirmDesc", { name: deleteConfirmation?.name || "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
