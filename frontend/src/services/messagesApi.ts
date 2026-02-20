const API_BASE_URL = 'http://localhost:8080/api'

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: string
  content: string
  type: string
  projectId?: string
  projectName?: string
  createdAt: string
}

export interface MessageRequest {
  content: string
  type?: string
  projectId?: string
  projectName?: string
}

export const messagesApi = {
  async getAllMessages(): Promise<Message[]> {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'GET',
      credentials: 'include',
    })
    if (!response.ok) throw new Error('Failed to fetch messages')
    return response.json()
  },

  async getMessagesByProject(projectId: string): Promise<Message[]> {
    const response = await fetch(`${API_BASE_URL}/messages/project/${projectId}`, {
      method: 'GET',
      credentials: 'include',
    })
    if (!response.ok) throw new Error('Failed to fetch messages')
    return response.json()
  },

  async createMessage(msg: MessageRequest): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
      credentials: 'include',
    })
    if (!response.ok) throw new Error('Failed to send message')
    return response.json()
  },
}
