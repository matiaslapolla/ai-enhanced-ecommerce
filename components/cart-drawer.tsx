"use client"

import type React from "react"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag } from "lucide-react"
import { CheckoutModal } from "@/components/checkout-modal"

interface CartDrawerProps {
  children: React.ReactNode
}

export function CartDrawer({ children }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleCheckout = () => {
    setIsOpen(false)
    setIsCheckoutOpen(true)
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart ({getTotalItems()})
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full">
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6">Add some products to get started!</p>
                <Button onClick={() => setIsOpen(false)}>Continue Shopping</Button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto py-6">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 border border-border rounded-lg">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground line-clamp-2 mb-1">{item.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{item.category}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-transparent"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>

                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>

                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-transparent"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cart Summary */}
                <div className="border-t border-border pt-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-foreground">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-foreground">${(getTotalPrice() * 0.08).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span className="text-foreground">Total</span>
                      <span className="text-foreground">${(getTotalPrice() * 1.08).toFixed(2)}</span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    Proceed to Checkout
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </>
  )
}
