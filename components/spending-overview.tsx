"use client"

import { Card } from "@/components/ui/card"
import type { Subscription } from "@/app/main/page"
import { useLanguage } from "@/contexts/language-context"
import { formatCurrency } from "@/lib/currency"
import { getExchangeRates, convertAmount as convertCurrency, getUsedCurrencies } from "@/lib/exchange-rates"
import { useState, useEffect } from "react"
import type { ExchangeRates } from "@/lib/exchange-rates"

interface SpendingOverviewProps {
  subscriptions: Subscription[]
  viewPeriod: "weekly" | "monthly" | "yearly"
  onViewPeriodChange: (period: "weekly" | "monthly" | "yearly") => void
  baseCurrency: string
  onBaseCurrencyChange: (currency: string) => void
}

export function SpendingOverview({ subscriptions, viewPeriod, onViewPeriodChange, baseCurrency, onBaseCurrencyChange }: SpendingOverviewProps) {
  const { t } = useLanguage()
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null)
  const [isLoadingRates, setIsLoadingRates] = useState(false)
  const [ratesError, setRatesError] = useState<string | null>(null)
  const [conversionApplied, setConversionApplied] = useState(false)

  // Convert subscription period amounts (weekly/monthly/yearly)
  const convertPeriodAmount = (amount: number, fromPeriod: string, toPeriod: string) => {
    const rates = {
      weekly: 52,
      monthly: 12,
      yearly: 1,
    }

    const yearlyAmount = amount * (rates[fromPeriod as keyof typeof rates] || 1)
    return yearlyAmount / (rates[toPeriod as keyof typeof rates] || 1)
  }

  // Fetch exchange rates when base currency changes
  useEffect(() => {
    const usedCurrencies = getUsedCurrencies(subscriptions)
    const needsConversion = usedCurrencies.length > 1 || (usedCurrencies.length === 1 && usedCurrencies[0] !== baseCurrency)
    
    if (!needsConversion) {
      setExchangeRates(null)
      setConversionApplied(false)
      setRatesError(null)
      return
    }

    setIsLoadingRates(true)
    setRatesError(null)

    getExchangeRates(baseCurrency)
      .then(rates => {
        setExchangeRates(rates)
        setConversionApplied(true)
        setIsLoadingRates(false)
      })
      .catch(error => {
        console.error('Failed to fetch exchange rates:', error)
        setRatesError(error.message)
        setIsLoadingRates(false)
        // Fallback to original multi-currency display
        setExchangeRates(null)
        setConversionApplied(false)
      })
  }, [baseCurrency, subscriptions])

  // Calculate total spending in base currency
  const calculateTotalSpending = () => {
    if (!conversionApplied || !exchangeRates) {
      // Fallback to original multi-currency logic
      return subscriptions.reduce((acc, subscription) => {
        const currency = subscription.currency
        const convertedAmount = convertPeriodAmount(subscription.amount, subscription.period, viewPeriod)
        
        if (!acc[currency]) {
          acc[currency] = 0
        }
        acc[currency] += convertedAmount
        
        return acc
      }, {} as Record<string, number>)
    }

    // Convert all subscriptions to base currency
    let totalInBaseCurrency = 0
    let conversionErrors = 0

    subscriptions.forEach(subscription => {
      try {
        // First convert period, then currency
        const periodConvertedAmount = convertPeriodAmount(subscription.amount, subscription.period, viewPeriod)
        const currencyConvertedAmount = convertCurrency(
          periodConvertedAmount,
          subscription.currency,
          baseCurrency,
          exchangeRates
        )
        totalInBaseCurrency += currencyConvertedAmount
      } catch (error) {
        console.warn(`Failed to convert ${subscription.currency} to ${baseCurrency}:`, error)
        conversionErrors++
        // Add to total without conversion as fallback
        const periodConvertedAmount = convertPeriodAmount(subscription.amount, subscription.period, viewPeriod)
        totalInBaseCurrency += periodConvertedAmount
      }
    })

    return { [baseCurrency]: totalInBaseCurrency, conversionErrors }
  }

  const spendingData = calculateTotalSpending()
  const usedCurrencies = getUsedCurrencies(subscriptions)

  const periodLabels = {
    weekly: t("overview.week"),
    monthly: t("overview.month"),
    yearly: t("overview.year"),
  }

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-xl font-semibold">{t("overview.title")}</h2>

        <div className="flex bg-muted p-1 rounded-lg w-full">
          {(["weekly", "monthly", "yearly"] as const).map((period) => (
            <div
              key={period}
              onClick={() => onViewPeriodChange(period)}
              className={`
                flex-1 capitalize text-sm font-medium cursor-pointer py-2 px-3 rounded-md text-center
                ${viewPeriod === period ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}
              `}
            >
              {t(`form.${period}`)}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        {isLoadingRates ? (
          <div className="flex flex-col items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mb-4"></div>
            <p className="text-muted-foreground">{t("overview.loadingRates")}</p>
          </div>
        ) : conversionApplied && typeof spendingData === 'object' && !Array.isArray(spendingData) && 'conversionErrors' in spendingData ? (
          // Unified currency display with conversion
          <div>
            <div className="text-3xl sm:text-4xl font-bold mb-2">
              {formatCurrency(spendingData[baseCurrency], baseCurrency)}
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              {t("overview.totalSpending")} {periodLabels[viewPeriod]}
            </p>
            
            {/* Conversion indicator */}
            {usedCurrencies.length > 1 && (
              <div className="mt-2 text-xs text-muted-foreground">
                {t("overview.convertedFrom", { count: usedCurrencies.length.toString() })}
              </div>
            )}

            {/* Period breakdown */}
            <div className="mt-6 pt-4 border-t">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div>
                  <div className="text-base sm:text-lg font-semibold">
                    {formatCurrency(convertPeriodAmount(spendingData[baseCurrency], viewPeriod, "weekly"), baseCurrency)}
                  </div>
                  <div className="text-xs text-muted-foreground">{t("form.weekly")}</div>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-semibold">
                    {formatCurrency(convertPeriodAmount(spendingData[baseCurrency], viewPeriod, "monthly"), baseCurrency)}
                  </div>
                  <div className="text-xs text-muted-foreground">{t("form.monthly")}</div>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-semibold">
                    {formatCurrency(convertPeriodAmount(spendingData[baseCurrency], viewPeriod, "yearly"), baseCurrency)}
                  </div>
                  <div className="text-xs text-muted-foreground">{t("form.yearly")}</div>
                </div>
              </div>
            </div>
          </div>
        ) : Object.keys(spendingData).length === 1 && !conversionApplied ? (
          // Single currency - no conversion needed
          <div>
            <div className="text-3xl sm:text-4xl font-bold mb-2">
              {formatCurrency(Object.values(spendingData)[0], Object.keys(spendingData)[0])}
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              {t("overview.totalSpending")} {periodLabels[viewPeriod]}
            </p>

            <div className="mt-6 pt-4 border-t">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div>
                  <div className="text-base sm:text-lg font-semibold">
                    {formatCurrency(convertPeriodAmount(Object.values(spendingData)[0], viewPeriod, "weekly"), Object.keys(spendingData)[0])}
                  </div>
                  <div className="text-xs text-muted-foreground">{t("form.weekly")}</div>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-semibold">
                    {formatCurrency(convertPeriodAmount(Object.values(spendingData)[0], viewPeriod, "monthly"), Object.keys(spendingData)[0])}
                  </div>
                  <div className="text-xs text-muted-foreground">{t("form.monthly")}</div>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-semibold">
                    {formatCurrency(convertPeriodAmount(Object.values(spendingData)[0], viewPeriod, "yearly"), Object.keys(spendingData)[0])}
                  </div>
                  <div className="text-xs text-muted-foreground">{t("form.yearly")}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Fallback: Multiple currencies without conversion (API failed)
          <div>
            <div className="text-lg font-semibold mb-4">
              {t("overview.totalSpending")} {periodLabels[viewPeriod]}
            </div>
            <div className="space-y-2">
              {Object.entries(spendingData).map(([currency, amount]) => (
                <div key={currency} className="text-xl sm:text-2xl font-bold">
                  {formatCurrency(amount, currency)}
                </div>
              ))}
            </div>
            {ratesError && (
              <div className="mt-2 text-xs text-muted-foreground">
                {t("overview.conversionFailed")}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
