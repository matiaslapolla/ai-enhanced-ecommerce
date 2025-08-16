"use client"

import { Header } from "@/components/header"
import { ProductGrid } from "@/components/product-grid"
import { CategoryFilter } from "@/components/category-filter"
import { EnhancedSearchBar } from "@/components/enhanced-search-bar"
import { ProductRecommendations } from "@/components/product-recommendations"
import { PersonalizedRecommendations } from "@/components/personalized-recommendations"
import { SemanticSearch } from "@/components/semantic-search"
import { AIChatWidget } from "@/components/ai-chat-widget"
import { useState } from "react"

// Mock product data for AI features
const mockProducts = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    originalPrice: 99.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.5,
    reviews: 128,
    category: "Electronics",
    isOnSale: true,
    inStock: true,
    tags: ["wireless", "bluetooth", "audio"],
    brand: "AudioTech",
  },
  {
    id: 2,
    name: "Organic Cotton T-Shirt",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.2,
    reviews: 89,
    category: "Fashion",
    isOnSale: false,
    inStock: true,
    tags: ["organic", "cotton", "sustainable"],
    brand: "EcoWear",
  },
  {
    id: 3,
    name: "Smart Home Security Camera",
    price: 149.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    reviews: 203,
    category: "Electronics",
    isOnSale: false,
    inStock: true,
    tags: ["security", "smart", "home"],
    brand: "SecureHome",
  },
  {
    id: 4,
    name: "Yoga Mat Premium",
    price: 39.99,
    originalPrice: 59.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.4,
    reviews: 156,
    category: "Sports",
    isOnSale: true,
    inStock: true,
    tags: ["yoga", "fitness", "exercise"],
    brand: "ZenFit",
  },
  {
    id: 5,
    name: "Coffee Maker Deluxe",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.6,
    reviews: 94,
    category: "Home & Garden",
    isOnSale: false,
    inStock: true,
    tags: ["coffee", "kitchen", "appliance"],
    brand: "BrewMaster",
  },
  {
    id: 6,
    name: "Running Shoes Pro",
    price: 119.99,
    originalPrice: 149.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    reviews: 267,
    category: "Sports",
    isOnSale: true,
    inStock: true,
    tags: ["running", "athletic", "sports"],
    brand: "RunPro",
  },
]

export default function HomePage() {
  const [semanticResults, setSemanticResults] = useState<any[]>([])
  const [showSemanticResults, setShowSemanticResults] = useState(false)

  const handleSearch = (query: string, filters: any) => {
    console.log("Regular search:", query, filters)
    setShowSemanticResults(false)
    // Implement regular search logic
  }

  const handleAISearch = (query: string) => {
    console.log("AI search:", query)
    // AI search is handled by the chat widget
  }

  const handleSemanticResults = (results: any[]) => {
    setSemanticResults(results)
    setShowSemanticResults(results.length > 0)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section with Enhanced AI Search */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Discover Amazing Products</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Shop with confidence using our AI-powered search and personalized recommendations
          </p>
          <EnhancedSearchBar onSearch={handleSearch} onAISearch={handleAISearch} />
        </section>

        <section className="mb-12">
          <SemanticSearch products={mockProducts} onResultsFound={handleSemanticResults} />
        </section>

        {showSemanticResults && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {semanticResults.slice(0, 6).map(({ product, relevanceScore, matchReason }) => (
                <div key={product.id} className="border rounded-lg p-4 space-y-2">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded"
                  />
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{matchReason}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">${product.price}</span>
                    <span className="text-xs bg-primary/10 px-2 py-1 rounded">{relevanceScore}% match</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-12">
          <PersonalizedRecommendations allProducts={mockProducts} maxItems={6} />
        </section>

        {/* AI-Powered Recommendations */}
        <section className="mb-12">
          <ProductRecommendations allProducts={mockProducts} title="Trending Now" maxItems={4} />
        </section>

        {/* Filters and Product Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <CategoryFilter />
          </aside>

          <div className="flex-1 space-y-8">
            <ProductGrid />

            {/* More AI Recommendations */}
            <ProductRecommendations allProducts={mockProducts} title="You May Also Like" maxItems={4} />
          </div>
        </div>
      </main>

      {/* AI Chat Widget */}
      <AIChatWidget products={mockProducts} />
    </div>
  )
}
