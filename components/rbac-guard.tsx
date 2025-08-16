"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldX } from "lucide-react"

interface RBACGuardProps {
  children: React.ReactNode
  requiredPermission?: string
  requiredRole?: string
  fallback?: React.ReactNode
}

export function RBACGuard({ children, requiredPermission, requiredRole, fallback }: RBACGuardProps) {
  const { user, hasPermission, hasRole } = useAuth()

  // Check if user is authenticated
  if (!user || user.isGuest) {
    return (
      fallback || (
        <Alert className="border-red-200 bg-red-50">
          <ShieldX className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Authentication required. Please log in to access this feature.
          </AlertDescription>
        </Alert>
      )
    )
  }

  // Check permission if required
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      fallback || (
        <Alert className="border-amber-200 bg-amber-50">
          <ShieldX className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Insufficient permissions. You don't have access to this feature.
          </AlertDescription>
        </Alert>
      )
    )
  }

  // Check role if required
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      fallback || (
        <Alert className="border-amber-200 bg-amber-50">
          <ShieldX className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Access denied. This feature is restricted to {requiredRole} users.
          </AlertDescription>
        </Alert>
      )
    )
  }

  return <>{children}</>
}
