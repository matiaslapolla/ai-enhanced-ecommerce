"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, AlertTriangle, Star, Package } from "lucide-react"

interface SalesData {
  date: string
  revenue: number
  orders: number
  customers: number
  avgOrderValue: number
}

interface ProductPerformance {
  id: number
  name: string
  category: string
  revenue: number
  unitsSold: number
  stock: number
  trend: "up" | "down" | "stable"
  rating: number
}

// Mock sales data
const mockSalesData: SalesData[] = [
  { date: "2024-01-01", revenue: 12500, orders: 85, customers: 72, avgOrderValue: 147 },
  { date: "2024-01-02", revenue: 15200, orders: 98, customers: 89, avgOrderValue: 155 },
  { date: "2024-01-03", revenue: 11800, orders: 76, customers: 68, avgOrderValue: 155 },
  { date: "2024-01-04", revenue: 18900, orders: 124, customers: 108, avgOrderValue: 152 },
  { date: "2024-01-05", revenue: 16700, orders: 112, customers: 95, avgOrderValue: 149 },
  { date: "2024-01-06", revenue: 14300, orders: 89, customers: 81, avgOrderValue: 161 },
  { date: "2024-01-07", revenue: 19500, orders: 135, customers: 118, avgOrderValue: 144 },
]

const mockProductPerformance: ProductPerformance[] = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    revenue: 4800,
    unitsSold: 60,
    stock: 15,
    trend: "up",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Organic Cotton T-Shirt",
    category: "Fashion",
    revenue: 1250,
    unitsSold: 50,
    stock: 5,
    trend: "down",
    rating: 4.2,
  },
  {
    id: 3,
    name: "Smart Home Security Camera",
    category: "Electronics",
    revenue: 7500,
    unitsSold: 50,
    stock: 25,
    trend: "up",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Yoga Mat Premium",
    category: "Sports",
    revenue: 2400,
    unitsSold: 60,
    stock: 8,
    trend: "stable",
    rating: 4.4,
  },
  {
    id: 5,
    name: "Coffee Maker Deluxe",
    category: "Home & Garden",
    revenue: 3600,
    unitsSold: 40,
    stock: 12,
    trend: "up",
    rating: 4.6,
  },
]

export function SalesDashboard() {
  const [timeFilter, setTimeFilter] = useState("7d")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredData = useMemo(() => {
    // In a real app, this would filter based on the selected time range
    return mockSalesData
  }, [timeFilter])

  const filteredProducts = useMemo(() => {
    if (categoryFilter === "all") return mockProductPerformance
    return mockProductPerformance.filter((product) => product.category.toLowerCase() === categoryFilter.toLowerCase())
  }, [categoryFilter])

  // Calculate summary metrics
  const totalRevenue = filteredData.reduce((sum, day) => sum + day.revenue, 0)
  const totalOrders = filteredData.reduce((sum, day) => sum + day.orders, 0)
  const totalCustomers = filteredData.reduce((sum, day) => sum + day.customers, 0)
  const avgOrderValue = totalRevenue / totalOrders

  // Calculate trends (comparing last 3 days vs previous 3 days)
  const recentRevenue = filteredData.slice(-3).reduce((sum, day) => sum + day.revenue, 0)
  const previousRevenue = filteredData.slice(-6, -3).reduce((sum, day) => sum + day.revenue, 0)
  const revenueTrend = ((recentRevenue - previousRevenue) / previousRevenue) * 100

  // Actionable insights
  const lowStockProducts = filteredProducts.filter((p) => p.stock <= 10)
  const topPerformers = filteredProducts.sort((a, b) => b.revenue - a.revenue).slice(0, 3)

  const getMetricCard = (title: string, value: string, trend: number, icon: any) => {
    const Icon = icon
    const isPositive = trend > 0

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="flex items-center mt-4">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
            )}
            <span className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {Math.abs(trend).toFixed(1)}%
            </span>
            <span className="text-sm text-muted-foreground ml-1">vs last period</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4">
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="fashion">Fashion</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="home & garden">Home & Garden</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getMetricCard("Total Revenue", `$${totalRevenue.toLocaleString()}`, revenueTrend, DollarSign)}
        {getMetricCard("Total Orders", totalOrders.toString(), 8.2, ShoppingCart)}
        {getMetricCard("Customers", totalCustomers.toString(), 12.5, Users)}
        {getMetricCard("Avg Order Value", `$${avgOrderValue.toFixed(0)}`, -2.1, TrendingUp)}
      </div>

      {/* Actionable Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Restock Alerts ({lowStockProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
                >
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-orange-700 border-orange-300">
                      {product.stock} left
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{product.unitsSold} sold this period</p>
                  </div>
                </div>
              ))}
              {lowStockProducts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">All products are well stocked! 🎉</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{product.category}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{product.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-green-700">${product.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{product.unitsSold} units sold</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Product</th>
                  <th className="text-left p-2 font-medium">Category</th>
                  <th className="text-right p-2 font-medium">Revenue</th>
                  <th className="text-right p-2 font-medium">Units Sold</th>
                  <th className="text-right p-2 font-medium">Stock</th>
                  <th className="text-center p-2 font-medium">Trend</th>
                  <th className="text-center p-2 font-medium">Rating</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                      </div>
                    </td>
                    <td className="p-2 text-sm text-muted-foreground">{product.category}</td>
                    <td className="p-2 text-right font-medium">${product.revenue.toLocaleString()}</td>
                    <td className="p-2 text-right">{product.unitsSold}</td>
                    <td className="p-2 text-right">
                      <span className={product.stock <= 10 ? "text-orange-600 font-medium" : ""}>{product.stock}</span>
                    </td>
                    <td className="p-2 text-center">
                      {product.trend === "up" && <TrendingUp className="h-4 w-4 text-green-600 mx-auto" />}
                      {product.trend === "down" && <TrendingDown className="h-4 w-4 text-red-600 mx-auto" />}
                      {product.trend === "stable" && <div className="w-4 h-0.5 bg-gray-400 mx-auto" />}
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
