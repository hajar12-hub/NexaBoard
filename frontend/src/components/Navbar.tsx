import React from 'react'
import { 
  Search, 
  Bell, 
  MessageSquare, 
  User, 
  Sun, 
  Moon, 
  Monitor, 
  LogOut, 
  Shield,
  Settings
} from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback } from './ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu'
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
  
  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="w-4 h-4" />
      case 'dark': return <Moon className="w-4 h-4" />
      default: return <Monitor className="w-4 h-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'text-red-600 dark:text-red-400'
      case 'manager': return 'text-blue-600 dark:text-blue-400'
      case 'member': return 'text-green-600 dark:text-green-400'
      default: return 'text-muted-foreground'
    }
  }

  const getRoleIcon = (role: string) => {
    if (role?.toLowerCase() === 'admin' || role?.toLowerCase() === 'manager') {
      return <Shield className="w-3 h-3" />
    }
    return <User className="w-3 h-3" />
  }

  return (
    <div className="h-16 bg-background border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Barre de recherche (Gauche) */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search..." 
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Actions & Profil (Droite) */}
      <div className="flex items-center gap-3">
        {/* Toggle Thème */}
        <Button
          variant="ghost"
          size="sm"
          onClick={cycleTheme}
          className="p-2"
        >
          {getThemeIcon()}
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="sm" className="p-2">
            <Bell className="w-4 h-4" />
          </Button>
          <Badge className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center p-0 bg-destructive text-white text-[10px]">
            3
          </Badge>
        </div>

        {/* Messages */}
        <div className="relative">
          <Button variant="ghost" size="sm" className="p-2">
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Badge className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center p-0 bg-primary text-white text-[10px]">
            2
          </Badge>
        </div>


        {/* --- MENU PROFIL (CORRIGÉ) --- */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 p-2 h-auto hover:bg-accent cursor-pointer outline-none">
              <Avatar className="w-8 h-8 border">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <div className="text-sm font-semibold leading-none mb-1">{user?.name}</div>
                <div className={`text-[10px] uppercase tracking-wider font-bold flex items-center gap-1 ${getRoleColor(user?.role || '')}`}>
                  {getRoleIcon(user?.role || '')}
                  {user?.role}
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>

          {/* z-[100] pour être sûr qu'il passe devant tout, bg-background pour la visibilité */}
          <DropdownMenuContent align="end" className="w-60 z-[100] bg-background border shadow-xl p-2">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1 p-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="cursor-pointer py-2">
              <User className="mr-2 h-4 w-4" />
              <span>Mon Profil</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="cursor-pointer py-2">
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* BOUTON LOGOUT */}
            <DropdownMenuItem 
              onSelect={async (e) => {
                e.preventDefault()
                await logout()
              }}
              className="text-destructive cursor-pointer py-2 focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="font-semibold">Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}