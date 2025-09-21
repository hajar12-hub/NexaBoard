import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'admin' | 'manager' | 'member'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<boolean>
  logout: () => void
  hasRole: (requiredRole: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@nexaboard.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: '2',
    email: 'manager@nexaboard.com',
    password: 'manager123',
    name: 'Hajar Azaou',
    role: 'manager'
  },
  {
    id: '3',
    email: 'member@nexaboard.com',
    password: 'member123',
    name: 'Hanan Azaou',
    role: 'member'
  }
]

// Mock JWT token generation
const generateMockJWT = (user: User): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24h expiry
  }))
  const signature = btoa('mock-signature-' + user.id)
  return `${header}.${payload}.${signature}`
}

// Mock JWT validation
const validateMockJWT = (token: string): User | null => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = JSON.parse(atob(parts[1]))
    const now = Math.floor(Date.now() / 1000)
    
    if (payload.exp < now) return null
    
    return {
      id: payload.sub,
      email: payload.email,
      name: mockUsers.find(u => u.id === payload.sub)?.name || 'Unknown',
      role: payload.role
    }
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('nexaboard_token')
    if (token) {
      const userData = validateMockJWT(token)
      setUser(userData)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      const token = generateMockJWT(userWithoutPassword)
      
      localStorage.setItem('nexaboard_token', token)
      setUser(userWithoutPassword)
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const register = async (email: string, password: string, name: string, role: UserRole = 'member'): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check if user already exists
    if (mockUsers.find(u => u.email === email)) {
      setIsLoading(false)
      return false
    }
    
    // Create new user
    const newUser: User & { password: string } = {
      id: String(mockUsers.length + 1),
      email,
      password,
      name,
      role
    }
    
    mockUsers.push(newUser)
    
    const { password: _, ...userWithoutPassword } = newUser
    const token = generateMockJWT(userWithoutPassword)
    
    localStorage.setItem('nexaboard_token', token)
    setUser(userWithoutPassword)
    setIsLoading(false)
    return true
  }

  const logout = () => {
    localStorage.removeItem('nexaboard_token')
    setUser(null)
  }

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