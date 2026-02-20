import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Input } from '../ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Plus, Edit, Trash2, User, Calendar } from 'lucide-react'
import { projectsApi, type Project } from '../../services/projectsApi'
import { useAuth } from '../../contexts/AuthContext'

export function Projects() {
  const { user } = useAuth()
  const [projectList, setProjectList] = useState<Project[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Form state
  const [projectName, setProjectName] = useState('')
  const [deadline, setDeadline] = useState('')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        const projects = await projectsApi.getAllProjects()
        setProjectList(projects)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await projectsApi.deleteProject(id)
      setProjectList(prev => prev.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
    }
  }

  const handleCreateProject = async () => {
    if (!projectName || !deadline || !user) {
      alert('Please fill in all fields')
      return
    }

    try {
      const newProject = await projectsApi.createProject({
        name: projectName,
        managerId: user.id,
        deadline: deadline,
      })
      setProjectList(prev => [...prev, newProject])
      setIsCreateOpen(false)
      setProjectName('')
      setDeadline('')
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project. Make sure you have manager or admin role.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'default'
      case 'Review': return 'secondary'
      case 'Completed': return 'outline'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Project Management</h1>
          <p className="text-muted-foreground">Create, edit and track the progress of your projects</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new project</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Project name</Label>
                <Input 
                  id="name" 
                  placeholder="Project name" 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="manager">Project manager</Label>
                <Input 
                  id="manager" 
                  value={user?.name || ''} 
                  disabled 
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">You will be assigned as the project manager</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input 
                  id="deadline" 
                  type="date" 
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setIsCreateOpen(false)
                  setProjectName('')
                  setDeadline('')
                }}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject}>
                  Create project
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectList.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No projects yet. Create your first project!</p>
            </div>
          ) : (
            projectList.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="p-1">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Progression</span>
                      <span className="text-sm font-medium">{project.totalProgress}%</span>
                    </div>
                    <Progress value={project.totalProgress} />
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{project.managerName}</span>
                    <Badge variant={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>

                  {project.deadline && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Deadline: {new Date(project.deadline).toLocaleDateString('en-US')}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t">
                    <Button variant="outline" className="w-full">
                      View details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectList.length}</div>
            <p className="text-xs text-muted-foreground">Active projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projectList.length > 0 
                ? Math.round(projectList.reduce((acc, p) => acc + p.totalProgress, 0) / projectList.length)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">All projects combined</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Behind Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">1</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}