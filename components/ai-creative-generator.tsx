"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, RefreshCw, Sparkles, ImageIcon, Type } from "lucide-react"

interface Product {
  title: string
  category: string
  features: string[]
  price: number
}

interface AdCreative {
  headline: string
  description: string
  cta: string
  visualSuggestion: string
  targetAudience: string
  platform: string
}

export default function AICreativeGenerator() {
  const [product, setProduct] = useState<Product>({
    title: "",
    category: "",
    features: [],
    price: 0,
  })
  const [creatives, setCreatives] = useState<AdCreative[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [featureInput, setFeatureInput] = useState("")

  const addFeature = () => {
    if (featureInput.trim()) {
      setProduct((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }))
      setFeatureInput("")
    }
  }

  const removeFeature = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const generateCreatives = async () => {
    setIsGenerating(true)

    // Mock AI generation with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockCreatives: AdCreative[] = [
      {
        headline: `Transform Your Style with ${product.title}`,
        description: `Experience premium quality and unmatched comfort. ${product.features.slice(0, 2).join(" and ")} make this the perfect choice for discerning customers.`,
        cta: "Shop Now - Limited Time",
        visualSuggestion: "Hero shot with lifestyle background, warm lighting, focus on key features",
        targetAudience: "Style-conscious consumers aged 25-45",
        platform: "Facebook/Instagram",
      },
      {
        headline: `${product.title} - Now $${product.price}`,
        description: `Don't miss out! Premium ${product.category.toLowerCase()} with ${product.features[0] || "amazing features"}. Free shipping on orders over $50.`,
        cta: "Get Yours Today",
        visualSuggestion: "Clean product shot with price overlay, minimalist design",
        targetAudience: "Price-conscious shoppers",
        platform: "Google Ads",
      },
      {
        headline: `Why Choose ${product.title}?`,
        description: `✓ ${product.features.slice(0, 3).join(" ✓ ")}. Join thousands of satisfied customers who made the smart choice.`,
        cta: "Learn More",
        visualSuggestion: "Comparison layout, customer testimonials, trust badges",
        targetAudience: "Research-oriented buyers",
        platform: "LinkedIn",
      },
    ]

    setCreatives(mockCreatives)
    setIsGenerating(false)
  }

  const exportCreative = (creative: AdCreative) => {
    const content = `
Ad Creative Export
=================

Platform: ${creative.platform}
Target Audience: ${creative.targetAudience}

Headline: ${creative.headline}
Description: ${creative.description}
Call to Action: ${creative.cta}

Visual Suggestion: ${creative.visualSuggestion}

Generated for: ${product.title}
Category: ${product.category}
Features: ${product.features.join(", ")}
    `.trim()

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${product.title.replace(/\s+/g, "_")}_ad_creative.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            AI Creative Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Product Title</Label>
              <Input
                id="title"
                value={product.title}
                onChange={(e) => setProduct((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter product title"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={product.category}
                onChange={(e) => setProduct((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Electronics, Clothing"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              value={product.price || ""}
              onChange={(e) => setProduct((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label>Product Features</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Add a feature"
                onKeyPress={(e) => e.key === "Enter" && addFeature()}
              />
              <Button onClick={addFeature} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeFeature(index)}>
                  {feature} ×
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={generateCreatives}
            disabled={!product.title || !product.category || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating AI Creatives...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Ad Creatives
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {creatives.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Generated Ad Creatives</h3>
          {creatives.map((creative, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{creative.platform}</CardTitle>
                    <p className="text-sm text-muted-foreground">{creative.targetAudience}</p>
                  </div>
                  <Button onClick={() => exportCreative(creative)} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="copy" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="copy" className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Ad Copy
                    </TabsTrigger>
                    <TabsTrigger value="visual" className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Visual
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="copy" className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Headline</Label>
                      <p className="text-lg font-semibold">{creative.headline}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm">{creative.description}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Call to Action</Label>
                      <Badge variant="default">{creative.cta}</Badge>
                    </div>
                  </TabsContent>
                  <TabsContent value="visual" className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Visual Suggestion</Label>
                      <p className="text-sm text-muted-foreground">{creative.visualSuggestion}</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-center text-muted-foreground">
                        AI-Generated Visual Preview
                        <br />
                        <span className="text-xs">
                          Placeholder for generated image based on: {creative.visualSuggestion}
                        </span>
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
