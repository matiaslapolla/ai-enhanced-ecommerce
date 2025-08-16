"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Check, ChevronLeft, ChevronRight, CreditCard, Banknote, User, MapPin, Phone, Mail } from "lucide-react"
import { useCurrency } from "@/components/multi-currency-selector"

interface PaymentFlowModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: string
    name: string
    price: number
    image: string
  }
  onPaymentComplete?: (result: any) => void
}

interface BuyerData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  zipCode: string
  country: string
}

interface PaymentData {
  method: "card" | "cash"
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
}

export function PaymentFlowModal({ isOpen, onClose, product, onPaymentComplete }: PaymentFlowModalProps) {
  const { formatPrice } = useCurrency()
  const [currentStep, setCurrentStep] = useState(1)
  const [processing, setProcessing] = useState(false)

  const [buyerData, setBuyerData] = useState<BuyerData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "United States",
  })

  const [paymentData, setPaymentData] = useState<PaymentData>({
    method: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })

  const steps = [
    { number: 1, title: "Buyer Information", icon: User },
    { number: 2, title: "Payment Method", icon: CreditCard },
    { number: 3, title: "Review & Pay", icon: Check },
  ]

  const validateStep1 = () => {
    return (
      buyerData.firstName &&
      buyerData.lastName &&
      buyerData.email &&
      buyerData.phone &&
      buyerData.address &&
      buyerData.city &&
      buyerData.zipCode
    )
  }

  const validateStep2 = () => {
    if (paymentData.method === "cash") return true
    return paymentData.cardNumber && paymentData.expiryDate && paymentData.cvv && paymentData.cardholderName
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePayment = async () => {
    setProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1500))

      // Simulate success/failure (90% success rate)
      const success = Math.random() > 0.1

      if (success) {
        const result = {
          success: true,
          transactionId: `PAY_${Date.now()}`,
          method: paymentData.method,
          amount: product.price,
          buyer: buyerData,
          product: product,
        }

        onPaymentComplete?.(result)
        onClose()
      } else {
        throw new Error("Payment processing failed")
      }
    } catch (error) {
      console.log("[v0] Payment failed:", error)
      onPaymentComplete?.({ success: false, error: "Payment processing failed" })
    } finally {
      setProcessing(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setPaymentData({ ...paymentData, cardNumber: formatted })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.number
            const isCompleted = currentStep > step.number

            return (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isActive
                        ? "border-primary text-primary"
                        : "border-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${isCompleted ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Step 1: Buyer Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Buyer Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={buyerData.firstName}
                    onChange={(e) => setBuyerData({ ...buyerData, firstName: e.target.value })}
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={buyerData.lastName}
                    onChange={(e) => setBuyerData({ ...buyerData, lastName: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={buyerData.email}
                    onChange={(e) => setBuyerData({ ...buyerData, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={buyerData.phone}
                    onChange={(e) => setBuyerData({ ...buyerData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={buyerData.address}
                  onChange={(e) => setBuyerData({ ...buyerData, address: e.target.value })}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={buyerData.city}
                    onChange={(e) => setBuyerData({ ...buyerData, city: e.target.value })}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={buyerData.zipCode}
                    onChange={(e) => setBuyerData({ ...buyerData, zipCode: e.target.value })}
                    placeholder="10001"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={buyerData.country}
                    onChange={(e) => setBuyerData({ ...buyerData, country: e.target.value })}
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </h3>

              <RadioGroup
                value={paymentData.method}
                onValueChange={(value: "card" | "cash") => setPaymentData({ ...paymentData, method: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center gap-2">
                    <Banknote className="h-4 w-4" />
                    Cash on Delivery
                  </Label>
                </div>
              </RadioGroup>

              {paymentData.method === "card" && (
                <div className="space-y-4 mt-6">
                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name *</Label>
                    <Input
                      id="cardholderName"
                      value={paymentData.cardholderName}
                      onChange={(e) => setPaymentData({ ...paymentData, cardholderName: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        value={paymentData.expiryDate}
                        onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentData.method === "cash" && (
                <Card className="mt-6">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Banknote className="h-8 w-8 text-green-600" />
                      <div>
                        <h4 className="font-medium">Cash on Delivery</h4>
                        <p className="text-sm text-muted-foreground">
                          Pay with cash when your order is delivered to your address.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 3: Review & Pay */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Check className="h-5 w-5" />
                Review Your Order
              </h3>

              {/* Product Summary */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Buyer Information Summary */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Delivery Information
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>
                        {buyerData.firstName} {buyerData.lastName}
                      </strong>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {buyerData.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {buyerData.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {buyerData.address}, {buyerData.city}, {buyerData.zipCode}, {buyerData.country}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method Summary */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    {paymentData.method === "card" ? (
                      <CreditCard className="h-4 w-4" />
                    ) : (
                      <Banknote className="h-4 w-4" />
                    )}
                    Payment Method
                  </h4>
                  {paymentData.method === "card" ? (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <span>**** **** **** {paymentData.cardNumber.slice(-4)}</span>
                      <Badge variant="outline">{paymentData.cardholderName}</Badge>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Banknote className="h-5 w-5 text-green-600" />
                      <span>Cash on Delivery</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Total */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatPrice(product.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>{formatPrice(product.price)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              disabled={(currentStep === 1 && !validateStep1()) || (currentStep === 2 && !validateStep2())}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handlePayment} disabled={processing} className="bg-primary hover:bg-primary/90">
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  {paymentData.method === "card" ? "Pay Now" : "Place Order"}
                  <Check className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
