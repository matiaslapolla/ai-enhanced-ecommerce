"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface EnhancedSearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void
  onAISearch: (query: string) => void
}

interface SearchFilters {
  category?: string
  priceRange?: [number, number]
  onSale?: boolean
  rating?: number
}

export function EnhancedSearchBar({ onSearch, onAISearch }: EnhancedSearchBarProps) {
  const [query, setQuery] = useState("")
  const [isAIMode, setIsAIMode] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({})
  const [suggestions, setSuggestions] = useState<string[]>([])

  const aiSuggestions = [
    "Show me electronics under $100",
    "Find red shoes for running",
    "What's good for home workouts?",
    "Show me kitchen appliances on sale",
    "Find highly rated headphones",
    "What's trending in fashion?",
  ]

  const regularSuggestions = [
    "Wireless headphones",
    "Running shoes",
    "Coffee maker",
    "Yoga mat",
    "Smart watch",
    "Bluetooth speaker",
  ]

  useEffect(() => {
    if (query.length > 0) {
      const currentSuggestions = isAIMode ? aiSuggestions : regularSuggestions
      const filtered = currentSuggestions.filter((suggestion) => suggestion.toLowerCase().includes(query.toLowerCase()))
      setSuggestions(filtered.slice(0, 4))
    } else {
      setSuggestions([])
    }
  }, [query, isAIMode])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    if (isAIMode) {
      onAISearch(query)
    } else {
      onSearch(query, filters)
    }
    setSuggestions([])
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setSuggestions([])
    if (isAIMode) {
      onAISearch(suggestion)
    } else {
      onSearch(suggestion, filters)
    }
  }

  const toggleAIMode = () => {
    setIsAIMode(!isAIMode)
    setQuery("")
    setSuggestions([])
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            placeholder={
              isAIMode ? "Try 'Show me red shoes under $100' or ask me anything..." : "Search for products..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`pl-12 pr-40 h-14 text-lg bg-card border-2 transition-colors ${
              isAIMode ? "border-primary focus:border-primary" : "border-border focus:border-primary"
            }`}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <Button
              type="button"
              variant={isAIMode ? "default" : "outline"}
              size="sm"
              onClick={toggleAIMode}
              className="h-10 px-3"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              {isAIMode ? "AI" : "AI"}
            </Button>
            <Button type="submit" className="h-10 px-4">
              {isAIMode ? "Ask AI" : "Search"}
            </Button>
          </div>
        </div>

        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-10">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-b-0 first:rounded-t-lg last:rounded-b-lg"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-center gap-2">
                  {isAIMode ? (
                    <Sparkles className="h-4 w-4 text-primary" />
                  ) : (
                    <Search className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Mode indicator and quick suggestions */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {isAIMode && (
          <Badge variant="secondary" className="text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Mode Active
          </Badge>
        )}

        {(isAIMode ? aiSuggestions : regularSuggestions).slice(0, 3).map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            onClick={() => handleSuggestionClick(suggestion)}
            className="text-sm bg-transparent"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  )
}
