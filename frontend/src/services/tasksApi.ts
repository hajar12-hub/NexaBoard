const API_BASE_URL = 'http://localhost:8080/api'

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assigneeName: string
  projectId: string
}

export interface TaskRequest {
  title: string
  description: string
  projectId: string
  status?: TaskStatus
  priority?: TaskPriority
  assignedId?: string
}

export const tasksApi = {
  async getTasksByProject(projectId: string): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks/project/${projectId}`, {
      method: 'GET',
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Failed to fetch tasks')
    }
    return response.json()
  },

  async getUserTasks(userId: string): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks/my-tasks?userId=${userId}`, {
      method: 'GET',
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Failed to fetch user tasks')
    }
    return response.json()
  },

  async createTask(task: TaskRequest): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
      credentials: 'include',
    })
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Failed to create task')
    }
    return response.json()
  },

  async updateTask(taskId: string, task: Partial<TaskRequest>): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Failed to update task')
    }
    return response.json()
  },

  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/status?status=${status}`, {
      method: 'PATCH',
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Failed to update task status')
    }
    return response.json()
  },

  async deleteTask(taskId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Failed to delete task')
    }
  },
}


