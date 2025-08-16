"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, Clock, Sparkles, Calendar } from "lucide-react"

interface DeliveryEstimate {
  minDays: number
  maxDays: number
  confidence: number
  factors: string[]
  estimatedDate: string
  rushAvailable: boolean
  rushDays?: number
}

interface Product {
  id: number
  name: string
  category: string
  weight?: number
  dimensions?: { length: number; width: number; height: number }
}

// AI delivery estimation logic
const generateDeliveryEstimate = async (
  products: Product[],
  destination: string,
  zipCode: string,
): Promise<DeliveryEstimate> => {
  // Simulate AI processing
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const factors: string[] = []
  let baseDays = 3 // Base delivery time

  // Product-based factors
  const hasElectronics = products.some((p) => p.category === "Electronics")
  const hasBulkyItems = products.some((p) => p.category === "Home & Garden")
  const totalWeight = products.reduce((sum, p) => sum + (p.weight || 1), 0)

  if (hasElectronics) {
    baseDays += 1
    factors.push("Electronics require additional handling")
  }

  if (hasBulkyItems) {
    baseDays += 1
    factors.push("Large items need special shipping")
  }

  if (totalWeight > 10) {
    baseDays += 1
    factors.push("Heavy package requires freight shipping")
  }

  // Location-based factors
  const locationFactors: Record<string, { days: number; factor: string }> = {
    "New York": { days: -1, factor: "Major metropolitan area" },
    "Los Angeles": { days: -1, factor: "West coast hub location" },
    Chicago: { days: 0, factor: "Central distribution point" },
    Miami: { days: 1, factor: "Southern region delivery" },
    Seattle: { days: 1, factor: "Pacific Northwest location" },
    Denver: { days: 1, factor: "Mountain region delivery" },
    Alaska: { days: 3, factor: "Remote location requires air transport" },
    Hawaii: { days: 2, factor: "Island delivery via air/sea" },
  }

  const locationFactor = locationFactors[destination]
  if (locationFactor) {
    baseDays += locationFactor.days
    factors.push(locationFactor.factor)
  }

  // ZIP code analysis (mock)
  const zipPrefix = zipCode.substring(0, 2)
  const remoteZipPrefixes = ["99", "96", "97", "85", "86"] // Alaska, Hawaii, Montana, etc.
  if (remoteZipPrefixes.includes(zipPrefix)) {
    baseDays += 2
    factors.push("Remote ZIP code area")
  }

  // Seasonal factors (mock)
  const currentMonth = new Date().getMonth()
  const peakSeasons = [10, 11, 0] // Nov, Dec, Jan
  if (peakSeasons.includes(currentMonth)) {
    baseDays += 1
    factors.push("Peak shipping season")
  }

  // Calculate range
  const minDays = Math.max(1, baseDays - 1)
  const maxDays = baseDays + 2

  // Calculate estimated delivery date
  const estimatedDate = new Date()
  estimatedDate.setDate(estimatedDate.getDate() + Math.ceil((minDays + maxDays) / 2))

  // Confidence based on factors
  const confidence = Math.max(0.6, 0.95 - factors.length * 0.05)

  return {
    minDays,
    maxDays,
    confidence,
    factors: factors.slice(0, 3),
    estimatedDate: estimatedDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    rushAvailable: minDays > 2,
    rushDays: minDays > 2 ? 1 : undefined,
  }
}

interface DeliveryEstimatorProps {
  products: Product[]
  onEstimateUpdate?: (estimate: DeliveryEstimate | null) => void
}

export function DeliveryEstimator({ products, onEstimateUpdate }: DeliveryEstimatorProps) {
  const [destination, setDestination] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [estimate, setEstimate] = useState<DeliveryEstimate | null>(null)
  const [isEstimating, setIsEstimating] = useState(false)

  const handleEstimate = async () => {
    if (!destination || !zipCode || products.length === 0) return

    setIsEstimating(true)
    try {
      const result = await generateDeliveryEstimate(products, destination, zipCode)
      setEstimate(result)
      onEstimateUpdate?.(result)
    } catch (error) {
      console.error("Error estimating delivery:", error)
    } finally {
      setIsEstimating(false)
    }
  }

  useEffect(() => {
    if (estimate) {
      onEstimateUpdate?.(estimate)
    }
  }, [estimate, onEstimateUpdate])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          AI Delivery Estimation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Destination City</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New York">New York, NY</SelectItem>
                <SelectItem value="Los Angeles">Los Angeles, CA</SelectItem>
                <SelectItem value="Chicago">Chicago, IL</SelectItem>
                <SelectItem value="Miami">Miami, FL</SelectItem>
                <SelectItem value="Seattle">Seattle, WA</SelectItem>
                <SelectItem value="Denver">Denver, CO</SelectItem>
                <SelectItem value="Alaska">Anchorage, AK</SelectItem>
                <SelectItem value="Hawaii">Honolulu, HI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>ZIP Code</Label>
            <Input
              placeholder="Enter ZIP code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              maxLength={5}
            />
          </div>
        </div>

        <Button onClick={handleEstimate} disabled={isEstimating || !destination || !zipCode} className="w-full">
          {isEstimating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
              Calculating Delivery Time...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Get AI Delivery Estimate
            </>
          )}
        </Button>

        {estimate && (
          <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Delivery Estimate
              </h4>
              <Badge variant="secondary" className="text-xs">
                {Math.round(estimate.confidence * 100)}% confidence
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">
                  {estimate.minDays === estimate.maxDays
                    ? `${estimate.minDays} days`
                    : `${estimate.minDays}-${estimate.maxDays} days`}
                </div>
                <p className="text-sm text-muted-foreground">Standard delivery</p>
              </div>

              <div className="space-y-2">
                <div className="text-lg font-semibold">{estimate.estimatedDate}</div>
                <p className="text-sm text-muted-foreground">Expected arrival</p>
              </div>
            </div>

            {estimate.rushAvailable && estimate.rushDays && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Rush Delivery Available</span>
                </div>
                <p className="text-sm text-orange-700">
                  Get it in {estimate.rushDays} day{estimate.rushDays > 1 ? "s" : ""} for an additional fee
                </p>
              </div>
            )}

            <div className="space-y-2">
              <h5 className="font-medium text-sm">AI Analysis Factors:</h5>
              <ul className="text-sm space-y-1">
                {estimate.factors.map((factor, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
