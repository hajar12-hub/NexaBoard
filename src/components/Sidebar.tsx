import React from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  LayoutDashboard, 
  FolderOpen, 
  Kanban, 
  Users, 
  Clock, 
  BarChart3, 
  Settings,
  MessageSquare,
  Trophy,
  Layers3
} from 'lucide-react'

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderOpen, badge: '12' },
  { id: 'kanban', label: 'Kanban', icon: Kanban },
  { id: 'members', label: 'Members', icon: Users, badge: '8' },
  { id: 'communication', label: 'Communication', icon: MessageSquare, badge: '3' },
  { id: 'gamification', label: 'Gamification', icon: Trophy },
  { id: 'time-tracking', label: 'Time Tracking', icon: Clock },
  { id: 'ai-reports', label: 'AI Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings }
]

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Layers3 className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-sidebar-foreground">NexaBoard</h2>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
                onClick={() => onPageChange(item.id)}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge variant={isActive ? "secondary" : "outline"} className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}