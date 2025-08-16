"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Calendar,
  DollarSign,
} from "lucide-react"

interface PricingRecommendation {
  productId: string
  productName: string
  currentPrice: number
  recommendedPrice: number
  confidence: number
  reason: string
  trigger: "competitor" | "seasonality" | "demand" | "inventory"
  projectedImpact: {
    salesChange: number
    revenueChange: number
    marginChange: number
  }
  competitorData?: {
    competitor: string
    price: number
  }
  urgency: "low" | "medium" | "high"
}

export default function AutonomousPricingAgent() {
  const [recommendations, setRecommendations] = useState<PricingRecommendation[]>([])
  const [acceptedCount, setAcceptedCount] = useState(0)
  const [rejectedCount, setRejectedCount] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    // Simulate real-time pricing analysis
    generateRecommendations()
    const interval = setInterval(generateRecommendations, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const generateRecommendations = () => {
    setIsAnalyzing(true)

    setTimeout(() => {
      const mockRecommendations: PricingRecommendation[] = [
        {
          productId: "1",
          productName: "Wireless Bluetooth Headphones",
          currentPrice: 89.99,
          recommendedPrice: 84.99,
          confidence: 87,
          reason: "Competitor Amazon lowered price by 8%. Maintain competitive position.",
          trigger: "competitor",
          projectedImpact: {
            salesChange: 15,
            revenueChange: 8,
            marginChange: -3,
          },
          competitorData: {
            competitor: "Amazon",
            price: 82.99,
          },
          urgency: "high",
        },
        {
          productId: "2",
          productName: "Smart Fitness Watch",
          currentPrice: 199.99,
          recommendedPrice: 229.99,
          confidence: 92,
          reason: "Holiday season approaching. Historical data shows 23% price elasticity.",
          trigger: "seasonality",
          projectedImpact: {
            salesChange: -5,
            revenueChange: 12,
            marginChange: 18,
          },
          urgency: "medium",
        },
        {
          productId: "3",
          productName: "Organic Cotton T-Shirt",
          currentPrice: 24.99,
          recommendedPrice: 27.99,
          confidence: 78,
          reason: "High demand detected. Low inventory (12 units). Optimize for margin.",
          trigger: "inventory",
          projectedImpact: {
            salesChange: -8,
            revenueChange: 4,
            marginChange: 15,
          },
          urgency: "low",
        },
      ]

      setRecommendations(mockRecommendations)
      setIsAnalyzing(false)
    }, 1500)
  }

  const acceptRecommendation = (id: string) => {
    setRecommendations((prev) => prev.filter((rec) => rec.productId !== id))
    setAcceptedCount((prev) => prev + 1)
  }

  const rejectRecommendation = (id: string) => {
    setRecommendations((prev) => prev.filter((rec) => rec.productId !== id))
    setRejectedCount((prev) => prev + 1)
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case "competitor":
        return <BarChart3 className="h-4 w-4" />
      case "seasonality":
        return <Calendar className="h-4 w-4" />
      case "demand":
        return <TrendingUp className="h-4 w-4" />
      case "inventory":
        return <DollarSign className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            Autonomous Pricing Agent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{recommendations.length}</div>
              <div className="text-sm text-muted-foreground">Active Recommendations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{acceptedCount}</div>
              <div className="text-sm text-muted-foreground">Accepted Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
              <div className="text-sm text-muted-foreground">Rejected Today</div>
            </div>
          </div>

          <Button onClick={generateRecommendations} disabled={isAnalyzing} className="w-full">
            {isAnalyzing ? "Analyzing Market Data..." : "Refresh Analysis"}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <Card key={rec.productId} className="border-l-4 border-l-emerald-500">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{rec.productName}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    {getTriggerIcon(rec.trigger)}
                    <span className="text-sm text-muted-foreground capitalize">{rec.trigger} Trigger</span>
                    <Badge variant={getUrgencyColor(rec.urgency) as any} className="text-xs">
                      {rec.urgency} urgency
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Confidence</div>
                  <div className="text-lg font-semibold">{rec.confidence}%</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pricing" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="impact">Impact</TabsTrigger>
                </TabsList>

                <TabsContent value="pricing" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Current Price</div>
                      <div className="text-xl font-semibold">${rec.currentPrice}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Recommended Price</div>
                      <div className="text-xl font-semibold text-emerald-600">
                        ${rec.recommendedPrice}
                        {rec.recommendedPrice > rec.currentPrice ? (
                          <TrendingUp className="inline h-4 w-4 ml-1 text-green-500" />
                        ) : (
                          <TrendingDown className="inline h-4 w-4 ml-1 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Reasoning</div>
                    <p className="text-sm">{rec.reason}</p>
                  </div>

                  {rec.competitorData && (
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="text-sm font-medium">Competitor Analysis</div>
                      <div className="text-sm text-muted-foreground">
                        {rec.competitorData.competitor}: ${rec.competitorData.price}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="impact" className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Sales Change</span>
                        <span className={rec.projectedImpact.salesChange >= 0 ? "text-green-600" : "text-red-600"}>
                          {rec.projectedImpact.salesChange >= 0 ? "+" : ""}
                          {rec.projectedImpact.salesChange}%
                        </span>
                      </div>
                      <Progress value={Math.abs(rec.projectedImpact.salesChange)} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Revenue Change</span>
                        <span className={rec.projectedImpact.revenueChange >= 0 ? "text-green-600" : "text-red-600"}>
                          {rec.projectedImpact.revenueChange >= 0 ? "+" : ""}
                          {rec.projectedImpact.revenueChange}%
                        </span>
                      </div>
                      <Progress value={Math.abs(rec.projectedImpact.revenueChange)} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Margin Change</span>
                        <span className={rec.projectedImpact.marginChange >= 0 ? "text-green-600" : "text-red-600"}>
                          {rec.projectedImpact.marginChange >= 0 ? "+" : ""}
                          {rec.projectedImpact.marginChange}%
                        </span>
                      </div>
                      <Progress value={Math.abs(rec.projectedImpact.marginChange)} className="h-2" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 mt-4">
                <Button onClick={() => acceptRecommendation(rec.productId)} className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept Recommendation
                </Button>
                <Button onClick={() => rejectRecommendation(rec.productId)} variant="outline" className="flex-1">
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {recommendations.length === 0 && !isAnalyzing && (
          <Card>
            <CardContent className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No pricing recommendations at this time.</p>
              <p className="text-sm text-muted-foreground">The AI agent is monitoring market conditions.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
