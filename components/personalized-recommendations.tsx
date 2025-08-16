"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, TrendingUp, Heart, ShoppingBag, Star } from "lucide-react"
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
}

interface UserProfile {
  id: string
  cohort: "budget_conscious" | "premium_buyer" | "fitness_enthusiast" | "tech_lover" | "fashion_forward"
  viewHistory: number[]
  purchaseHistory: number[]
  preferences: {
    categories: string[]
    priceRange: [number, number]
    brands: string[]
  }
}

// Mock user cohorts with different behaviors
const cohortProfiles = {
  budget_conscious: {
    preferredCategories: ["Fashion", "Home & Garden"],
    maxPrice: 50,
    salePreference: 0.8,
    ratingThreshold: 4.0,
  },
  premium_buyer: {
    preferredCategories: ["Electronics", "Sports"],
    maxPrice: 500,
    salePreference: 0.2,
    ratingThreshold: 4.5,
  },
  fitness_enthusiast: {
    preferredCategories: ["Sports", "Health"],
    maxPrice: 150,
    salePreference: 0.4,
    ratingThreshold: 4.3,
  },
  tech_lover: {
    preferredCategories: ["Electronics", "Technology"],
    maxPrice: 300,
    salePreference: 0.3,
    ratingThreshold: 4.4,
  },
  fashion_forward: {
    preferredCategories: ["Fashion", "Accessories"],
    maxPrice: 200,
    salePreference: 0.6,
    ratingThreshold: 4.2,
  },
}

// Generate personalized recommendations
const generatePersonalizedRecommendations = (
  user: UserProfile,
  allProducts: Product[],
  cartItems: Product[],
): { product: Product; score: number; reason: string }[] => {
  const cohort = cohortProfiles[user.cohort]
  const scored: { product: Product; score: number; reason: string }[] = []

  allProducts.forEach((product) => {
    // Skip items already in cart
    if (cartItems.some((item) => item.id === product.id)) return

    let score = 0
    const reasons: string[] = []

    // Category preference
    if (cohort.preferredCategories.includes(product.category)) {
      score += 30
      reasons.push("matches your interests")
    }

    // Price preference
    if (product.price <= cohort.maxPrice) {
      score += 20
      reasons.push("within your budget")
    }

    // Sale preference
    if (product.isOnSale && Math.random() < cohort.salePreference) {
      score += 15
      reasons.push("on sale")
    }

    // Rating threshold
    if (product.rating >= cohort.ratingThreshold) {
      score += 10
      reasons.push("highly rated")
    }

    // View history similarity
    user.viewHistory.forEach((viewedId) => {
      const viewedProduct = allProducts.find((p) => p.id === viewedId)
      if (viewedProduct && viewedProduct.category === product.category) {
        score += 12
        reasons.push("similar to viewed items")
      }
    })

    // Purchase history patterns
    user.purchaseHistory.forEach((purchasedId) => {
      const purchasedProduct = allProducts.find((p) => p.id === purchasedId)
      if (purchasedProduct && purchasedProduct.category === product.category) {
        score += 25
        reasons.push("based on your purchases")
      }
    })

    // Random factor for variety
    score += Math.random() * 5

    if (score > 0) {
      scored.push({
        product,
        score,
        reason: reasons.slice(0, 2).join(", ") || "recommended for you",
      })
    }
  })

  return scored.sort((a, b) => b.score - a.score)
}

// Mock user profile - in real app this would come from user data
const getMockUserProfile = (): UserProfile => {
  const stored = localStorage.getItem("user_profile")
  if (stored) {
    return JSON.parse(stored)
  }

  // Generate random user profile
  const cohorts = Object.keys(cohortProfiles) as Array<keyof typeof cohortProfiles>
  const randomCohort = cohorts[Math.floor(Math.random() * cohorts.length)]

  const profile: UserProfile = {
    id: "user_" + Math.random().toString(36).substr(2, 9),
    cohort: randomCohort,
    viewHistory: [1, 3, 4], // Mock viewed products
    purchaseHistory: [2], // Mock purchased products
    preferences: {
      categories: cohortProfiles[randomCohort].preferredCategories,
      priceRange: [0, cohortProfiles[randomCohort].maxPrice],
      brands: [],
    },
  }

  localStorage.setItem("user_profile", JSON.stringify(profile))
  return profile
}

interface PersonalizedRecommendationsProps {
  allProducts: Product[]
  maxItems?: number
}

export function PersonalizedRecommendations({ allProducts, maxItems = 6 }: PersonalizedRecommendationsProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [recommendations, setRecommendations] = useState<{ product: Product; score: number; reason: string }[]>([])
  const { addToCart, isInCart, items: cartItems } = useCart()

  useEffect(() => {
    const profile = getMockUserProfile()
    setUserProfile(profile)

    const recs = generatePersonalizedRecommendations(profile, allProducts, cartItems)
    setRecommendations(recs.slice(0, maxItems))
  }, [allProducts, cartItems, maxItems])

  const getCohortDisplayName = (cohort: string) => {
    const names = {
      budget_conscious: "Budget Conscious",
      premium_buyer: "Premium Buyer",
      fitness_enthusiast: "Fitness Enthusiast",
      tech_lover: "Tech Lover",
      fashion_forward: "Fashion Forward",
    }
    return names[cohort as keyof typeof names] || cohort
  }

  const getCohortIcon = (cohort: string) => {
    const icons = {
      budget_conscious: ShoppingBag,
      premium_buyer: Star,
      fitness_enthusiast: TrendingUp,
      tech_lover: User,
      fashion_forward: Heart,
    }
    const Icon = icons[cohort as keyof typeof icons] || User
    return <Icon className="h-4 w-4" />
  }

  if (!userProfile || recommendations.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personalized for You
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            {getCohortIcon(userProfile.cohort)}
            {getCohortDisplayName(userProfile.cohort)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map(({ product, reason }) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.isOnSale && <Badge className="absolute top-2 left-2 bg-destructive text-xs">Sale</Badge>}
                <Badge className="absolute top-2 right-2 bg-primary/90 text-xs">For You</Badge>
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>

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
                    <span className="font-bold text-sm">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
                    )}
                  </div>

                  <p className="text-xs text-primary italic">{reason}</p>

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
                    {isInCart(product.id) ? "Added to Cart" : "Add to Cart"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
