"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertTriangle, Package, TrendingUp, TrendingDown } from "lucide-react"

interface InventoryItem {
  id: number
  name: string
  sku: string
  currentStock: number
  lowStockThreshold: number
  category: string
  lastRestocked: string
  trend: "up" | "down" | "stable"
}

// Mock inventory data
const mockInventory: InventoryItem[] = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    sku: "WBH-001",
    currentStock: 15,
    lowStockThreshold: 10,
    category: "Electronics",
    lastRestocked: "2024-01-10",
    trend: "down",
  },
  {
    id: 2,
    name: "Organic Cotton T-Shirt",
    sku: "OCT-002",
    currentStock: 5,
    lowStockThreshold: 10,
    category: "Fashion",
    lastRestocked: "2024-01-08",
    trend: "down",
  },
  {
    id: 3,
    name: "Smart Home Security Camera",
    sku: "SHC-003",
    currentStock: 25,
    lowStockThreshold: 15,
    category: "Electronics",
    lastRestocked: "2024-01-12",
    trend: "up",
  },
]

export function InventoryTracker() {
  const [inventory, setInventory] = useState(mockInventory)
  const [editingStock, setEditingStock] = useState<number | null>(null)
  const [newStock, setNewStock] = useState("")

  const updateStock = (id: number, stock: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, currentStock: stock, lastRestocked: new Date().toISOString().split("T")[0] } : item,
      ),
    )
    setEditingStock(null)
    setNewStock("")
  }

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) return { status: "Out of Stock", color: "destructive" }
    if (item.currentStock <= item.lowStockThreshold) return { status: "Low Stock", color: "warning" }
    return { status: "In Stock", color: "success" }
  }

  const lowStockItems = inventory.filter((item) => item.currentStock <= item.lowStockThreshold)

  return (
    <div className="space-y-6">
      {/* Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alerts ({lowStockItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="font-medium">{item.name}</span>
                  <Badge variant="outline" className="text-orange-700 border-orange-300">
                    {item.currentStock} left
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventory Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventory.map((item) => {
              const stockStatus = getStockStatus(item)
              return (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          stockStatus.color === "destructive"
                            ? "destructive"
                            : stockStatus.color === "warning"
                              ? "secondary"
                              : "default"
                        }
                      >
                        {stockStatus.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">Last restocked: {item.lastRestocked}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {item.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : item.trend === "down" ? (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      ) : null}

                      {editingStock === item.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={newStock}
                            onChange={(e) => setNewStock(e.target.value)}
                            className="w-20"
                            placeholder={item.currentStock.toString()}
                          />
                          <Button
                            size="sm"
                            onClick={() => updateStock(item.id, Number.parseInt(newStock) || item.currentStock)}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingStock(null)
                              setNewStock("")
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{item.currentStock}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingStock(item.id)
                              setNewStock(item.currentStock.toString())
                            }}
                          >
                            Update
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
