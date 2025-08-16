"use client"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, Sparkles } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  category: string
  isOnSale: boolean
  inStock: boolean
  tags?: string[]
  brand?: string
}

interface ProductRecommendationsProps {
  currentProduct?: Product
  userHistory?: Product[]
  cartItems?: Product[]
  allProducts: Product[]
  title?: string
  maxItems?: number
}

export function ProductRecommendations({
  currentProduct,
  userHistory = [],
  cartItems = [],
  allProducts,
  title = "You May Also Like",
  maxItems = 4,
}: ProductRecommendationsProps) {
  const { addToCart, isInCart } = useCart()

  const recommendations = useMemo(() => {
    const scored: Array<{ product: Product; score: number }> = []

    allProducts.forEach((product) => {
      // Skip current product and items already in cart
      if (currentProduct && product.id === currentProduct.id) return
      if (cartItems.some((item) => item.id === product.id)) return

      let score = 0

      // Category similarity (highest weight)
      if (currentProduct && product.category === currentProduct.category) {
        score += 50
      }

      // Price range similarity
      if (currentProduct) {
        const priceDiff = Math.abs(product.price - currentProduct.price)
        const priceScore = Math.max(0, 20 - (priceDiff / currentProduct.price) * 20)
        score += priceScore
      }

      // User history preferences
      userHistory.forEach((historyItem) => {
        if (product.category === historyItem.category) score += 15
        if (product.id === historyItem.id) score += 30 // Previously viewed
      })

      // Rating boost
      score += product.rating * 5

      // Sale items boost
      if (product.isOnSale) score += 10

      // Stock availability
      if (product.inStock) score += 5

      // Random factor for variety (fixed seed based on product ID for consistency)
      score += (product.id * 0.1) % 10

      scored.push({ product, score })
    })

    // Sort by score and take top items
    const topRecommendations = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, maxItems)
      .map((item) => item.product)

    // If we don't have enough recommendations, fill with random popular items
    if (topRecommendations.length < maxItems) {
      const remaining = allProducts
        .filter((p) => !topRecommendations.some((r) => r.id === p.id))
        .filter((p) => (currentProduct ? p.id !== currentProduct.id : true))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, maxItems - topRecommendations.length)

      topRecommendations.push(...remaining)
    }

    return topRecommendations
  }, [currentProduct, userHistory, cartItems, allProducts, maxItems])

  if (recommendations.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <Badge variant="secondary" className="text-xs">
          AI Powered
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((product) => (
          <Card key={product.id} className="group overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.isOnSale && <Badge className="absolute top-2 left-2 bg-destructive text-xs">Sale</Badge>}
            </div>

            <CardContent className="p-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm line-clamp-2 text-foreground">{product.name}</h4>

                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
                  )}
                </div>

                <Button
                  size="sm"
                  className="w-full text-xs"
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      originalPrice: product.originalPrice,
                      image: product.image,
                      category: product.category,
                      inStock: product.inStock,
                    })
                  }
                  disabled={!product.inStock || isInCart(product.id)}
                >
                  {isInCart(product.id) ? (
                    "Added to Cart"
                  ) : (
                    <>
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
