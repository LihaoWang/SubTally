"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Subscription } from "@/app/main/page"
import { useLanguage } from "@/contexts/language-context"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDownIcon } from "lucide-react"
import { POPULAR_CURRENCIES, formatCurrencyOption } from "@/lib/currencies"



interface SubscriptionFormProps {
  onSubmit: (subscription: Omit<Subscription, "id" | "createdAt">) => void
  initialData?: Subscription | null
  baseCurrency: string
}

export function SubscriptionForm({ onSubmit, initialData, baseCurrency }: SubscriptionFormProps) {
  const { t } = useLanguage()
  const [calendarOpen, setCalendarOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    amount: initialData?.amount?.toString() || "",
    period: initialData?.period || ("" as "weekly" | "monthly" | "yearly" | ""),
    currency: initialData?.currency || baseCurrency,
    description: initialData?.description || "",
    nextBillingDate: initialData?.nextBillingDate 
      ? initialData.nextBillingDate.toISOString().split("T")[0] 
      : "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        amount: initialData.amount.toString(),
        period: initialData.period,
        currency: initialData.currency,
        description: initialData.description,
        nextBillingDate: initialData.nextBillingDate.toISOString().split("T")[0],
      })
    } else {
      setFormData({
        name: "",
        amount: "",
        period: "",
        currency: baseCurrency,
        description: "",
        nextBillingDate: "",
      })
    }
  }, [initialData])

  const dateInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.amount || !formData.period || !formData.currency || !formData.nextBillingDate) {
      return
    }

    onSubmit({
      name: formData.name,
      amount: Number.parseFloat(formData.amount),
      period: formData.period as "weekly" | "monthly" | "yearly",
      currency: formData.currency,
      description: formData.description,
      nextBillingDate: new Date(formData.nextBillingDate),
    })

    // Reset form
    setFormData({
      name: "",
      amount: "",
      period: "",
      currency: baseCurrency,
      description: "",
      nextBillingDate: "",
    })
  }

  const handleCalendarIconClick = () => {
    if (dateInputRef.current) {
      // Just use click() method - more reliable across environments
      dateInputRef.current.click()
    }
  }

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("form.serviceName")}</Label>
        <Input
          id="name"
          placeholder={t("form.serviceNamePlaceholder")}
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">{t("form.amount")}</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder={t("form.amountPlaceholder")}
          value={formData.amount}
          onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="currency">{t("form.currency")}</Label>
        <Select
          value={formData.currency}
          onValueChange={(value: string) =>
            setFormData((prev) => ({ ...prev, currency: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={t("form.currencyPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {POPULAR_CURRENCIES.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {formatCurrencyOption(currency)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="period">{t("form.billingPeriod")}</Label>
        <Select
          value={formData.period}
          onValueChange={(value: "weekly" | "monthly" | "yearly") =>
            setFormData((prev) => ({ ...prev, period: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={t("form.billingPeriodPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">{t("form.weekly")}</SelectItem>
            <SelectItem value="monthly">{t("form.monthly")}</SelectItem>
            <SelectItem value="yearly">{t("form.yearly")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="nextBillingDate">{t("form.nextBillingDate")}</Label>
        <div className="relative flex gap-2">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-48 justify-between font-normal"
              >
                {formData.nextBillingDate
                  ? new Date(formData.nextBillingDate).toLocaleDateString()
                  : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={formData.nextBillingDate ? new Date(formData.nextBillingDate) : undefined}
                captionLayout="dropdown"
                onSelect={(date) => {
                  console.log("Selected date:", date)
                  if (date) {
                    const formattedDate = date.toISOString().split("T")[0]
                    console.log("Formatted date:", formattedDate)
                    setFormData((prev) => ({ ...prev, nextBillingDate: formattedDate }))
                    setCalendarOpen(false)
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">{t("form.description")}</Label>
        <Textarea
          id="description"
          placeholder={t("form.descriptionPlaceholder")}
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full">
        {initialData ? t("form.saveSubscription") : t("form.addSubscription")}
      </Button>
    </form>
  )
}
