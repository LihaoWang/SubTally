export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CNY: "¥",
    CAD: "C$",
    AUD: "A$",
    CHF: "Fr",
    SEK: "kr",
    NOK: "kr",
  }
  return symbols[currency] || currency
}

export const formatCurrency = (amount: number, currency: string): string => {
  const symbol = getCurrencySymbol(currency)
  
  // For currencies that typically don't use decimals
  if (currency === "JPY") {
    return `${symbol}${Math.round(amount)}`
  }
  
  return `${symbol}${amount.toFixed(2)}`
}