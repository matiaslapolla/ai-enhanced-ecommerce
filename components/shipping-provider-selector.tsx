"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Truck, Clock, Shield, Zap } from "lucide-react"

interface ShippingOption {
  id: string
  provider: string
  service: string
  cost: number
  estimatedDays: string
  features: string[]
  icon: string
  reliability: number
  tracking: boolean
  insurance: boolean
}

interface ShippingProviderSelectorProps {
  destination?: string
  totalWeight?: number
  onSelectionChange?: (option: ShippingOption | null) => void
}

// Mock shipping providers with realistic options
const generateShippingOptions = (destination = "", totalWeight = 1): ShippingOption[] => {
  const baseOptions: ShippingOption[] = [
    {
      id: "fedex-ground",
      provider: "FedEx",
      service: "Ground",
      cost: 8.99,
      estimatedDays: "3-5 business days",
      features: ["Tracking included", "Signature on delivery"],
      icon: "🚚",
      reliability: 0.95,
      tracking: true,
      insurance: false,
    },
    {
      id: "fedex-express",
      provider: "FedEx",
      service: "Express Saver",
      cost: 24.99,
      estimatedDays: "1-2 business days",
      features: ["Express delivery", "Tracking included", "Insurance up to $100"],
      icon: "⚡",
      reliability: 0.98,
      tracking: true,
      insurance: true,
    },
    {
      id: "dhl-express",
      provider: "DHL",
      service: "Express Worldwide",
      cost: 32.99,
      estimatedDays: "1-3 business days",
      features: ["International express", "Real-time tracking", "Insurance included"],
      icon: "🌍",
      reliability: 0.97,
      tracking: true,
      insurance: true,
    },
    {
      id: "ups-ground",
      provider: "UPS",
      service: "Ground",
      cost: 9.49,
      estimatedDays: "3-5 business days",
      features: ["Reliable ground service", "Tracking included"],
      icon: "📦",
      reliability: 0.94,
      tracking: true,
      insurance: false,
    },
    {
      id: "usps-priority",
      provider: "USPS",
      service: "Priority Mail",
      cost: 7.99,
      estimatedDays: "2-3 business days",
      features: ["Affordable priority", "Tracking included", "Free boxes"],
      icon: "📮",
      reliability: 0.92,
      tracking: true,
      insurance: false,
    },
  ]

  // Add regional providers based on destination
  if (destination.includes("Argentina") || destination.includes("South America")) {
    baseOptions.push({
      id: "correo-argentino",
      provider: "Correo Argentino",
      service: "Encomienda Clásica",
      cost: 12.5,
      estimatedDays: "5-8 business days",
      features: ["Local expertise", "Customs handling", "Door-to-door"],
      icon: "🇦🇷",
      reliability: 0.88,
      tracking: true,
      insurance: false,
    })
  }

  // Adjust costs based on weight
  return baseOptions.map((option) => ({
    ...option,
    cost: option.cost + (totalWeight > 5 ? (totalWeight - 5) * 2 : 0),
  }))
}

export function ShippingProviderSelector({
  destination = "",
  totalWeight = 1,
  onSelectionChange,
}: ShippingProviderSelectorProps) {
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadShippingOptions = async () => {
      setIsLoading(true)
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const options = generateShippingOptions(destination, totalWeight)
      setShippingOptions(options)
      setIsLoading(false)

      // Auto-select the most balanced option (good price/speed ratio)
      const defaultOption = options.find((opt) => opt.service.includes("Ground") || opt.service.includes("Priority"))
      if (defaultOption) {
        setSelectedOption(defaultOption.id)
        onSelectionChange?.(defaultOption)
      }
    }

    loadShippingOptions()
  }, [destination, totalWeight, onSelectionChange])

  const handleSelectionChange = (optionId: string) => {
    setSelectedOption(optionId)
    const option = shippingOptions.find((opt) => opt.id === optionId)
    onSelectionChange?.(option || null)
  }

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 0.95) return "text-green-600"
    if (reliability >= 0.9) return "text-yellow-600"
    return "text-red-600"
  }

  const getServiceIcon = (service: string) => {
    if (service.includes("Express") || service.includes("Overnight")) return <Zap className="h-4 w-4 text-orange-500" />
    if (service.includes("Ground") || service.includes("Standard")) return <Truck className="h-4 w-4 text-blue-500" />
    return <Clock className="h-4 w-4 text-gray-500" />
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Shipping Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Shipping Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedOption} onValueChange={handleSelectionChange} className="space-y-4">
          {shippingOptions.map((option) => (
            <div key={option.id} className="relative">
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{option.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{option.provider}</span>
                          <span className="text-muted-foreground">{option.service}</span>
                          {getServiceIcon(option.service)}
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-muted-foreground">{option.estimatedDays}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">Reliability:</span>
                            <span className={`text-xs font-medium ${getReliabilityColor(option.reliability)}`}>
                              {Math.round(option.reliability * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold">${option.cost.toFixed(2)}</div>
                      <div className="flex gap-1 mt-1">
                        {option.tracking && (
                          <Badge variant="outline" className="text-xs">
                            Tracking
                          </Badge>
                        )}
                        {option.insurance && (
                          <Badge variant="outline" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Insured
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {option.features.map((feature, index) => (
                        <span key={index} className="text-xs text-muted-foreground">
                          • {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </Label>
              </div>

              {selectedOption === option.id && (
                <div className="absolute -top-1 -right-1">
                  <Badge className="bg-primary text-primary-foreground">Selected</Badge>
                </div>
              )}
            </div>
          ))}
        </RadioGroup>

        {selectedOption && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-4 w-4 text-primary" />
              <span className="font-medium text-primary">Shipping Summary</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {(() => {
                const option = shippingOptions.find((opt) => opt.id === selectedOption)
                return option
                  ? `${option.provider} ${option.service} - ${option.estimatedDays} for $${option.cost.toFixed(2)}`
                  : ""
              })()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
