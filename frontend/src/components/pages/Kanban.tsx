import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button'; // Import du bouton
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Plus } from 'lucide-react'; // Icône pour le bouton
import { tasksApi, type Task as ApiTask } from '../../services/tasksApi';
import { useAuth } from '../../contexts/AuthContext';
import { CreateTaskModal } from '../kanban/CreateTaskModal'; // Import de ta modal

export function Kanban() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour la modal
  
  // Note: Dans une version finale, cet ID devrait venir de l'URL ou d'un sélecteur
  const [selectedProject, setSelectedProject] = useState<string>("6595e1dced40e9c91c7a1552"); 

  // On sort fetchTasks du useEffect pour pouvoir le réutiliser après la création d'une tâche
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      // On récupère les tâches du projet sélectionné (plus logique pour un Kanban)
      const data = await tasksApi.getTasksByProject(selectedProject);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedProject]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const columns = [
    { id: "todo", title: "To Do", status: "TODO" as const },
    { id: "in-progress", title: "In Progress", status: "IN_PROGRESS" as const },
    { id: "review", title: "Review", status: "REVIEW" as const },
    { id: "done", title: "Done", status: "DONE" as const },
  ];

  const getTasksByStatus = (status: string) =>
    tasks.filter((task) => task.status === status);

  const getMemberAvatar = (name?: string) => {
    return name?.split(" ").map((n) => n[0]).join("") ?? "UN";
  };

  const handleStatusChange = async (taskId: string, newStatus: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE") => {
    try {
      await tasksApi.updateTaskStatus(taskId, newStatus);
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const getPriorityVariant = (priority?: string) => {
    switch (priority) {
      case 'HIGH':
      case 'URGENT':
        return 'destructive';
      case 'MEDIUM':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Kanban</h1>
          <p className="text-muted-foreground">Manage your tasks with an interactive kanban view</p>
        </div>

        {/* BOUTON POUR AJOUTER UNE TÂCHE */}
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-250px)]">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.status);

          return (
            <div key={column.id} className="flex flex-col bg-muted/30 rounded-lg p-2">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-semibold text-sm uppercase tracking-wider">{column.title}</h3>
                <Badge variant="secondary">{columnTasks.length}</Badge>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-1">
                {columnTasks.map((task) => (
                  <Card 
                    key={task.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary/20"
                    onClick={() => {
                      const currentIndex = columns.findIndex(col => col.status === task.status);
                      const nextIndex = (currentIndex + 1) % columns.length;
                      handleStatusChange(task.id, columns[nextIndex].status);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
                          {task.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge
                            variant={getPriorityVariant(task.priority)}
                            className="text-[10px] px-1.5 py-0"
                          >
                            {task.priority}
                          </Badge>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground">{task.assigneeName}</span>
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-[10px]">
                                {getMemberAvatar(task.assigneeName)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {columnTasks.length === 0 && (
                  <div className="flex items-center justify-center h-24 border-2 border-dashed border-muted rounded-lg">
                    <p className="text-muted-foreground text-xs italic">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DE CRÉATION DE TÂCHE */}
      {isModalOpen && (
        <CreateTaskModal 
          projectId={selectedProject} 
          onClose={() => setIsModalOpen(false)} 
          onTaskCreated={fetchTasks} // Recharge les tâches après création
        />
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}