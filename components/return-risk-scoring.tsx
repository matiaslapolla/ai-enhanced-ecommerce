"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Shield, TrendingDown, BarChart3, Package, DollarSign } from "lucide-react"

interface ReturnRiskScore {
  productId: string
  productName: string
  category: string
  price: number
  riskScore: number
  riskLevel: "low" | "medium" | "high"
  factors: {
    sizing: number
    material: number
    price: number
    category: number
    historical: number
  }
  recommendations: string[]
  returnRate: number
  averageCategoryReturn: number
}

interface RiskAnalytics {
  totalProducts: number
  highRiskCount: number
  mediumRiskCount: number
  lowRiskCount: number
  averageReturnRate: number
  potentialSavings: number
}

export default function ReturnRiskScoring() {
  const [products, setProducts] = useState<ReturnRiskScore[]>([])
  const [analytics, setAnalytics] = useState<RiskAnalytics | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<ReturnRiskScore | null>(null)

  useEffect(() => {
    generateRiskScores()
  }, [])

  const generateRiskScores = () => {
    const mockProducts: ReturnRiskScore[] = [
      {
        productId: "1",
        productName: "Premium Leather Jacket",
        category: "Clothing",
        price: 299.99,
        riskScore: 78,
        riskLevel: "high",
        factors: {
          sizing: 85,
          material: 60,
          price: 75,
          category: 80,
          historical: 82,
        },
        recommendations: [
          "Add detailed size chart with measurements",
          "Include material care instructions",
          "Offer virtual try-on feature",
          "Reduce promotion visibility by 20%",
        ],
        returnRate: 18.5,
        averageCategoryReturn: 15.2,
      },
      {
        productId: "2",
        productName: "Wireless Bluetooth Speaker",
        category: "Electronics",
        price: 79.99,
        riskScore: 32,
        riskLevel: "low",
        factors: {
          sizing: 10,
          material: 25,
          price: 40,
          category: 30,
          historical: 28,
        },
        recommendations: [
          "Highlight warranty information",
          "Add audio quality samples",
          "Feature customer reviews prominently",
        ],
        returnRate: 4.2,
        averageCategoryReturn: 8.1,
      },
      {
        productId: "3",
        productName: "Athletic Running Shoes",
        category: "Footwear",
        price: 129.99,
        riskScore: 65,
        riskLevel: "medium",
        factors: {
          sizing: 90,
          material: 45,
          price: 55,
          category: 70,
          historical: 65,
        },
        recommendations: [
          "Implement foot scanning technology",
          "Provide detailed fit guide",
          "Offer free size exchanges",
          "Moderate promotion intensity",
        ],
        returnRate: 12.8,
        averageCategoryReturn: 14.5,
      },
      {
        productId: "4",
        productName: "Stainless Steel Water Bottle",
        category: "Home & Kitchen",
        price: 24.99,
        riskScore: 18,
        riskLevel: "low",
        factors: {
          sizing: 15,
          material: 20,
          price: 15,
          category: 20,
          historical: 20,
        },
        recommendations: [
          "Emphasize durability features",
          "Show capacity comparisons",
          "Highlight eco-friendly benefits",
        ],
        returnRate: 2.1,
        averageCategoryReturn: 3.8,
      },
    ]

    setProducts(mockProducts)

    const mockAnalytics: RiskAnalytics = {
      totalProducts: mockProducts.length,
      highRiskCount: mockProducts.filter((p) => p.riskLevel === "high").length,
      mediumRiskCount: mockProducts.filter((p) => p.riskLevel === "medium").length,
      lowRiskCount: mockProducts.filter((p) => p.riskLevel === "low").length,
      averageReturnRate: mockProducts.reduce((sum, p) => sum + p.returnRate, 0) / mockProducts.length,
      potentialSavings: 15420,
    }

    setAnalytics(mockAnalytics)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
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

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <TrendingDown className="h-4 w-4" />
      case "low":
        return <Shield className="h-4 w-4" />
      default:
        return <BarChart3 className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <div className="text-2xl font-bold">{analytics.totalProducts}</div>
              <div className="text-sm text-muted-foreground">Total Products</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{analytics.highRiskCount}</div>
              <div className="text-sm text-muted-foreground">High Risk</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingDown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">{analytics.mediumRiskCount}</div>
              <div className="text-sm text-muted-foreground">Medium Risk</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{analytics.lowRiskCount}</div>
              <div className="text-sm text-muted-foreground">Low Risk</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-600">${analytics.potentialSavings.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Potential Savings</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              Return Risk Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.productId}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedProduct?.productId === product.productId
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-border hover:bg-muted"
                  }`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">{product.productName}</div>
                      <div className="text-sm text-muted-foreground">
                        {product.category} • ${product.price}
                      </div>
                    </div>
                    <Badge variant={getRiskColor(product.riskLevel) as any} className="flex items-center gap-1">
                      {getRiskIcon(product.riskLevel)}
                      {product.riskLevel}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Risk Score</span>
                      <span className="font-medium">{product.riskScore}/100</span>
                    </div>
                    <Progress value={product.riskScore} className="h-2" />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Return Rate: {product.returnRate}%</span>
                    <span>Category Avg: {product.averageCategoryReturn}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Analysis Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedProduct ? (
              <Tabs defaultValue="factors" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="factors">Risk Factors</TabsTrigger>
                  <TabsTrigger value="recommendations">Actions</TabsTrigger>
                </TabsList>

                <TabsContent value="factors" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">{selectedProduct.productName}</h4>
                    <div className="space-y-3">
                      {Object.entries(selectedProduct.factors).map(([factor, score]) => (
                        <div key={factor}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize">{factor} Risk</span>
                            <span className="font-medium">{score}/100</span>
                          </div>
                          <Progress value={score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-sm font-medium mb-1">Overall Assessment</div>
                    <div className="text-sm text-muted-foreground">
                      This product has a <strong>{selectedProduct.riskLevel}</strong> return risk with a score of{" "}
                      <strong>{selectedProduct.riskScore}/100</strong>. The current return rate of{" "}
                      <strong>{selectedProduct.returnRate}%</strong> is{" "}
                      {selectedProduct.returnRate > selectedProduct.averageCategoryReturn ? "above" : "below"} the
                      category average.
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Recommended Actions</h4>
                    <div className="space-y-2">
                      {selectedProduct.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-muted rounded">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                    <div className="text-sm font-medium text-emerald-800 mb-1">Impact Projection</div>
                    <div className="text-sm text-emerald-700">
                      Implementing these recommendations could reduce return rate by 2-4% and save approximately{" "}
                      <strong>
                        ${Math.round(selectedProduct.price * selectedProduct.returnRate * 0.3).toLocaleString()}
                      </strong>{" "}
                      in return processing costs.
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a product to view detailed risk analysis</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
