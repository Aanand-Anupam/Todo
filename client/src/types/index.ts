export interface Avatar {
  avatar_url: string
  avatar_public_id: string
}

export interface User {
  _id: string
  userName: string
  email?: string
  avatar?: Avatar
  createdAt: string
  updatedAt: string
}

export type TodoItemStatus = 'DONE' | 'MISSED' | 'UPCOMING'

export interface TodoItem {
  _id?: string
  type: 'text' | 'audio'
  content?: string
  url?: string
  public_id?: string
  status: TodoItemStatus
  order: number
  fieldName?: string
}

export interface Todo {
  _id: string
  todoName: string
  items: TodoItem[]
  creator: string
  createdAt: string
  updatedAt: string
  deleteStatus: 'PENDING' | 'ACTIVE' | 'FAILED'
  deletedAt?: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
}

export interface AuthPayload {
  accessToken: string
  createdUser?: User
  user?: User
}

export interface FlatTask {
  todoId: string
  todoName: string
  item: TodoItem
}
