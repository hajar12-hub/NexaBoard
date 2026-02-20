const API_BASE_URL = 'http://localhost:8080/api'

export interface Project {
  id: string
  name: string
  description: string
  totalProgress: number
  status: string
  managerName: string
  managerId: string
  deadline: string
  teamSize: number
}

export interface ProjectRequest {
  name: string
  managerId: string
  deadline: string
}

export interface ProjectUpdateRequest {
  name?: string
  description?: string
  status?: string
  deadline?: string
}

export const projectsApi = {
  async getAllProjects(): Promise<Project[]> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'GET',
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Failed to fetch projects')
    }
    return response.json()
  },

  async getUserProjects(userId: string): Promise<Project[]> {
    const response = await fetch(`${API_BASE_URL}/projects/my-projects?userId=${userId}`, {
      method: 'GET',
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Failed to fetch user projects')
    }
    return response.json()
  },

  async getProjectById(id: string): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'GET',
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Failed to fetch project')
    }
    return response.json()
  },

  async createProject(project: ProjectRequest): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
      credentials: 'include',
    })
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Failed to create project')
    }
    return response.json()
  },

  async updateProject(id: string, project: ProjectUpdateRequest): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
      credentials: 'include',
    })
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Failed to update project')
    }
    return response.json()
  },

  async deleteProject(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Failed to delete project')
    }
  },
}


