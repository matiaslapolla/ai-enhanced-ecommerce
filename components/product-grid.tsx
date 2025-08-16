"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Heart, ShoppingCart, Star, Check, CreditCard } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { ExpressCheckout } from "@/components/express-checkout"
import { PaymentFlowModal } from "@/components/payment-flow-modal"

// Mock product data
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
  },
]

export function ProductGrid() {
  const [loading, setLoading] = useState(false)
  const [products] = useState(mockProducts)
  const { addToCart, isInCart } = useCart()
  const [addingToCart, setAddingToCart] = useState<number | null>(null)
  const [expressCheckoutResult, setExpressCheckoutResult] = useState<any>(null)
  const [showPaymentFlow, setShowPaymentFlow] = useState<{ show: boolean; product: any }>({
    show: false,
    product: null,
  })

  const handleAddToCart = async (product: (typeof mockProducts)[0]) => {
    setAddingToCart(product.id)

    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      inStock: product.inStock,
    })

    setAddingToCart(null)
  }

  const handleExpressCheckoutComplete = (result: any) => {
    setExpressCheckoutResult(result)
    if (result.success) {
      // Show success message or redirect
      console.log("[v0] Express checkout completed successfully:", result)
    } else {
      console.log("[v0] Express checkout failed:", result)
    }
  }

  const handleBuyNow = (product: (typeof mockProducts)[0]) => {
    setShowPaymentFlow({
      show: true,
      product: {
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
      },
    })
  }

  const handlePaymentFlowComplete = (result: any) => {
    setShowPaymentFlow({ show: false, product: null })
    if (result.success) {
      console.log("[v0] Payment flow completed successfully:", result)
    } else {
      console.log("[v0] Payment flow failed:", result)
    }
  }

  const getStockDisplay = (productId: number) => {
    // Mock stock data - in real app this would come from inventory system
    const stockData: Record<number, number> = {
      1: 15,
      2: 5,
      3: 25,
      4: 8,
      5: 12,
      6: 20,
    }
    return stockData[productId] || 0
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-64 w-full" />
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results header */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Showing {products.length} products</p>
        <select className="border border-border rounded-md px-3 py-2 text-sm bg-background">
          <option>Sort by: Featured</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Customer Rating</option>
          <option>Newest</option>
        </select>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const stockCount = getStockDisplay(product.id)
          const isLowStock = stockCount <= 10 && stockCount > 0

          return (
            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.isOnSale && <Badge className="absolute top-2 left-2 bg-destructive">Sale</Badge>}
                {isLowStock && <Badge className="absolute top-2 right-12 bg-orange-500 text-white">Low Stock</Badge>}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground line-clamp-2">{product.name}</h3>

                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className={`${isLowStock ? "text-orange-600" : "text-muted-foreground"}`}>
                      {stockCount > 0 ? `${stockCount} in stock` : "Out of stock"}
                    </span>
                    {isLowStock && (
                      <Badge variant="outline" className="text-xs border-orange-300 text-orange-600">
                        Only {stockCount} left!
                      </Badge>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    disabled={addingToCart === product.id || !product.inStock || stockCount === 0}
                  >
                    {addingToCart === product.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                        Adding...
                      </>
                    ) : isInCart(product.id) ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Added to Cart
                      </>
                    ) : stockCount === 0 ? (
                      "Out of Stock"
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>

                  {product.inStock && stockCount > 0 && (
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      size="sm"
                      onClick={() => handleBuyNow(product)}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Buy Now
                    </Button>
                  )}

                  {product.inStock && stockCount > 0 && (
                    <>
                      <Separator className="my-3" />
                      <ExpressCheckout
                        productId={product.id.toString()}
                        productName={product.name}
                        productPrice={product.price}
                        onCheckoutComplete={handleExpressCheckoutComplete}
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {showPaymentFlow.show && (
        <PaymentFlowModal
          isOpen={showPaymentFlow.show}
          onClose={() => setShowPaymentFlow({ show: false, product: null })}
          product={showPaymentFlow.product}
          onPaymentComplete={handlePaymentFlowComplete}
        />
      )}
    </div>
  )
}
