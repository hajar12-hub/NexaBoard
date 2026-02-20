const API_BASE_URL = 'http://localhost:8080/api'

export interface User {
  id: string
  name: string
  email: string
  role: string
}

export const usersApi = {
  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }
    return response.json()
  },

  async getManagers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users/managers`, {
      method: 'GET',
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Failed to fetch managers')
    }
    return response.json()
  },
}
