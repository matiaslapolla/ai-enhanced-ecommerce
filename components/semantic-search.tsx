"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Sparkles, Brain } from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  tags: string[]
  rating: number
  reviews: number
  image: string
  inStock: boolean
}

interface SemanticSearchResult {
  product: Product
  relevanceScore: number
  matchReason: string
}

// Mock semantic search engine
const performSemanticSearch = (query: string, products: Product[]): SemanticSearchResult[] => {
  const queryLower = query.toLowerCase()
  const results: SemanticSearchResult[] = []

  // Natural language processing patterns
  const intentPatterns = {
    price: /under \$?(\d+)|less than \$?(\d+)|below \$?(\d+)|cheap|affordable|budget/i,
    color: /red|blue|green|black|white|yellow|pink|purple|orange|brown|gray|grey/i,
    activity: /running|yoga|fitness|workout|exercise|sports|gaming|work|office|home/i,
    quality: /best|top|premium|high.?quality|excellent|good|great/i,
    sale: /sale|discount|deal|offer|cheap|bargain/i,
    category: /electronics|fashion|sports|home|garden|kitchen|tech|clothing/i,
  }

  products.forEach((product) => {
    let score = 0
    const reasons: string[] = []

    // Direct keyword matching
    const productText = `${product.name} ${product.description} ${product.tags.join(" ")}`.toLowerCase()
    const queryWords = queryLower.split(" ")

    queryWords.forEach((word) => {
      if (productText.includes(word)) {
        score += 10
        reasons.push(`matches "${word}"`)
      }
    })

    // Intent-based matching
    const priceMatch = query.match(intentPatterns.price)
    if (priceMatch) {
      const maxPrice = Number.parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3])
      if (product.price <= maxPrice) {
        score += 20
        reasons.push(`under $${maxPrice}`)
      }
    }

    const colorMatch = query.match(intentPatterns.color)
    if (colorMatch && productText.includes(colorMatch[0].toLowerCase())) {
      score += 15
      reasons.push(`color match: ${colorMatch[0]}`)
    }

    const activityMatch = query.match(intentPatterns.activity)
    if (
      activityMatch &&
      (productText.includes(activityMatch[0].toLowerCase()) ||
        product.category.toLowerCase().includes(activityMatch[0].toLowerCase()))
    ) {
      score += 15
      reasons.push(`activity: ${activityMatch[0]}`)
    }

    if (intentPatterns.quality.test(query) && product.rating >= 4.5) {
      score += 10
      reasons.push("high rated")
    }

    if (intentPatterns.sale.test(query) && product.price < 100) {
      score += 10
      reasons.push("good value")
    }

    // Category matching
    if (product.category.toLowerCase().includes(queryLower) || queryLower.includes(product.category.toLowerCase())) {
      score += 12
      reasons.push(`category: ${product.category}`)
    }

    // Semantic similarity (mock)
    const semanticKeywords = {
      headphones: ["audio", "music", "sound", "wireless", "bluetooth"],
      shoes: ["footwear", "running", "athletic", "comfort"],
      fitness: ["yoga", "exercise", "workout", "health", "sports"],
      kitchen: ["cooking", "food", "appliance", "home"],
      tech: ["electronics", "smart", "digital", "device"],
    }

    Object.entries(semanticKeywords).forEach(([key, synonyms]) => {
      if (queryLower.includes(key)) {
        synonyms.forEach((synonym) => {
          if (productText.includes(synonym)) {
            score += 8
            reasons.push(`semantic: ${synonym}`)
          }
        })
      }
    })

    if (score > 0) {
      results.push({
        product,
        relevanceScore: score,
        matchReason: reasons.slice(0, 3).join(", "),
      })
    }
  })

  return results.sort((a, b) => b.relevanceScore - a.relevanceScore)
}

// Fallback suggestions when no results
const generateFallbackSuggestions = (query: string): string[] => {
  const suggestions = [
    "Try searching for 'wireless headphones'",
    "Look for 'running shoes under $100'",
    "Search 'kitchen appliances on sale'",
    "Find 'yoga equipment for beginners'",
    "Browse 'electronics with high ratings'",
  ]

  // Smart fallbacks based on query
  if (query.includes("shoe")) return ["running shoes", "athletic footwear", "comfortable shoes"]
  if (query.includes("music") || query.includes("audio")) return ["headphones", "speakers", "audio equipment"]
  if (query.includes("fitness") || query.includes("workout")) return ["yoga mats", "fitness equipment", "sports gear"]

  return suggestions.slice(0, 3)
}

interface SemanticSearchProps {
  products: Product[]
  onResultsFound: (results: SemanticSearchResult[]) => void
}

export function SemanticSearch({ products, onResultsFound }: SemanticSearchProps) {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [lastQuery, setLastQuery] = useState("")
  const [fallbackSuggestions, setFallbackSuggestions] = useState<string[]>([])

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setLastQuery(searchQuery)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const results = performSemanticSearch(searchQuery, products)

    if (results.length === 0) {
      setFallbackSuggestions(generateFallbackSuggestions(searchQuery))
    } else {
      setFallbackSuggestions([])
    }

    onResultsFound(results)
    setIsSearching(false)
  }

  const exampleQueries = [
    "Show me red shoes under $100",
    "Find wireless headphones with good reviews",
    "What's good for home workouts?",
    "Kitchen appliances on sale",
    "Best electronics for students",
    "Comfortable running gear",
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Semantic Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Try: 'Show me red shoes under $100' or 'Find wireless headphones with good reviews'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch(query)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => handleSearch(query)} disabled={isSearching || !query.trim()}>
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                Searching...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </div>

        {/* Example queries */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Try these natural language queries:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((example) => (
              <Button
                key={example}
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery(example)
                  handleSearch(example)
                }}
                className="text-xs"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>

        {/* Fallback suggestions */}
        {fallbackSuggestions.length > 0 && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-2">No results for "{lastQuery}". Try these instead:</p>
            <div className="space-y-1">
              {fallbackSuggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setQuery(suggestion)
                    handleSearch(suggestion)
                  }}
                  className="text-sm justify-start h-auto p-2"
                >
                  <Search className="h-3 w-3 mr-2" />
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
