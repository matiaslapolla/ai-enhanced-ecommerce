"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { TrendingUp, TrendingDown, DollarSign, Brain, AlertCircle } from "lucide-react"

interface PricingSuggestion {
  suggestedPrice: number
  confidence: number
  reasoning: string[]
  demandLevel: "low" | "medium" | "high"
  competitorPrice?: number
  trend: "up" | "down" | "stable"
}

interface Product {
  id: number
  name: string
  category: string
  currentPrice: number
  cost: number
  stock: number
  salesVelocity: number
}

// Mock pricing algorithm
const generatePricingSuggestion = (product: Product, marketData: any): PricingSuggestion => {
  const reasoning: string[] = []
  let suggestedPrice = product.currentPrice
  let confidence = 0.7

  // Demand-based pricing
  const demandMultiplier = {
    low: 0.95,
    medium: 1.0,
    high: 1.15,
  }

  const demandLevel = product.salesVelocity > 10 ? "high" : product.salesVelocity > 5 ? "medium" : "low"

  suggestedPrice *= demandMultiplier[demandLevel]
  reasoning.push(`${demandLevel} demand (${product.salesVelocity} sales/week)`)

  // Stock-based pricing
  if (product.stock < 10) {
    suggestedPrice *= 1.1
    reasoning.push("low stock creates urgency")
    confidence += 0.1
  } else if (product.stock > 50) {
    suggestedPrice *= 0.95
    reasoning.push("high stock suggests price reduction")
  }

  // Category trends
  const categoryTrends = {
    Electronics: { multiplier: 1.05, trend: "up" as const },
    Fashion: { multiplier: 0.98, trend: "down" as const },
    Sports: { multiplier: 1.02, trend: "stable" as const },
    "Home & Garden": { multiplier: 1.03, trend: "up" as const },
  }

  const categoryTrend = categoryTrends[product.category as keyof typeof categoryTrends]
  if (categoryTrend) {
    suggestedPrice *= categoryTrend.multiplier
    reasoning.push(`${product.category} category trending ${categoryTrend.trend}`)
  }

  // Competitor pricing (mock)
  const competitorPrice = product.currentPrice * (0.9 + Math.random() * 0.2)
  if (competitorPrice < suggestedPrice * 0.9) {
    suggestedPrice = competitorPrice * 1.05
    reasoning.push("adjusted for competitor pricing")
    confidence -= 0.1
  }

  // Margin protection
  const minPrice = product.cost * 1.3 // 30% minimum margin
  if (suggestedPrice < minPrice) {
    suggestedPrice = minPrice
    reasoning.push("maintaining minimum 30% margin")
    confidence -= 0.2
  }

  // Round to reasonable price points
  suggestedPrice = Math.round(suggestedPrice * 100) / 100

  return {
    suggestedPrice,
    confidence: Math.max(0.3, Math.min(0.95, confidence)),
    reasoning: reasoning.slice(0, 3),
    demandLevel,
    competitorPrice: Math.round(competitorPrice * 100) / 100,
    trend: categoryTrend?.trend || "stable",
  }
}

export function DynamicPricingWidget() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [customPrice, setCustomPrice] = useState("")
  const [pricingSuggestion, setPricingSuggestion] = useState<PricingSuggestion | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Mock products for demo
  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      category: "Electronics",
      currentPrice: 79.99,
      cost: 45.0,
      stock: 8,
      salesVelocity: 12,
    },
    {
      id: 2,
      name: "Organic Cotton T-Shirt",
      category: "Fashion",
      currentPrice: 24.99,
      cost: 12.0,
      stock: 45,
      salesVelocity: 6,
    },
    {
      id: 3,
      name: "Yoga Mat Premium",
      category: "Sports",
      currentPrice: 39.99,
      cost: 18.0,
      stock: 25,
      salesVelocity: 8,
    },
  ]

  const analyzePricing = async (product: Product) => {
    setIsAnalyzing(true)

    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockMarketData = {
      categoryGrowth: 0.05,
      seasonality: 1.0,
      competitorCount: 5,
    }

    const suggestion = generatePricingSuggestion(product, mockMarketData)
    setPricingSuggestion(suggestion)
    setCustomPrice(suggestion.suggestedPrice.toString())
    setIsAnalyzing(false)
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setPricingSuggestion(null)
    setCustomPrice(product.currentPrice.toString())
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600"
    if (confidence >= 0.6) return "text-yellow-600"
    return "text-red-600"
  }

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "high":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Dynamic Pricing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Selection */}
          <div className="space-y-3">
            <Label>Select Product to Analyze</Label>
            <div className="grid grid-cols-1 gap-2">
              {mockProducts.map((product) => (
                <Button
                  key={product.id}
                  variant={selectedProduct?.id === product.id ? "default" : "outline"}
                  className="justify-start h-auto p-3"
                  onClick={() => handleProductSelect(product)}
                >
                  <div className="text-left">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Current: ${product.currentPrice} | Stock: {product.stock} | Sales: {product.salesVelocity}/week
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {selectedProduct && (
            <div className="space-y-4">
              {/* Analysis Button */}
              <Button onClick={() => analyzePricing(selectedProduct)} disabled={isAnalyzing} className="w-full">
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                    Analyzing Market Data...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze Optimal Pricing
                  </>
                )}
              </Button>

              {/* Pricing Suggestion */}
              {pricingSuggestion && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        AI Pricing Recommendation
                      </h3>
                      <Badge variant="secondary" className={getConfidenceColor(pricingSuggestion.confidence)}>
                        {Math.round(pricingSuggestion.confidence * 100)}% confidence
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm">Current Price</Label>
                        <div className="text-2xl font-bold">${selectedProduct.currentPrice}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Suggested Price</Label>
                        <div className="text-2xl font-bold text-primary">${pricingSuggestion.suggestedPrice}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium">Demand Level</div>
                        <div className={`capitalize ${getDemandColor(pricingSuggestion.demandLevel)}`}>
                          {pricingSuggestion.demandLevel}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">Market Trend</div>
                        <div className="flex items-center justify-center gap-1">
                          {pricingSuggestion.trend === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                          {pricingSuggestion.trend === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
                          <span className="capitalize">{pricingSuggestion.trend}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">Competitor Avg</div>
                        <div>${pricingSuggestion.competitorPrice}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">AI Reasoning:</Label>
                      <ul className="text-sm space-y-1">
                        {pricingSuggestion.reasoning.map((reason, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span className="capitalize">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Manual Price Override */}
              <div className="space-y-3">
                <Label>Set Custom Price</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="number"
                      step="0.01"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      className="pl-10"
                      placeholder="Enter price"
                    />
                  </div>
                  <Button variant="outline">Save Price</Button>
                </div>

                {pricingSuggestion && customPrice && (
                  <div className="text-sm text-muted-foreground">
                    {Number.parseFloat(customPrice) > pricingSuggestion.suggestedPrice * 1.1 && (
                      <div className="flex items-center gap-1 text-orange-600">
                        <AlertCircle className="h-3 w-3" />
                        Price is significantly higher than AI recommendation
                      </div>
                    )}
                    {Number.parseFloat(customPrice) < selectedProduct.cost * 1.2 && (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertCircle className="h-3 w-3" />
                        Warning: Low margin (less than 20%)
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
