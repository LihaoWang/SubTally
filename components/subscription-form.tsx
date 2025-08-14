"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Subscription } from "@/app/page"

interface SubscriptionFormProps {
  onSubmit: (subscription: Omit<Subscription, "id" | "createdAt">) => void
}

export function SubscriptionForm({ onSubmit }: SubscriptionFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    period: "" as "weekly" | "monthly" | "yearly" | "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.amount || !formData.period) {
      return
    }

    onSubmit({
      name: formData.name,
      amount: Number.parseFloat(formData.amount),
      period: formData.period as "weekly" | "monthly" | "yearly",
      description: formData.description,
    })

    // Reset form
    setFormData({
      name: "",
      amount: "",
      period: "",
      description: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Service Name</Label>
        <Input
          id="name"
          placeholder="Netflix, Spotify, etc."
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount ($)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="9.99"
          value={formData.amount}
          onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="period">Billing Period</Label>
        <Select
          value={formData.period}
          onValueChange={(value: "weekly" | "monthly" | "yearly") =>
            setFormData((prev) => ({ ...prev, period: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select billing period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Premium plan, family subscription, etc."
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full">
        Add Subscription
      </Button>
    </form>
  )
}
