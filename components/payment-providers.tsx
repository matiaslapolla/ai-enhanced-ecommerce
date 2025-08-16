"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Smartphone, Globe, AlertCircle, CheckCircle } from "lucide-react"

interface PaymentProvidersProps {
  selectedMethod: string
  onMethodChange: (method: string) => void
  onProcessPayment: (paymentData: any) => Promise<void>
  loading: boolean
}

export function PaymentProviders({ selectedMethod, onMethodChange, onProcessPayment, loading }: PaymentProvidersProps) {
  const [paymentData, setPaymentData] = useState({
    // Credit Card
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    // PayPal
    paypalEmail: "",
    paypalPassword: "",
    // MercadoPago
    mercadopagoEmail: "",
    mercadopagoPassword: "",
    // Additional fields for enhanced flows
    saveCard: false,
    billingAddress: "",
    phoneNumber: "",
  })

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onProcessPayment(paymentData)
  }

  const paymentMethods = [
    {
      id: "stripe",
      name: "Credit Card (Stripe)",
      icon: <CreditCard className="h-5 w-5" />,
      description: "Pay securely with your credit or debit card",
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: <Globe className="h-5 w-5" />,
      description: "Pay with your PayPal account",
    },
    {
      id: "mercadopago",
      name: "MercadoPago",
      icon: <Smartphone className="h-5 w-5" />,
      description: "Pay with MercadoPago",
    },
    {
      id: "apple-pay",
      name: "Apple Pay",
      icon: <Smartphone className="h-5 w-5" />,
      description: "Pay with Touch ID or Face ID",
    },
    {
      id: "google-pay",
      name: "Google Pay",
      icon: <Smartphone className="h-5 w-5" />,
      description: "Pay with Google Pay",
    },
  ]

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

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setPaymentData({ ...paymentData, cardNumber: formatted })
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    setPaymentData({ ...paymentData, expiryDate: formatted })
  }

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Choose Payment Method</Label>
        <div className="grid gap-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedMethod === method.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onClick={() => onMethodChange(method.id)}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">{method.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-foreground">{method.name}</div>
                  <div className="text-sm text-muted-foreground">{method.description}</div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    selectedMethod === method.id ? "border-primary bg-primary" : "border-border"
                  }`}
                >
                  {selectedMethod === method.id && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Forms */}
      <form onSubmit={handlePaymentSubmit} className="space-y-4">
        {selectedMethod === "stripe" && (
          <div className="space-y-4 p-4 border border-border rounded-lg bg-card">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Credit Card Information</h4>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
                required
              />
              {paymentData.cardNumber.length > 4 && (
                <div className="text-xs text-muted-foreground">
                  {paymentData.cardNumber.startsWith("4") && "💳 Visa"}
                  {paymentData.cardNumber.startsWith("5") && "💳 Mastercard"}
                  {paymentData.cardNumber.startsWith("3") && "💳 American Express"}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="text"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={handleExpiryDateChange}
                  maxLength={5}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="text"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                type="text"
                placeholder="John Doe"
                value={paymentData.cardholderName}
                onChange={(e) => setPaymentData({ ...paymentData, cardholderName: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="saveCard"
                checked={paymentData.saveCard}
                onChange={(e) => setPaymentData({ ...paymentData, saveCard: e.target.checked })}
                className="rounded border-border"
              />
              <Label htmlFor="saveCard" className="text-sm">
                Save card for future purchases
              </Label>
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Your payment information is encrypted and secure</span>
            </div>
          </div>
        )}

        {selectedMethod === "paypal" && (
          <div className="space-y-4 p-4 border border-border rounded-lg bg-card">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">PayPal Login</h4>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paypalEmail">PayPal Email</Label>
              <Input
                id="paypalEmail"
                type="email"
                placeholder="your@email.com"
                value={paymentData.paypalEmail}
                onChange={(e) => setPaymentData({ ...paymentData, paypalEmail: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paypalPassword">PayPal Password</Label>
              <Input
                id="paypalPassword"
                type="password"
                placeholder="Enter your PayPal password"
                value={paymentData.paypalPassword}
                onChange={(e) => setPaymentData({ ...paymentData, paypalPassword: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">You'll be redirected to PayPal to complete payment</span>
            </div>
          </div>
        )}

        {selectedMethod === "mercadopago" && (
          <div className="space-y-4 p-4 border border-border rounded-lg bg-card">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">MercadoPago</h4>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mercadopagoEmail">MercadoPago Email</Label>
              <Input
                id="mercadopagoEmail"
                type="email"
                placeholder="your@email.com"
                value={paymentData.mercadopagoEmail}
                onChange={(e) => setPaymentData({ ...paymentData, mercadopagoEmail: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mercadopagoPassword">Password</Label>
              <Input
                id="mercadopagoPassword"
                type="password"
                placeholder="Enter your MercadoPago password"
                value={paymentData.mercadopagoPassword}
                onChange={(e) => setPaymentData({ ...paymentData, mercadopagoPassword: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">Secure payment processing with MercadoPago</span>
            </div>
          </div>
        )}

        {(selectedMethod === "apple-pay" || selectedMethod === "google-pay") && (
          <div className="space-y-4 p-4 border border-border rounded-lg bg-card">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">{selectedMethod === "apple-pay" ? "Apple Pay" : "Google Pay"}</h4>
            </div>

            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground mb-4">
                {selectedMethod === "apple-pay"
                  ? "Use Touch ID, Face ID, or your device passcode to pay"
                  : "Use your fingerprint or device PIN to pay"}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Quick and secure payment</span>
              </div>
            </div>
          </div>
        )}

        {selectedMethod && (
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                Processing Payment...
              </>
            ) : (
              `Pay with ${paymentMethods.find((m) => m.id === selectedMethod)?.name}`
            )}
          </Button>
        )}
      </form>
    </div>
  )
}
