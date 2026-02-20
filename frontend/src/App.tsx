import React, { useState, useEffect, useCallback } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LoadingScreen } from './components/LoadingScreen'
import { AuthPage } from './components/auth/AuthPage'
import { Sidebar } from './components/Sidebar'
import { Navbar } from './components/Navbar'
import { Dashboard } from './components/pages/Dashboard'
import { Projects } from './components/pages/Projects'
import { Kanban } from './components/pages/Kanban'
import { Members } from './components/pages/Members'
import { Communication } from './components/pages/Communication'
import { Gamification } from './components/pages/Gamification'
import { TimeTracking } from './components/pages/TimeTracking'
import { AIReports } from './components/pages/AIReports'
import { Settings } from './components/pages/Settings'
import { ProtectedRoute } from './components/ProtectedRoute'
import { statsApi } from './services/statsApi'
import './globals.css'

interface SidebarCounts {
  projects: number
  members: number
  messages: number
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [showInitialLoading, setShowInitialLoading] = useState(true)
  const [sidebarCounts, setSidebarCounts] = useState<SidebarCounts | null>(null)
  const { user, isLoading } = useAuth()

  const fetchSidebarCounts = useCallback(async () => {
    if (!user) return
    try {
      const stats = await statsApi.getStats()
      setSidebarCounts({ projects: stats.projects, members: stats.members, messages: stats.messages })
    } catch {
      setSidebarCounts({ projects: 0, members: 0, messages: 0 })
    }
  }, [user])

  useEffect(() => {
    if (user) fetchSidebarCounts()
  }, [user, fetchSidebarCounts])

  // Handle initial loading screen
  const handleLoadingComplete = () => {
    setShowInitialLoading(false)
  }

  // Show initial loading screen only on first visit
  if (showInitialLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading NexaBoard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'projects':
        return (
          <ProtectedRoute requiredRole="member">
            <Projects />
   
          </ProtectedRoute>
        )
      case 'kanban':
        return (
          <ProtectedRoute requiredRole="member">
            <Kanban />
          </ProtectedRoute>
        )
      case 'members':
        return (
          <ProtectedRoute requiredRole="manager">
            <Members />
          </ProtectedRoute>
        )
      case 'communication':
        return (
          <ProtectedRoute requiredRole="member">
            <Communication />
          </ProtectedRoute>
        )
      case 'gamification':
        return (
          <ProtectedRoute requiredRole="member">
            <Gamification />
          </ProtectedRoute>
        )
      case 'time-tracking':
        return (
          <ProtectedRoute requiredRole="member">
            <TimeTracking />
          </ProtectedRoute>
        )
      case 'ai-reports':
        return (
          <ProtectedRoute requiredRole="manager">
            <AIReports />
          </ProtectedRoute>
        )
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="h-screen flex bg-background">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} counts={sidebarCounts} />
      
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <main className="flex-1 overflow-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}