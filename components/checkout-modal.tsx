"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { PaymentProviders } from "@/components/payment-providers"
import { DeliveryEstimator } from "@/components/delivery-estimator"
import { ShippingProviderSelector } from "@/components/shipping-provider-selector"
import { MultiCurrencySelector, useCurrency } from "@/components/multi-currency-selector"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { MapPin, User, Check, AlertTriangle, X } from "lucide-react"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
  provider?: string
  message?: string
  retryable?: boolean
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, getTotalPrice, clearCart } = useCart()
  const { formatPrice } = useCurrency()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [shippingCost, setShippingCost] = useState(0)
  const [deliveryEstimate, setDeliveryEstimate] = useState<any>(null)
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  })

  const simulatePaymentProcessing = async (paymentData: any): Promise<PaymentResult> => {
    console.log("[v0] Starting payment simulation with enhanced scenarios")

    const scenarios = [
      { success: true, probability: 0.75, message: "Payment processed successfully" },
      { success: true, probability: 0.1, message: "Payment approved after verification", delay: 3000 },
      { success: false, error: "Insufficient funds", probability: 0.04, retryable: true },
      { success: false, error: "Card declined by issuer", probability: 0.03, retryable: true },
      { success: false, error: "Expired card", probability: 0.02, retryable: true },
      { success: false, error: "Invalid CVV", probability: 0.02, retryable: true },
      { success: false, error: "Network timeout", probability: 0.02, retryable: true },
      { success: false, error: "Fraud detection triggered", probability: 0.01, retryable: false },
      { success: false, error: "Payment processor unavailable", probability: 0.01, retryable: true },
    ]

    let methodMultiplier = 1
    if (selectedPaymentMethod === "paypal") methodMultiplier = 0.95
    if (selectedPaymentMethod === "apple-pay" || selectedPaymentMethod === "google-pay") methodMultiplier = 0.98
    if (selectedPaymentMethod === "mercadopago") methodMultiplier = 0.92

    const random = Math.random() * methodMultiplier
    let cumulativeProbability = 0
    let selectedScenario = scenarios[0]

    for (const scenario of scenarios) {
      cumulativeProbability += scenario.probability
      if (random <= cumulativeProbability) {
        selectedScenario = scenario
        break
      }
    }

    const baseDelay = selectedScenario.delay || 1500
    const methodDelay =
      {
        stripe: 1000,
        paypal: 2500,
        mercadopago: 2000,
        "apple-pay": 800,
        "google-pay": 800,
      }[selectedPaymentMethod] || 1500

    await new Promise((resolve) => setTimeout(resolve, baseDelay + methodDelay + Math.random() * 1000))

    if (selectedScenario.success) {
      const transactionId = `${selectedPaymentMethod.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      console.log(`[v0] Payment successful! Transaction ID: ${transactionId}`)

      return {
        success: true,
        transactionId,
        provider: selectedPaymentMethod,
        message: selectedScenario.message,
      }
    } else {
      console.log(`[v0] Payment failed: ${selectedScenario.error}`)
      return {
        success: false,
        error: selectedScenario.error,
        provider: selectedPaymentMethod,
        retryable: selectedScenario.retryable,
      }
    }
  }

  const handlePaymentSubmit = async (paymentData: any) => {
    setLoading(true)

    try {
      console.log(`[v0] Processing payment with ${selectedPaymentMethod}:`, paymentData)

      const result = await simulatePaymentProcessing(paymentData)
      setPaymentResult(result)

      if (result.success) {
        console.log(`[v0] Payment successful! Transaction ID: ${result.transactionId}`)
        setOrderComplete(true)
        clearCart()
      } else {
        console.log(`[v0] Payment failed: ${result.error}`)
      }
    } catch (error) {
      console.error("[v0] Payment processing error:", error)
      setPaymentResult({
        success: false,
        error: "An unexpected error occurred",
        provider: selectedPaymentMethod,
        retryable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOrderComplete(false)
    setPaymentResult(null)
    setSelectedPaymentMethod("")
    onClose()
  }

  const handleRetryPayment = () => {
    setPaymentResult(null)
    setSelectedPaymentMethod("")
  }

  const handleShippingSelection = (option: any) => {
    setShippingCost(option ? option.cost : 0)
  }

  const cartProducts = items.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    weight: 1,
  }))

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.08
  const total = subtotal + shippingCost + tax

  if (orderComplete && paymentResult?.success) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-6">Thank you for your purchase. Your order has been confirmed.</p>

            <div className="space-y-4 mb-6">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-mono font-semibold">#ECO-{Date.now().toString().slice(-6)}</p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <p className="font-semibold text-sm font-mono">{paymentResult.transactionId}</p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-semibold capitalize">{paymentResult.provider?.replace("-", " ")}</p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="font-semibold">{formatPrice(total)}</p>
              </div>

              {deliveryEstimate && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Expected Delivery</p>
                  <p className="font-semibold">{deliveryEstimate.estimatedDate}</p>
                </div>
              )}
            </div>

            <Button onClick={handleClose} className="w-full">
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (paymentResult && !paymentResult.success) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Payment Failed</h2>
            <p className="text-muted-foreground mb-6">
              {paymentResult.retryable
                ? "We couldn't process your payment. Please try again or use a different payment method."
                : "This payment cannot be retried. Please contact support if you believe this is an error."}
            </p>

            <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-lg mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="font-semibold text-destructive">Error Details</span>
              </div>
              <p className="text-sm text-destructive">{paymentResult.error}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Payment method: {paymentResult.provider?.replace("-", " ")}
              </p>
              <p className="text-xs text-muted-foreground">Transaction ID: TXN_FAILED_{Date.now()}</p>
            </div>

            <div className="space-y-3">
              {paymentResult.retryable && (
                <Button onClick={handleRetryPayment} className="w-full">
                  Try Different Payment Method
                </Button>
              )}
              <Button variant="outline" onClick={handleClose} className="w-full bg-transparent">
                {paymentResult.retryable ? "Cancel Order" : "Close"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Checkout</DialogTitle>
            <MultiCurrencySelector />
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Contact Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Shipping Address</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <DeliveryEstimator products={cartProducts} onEstimateUpdate={setDeliveryEstimate} />

            <ShippingProviderSelector
              destination={`${formData.city}, ${formData.state}`}
              totalWeight={items.reduce((sum, item) => sum + item.quantity, 0)}
              onSelectionChange={handleShippingSelection}
            />

            <PaymentProviders
              selectedMethod={selectedPaymentMethod}
              onMethodChange={setSelectedPaymentMethod}
              onProcessPayment={handlePaymentSubmit}
              loading={loading}
            />
          </div>

          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-lg space-y-4">
              <h3 className="font-semibold">Order Summary</h3>

              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-foreground">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">{shippingCost > 0 ? formatPrice(shippingCost) : "Free"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="text-foreground">{formatPrice(tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
