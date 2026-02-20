import React, { createContext, useContext, useState, useEffect } from 'react'

// --- TYPES ---
export type UserRole = 'admin' | 'manager' | 'member'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
}

export interface AuthResult {
  success: boolean
  error?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<AuthResult>
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<AuthResult>
  logout: () => Promise<void>
  hasRole: (requiredRole: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// URL de ton backend Spring Boot
const API_BASE_URL = 'http://localhost:8080/api/auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // --- 1. VÉRIFICATION DE LA SESSION AU DÉMARRAGE ---
  // Permet de rester connecté si on rafraîchit la page (F5)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/me`, {
          method: 'GET',
          credentials: 'include', // Envoie le cookie au serveur
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Session non trouvée ou serveur éteint")
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  // --- 2. LOGIN ---
  const login = async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Requis pour recevoir le cookie HttpOnly
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        return { success: true }
      }
      const errorText = await response.text()
      return { success: false, error: errorText || 'Invalid email or password' }
    } catch (error) {
      console.error("Erreur de connexion au serveur:", error)
      return { success: false, error: 'Server unreachable. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }

  // --- 3. REGISTER ---
  const register = async (email: string, password: string, name: string, role: UserRole = 'member'): Promise<AuthResult> => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }),
        credentials: 'include',
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        return { success: true }
      }
      const errorText = await response.text()
      return { success: false, error: errorText || 'Registration failed' }
    } catch (error) {
      console.error("Erreur d'inscription:", error)
      return { success: false, error: 'Server unreachable. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }

  // --- 4. LOGOUT ---
  const logout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
      })
      // Attendre que la réponse soit bien reçue (le cookie est supprimé par le serveur)
      if (response.ok) {
        // Petit délai pour que le navigateur traite le Set-Cookie de suppression
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    } catch (error) {
      console.error("Erreur lors du logout backend:", error)
    } finally {
      setUser(null)
      // Rechargement complet pour vider tout l'état et forcer la page de login
      window.location.href = '/'
    }
  }

  // --- 5. GESTION DES RÔLES ---
  const hasRole = (requiredRole: UserRole): boolean => {
    if (!user) return false
    
    const roleHierarchy: Record<UserRole, number> = {
      member: 1,
      manager: 2,
      admin: 3
    }
    
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}