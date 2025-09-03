"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SubscriptionForm } from "@/components/subscription-form"
import type { Subscription } from "@/app/main/page"
import { useLanguage } from "@/contexts/language-context"

interface SubscriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (subscription: Omit<Subscription, "id" | "createdAt">) => void
  editingSubscription?: Subscription | null
  baseCurrency: string
}

export function SubscriptionModal({ open, onOpenChange, onSubmit, editingSubscription, baseCurrency }: SubscriptionModalProps) {
  const { t } = useLanguage()

  const handleSubmit = (subscription: Omit<Subscription, "id" | "createdAt">) => {
    onSubmit(subscription)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingSubscription ? t("modal.editTitle") : t("modal.title")}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <SubscriptionForm onSubmit={handleSubmit} initialData={editingSubscription} baseCurrency={baseCurrency} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
