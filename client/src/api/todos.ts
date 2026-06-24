import { apiFetch, apiFormData } from './client'
import type { Todo, TodoItem, TodoItemStatus } from '../types'
import {
  buildAddItemPayload,
  buildCreateTodoPayload,
  cloneFormData,
  type AudioFilePayload,
  type DraftTodoItem,
} from '../utils/todoPayload'

export type { AudioFilePayload, DraftTodoItem }

export async function getTodos() {
  const res = await apiFetch<Todo[]>('/todo/getTodos')
  return res.data ?? []
}

export async function getTodo(todoId: string) {
  const res = await apiFetch<Todo>(`/todo/getTodo/${todoId}`)
  return res.data
}

export async function createTodoDocument(
  todoName: string,
  drafts: DraftTodoItem[],
) {
  const { order, files } = buildCreateTodoPayload(drafts)

  const formData = new FormData()
  formData.append('todoName', todoName.trim())
  formData.append('order', JSON.stringify(order))
  files.forEach(({ fieldName, file }) => {
    formData.append(fieldName, file, file.name)
  })

  const res = await apiFormData<{ todo_document: Todo }>(
    '/todo/createTodo',
    formData,
  )
  return res.data?.todo_document
}

export async function updateTodo(
  todoId: string,
  payload: {
    update_item?: TodoItem[]
    new_item?: Omit<TodoItem, '_id'>[]
    deleted_item?: string[]
  },
  files: AudioFilePayload[] = [],
) {
  const formData = new FormData()
  formData.append('update_item', JSON.stringify(payload.update_item ?? []))
  formData.append('new_item', JSON.stringify(payload.new_item ?? []))
  formData.append('deleted_item', JSON.stringify(payload.deleted_item ?? []))

  files.forEach(({ fieldName, file }) => {
    formData.append(fieldName, file, file.name)
  })

  const res = await apiFormData<Todo>(`/todo/updateTodo/${todoId}`, formData)
  return res.data
}

export async function deleteTodo(todoId: string) {
  await apiFetch(`/todo/deleteTodo/${todoId}`, { method: 'POST' })
}

export async function toggleItemStatus(todo: Todo, item: TodoItem) {
  if (!item._id) return todo

  const newStatus: TodoItemStatus =
    item.status === 'DONE' ? 'UPCOMING' : 'DONE'

  return updateTodo(todo._id, {
    update_item: [{ ...item, status: newStatus }],
  })
}

export async function addItemToTodo(todo: Todo, draft: DraftTodoItem) {
  const payload = buildAddItemPayload(todo.items, draft)
  if (!payload) {
    throw new Error('Invalid task details.')
  }

  return updateTodo(todo._id, { new_item: payload.new_item }, payload.files)
}

export async function deleteItemFromTodo(todo: Todo, itemId: string) {
  return updateTodo(todo._id, {
    deleted_item: [itemId],
  })
}

export async function replaceAudioItem(
  todo: Todo,
  item: TodoItem,
  file: File,
) {
  if (!item._id || !item.fieldName) return

  return updateTodo(
    todo._id,
    {
      update_item: [{ ...item, status: item.status }],
    },
    [{ fieldName: item.fieldName, file }],
  )
}

export { cloneFormData }
