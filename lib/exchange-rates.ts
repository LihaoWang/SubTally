export interface ExchangeRates {
  base: string
  date: string
  rates: Record<string, number>
}

interface CachedRates extends ExchangeRates {
  timestamp: number
}

const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
const PRIMARY_API = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies'
const FALLBACK_API = 'https://api.exchangerate-api.com/v4/latest'

/**
 * Fetches exchange rates from the primary API
 */
async function fetchFromPrimaryAPI(baseCurrency: string): Promise<ExchangeRates> {
  const response = await fetch(`${PRIMARY_API}/${baseCurrency.toLowerCase()}.json`)
  if (!response.ok) {
    throw new Error(`Primary API failed: ${response.status}`)
  }
  
  const data = await response.json()
  const rates = data[baseCurrency.toLowerCase()]
  
  if (!rates) {
    throw new Error('Invalid response format from primary API')
  }
  
  // Convert to uppercase keys for consistency
  const normalizedRates: Record<string, number> = {}
  Object.keys(rates).forEach(key => {
    normalizedRates[key.toUpperCase()] = rates[key]
  })
  
  return {
    base: baseCurrency.toUpperCase(),
    date: new Date().toISOString().split('T')[0],
    rates: normalizedRates
  }
}

/**
 * Fetches exchange rates from the fallback API
 */
async function fetchFromFallbackAPI(baseCurrency: string): Promise<ExchangeRates> {
  const response = await fetch(`${FALLBACK_API}/${baseCurrency.toUpperCase()}`)
  if (!response.ok) {
    throw new Error(`Fallback API failed: ${response.status}`)
  }
  
  const data = await response.json()
  
  return {
    base: data.base,
    date: data.date,
    rates: data.rates
  }
}

/**
 * Fetches current exchange rates for a base currency
 */
export async function fetchExchangeRates(baseCurrency: string): Promise<ExchangeRates> {
  try {
    return await fetchFromPrimaryAPI(baseCurrency)
  } catch (error) {
    console.warn('Primary API failed, trying fallback:', error)
    
    try {
      return await fetchFromFallbackAPI(baseCurrency)
    } catch (fallbackError) {
      console.error('All APIs failed:', fallbackError)
      throw new Error('Unable to fetch exchange rates from any API')
    }
  }
}

/**
 * Gets cached exchange rates from localStorage
 */
export function getCachedRates(baseCurrency: string): CachedRates | null {
  try {
    const cached = localStorage.getItem(`exchange-rates-${baseCurrency.toUpperCase()}`)
    if (!cached) return null
    
    const rates = JSON.parse(cached) as CachedRates
    return isRatesCacheValid(rates) ? rates : null
  } catch (error) {
    console.error('Error reading cached rates:', error)
    return null
  }
}

/**
 * Caches exchange rates in localStorage
 */
export function setCachedRates(rates: ExchangeRates): void {
  try {
    const cachedRates: CachedRates = {
      ...rates,
      timestamp: Date.now()
    }
    localStorage.setItem(`exchange-rates-${rates.base}`, JSON.stringify(cachedRates))
  } catch (error) {
    console.error('Error caching rates:', error)
  }
}

/**
 * Checks if cached rates are still valid (within 24 hours)
 */
export function isRatesCacheValid(cachedRates: CachedRates): boolean {
  return Date.now() - cachedRates.timestamp < CACHE_DURATION
}

/**
 * Converts an amount from one currency to another
 */
export function convertAmount(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRates
): number {
  const from = fromCurrency.toUpperCase()
  const to = toCurrency.toUpperCase()
  
  // Same currency, no conversion needed
  if (from === to) return amount
  
  // Convert from base currency to target
  if (from === rates.base) {
    const rate = rates.rates[to]
    if (!rate) throw new Error(`Rate not found for ${to}`)
    return amount * rate
  }
  
  // Convert from non-base currency to base, then to target
  const fromRate = rates.rates[from]
  if (!fromRate) throw new Error(`Rate not found for ${from}`)
  
  const baseAmount = amount / fromRate
  
  // If target is base currency, return base amount
  if (to === rates.base) return baseAmount
  
  // Convert from base to target
  const toRate = rates.rates[to]
  if (!toRate) throw new Error(`Rate not found for ${to}`)
  
  return baseAmount * toRate
}

/**
 * Gets exchange rates with caching - tries cache first, then API
 */
export async function getExchangeRates(baseCurrency: string): Promise<ExchangeRates> {
  // Try cache first
  const cached = getCachedRates(baseCurrency)
  if (cached) {
    return cached
  }
  
  // Fetch fresh rates and cache them
  const rates = await fetchExchangeRates(baseCurrency)
  setCachedRates(rates)
  return rates
}

/**
 * Auto-detects the most frequently used currency from subscriptions
 */
export function detectBaseCurrency(subscriptions: Array<{ currency?: string }>): string {
  if (subscriptions.length === 0) return 'USD'
  
  const currencyCount: Record<string, number> = {}
  
  subscriptions.forEach(sub => {
    const currency = sub.currency || 'USD'
    currencyCount[currency] = (currencyCount[currency] || 0) + 1
  })
  
  // Return the most frequently used currency
  return Object.entries(currencyCount).reduce((a, b) => 
    currencyCount[a[0]] > currencyCount[b[0]] ? a : b
  )[0]
}

/**
 * Gets the user's base currency preference from localStorage
 */
export function getBaseCurrency(): string {
  try {
    return localStorage.getItem('baseCurrency') || 'USD'
  } catch {
    return 'USD'
  }
}

/**
 * Sets the user's base currency preference in localStorage
 */
export function setBaseCurrency(currency: string): void {
  try {
    localStorage.setItem('baseCurrency', currency.toUpperCase())
  } catch (error) {
    console.error('Error saving base currency:', error)
  }
}

/**
 * Gets unique currencies used in subscriptions
 */
export function getUsedCurrencies(subscriptions: Array<{ currency?: string }>): string[] {
  const currencies = new Set<string>()
  subscriptions.forEach(sub => {
    currencies.add(sub.currency || 'USD')
  })
  return Array.from(currencies)
}