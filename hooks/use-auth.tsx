"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "seller" | "customer"
  permissions: string[]
  isGuest?: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role?: "admin" | "seller" | "customer") => Promise<void>
  signup: (email: string, password: string, name: string, role?: "admin" | "seller" | "customer") => Promise<void>
  logout: () => void
  continueAsGuest: () => void
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ROLE_PERMISSIONS = {
  admin: ["view_admin", "manage_users", "manage_products", "view_analytics", "manage_orders", "fraud_detection"],
  seller: ["manage_products", "view_analytics", "manage_orders", "seo_tools"],
  customer: ["view_products", "manage_cart", "place_orders"],
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("ecommerce_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (email: string, password: string, role: "admin" | "seller" | "customer" = "customer") => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser: User = {
      id: "1",
      email,
      name: email.split("@")[0],
      role,
      permissions: ROLE_PERMISSIONS[role],
    }

    setUser(mockUser)
    localStorage.setItem("ecommerce_user", JSON.stringify(mockUser))
  }

  const signup = async (
    email: string,
    password: string,
    name: string,
    role: "admin" | "seller" | "customer" = "customer",
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      permissions: ROLE_PERMISSIONS[role],
    }

    setUser(mockUser)
    localStorage.setItem("ecommerce_user", JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("ecommerce_user")
  }

  const continueAsGuest = () => {
    const guestUser: User = {
      id: `guest_${Date.now()}`,
      email: "guest@example.com",
      name: "Guest User",
      role: "customer",
      permissions: ROLE_PERMISSIONS.customer,
      isGuest: true,
    }

    setUser(guestUser)
    localStorage.setItem("ecommerce_user", JSON.stringify(guestUser))
  }

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false
  }

  const hasRole = (role: string): boolean => {
    return user?.role === role || false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        continueAsGuest,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
