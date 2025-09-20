import React from 'react'
import { useAuth, type UserRole } from '../contexts/AuthContext'
import { Alert, AlertDescription } from './ui/alert'
import { Shield, AlertTriangle } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  fallback?: React.ReactNode
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallback 
}: ProtectedRouteProps) {
  const { user, hasRole } = useAuth()

  if (!user) {
    return null // they should login first 
  }
 
  if (requiredRole && !hasRole(requiredRole)) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="flex items-center justify-center h-full">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            You don't have permission to access this page. Required role: {requiredRole}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return <>{children}</>
}