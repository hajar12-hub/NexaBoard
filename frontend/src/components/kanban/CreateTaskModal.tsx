import React, { useState } from 'react';
import { tasksApi, TaskPriority, TaskStatus } from '../../services/tasksApi';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface CreateTaskModalProps {
  projectId: string; // La tâche doit être liée à un projet
  onClose: () => void;
  onTaskCreated: () => void; // Pour rafraîchir le Kanban après création
}

export function CreateTaskModal({ projectId, onClose, onTaskCreated }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert("Le titre est obligatoire");

    setIsSubmitting(true);
    try {
      await tasksApi.createTask({
        title,
        description,
        projectId,
        priority,
        status: 'TODO', // Par défaut une nouvelle tâche est en TODO
      });
      
      onTaskCreated(); // Rafraîchir la liste des tâches
      onClose(); // Fermer la modal
    } catch (error) {
      console.error("Erreur lors de la création de la tâche:", error);
      alert("Erreur lors de la création");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg w-full max-w-md shadow-xl border">
        <h2 className="text-xl font-bold mb-4">New task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label></Label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="title of task"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Input 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Details of task..."
            />
          </div>

          <div>
            <Label>Priorité</Label>
            <Select value={priority} onValueChange={(value: TaskPriority) => setPriority(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">LOW</SelectItem>
                <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                <SelectItem value="HIGH">HIGH</SelectItem>
                <SelectItem value="URGENT">URGENT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Créer la tâche"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}