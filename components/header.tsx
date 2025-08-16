"use client"

import { useState } from "react"
import { ShoppingCart, User, Menu, Settings, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthModal } from "@/components/auth-modal"
import { CartDrawer } from "@/components/cart-drawer"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import Link from "next/link"

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, logout } = useAuth()
  const { getTotalItems } = useCart()

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500"
      case "seller":
        return "bg-blue-500"
      case "customer":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Admin"
      case "seller":
        return "Seller"
      case "customer":
        return "Buyer"
      default:
        return "Guest"
    }
  }

  return (
    <>
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold text-foreground">EcoShop</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/products" className="text-foreground hover:text-primary transition-colors">
                Products
              </Link>
              <Link href="/categories" className="text-foreground hover:text-primary transition-colors">
                Categories
              </Link>
              <Link href="/deals" className="text-foreground hover:text-primary transition-colors">
                Deals
              </Link>
              {user?.role === "seller" && (
                <Link
                  href="/admin"
                  className="text-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <Settings className="h-4 w-4" />
                  Admin Panel
                </Link>
              )}
              <Link href="/about" className="text-foreground hover:text-primary transition-colors">
                About
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <CartDrawer>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {getTotalItems() > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </CartDrawer>

              {user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className={`${getRoleColor(user.role)} text-white text-xs px-2 py-1`}>
                      {getRoleLabel(user.role)}
                    </Badge>
                    <span className="text-sm text-foreground hidden sm:block">
                      {user.isGuest ? "Guest" : user.name}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setIsAuthModalOpen(true)}>
                  <User className="h-5 w-5" />
                </Button>
              )}

              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}
