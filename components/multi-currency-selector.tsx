"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Globe } from "lucide-react"

interface Currency {
  code: string
  name: string
  symbol: string
  rate: number
  locale: string
}

interface CurrencyContextType {
  selectedCurrency: Currency
  currencies: Currency[]
  convertPrice: (price: number) => number
  formatPrice: (price: number) => string
  changeCurrency: (currencyCode: string) => void
}

// Mock exchange rates (in real app, these would come from an API)
const mockCurrencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", rate: 1.0, locale: "en-US" },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.85, locale: "de-DE" },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.73, locale: "en-GB" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 1.25, locale: "en-CA" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.35, locale: "en-AU" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 110.0, locale: "ja-JP" },
  { code: "ARS", name: "Argentine Peso", symbol: "$", rate: 350.0, locale: "es-AR" },
  { code: "MXN", name: "Mexican Peso", symbol: "$", rate: 18.0, locale: "es-MX" },
]

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(mockCurrencies[0])

  useEffect(() => {
    // Load saved currency from localStorage
    const savedCurrency = localStorage.getItem("selected_currency")
    if (savedCurrency) {
      const currency = mockCurrencies.find((c) => c.code === savedCurrency)
      if (currency) {
        setSelectedCurrency(currency)
      }
    }
  }, [])

  const convertPrice = (price: number): number => {
    return price * selectedCurrency.rate
  }

  const formatPrice = (price: number): string => {
    const convertedPrice = convertPrice(price)

    try {
      return new Intl.NumberFormat(selectedCurrency.locale, {
        style: "currency",
        currency: selectedCurrency.code,
        minimumFractionDigits: selectedCurrency.code === "JPY" ? 0 : 2,
      }).format(convertedPrice)
    } catch (error) {
      // Fallback formatting
      return `${selectedCurrency.symbol}${convertedPrice.toFixed(selectedCurrency.code === "JPY" ? 0 : 2)}`
    }
  }

  const changeCurrency = (currencyCode: string) => {
    const currency = mockCurrencies.find((c) => c.code === currencyCode)
    if (currency) {
      setSelectedCurrency(currency)
      localStorage.setItem("selected_currency", currencyCode)
    }
  }

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        currencies: mockCurrencies,
        convertPrice,
        formatPrice,
        changeCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}

export function MultiCurrencySelector() {
  const { selectedCurrency, currencies, changeCurrency } = useCurrency()

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedCurrency.code} onValueChange={changeCurrency}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              <div className="flex items-center gap-2">
                <span className="font-mono">{currency.symbol}</span>
                <span>{currency.code}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

interface CurrencyBadgeProps {
  originalPrice: number
  className?: string
}

export function CurrencyBadge({ originalPrice, className }: CurrencyBadgeProps) {
  const { selectedCurrency, formatPrice } = useCurrency()

  if (selectedCurrency.code === "USD") return null

  return (
    <Badge variant="secondary" className={`text-xs ${className}`}>
      ~{formatPrice(originalPrice)}
    </Badge>
  )
}
