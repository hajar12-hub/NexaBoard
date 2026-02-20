const API_BASE_URL = 'http://localhost:8080/api'

export interface Stats {
  projects: number
  members: number
  messages: number
}

export const statsApi = {
  async getStats(): Promise<Stats> {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: 'GET',
      credentials: 'include',
    })
    if (!response.ok) throw new Error('Failed to fetch stats')
    return response.json()
  },
}
