import React, { useState } from 'react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { useTheme } from '../../contexts/ThemeContext'
import { Sun, Moon, Layers3 } from 'lucide-react'
import { Button } from '../ui/button'

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
  <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
  {/* Gradient sombre */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1c] via-[#0f1a2d] to-[#1b2a40]" />
  
  {/* Overlay luxueux */}
  <div className="absolute inset-0 bg-gradient-to-t from-[#000]/30 to-transparent" />
  
  {/* Grid dorée discrète */}
  <div className="absolute inset-0 
      bg-[linear-gradient(to_right,#ffd7000a_1px,transparent_1px),
          linear-gradient(to_bottom,#ffd7000a_1px,transparent_1px)] 
      bg-[size:40px_40px] opacity-20" />
  
  {/* Contenu */}
  <div className="relative z-10 flex flex-col justify-center px-12 text-primary-foreground">
    <div className="flex items-center gap-3 mb-8">
      <div className="p-3 bg-white/10 rounded-2xl backdrop-blur">
              <Layers3 className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold">NexaBoard</h1>
          </div>
          
          <div className="space-y-6 max-w-md">
            <h2 className="text-4xl font-bold leading-tight">
              Manage your projects with precision
            </h2>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              A modern dashboard for startups to track projects, manage teams, 
              and analyze performance with AI-powered insights.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span className="text-primary-foreground/90">Project Management</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span className="text-primary-foreground/90">Team Collaboration</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span className="text-primary-foreground/90">AI Analytics</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span className="text-primary-foreground/90">Time Tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-32 w-24 h-24 bg-white/5 rounded-full blur-xl" />
        <div className="absolute top-1/2 right-12 w-16 h-16 bg-white/5 rounded-full blur-xl" />
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex flex-col min-h-screen lg:max-w-md xl:max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <div className="lg:hidden flex items-center gap-2">
            <Layers3 className="w-6 h-6" />
            <span className="font-bold">NexaBoard</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="ml-auto"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>
        </div>

        {/* Auth Form */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm">
            {isLogin ? (
              <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 NexaBoard. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}