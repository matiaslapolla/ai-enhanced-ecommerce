"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Smartphone, CreditCard, Zap } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useCurrency } from "@/components/multi-currency-selector"
import { PaymentFlowModal } from "@/components/payment-flow-modal"

interface ExpressCheckoutProps {
  productId: string
  productName: string
  productPrice: number
  onCheckoutComplete?: (result: any) => void
}

export function ExpressCheckout({ productId, productName, productPrice, onCheckoutComplete }: ExpressCheckoutProps) {
  const { addItem } = useCart()
  const { formatPrice } = useCurrency()
  const [loading, setLoading] = useState<string | null>(null)
  const [showPaymentFlow, setShowPaymentFlow] = useState(false)

  const handlePaymentFlowComplete = (result: any) => {
    setShowPaymentFlow(false)
    onCheckoutComplete?.(result)
  }

  const handleExpressCheckout = async (method: string) => {
    setLoading(method)

    try {
      // Add item to cart temporarily
      addItem({
        id: productId,
        name: productName,
        price: productPrice,
        image: `/placeholder.svg?height=100&width=100&query=${productName}`,
        category: "Product",
        quantity: 1,
      })

      // Simulate express payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1500))

      // Simulate success/failure
      const success = Math.random() > 0.15 // 85% success rate

      if (success) {
        const result = {
          success: true,
          transactionId: `EXPRESS_${method.toUpperCase()}_${Date.now()}`,
          method,
          amount: productPrice,
        }

        console.log(`[v0] Express checkout successful:`, result)
        onCheckoutComplete?.(result)
      } else {
        throw new Error("Express payment failed")
      }
    } catch (error) {
      console.log(`[v0] Express checkout failed:`, error)
      onCheckoutComplete?.({ success: false, error: "Express payment failed" })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">Express Checkout</span>
      </div>

      <Button className="w-full mb-2" onClick={() => setShowPaymentFlow(true)} disabled={loading !== null}>
        <CreditCard className="h-4 w-4 mr-2" />
        Buy Now
      </Button>

      <div className="grid grid-cols-1 gap-2">
        <Button
          variant="outline"
          className="w-full bg-black text-white hover:bg-gray-800 border-black"
          onClick={() => handleExpressCheckout("apple-pay")}
          disabled={loading !== null}
        >
          {loading === "apple-pay" ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          ) : (
            <Smartphone className="h-4 w-4 mr-2" />
          )}
          Pay with Apple Pay
        </Button>

        <Button
          variant="outline"
          className="w-full bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
          onClick={() => handleExpressCheckout("google-pay")}
          disabled={loading !== null}
        >
          {loading === "google-pay" ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          ) : (
            <Smartphone className="h-4 w-4 mr-2" />
          )}
          Pay with Google Pay
        </Button>

        <Button
          variant="outline"
          className="w-full bg-yellow-400 text-black hover:bg-yellow-500 border-yellow-400"
          onClick={() => handleExpressCheckout("paypal-express")}
          disabled={loading !== null}
        >
          {loading === "paypal-express" ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2" />
          ) : (
            <CreditCard className="h-4 w-4 mr-2" />
          )}
          PayPal Express
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Skip the cart and checkout instantly with {formatPrice(productPrice)}
      </p>

      <PaymentFlowModal
        isOpen={showPaymentFlow}
        onClose={() => setShowPaymentFlow(false)}
        product={{
          id: productId,
          name: productName,
          price: productPrice,
          image: `/placeholder.svg?height=100&width=100&query=${productName}`,
        }}
        onPaymentComplete={handlePaymentFlowComplete}
      />
    </div>
  )
}
