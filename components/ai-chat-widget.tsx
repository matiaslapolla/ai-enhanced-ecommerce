"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Send, Bot, User, HelpCircle } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  products?: any[]
  supportType?: "faq" | "return" | "shipping" | "general"
}

interface AIChatWidgetProps {
  products: any[]
}

const supportKnowledgeBase = {
  faq: {
    shipping: {
      keywords: ["shipping", "delivery", "ship", "arrive", "when will", "how long"],
      response:
        "We offer free standard shipping on orders over $50. Standard delivery takes 3-5 business days, while express shipping (2-3 days) costs $9.99. You'll receive tracking information once your order ships!",
    },
    returns: {
      keywords: ["return", "refund", "exchange", "money back", "not satisfied"],
      response:
        "We have a 30-day return policy! You can return any item in original condition for a full refund. Just go to your account > Orders > Return Item, or contact our support team. Return shipping is free for defective items.",
    },
    sizing: {
      keywords: ["size", "fit", "too small", "too big", "sizing chart"],
      response:
        "Each product page has a detailed sizing chart. If you're unsure, I recommend ordering your usual size. Remember, we offer free exchanges within 30 days if the fit isn't perfect!",
    },
    payment: {
      keywords: ["payment", "pay", "credit card", "paypal", "billing"],
      response:
        "We accept all major credit cards, PayPal, Apple Pay, and Google Pay. Your payment information is encrypted and secure. You'll only be charged when your order ships.",
    },
    warranty: {
      keywords: ["warranty", "broken", "defective", "not working", "guarantee"],
      response:
        "All products come with manufacturer warranties. Electronics typically have 1-2 year warranties. If something arrives damaged or stops working, contact us immediately for a replacement or refund.",
    },
    account: {
      keywords: ["account", "login", "password", "profile", "forgot"],
      response:
        "Having trouble with your account? You can reset your password using the 'Forgot Password' link on the login page. For other account issues, I can help you right here!",
    },
  },
  quickActions: [
    { label: "Track my order", action: "track_order", icon: "📦" },
    { label: "Return policy", action: "return_policy", icon: "↩️" },
    { label: "Shipping info", action: "shipping_info", icon: "🚚" },
    { label: "Size guide", action: "size_guide", icon: "📏" },
    { label: "Contact support", action: "contact_support", icon: "💬" },
  ],
}

export function AIChatWidget({ products }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content:
        "Hi! I'm your AI shopping assistant. I can help you find products, answer questions about shipping, returns, and more. What can I help you with today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const predefinedQuestions = [
    "Show me electronics under $100",
    "What's your return policy?",
    "How long does shipping take?",
    "Find me something for the kitchen",
    "Do you have a size guide?",
  ]

  const processAIQuery = async (
    query: string,
  ): Promise<{ response: string; products?: any[]; supportType?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1500))

    const lowerQuery = query.toLowerCase()

    // Check for FAQ/support queries first
    for (const [category, faqItem] of Object.entries(supportKnowledgeBase.faq)) {
      if (faqItem.keywords.some((keyword) => lowerQuery.includes(keyword))) {
        return {
          response: faqItem.response,
          supportType: category,
        }
      }
    }

    // Handle quick actions
    if (lowerQuery.includes("track") && lowerQuery.includes("order")) {
      return {
        response:
          "To track your order, please provide your order number or email address. You can also check your account dashboard for real-time tracking updates!",
        supportType: "general",
      }
    }

    // Product search logic (existing)
    let filteredProducts: any[] = []
    let response = ""

    const priceMatch = lowerQuery.match(/under \$?(\d+)|less than \$?(\d+)|below \$?(\d+)/)
    const maxPrice = priceMatch ? Number.parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3]) : null

    const categories = ["electronics", "fashion", "sports", "home", "garden", "kitchen"]
    const matchedCategory = categories.find((cat) => lowerQuery.includes(cat))

    const colors = ["red", "blue", "green", "black", "white", "gray", "brown"]
    const matchedColor = colors.find((color) => lowerQuery.includes(color))

    const onSale = lowerQuery.includes("sale") || lowerQuery.includes("deal") || lowerQuery.includes("discount")

    filteredProducts = products.filter((product) => {
      let matches = true

      if (maxPrice && product.price > maxPrice) matches = false
      if (matchedCategory && !product.category.toLowerCase().includes(matchedCategory)) matches = false
      if (onSale && !product.isOnSale) matches = false

      if (
        !lowerQuery.includes("show") &&
        !lowerQuery.includes("find") &&
        !lowerQuery.includes("what") &&
        !product.name.toLowerCase().includes(lowerQuery) &&
        !product.category.toLowerCase().includes(lowerQuery)
      ) {
        const queryWords = lowerQuery.split(" ").filter((word) => word.length > 2)
        const hasMatch = queryWords.some(
          (word) => product.name.toLowerCase().includes(word) || product.category.toLowerCase().includes(word),
        )
        if (queryWords.length > 0 && !hasMatch) matches = false
      }

      return matches
    })

    if (filteredProducts.length === 0) {
      response =
        "I couldn't find any products matching your criteria. Try adjusting your search or browse our categories! Is there anything else I can help you with?"
    } else if (filteredProducts.length === 1) {
      response = `I found 1 product that matches your search! Here it is:`
    } else {
      response = `Great! I found ${filteredProducts.length} products that match your search. Here are the results:`
    }

    if (maxPrice) response += ` (under $${maxPrice})`
    if (matchedCategory) response += ` in ${matchedCategory}`
    if (onSale) response += ` that are on sale`

    return { response, products: filteredProducts.slice(0, 6) }
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)
    setShowQuickActions(false)

    try {
      const { response, products: foundProducts, supportType } = await processAIQuery(content)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: new Date(),
        products: foundProducts,
        supportType: supportType as any,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again!",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickAction = (action: string) => {
    const actionQueries = {
      track_order: "How can I track my order?",
      return_policy: "What's your return policy?",
      shipping_info: "How long does shipping take?",
      size_guide: "Do you have a sizing guide?",
      contact_support: "I need to contact customer support",
    }

    const query = actionQueries[action as keyof typeof actionQueries] || action
    handleSendMessage(query)
  }

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-background border border-border rounded-lg shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <span className="font-semibold">AI Shopping Assistant</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="text-primary-foreground hover:bg-primary-foreground/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            {message.type === "assistant" && (
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
            )}

            <div className={`max-w-[80%] ${message.type === "user" ? "order-first" : ""}`}>
              <div
                className={`p-3 rounded-lg ${
                  message.type === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.supportType && (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    <HelpCircle className="h-3 w-3 mr-1" />
                    {message.supportType === "faq" ? "FAQ" : "Support"}
                  </Badge>
                )}
              </div>

              {/* Product Results */}
              {message.products && message.products.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.products.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <CardContent className="p-3">
                        <div className="flex gap-3">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-bold text-sm">${product.price}</span>
                              {product.isOnSale && (
                                <Badge variant="destructive" className="text-xs">
                                  Sale
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>

            {message.type === "user" && (
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {showQuickActions && messages.length === 1 && (
        <div className="p-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">Quick actions:</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {supportKnowledgeBase.quickActions.slice(0, 4).map((action) => (
              <Button
                key={action.action}
                variant="outline"
                size="sm"
                className="text-xs justify-start h-auto p-2 bg-transparent"
                onClick={() => handleQuickAction(action.action)}
              >
                <span className="mr-2">{action.icon}</span>
                {action.label}
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mb-2">Or try asking:</p>
          <div className="flex flex-wrap gap-2">
            {predefinedQuestions.slice(0, 2).map((question) => (
              <Button
                key={question}
                variant="outline"
                size="sm"
                className="text-xs bg-transparent"
                onClick={() => handleQuestionClick(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about products, shipping, returns..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
            disabled={isTyping}
          />
          <Button onClick={() => handleSendMessage(inputValue)} disabled={!inputValue.trim() || isTyping} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
