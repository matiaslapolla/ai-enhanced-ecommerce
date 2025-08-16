"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Tag, Brain, X, Plus } from "lucide-react"

interface ProductForTagging {
  id: number
  name: string
  description: string
  category: string
  tags: string[]
  suggestedTags: string[]
  suggestedCategories: string[]
}

// Mock AI tagging service
const generateAITags = (name: string, description: string): string[] => {
  const keywords = [...name.toLowerCase().split(" "), ...description.toLowerCase().split(" ")]
  const tagMap: Record<string, string[]> = {
    wireless: ["bluetooth", "connectivity", "portable"],
    headphones: ["audio", "music", "sound"],
    organic: ["eco-friendly", "sustainable", "natural"],
    cotton: ["fabric", "comfortable", "breathable"],
    smart: ["technology", "connected", "iot"],
    security: ["safety", "monitoring", "protection"],
    camera: ["photography", "surveillance", "recording"],
    yoga: ["fitness", "wellness", "exercise"],
    mat: ["equipment", "gear", "accessories"],
    coffee: ["beverage", "kitchen", "brewing"],
    maker: ["appliance", "automatic", "convenience"],
    running: ["athletic", "sports", "fitness"],
    shoes: ["footwear", "comfort", "performance"],
  }

  const suggestedTags = new Set<string>()
  keywords.forEach((keyword) => {
    if (tagMap[keyword]) {
      tagMap[keyword].forEach((tag) => suggestedTags.add(tag))
    }
  })

  return Array.from(suggestedTags).slice(0, 6)
}

const generateAICategories = (name: string, description: string): string[] => {
  const text = `${name} ${description}`.toLowerCase()
  const categories = []

  if (text.includes("headphones") || text.includes("camera") || text.includes("smart")) {
    categories.push("Electronics", "Technology")
  }
  if (text.includes("shirt") || text.includes("cotton") || text.includes("clothing")) {
    categories.push("Fashion", "Apparel")
  }
  if (text.includes("yoga") || text.includes("running") || text.includes("fitness")) {
    categories.push("Sports", "Fitness & Wellness")
  }
  if (text.includes("coffee") || text.includes("kitchen") || text.includes("home")) {
    categories.push("Home & Garden", "Kitchen")
  }

  return categories.slice(0, 3)
}

export function AITaggingSystem() {
  const [products, setProducts] = useState<ProductForTagging[]>([
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      description: "Premium wireless headphones with noise cancellation and long battery life",
      category: "Electronics",
      tags: ["wireless", "bluetooth"],
      suggestedTags: [],
      suggestedCategories: [],
    },
  ])

  const [selectedProduct, setSelectedProduct] = useState<ProductForTagging | null>(null)
  const [newTag, setNewTag] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateSuggestions = async (product: ProductForTagging) => {
    setIsGenerating(true)

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const suggestedTags = generateAITags(product.name, product.description)
    const suggestedCategories = generateAICategories(product.name, product.description)

    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, suggestedTags, suggestedCategories } : p)))

    setIsGenerating(false)
  }

  const addTag = (productId: number, tag: string) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, tags: [...p.tags, tag] } : p)))
  }

  const removeTag = (productId: number, tagToRemove: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, tags: p.tags.filter((tag) => tag !== tagToRemove) } : p)),
    )
  }

  const updateCategory = (productId: number, category: string) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, category } : p)))
  }

  const addCustomTag = (productId: number) => {
    if (newTag.trim()) {
      addTag(productId, newTag.trim())
      setNewTag("")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Product Tagging
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>

                {/* Current Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={product.category} onValueChange={(value) => updateCategory(product.id, value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Fashion">Fashion</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Fitness & Wellness">Fitness & Wellness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Current Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="default" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeTag(product.id, tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Add Custom Tag */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addCustomTag(product.id)}
                  />
                  <Button onClick={() => addCustomTag(product.id)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* AI Suggestions */}
                <div className="space-y-4">
                  <Button
                    onClick={() => generateSuggestions(product)}
                    disabled={isGenerating}
                    className="flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                        Generating AI Suggestions...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate AI Suggestions
                      </>
                    )}
                  </Button>

                  {product.suggestedTags.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">AI Suggested Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {product.suggestedTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            onClick={() => addTag(product.id, tag)}
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.suggestedCategories.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">AI Suggested Categories</label>
                      <div className="flex flex-wrap gap-2">
                        {product.suggestedCategories.map((category) => (
                          <Badge
                            key={category}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            onClick={() => updateCategory(product.id, category)}
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
