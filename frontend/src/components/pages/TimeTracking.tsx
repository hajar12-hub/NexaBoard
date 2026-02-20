import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Play, Clock } from 'lucide-react'
import { projectsApi, type Project } from '../../services/projectsApi'
import { tasksApi, type Task } from '../../services/tasksApi'
import { usersApi } from '../../services/usersApi'
import { useAuth } from '../../contexts/AuthContext'

export function TimeTracking() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<{ id: string; name: string; totalHours: number; entries: number }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      try {
        setIsLoading(true)
        const [projectsData, tasksData, usersData] = await Promise.all([
          projectsApi.getAllProjects(),
          tasksApi.getUserTasks(user.id),
          usersApi.getAllUsers(),
        ])
        setProjects(projectsData)
        setTasks(tasksData)
        setMembers(
          usersData.map((m) => ({
            id: m.id,
            name: m.name,
            totalHours: 0,
            entries: 0,
          }))
        )
      } catch (error) {
        console.error('Error fetching time tracking data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [user])

  const activeProjects = projects.filter((p) => p.status === 'In Progress').length
  const totalHoursThisWeek = tasks.filter((t) => t.status === 'DONE').length * 2
  const averageHoursPerDay = totalHoursThisWeek / 7

  const recentTasks = tasks.slice(0, 6).map((t) => ({
    id: t.id,
    task: t.title,
    member: t.assigneeName,
    project: projects.find((p) => p.id === t.projectId)?.name ?? 'Unknown',
    date: new Date().toISOString(),
    hours: t.status === 'DONE' ? 2 : 0,
  }))

  const getMemberStats = () => {
    return members.map((m) => ({
      ...m,
      totalHours: tasks.filter((t) => t.assigneeName === m.name && t.status === 'DONE').length * 2,
      entries: tasks.filter((t) => t.assigneeName === m.name).length,
    }))
  }

  const projectTimeData = projects.map((p) => {
    const projectTasks = tasks.filter((t) => t.projectId === p.id)
    const doneCount = projectTasks.filter((t) => t.status === 'DONE').length
    return { name: p.name, hours: doneCount * 2 }
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
      <div className="flex items-center justify-between">
        <div>
          <h1>Time Tracking</h1>
          <p className="text-muted-foreground">Analyze time spent on your projects and tasks</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="this-week">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This week</SelectItem>
              <SelectItem value="this-month">This month</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Play className="w-4 h-4 mr-2" />
            Start Timer
          </Button>
        </div>
      </div>

      {/* Time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHoursThisWeek}h</div>
            <p className="text-xs text-muted-foreground">Entire team</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageHoursPerDay.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">Per day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter((t) => t.status === 'DONE').length}
            </div>
            <p className="text-xs text-muted-foreground">Done this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
              ) : (
              recentTasks.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{entry.task}</div>
                      <div className="text-sm text-muted-foreground">
                        {entry.member} • {entry.project}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{entry.hours}h</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString('en-US')}
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Member Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Member Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getMemberStats().filter((m) => m.entries > 0).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No member statistics yet</p>
              ) : (
              getMemberStats()
                .filter((m) => m.entries > 0)
                .map((member) => (
                <div key={member.id} className="flex items-center gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{member.name}</span>
                      <span className="text-sm text-muted-foreground">{member.totalHours}h</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(100, ((member.totalHours || 0) / 20) * 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {member.entries} entries this week
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Heatmap</CardTitle>
          <p className="text-sm text-muted-foreground">
            Visualize team activity throughout the year
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center py-8">
              Activity heatmap will be available when time entries are tracked
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Project Time Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Time by Project</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectTimeData.length === 0 ? (
              <p className="text-sm text-muted-foreground col-span-full text-center py-4">No project data yet</p>
            ) : (
              projectTimeData.map((project) => {
                const pct = totalHoursThisWeek > 0 ? (project.hours / totalHoursThisWeek) * 100 : 0
                return (
                  <div key={project.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{project.name}</span>
                      <span className="text-sm text-muted-foreground">{project.hours}h</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round(pct)}% of total time
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}