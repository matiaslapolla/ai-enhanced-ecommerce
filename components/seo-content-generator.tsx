"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Sparkles, Copy, RefreshCw, CheckCircle } from "lucide-react"

interface ProductMetadata {
  name: string
  category: string
  price: number
  features: string[]
  brand: string
  color?: string
  material?: string
  targetAudience?: string
}

interface SEOContent {
  title: string
  metaDescription: string
  keywords: string[]
  productDescription: string
  altText: string
  urlSlug: string
}

// AI SEO content generation
const generateSEOContent = async (metadata: ProductMetadata): Promise<SEOContent> => {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const { name, category, price, features, brand, color, material, targetAudience } = metadata

  // Generate SEO title (50-60 characters optimal)
  const titleVariations = [
    `${name} - ${brand} | Premium ${category}`,
    `${brand} ${name} - Best ${category} for ${targetAudience || "Everyone"}`,
    `${name} by ${brand} - ${features[0]} ${category}`,
    `Premium ${name} - ${brand} ${category} Collection`,
  ]
  const title = titleVariations[Math.floor(Math.random() * titleVariations.length)]

  // Generate meta description (150-160 characters optimal)
  const descriptionTemplates = [
    `Discover the ${name} by ${brand}. ${features.slice(0, 2).join(" and ")} with premium quality. Starting at $${price}. Free shipping available.`,
    `Shop ${brand}'s ${name} - the perfect ${category.toLowerCase()} featuring ${features[0]}. Premium quality, competitive pricing at $${price}.`,
    `${name} from ${brand} combines ${features.slice(0, 2).join(" and ")}. Ideal for ${targetAudience || "everyone"}. Order now for $${price}.`,
  ]
  const metaDescription = descriptionTemplates[Math.floor(Math.random() * descriptionTemplates.length)]

  // Generate keywords
  const baseKeywords = [
    name.toLowerCase(),
    brand.toLowerCase(),
    category.toLowerCase(),
    `${category.toLowerCase()} ${brand.toLowerCase()}`,
    `best ${category.toLowerCase()}`,
    `premium ${category.toLowerCase()}`,
  ]

  const featureKeywords = features.map((f) => f.toLowerCase())
  const additionalKeywords = []

  if (color) additionalKeywords.push(`${color.toLowerCase()} ${category.toLowerCase()}`)
  if (material) additionalKeywords.push(`${material.toLowerCase()} ${category.toLowerCase()}`)
  if (targetAudience) additionalKeywords.push(`${category.toLowerCase()} for ${targetAudience.toLowerCase()}`)

  const keywords = [...baseKeywords, ...featureKeywords, ...additionalKeywords].slice(0, 15)

  // Generate product description
  const productDescription = `Experience the exceptional ${name} from ${brand}, designed for ${targetAudience || "discerning customers"}. This premium ${category.toLowerCase()} features ${features.join(", ")}, making it the perfect choice for those who demand quality and performance.

Key Features:
${features.map((feature) => `• ${feature}`).join("\n")}

${color ? `Available in ${color.toLowerCase()} finish` : ""}${material ? ` with ${material.toLowerCase()} construction` : ""} for lasting durability and style.

At just $${price}, this ${name} offers exceptional value without compromising on quality. Perfect for ${targetAudience || "anyone"} looking for reliable ${category.toLowerCase()} solutions.`

  // Generate alt text
  const altText = `${brand} ${name} - ${features[0]} ${category}${color ? ` in ${color}` : ""}`

  // Generate URL slug
  const urlSlug = `${brand}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

  return {
    title: title.slice(0, 60),
    metaDescription: metaDescription.slice(0, 160),
    keywords,
    productDescription,
    altText,
    urlSlug,
  }
}

export function SEOContentGenerator() {
  const [metadata, setMetadata] = useState<ProductMetadata>({
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    price: 79.99,
    features: ["Noise Cancellation", "30-hour Battery", "Premium Sound Quality"],
    brand: "AudioTech",
    color: "Black",
    material: "Premium Plastic",
    targetAudience: "Music Lovers",
  })

  const [seoContent, setSeoContent] = useState<SEOContent | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const content = await generateSEOContent(metadata)
      setSeoContent(content)
      setEditMode(false)
    } catch (error) {
      console.error("Error generating SEO content:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const updateMetadata = (field: keyof ProductMetadata, value: any) => {
    setMetadata((prev) => ({ ...prev, [field]: value }))
  }

  const updateSEOContent = (field: keyof SEOContent, value: any) => {
    if (seoContent) {
      setSeoContent((prev) => (prev ? { ...prev, [field]: value } : null))
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            AI SEO Content Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Metadata Input */}
          <div className="space-y-4">
            <h3 className="font-semibold">Product Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Product Name</Label>
                <Input
                  value={metadata.name}
                  onChange={(e) => updateMetadata("name", e.target.value)}
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <Label>Brand</Label>
                <Input
                  value={metadata.brand}
                  onChange={(e) => updateMetadata("brand", e.target.value)}
                  placeholder="Enter brand name"
                />
              </div>

              <div>
                <Label>Category</Label>
                <Select value={metadata.category} onValueChange={(value) => updateMetadata("category", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Fashion">Fashion</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                    <SelectItem value="Beauty">Beauty</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={metadata.price}
                  onChange={(e) => updateMetadata("price", Number.parseFloat(e.target.value))}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label>Color (Optional)</Label>
                <Input
                  value={metadata.color || ""}
                  onChange={(e) => updateMetadata("color", e.target.value)}
                  placeholder="e.g., Black, White, Red"
                />
              </div>

              <div>
                <Label>Target Audience (Optional)</Label>
                <Input
                  value={metadata.targetAudience || ""}
                  onChange={(e) => updateMetadata("targetAudience", e.target.value)}
                  placeholder="e.g., Professionals, Students, Athletes"
                />
              </div>
            </div>

            <div>
              <Label>Key Features (one per line)</Label>
              <Textarea
                value={metadata.features.join("\n")}
                onChange={(e) =>
                  updateMetadata(
                    "features",
                    e.target.value.split("\n").filter((f) => f.trim()),
                  )
                }
                placeholder="Enter key features, one per line"
                rows={4}
              />
            </div>
          </div>

          {/* Generate Button */}
          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                Generating SEO Content...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI SEO Content
              </>
            )}
          </Button>

          {/* Generated Content */}
          {seoContent && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Generated SEO Content</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)}>
                    {editMode ? "View Mode" : "Edit Mode"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isGenerating}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Regenerate
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {/* SEO Title */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>SEO Title ({seoContent.title.length}/60 chars)</Label>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(seoContent.title, "title")}>
                      {copiedField === "title" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {editMode ? (
                    <Input
                      value={seoContent.title}
                      onChange={(e) => updateSEOContent("title", e.target.value)}
                      maxLength={60}
                    />
                  ) : (
                    <div className="p-3 bg-muted rounded border">
                      <p className="text-sm">{seoContent.title}</p>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Optimal: 50-60 characters</span>
                    <span className={seoContent.title.length > 60 ? "text-red-600" : "text-green-600"}>
                      {seoContent.title.length <= 60 ? "✓ Good length" : "⚠ Too long"}
                    </span>
                  </div>
                </div>

                {/* Meta Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Meta Description ({seoContent.metaDescription.length}/160 chars)</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(seoContent.metaDescription, "description")}
                    >
                      {copiedField === "description" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {editMode ? (
                    <Textarea
                      value={seoContent.metaDescription}
                      onChange={(e) => updateSEOContent("metaDescription", e.target.value)}
                      maxLength={160}
                      rows={3}
                    />
                  ) : (
                    <div className="p-3 bg-muted rounded border">
                      <p className="text-sm">{seoContent.metaDescription}</p>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Optimal: 150-160 characters</span>
                    <span className={seoContent.metaDescription.length > 160 ? "text-red-600" : "text-green-600"}>
                      {seoContent.metaDescription.length <= 160 ? "✓ Good length" : "⚠ Too long"}
                    </span>
                  </div>
                </div>

                {/* Keywords */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>SEO Keywords</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(seoContent.keywords.join(", "), "keywords")}
                    >
                      {copiedField === "keywords" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {seoContent.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Product Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Product Description</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(seoContent.productDescription, "productDescription")}
                    >
                      {copiedField === "productDescription" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {editMode ? (
                    <Textarea
                      value={seoContent.productDescription}
                      onChange={(e) => updateSEOContent("productDescription", e.target.value)}
                      rows={8}
                    />
                  ) : (
                    <div className="p-3 bg-muted rounded border max-h-40 overflow-y-auto">
                      <pre className="text-sm whitespace-pre-wrap">{seoContent.productDescription}</pre>
                    </div>
                  )}
                </div>

                {/* Additional SEO Elements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Image Alt Text</Label>
                    <div className="p-3 bg-muted rounded border">
                      <p className="text-sm">{seoContent.altText}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>URL Slug</Label>
                    <div className="p-3 bg-muted rounded border">
                      <p className="text-sm font-mono">{seoContent.urlSlug}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button className="flex-1">Save & Publish</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Save as Draft
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
