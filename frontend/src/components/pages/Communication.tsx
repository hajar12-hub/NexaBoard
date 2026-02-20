import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter, 
  Bot, 
  Clock,
  Users,
  Hash,
  MoreVertical,
  Pin,
  Reply
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { messagesApi, type Message as ApiMessage } from '../../services/messagesApi'
import { projectsApi } from '../../services/projectsApi'
import { usersApi } from '../../services/usersApi'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: string
  content: string
  timestamp: Date
  projectId?: string
  projectName?: string
  type: 'message' | 'decision' | 'announcement'
}

interface AIInsight {
  id: string
  title: string
  summary: string
  timestamp: Date
  decisions: string[]
  participants: string[]
  projectsDiscussed: string[]
}

const mockAIInsights: AIInsight[] = [
  {
    id: '1',
    title: 'Daily Discussion Summary',
    summary: '3 key decisions made today: Deployment scheduled for Friday, Q4 budget approved, design system updates prioritized.',
    timestamp: new Date(),
    decisions: [
      'Mobile app deployment scheduled for Friday',
      'Q4 budget allocation approved',
      'Design system updates prioritized for next sprint'
    ],
    participants: ['Alex Johnson', 'Sarah Wilson', 'Mike Chen', 'Emma Davis'],
    projectsDiscussed: ['Mobile App Redesign', 'Budget Planning', 'Design System']
  },
  {
    id: '2',
    title: 'Weekly Communication Trends',
    summary: 'Increased activity on Mobile App project with 15 messages. Team collaboration up 23% from last week.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    decisions: [
      'API integration approach finalized',
      'Testing protocol established'
    ],
    participants: ['Alex Johnson', 'Mike Chen', 'Emma Davis'],
    projectsDiscussed: ['Mobile App Redesign']
  }
]

export function Communication() {
  const [newMessage, setNewMessage] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [projects, setProjects] = useState<{ id: string; name: string; taskCount?: number }[]>([])
  const [users, setUsers] = useState<{ id: string; name: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [msgs, projs, usrs] = await Promise.all([
          messagesApi.getAllMessages(),
          projectsApi.getAllProjects(),
          usersApi.getAllUsers(),
        ])
        setMessages(msgs.map((m: ApiMessage) => ({
          id: m.id,
          senderId: m.senderId,
          senderName: m.senderName,
          senderRole: m.senderRole,
          content: m.content,
          timestamp: new Date(m.createdAt),
          projectId: m.projectId,
          projectName: m.projectName,
          type: (m.type || 'message') as 'message' | 'decision' | 'announcement',
        })))
        setProjects(projs.map((p) => ({ id: p.id, name: p.name })))
        setUsers(usrs.map((u) => ({ id: u.id, name: u.name })))
      } catch (error) {
        console.error('Error fetching communication data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'decision': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'announcement': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
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

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return
    try {
      const sent = await messagesApi.createMessage({ content: newMessage.trim(), type: 'message' })
      setMessages((prev) => [{
        id: sent.id,
        senderId: sent.senderId,
        senderName: sent.senderName,
        senderRole: sent.senderRole,
        content: sent.content,
        timestamp: new Date(sent.createdAt),
        projectId: sent.projectId,
        projectName: sent.projectName,
        type: (sent.type || 'message') as 'message' | 'decision' | 'announcement',
      }, ...prev])
      setNewMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const filteredMessages = messages.filter(message => {
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'decisions' && message.type === 'decision') ||
                         (selectedFilter === 'announcements' && message.type === 'announcement') ||
                         (selectedFilter === 'messages' && message.type === 'message')
    
    const matchesSearch = searchQuery === '' || 
                         message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.projectName?.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>Communication</h1>
        <p className="text-muted-foreground">Team chat and collaboration hub</p>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chat Messages */}
            <div className="lg:col-span-3">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Team Chat
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Search messages..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8 w-64"
                        />
                      </div>
                      <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Messages</SelectItem>
                          <SelectItem value="decisions">Decisions</SelectItem>
                          <SelectItem value="announcements">Announcements</SelectItem>
                          <SelectItem value="messages">Messages</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4">
                      {filteredMessages.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">No messages yet. Start the conversation!</p>
                      ) : (
                      filteredMessages.map((message) => (
                        <div key={message.id} className="group">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">
                                {message.senderName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{message.senderName}</span>
                                <Badge variant="outline" className={`text-xs ${getRoleColor(message.senderRole)}`}>
                                  {message.senderRole}
                                </Badge>
                                {message.type !== 'message' && (
                                  <Badge className={`text-xs ${getMessageTypeColor(message.type)}`}>
                                    {message.type}
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(message.timestamp)}
                                </span>
                              </div>
                              
                              <p className="text-sm text-foreground mb-2">{message.content}</p>
                              
                              {message.projectName && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Hash className="w-3 h-3" />
                                  {message.projectName}
                                </div>
                              )}
                            </div>
                            
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Reply className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreVertical className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                      )}
                    </div>
                  </ScrollArea>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="pr-10"
                      />
                    </div>
                    <Button onClick={handleSendMessage} size="sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Online Users & Quick Actions */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="w-4 h-4" />
                    Online Now
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {users.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No users yet</p>
                  ) : (
                    users.map((u) => (
                      <div key={u.id} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{u.name}</span>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Active Projects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {projects.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No projects yet</p>
                  ) : (
                    projects.map((p) => (
                      <div key={p.id} className="flex items-center gap-2 text-sm">
                        <Hash className="w-3 h-3" />
                        <span>{p.name}</span>
                        {p.taskCount != null && (
                          <Badge variant="outline" className="text-xs">{p.taskCount}</Badge>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockAIInsights.map((insight) => (
              <Card key={insight.id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <Badge variant="outline" className="ml-auto">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTime(insight.timestamp)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{insight.summary}</p>
                  
                  <div>
                    <h4 className="font-medium mb-2">Key Decisions</h4>
                    <ul className="space-y-1">
                      {insight.decisions.map((decision, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          {decision}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-medium">Participants:</span>
                      <p className="text-muted-foreground">{insight.participants.length} members</p>
                    </div>
                    <div>
                      <span className="font-medium">Projects:</span>
                      <p className="text-muted-foreground">{insight.projectsDiscussed.length} discussed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversation History</CardTitle>
              <div className="flex gap-2">
                <Select defaultValue="all-projects">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-projects">All Projects</SelectItem>
                    <SelectItem value="mobile-app">Mobile App Redesign</SelectItem>
                    <SelectItem value="budget">Budget Planning</SelectItem>
                    <SelectItem value="design-system">Design System</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-members">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-members">All Members</SelectItem>
                    <SelectItem value="alex">Alex Johnson</SelectItem>
                    <SelectItem value="sarah">Sarah Wilson</SelectItem>
                    <SelectItem value="mike">Mike Chen</SelectItem>
                    <SelectItem value="emma">Emma Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-l-2 border-muted pl-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Today</span>
                        <Badge>12 messages</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Mobile app deployment discussion, budget approvals</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Yesterday</span>
                        <Badge>8 messages</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Design system updates, API integration status</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Last Week</span>
                        <Badge>34 messages</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Sprint planning, team coordination, project kickoffs</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}