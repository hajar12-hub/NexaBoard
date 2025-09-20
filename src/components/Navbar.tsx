import React from 'react'
import { Search, Bell, MessageSquare, User, Sun, Moon, Monitor, LogOut, Shield } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback } from './ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

export function Navbar() {
  const { theme, setTheme, effectiveTheme } = useTheme()
  const { user, logout } = useAuth()

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'auto'] as const
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }
  
// change the light mode to dark or auto mode
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />
      case 'dark':
        return <Moon className="w-4 h-4" />
      case 'auto':
        return <Monitor className="w-4 h-4" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600 dark:text-red-400'
      case 'manager': return 'text-blue-600 dark:text-blue-400'
      case 'member': return 'text-green-600 dark:text-green-400'
      default: return 'text-muted-foreground'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-3 h-3" />
      case 'manager': return <Shield className="w-3 h-3" />
      case 'member': return <User className="w-3 h-3" />
      default: return <User className="w-3 h-3" />
    }
  }

  return (
    <div className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search..." 
            className="pl-10 bg-input-background border-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={cycleTheme}
          className="p-2"
          title={`Current: ${theme} (${effectiveTheme})`}
        >
          {getThemeIcon()}
        </Button>

        <div className="relative">
          <Button variant="ghost" size="sm" className="p-2">
            <Bell className="w-4 h-4" />
          </Button>
          <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground">
            3
          </Badge>
        </div>

        <div className="relative">
          <Button variant="ghost" size="sm" className="p-2">
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground">
            2
          </Badge>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 p-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  {user?.name.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className={`text-xs flex items-center gap-1 ${getRoleColor(user?.role || '')}`}>
                  {getRoleIcon(user?.role || '')}
                  {user?.role}
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Shield className="mr-2 h-4 w-4" />
              Security
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}