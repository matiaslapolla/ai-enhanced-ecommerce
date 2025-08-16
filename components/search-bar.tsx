"use client"

import type React from "react"

import { useState } from "react"
import { Search, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchBar() {
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock search functionality
    console.log("Searching for:", query)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            placeholder="Try 'Show me red shoes under $100' or search by product name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-32 h-14 text-lg bg-card border-2 border-border focus:border-primary"
          />
          <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-6">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Search
          </Button>
        </div>
      </form>

      {/* Quick suggestions */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {["Electronics", "Fashion", "Home & Garden", "Sports", "Books"].map((suggestion) => (
          <Button key={suggestion} variant="outline" size="sm" onClick={() => setQuery(suggestion)} className="text-sm">
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  )
}
