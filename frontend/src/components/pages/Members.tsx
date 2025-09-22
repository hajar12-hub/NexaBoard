import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Input } from '../ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Plus, Mail, MoreVertical, UserPlus } from 'lucide-react'
import { members } from '../../data/mockData'

export function Members() {
  const [memberList, setMemberList] = useState(members)
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'away': return 'secondary'
      case 'offline': return 'outline'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'away': return 'Away'
      case 'offline': return 'Offline'
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Member Management</h1>
          <p className="text-muted-foreground">Manage your team and invitations</p>
        </div>
        
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite new member</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" placeholder="email@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setIsInviteOpen(false)}>
                  <Mail className="w-4 h-4 mr-2" />
                  Send invitation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memberList.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                <Button variant="ghost" size="sm" className="p-1">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{member.email}</span>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant={getStatusColor(member.status)}>
                  {getStatusLabel(member.status)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {member.tasksCount} tasks
                </span>
              </div>

              <div className="pt-2 border-t">
                <Button variant="outline" className="w-full">
                  View profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberList.length}</div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {memberList.filter(m => m.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assigned Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {memberList.reduce((acc, member) => acc + member.tasksCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(memberList.reduce((acc, member) => acc + member.tasksCount, 0) / memberList.length)}
            </div>
            <p className="text-xs text-muted-foreground">Tasks per person</p>
          </CardContent>
        </Card>
      </div>

      {/* Task Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Task Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {memberList.map((member) => (
              <div key={member.id} className="flex items-center gap-4">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{member.name}</span>
                    <span className="text-sm text-muted-foreground">{member.tasksCount} tasks</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (member.tasksCount / 20) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}