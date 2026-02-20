import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { projectsApi, type Project } from '../../services/projectsApi'
import { tasksApi, type Task } from '../../services/tasksApi'
import { useAuth } from '../../contexts/AuthContext'

export function Dashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      
      try {
        setIsLoading(true)
        const [userProjects, userTasks] = await Promise.all([
          projectsApi.getUserProjects(user.id),
          tasksApi.getUserTasks(user.id)
        ])
        setProjects(userProjects)
        setTasks(userTasks)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  const activeTasks = tasks.filter(task => task.status === 'IN_PROGRESS' || task.status === 'TODO')
  const globalProgress = projects.length > 0
    ? Math.round(projects.reduce((acc, project) => acc + project.totalProgress, 0) / projects.length)
    : 0
  // Derived from tasks: completed tasks as proxy (real time tracking would need TimeEntry API)
  const completedTasks = tasks.filter(t => t.status === 'DONE').length
  const totalTimeWorked = completedTasks * 2 // Approx 2h per completed task

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted-foreground">Overview of your projects and activities</p>
        </div>
        <Button>New Project</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalProgress}%</div>
            <Progress value={globalProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              Out of {tasks.length} total tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Worked</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTimeWorked}h</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Project Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No projects yet</p>
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{project.name}</span>
                        <span className="text-sm text-muted-foreground">{project.totalProgress}%</span>
                      </div>
                      <Progress value={project.totalProgress} className="h-2" />
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">{project.managerName}</span>
                        <Badge variant={project.status === 'In Progress' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No active tasks</p>
              ) : (
                activeTasks.slice(0, 5).map((task) => {
                  const priorityVariant = task.priority === 'HIGH' || task.priority === 'URGENT' 
                    ? 'destructive' 
                    : task.priority === 'MEDIUM' 
                    ? 'default' 
                    : 'secondary'
                  return (
                    <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {task.assigneeName}
                        </div>
                      </div>
                      <Badge variant={priorityVariant}>
                        {task.priority}
                      </Badge>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}