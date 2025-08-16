"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Sparkles, Eye, Send, User } from "lucide-react"

interface EmailTemplate {
  id: string
  name: string
  type: "welcome" | "abandoned_cart" | "product_recommendation" | "sale_announcement" | "restock_alert"
  subject: string
  content: string
  personalizationTags: string[]
}

interface CustomerProfile {
  firstName: string
  lastName: string
  email: string
  recentViewed: string[]
  purchaseHistory: string[]
  preferences: string[]
  location: string
}

// Mock email templates with AI-generated content
const emailTemplates: EmailTemplate[] = [
  {
    id: "welcome",
    name: "Welcome Email",
    type: "welcome",
    subject: "Welcome to our store, {{first_name}}! 🎉",
    content: `Hi {{first_name}},

Welcome to our amazing store! We're thrilled to have you join our community of happy customers.

As a welcome gift, here's a special 15% discount code just for you: WELCOME15

Based on your interests, we think you'll love these products:
{{recommended_products}}

Happy shopping!
The Team`,
    personalizationTags: ["first_name", "recommended_products"],
  },
  {
    id: "abandoned_cart",
    name: "Abandoned Cart Recovery",
    type: "abandoned_cart",
    subject: "{{first_name}}, you left something behind! 🛒",
    content: `Hi {{first_name}},

We noticed you left some great items in your cart. Don't worry, we've saved them for you!

Your cart contains:
{{cart_items}}

Complete your purchase now and get FREE shipping on orders over $50.

{{cart_recovery_link}}

Need help? Just reply to this email!

Best regards,
Customer Success Team`,
    personalizationTags: ["first_name", "cart_items", "cart_recovery_link"],
  },
  {
    id: "product_recommendation",
    name: "Personalized Recommendations",
    type: "product_recommendation",
    subject: "{{first_name}}, we found something perfect for you! ✨",
    content: `Hi {{first_name}},

Based on your recent interest in {{recent_category}}, we've curated some products we think you'll love:

{{recommended_products}}

These items are trending among customers in {{location}} and have excellent reviews.

Plus, enjoy free shipping on orders over $50!

Happy shopping,
The Curation Team`,
    personalizationTags: ["first_name", "recent_category", "recommended_products", "location"],
  },
]

// Mock customer data
const mockCustomer: CustomerProfile = {
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@email.com",
  recentViewed: ["Wireless Headphones", "Yoga Mat", "Coffee Maker"],
  purchaseHistory: ["Running Shoes", "Organic T-Shirt"],
  preferences: ["Electronics", "Fitness", "Sustainable Products"],
  location: "San Francisco, CA",
}

// AI content generation functions
const generatePersonalizedSubject = (template: EmailTemplate, customer: CustomerProfile): string => {
  let subject = template.subject

  const variations = {
    welcome: [
      `Welcome to our store, ${customer.firstName}! 🎉`,
      `Hi ${customer.firstName}, your journey starts here! ✨`,
      `${customer.firstName}, welcome to something amazing! 🌟`,
    ],
    abandoned_cart: [
      `${customer.firstName}, you left something behind! 🛒`,
      `Don't forget your items, ${customer.firstName}! ⏰`,
      `${customer.firstName}, your cart is waiting! 💫`,
    ],
    product_recommendation: [
      `${customer.firstName}, we found something perfect for you! ✨`,
      `New arrivals just for you, ${customer.firstName}! 🎯`,
      `${customer.firstName}, trending now in ${customer.location}! 📍`,
    ],
  }

  const typeVariations = variations[template.type]
  if (typeVariations) {
    subject = typeVariations[Math.floor(Math.random() * typeVariations.length)]
  }

  return subject
}

const generatePersonalizedContent = (template: EmailTemplate, customer: CustomerProfile): string => {
  let content = template.content

  // Replace personalization tags
  content = content.replace(/\{\{first_name\}\}/g, customer.firstName)
  content = content.replace(/\{\{last_name\}\}/g, customer.lastName)
  content = content.replace(/\{\{location\}\}/g, customer.location)

  // Generate dynamic content
  if (content.includes("{{recent_category}}")) {
    const recentCategory = customer.preferences[0] || "products"
    content = content.replace(/\{\{recent_category\}\}/g, recentCategory.toLowerCase())
  }

  if (content.includes("{{recommended_products}}")) {
    const recommendations = `
• ${customer.recentViewed[0] || "Wireless Headphones"} - $79.99 (⭐ 4.5/5)
• ${customer.recentViewed[1] || "Yoga Mat Premium"} - $39.99 (⭐ 4.4/5)
• ${customer.recentViewed[2] || "Coffee Maker Deluxe"} - $89.99 (⭐ 4.6/5)

[View All Recommendations →]`
    content = content.replace(/\{\{recommended_products\}\}/g, recommendations)
  }

  if (content.includes("{{cart_items}}")) {
    const cartItems = `
• Wireless Bluetooth Headphones - $79.99
• Organic Cotton T-Shirt - $24.99
• Total: $104.98 (Free Shipping Eligible!)`
    content = content.replace(/\{\{cart_items\}\}/g, cartItems)
  }

  if (content.includes("{{cart_recovery_link}}")) {
    content = content.replace(/\{\{cart_recovery_link\}\}/g, "[Complete Your Purchase →]")
  }

  return content
}

export function PersonalizedEmailPreview() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(emailTemplates[0])
  const [customer, setCustomer] = useState<CustomerProfile>(mockCustomer)
  const [generatedSubject, setGeneratedSubject] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewMode, setPreviewMode] = useState<"edit" | "preview">("edit")

  const generateEmail = async () => {
    setIsGenerating(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const subject = generatePersonalizedSubject(selectedTemplate, customer)
    const content = generatePersonalizedContent(selectedTemplate, customer)

    setGeneratedSubject(subject)
    setGeneratedContent(content)
    setIsGenerating(false)
  }

  useEffect(() => {
    generateEmail()
  }, [selectedTemplate])

  const handleCustomerUpdate = (field: keyof CustomerProfile, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Personalized Email Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Selection */}
          <div className="space-y-3">
            <Label>Email Template</Label>
            <Select
              value={selectedTemplate.id}
              onValueChange={(value) => {
                const template = emailTemplates.find((t) => t.id === value)
                if (template) setSelectedTemplate(template)
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {emailTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customer Profile */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Profile (for personalization)
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">First Name</Label>
                <Input value={customer.firstName} onChange={(e) => handleCustomerUpdate("firstName", e.target.value)} />
              </div>
              <div>
                <Label className="text-sm">Location</Label>
                <Input value={customer.location} onChange={(e) => handleCustomerUpdate("location", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <Button onClick={generateEmail} disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                Generating Personalized Email...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI-Personalized Email
              </>
            )}
          </Button>

          {/* Preview Toggle */}
          <div className="flex gap-2">
            <Button
              variant={previewMode === "edit" ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewMode("edit")}
            >
              Edit Mode
            </Button>
            <Button
              variant={previewMode === "preview" ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewMode("preview")}
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
          </div>

          {/* Email Content */}
          {previewMode === "edit" ? (
            <div className="space-y-4">
              <div>
                <Label>Subject Line</Label>
                <Input
                  value={generatedSubject}
                  onChange={(e) => setGeneratedSubject(e.target.value)}
                  placeholder="Email subject..."
                />
              </div>
              <div>
                <Label>Email Content</Label>
                <Textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  rows={12}
                  placeholder="Email content..."
                />
              </div>
            </div>
          ) : (
            <Card className="border-2 border-dashed border-primary/20">
              <CardHeader className="bg-muted/50">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">To:</span>
                    <span className="text-sm">{customer.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Subject:</span>
                    <span className="text-sm font-semibold">{generatedSubject}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{generatedContent}</div>
              </CardContent>
            </Card>
          )}

          {/* Personalization Tags */}
          <div className="space-y-2">
            <Label className="text-sm">Available Personalization Tags:</Label>
            <div className="flex flex-wrap gap-2">
              {selectedTemplate.personalizationTags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {`{{${tag}}}`}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Send Test Email
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Save Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
