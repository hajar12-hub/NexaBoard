import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { tasks, members } from '../../data/mockData'

const columns = [
  { id: 'todo', title: 'To Do', status: 'todo' },
  { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
  { id: 'review', title: 'Review', status: 'review' },
  { id: 'done', title: 'Done', status: 'done' }
]

export function Kanban() {
  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status)
  }

  const getMemberAvatar = (name: string) => {
    const member = members.find(m => m.name === name)
    return member ? member.name.split(' ').map(n => n[0]).join('') : 'UN'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>Kanban</h1>
        <p className="text-muted-foreground">Manage your tasks with an interactive kanban view</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.status)
          
          return (
            <div key={column.id} className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">{column.title}</h3>
                <Badge variant="secondary">{columnTasks.length}</Badge>
              </div>
              
              <div className="flex-1 space-y-3 overflow-y-auto">
                {columnTasks.map((task) => (
                  <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium leading-tight">{task.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{task.project}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge 
                            variant={
                              task.priority === 'high' ? 'destructive' : 
                              task.priority === 'medium' ? 'default' : 
                              'secondary'
                            }
                            className="text-xs"
                          >
                            {task.priority}
                          </Badge>

                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {getMemberAvatar(task.assignee)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {columnTasks.length === 0 && (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed border-muted rounded-lg">
                    <p className="text-muted-foreground text-sm">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Total tasks: {tasks.length}</span>
          <span className="text-sm text-muted-foreground">
            In progress: {getTasksByStatus('in-progress').length}
          </span>
          <span className="text-sm text-muted-foreground">
            Completed: {getTasksByStatus('done').length}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Drag and drop cards to change their status
        </p>
      </div>
    </div>
  )
}