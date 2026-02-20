import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'auto'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  effectiveTheme: 'light' | 'dark' // The actual theme being applied
  toggleTheme: () => void // Toggle between light and dark (for AuthPage, etc.)
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('auto')
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light')

  // Function to get system preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  // Function to determine effective theme
  const determineEffectiveTheme = (currentTheme: Theme): 'light' | 'dark' => {
    if (currentTheme === 'auto') {
      return getSystemTheme()
    }
    return currentTheme
  }

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      setTheme(savedTheme)
    } else {
      // Default to auto if no saved theme
      setTheme('auto')
    }
  }, [])

  // Update effective theme when theme changes or system preference changes
  useEffect(() => {
    const updateEffectiveTheme = () => {
      const newEffectiveTheme = determineEffectiveTheme(theme)
      setEffectiveTheme(newEffectiveTheme)
    }

    updateEffectiveTheme()

    // Listen for system theme changes when in auto mode
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => updateEffectiveTheme()
      
      // Use addEventListener for newer browsers, addListener for older ones
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange)
        return () => mediaQuery.removeListener(handleChange)
      }
    }
  }, [theme])

  // Apply the effective theme to the document
  useEffect(() => {
    localStorage.setItem('theme', theme)
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme, effectiveTheme])

  const toggleTheme = () => {
    setTheme(effectiveTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}