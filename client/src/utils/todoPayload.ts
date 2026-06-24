import type { TodoItem, TodoItemStatus } from '../types'

export type AudioFilePayload = { fieldName: string; file: File }

export type DraftTodoItem =
  | {
      id: string
      type: 'text'
      content: string
      status: TodoItemStatus
    }
  | {
      id: string
      type: 'audio'
      file: File | null
      status: TodoItemStatus
    }

export function nextAudioFieldName(existingFieldNames: string[] = []) {
  const used = new Set(existingFieldNames.filter(Boolean))
  let index = 1
  while (used.has(`audio${index}`)) index += 1
  return `audio${index}`
}

export function buildCreateTodoPayload(drafts: DraftTodoItem[]) {
  let audioIndex = 1
  const order: Omit<TodoItem, '_id'>[] = []
  const files: AudioFilePayload[] = []

  drafts.forEach((draft) => {
    if (draft.type === 'text') {
      const content = draft.content.trim()
      if (!content) return
      order.push({
        type: 'text',
        content,
        status: draft.status,
        order: 0,
      })
      return
    }

    if (draft.type === 'audio') {
      if (!draft.file) {
        throw new Error('Each audio task needs a recorded or uploaded file.')
      }
      const fieldName = `audio${audioIndex++}`
      order.push({
        type: 'audio',
        status: draft.status,
        order: 0,
        fieldName,
      })
      files.push({ fieldName, file: draft.file })
    }
  })

  if (order.length === 0) {
    throw new Error('Add at least one task to the list.')
  }

  order.forEach((item, index) => {
    item.order = index + 1
  })

  return { order, files }
}

export function validateDrafts(drafts: DraftTodoItem[]): string | null {
  try {
    buildCreateTodoPayload(drafts)
    return null
  } catch (err) {
    return err instanceof Error ? err.message : 'Invalid task details.'
  }
}

export function buildAddItemPayload(
  existingItems: TodoItem[],
  draft: DraftTodoItem,
) {
  const maxOrder = existingItems.reduce((max, item) => Math.max(max, item.order), 0)
  const orderNum = maxOrder + 1
  const existingFieldNames = existingItems
    .map((item) => item.fieldName)
    .filter((name): name is string => Boolean(name))

  if (draft.type === 'text') {
    const content = draft.content.trim()
    if (!content) return null
    return {
      new_item: [
        {
          type: 'text' as const,
          content,
          status: draft.status,
          order: orderNum,
        },
      ],
      files: [] as AudioFilePayload[],
    }
  }

  if (draft.type === 'audio') {
    if (!draft.file) {
      throw new Error('Audio task requires a file.')
    }
    const fieldName = nextAudioFieldName(existingFieldNames)
    return {
      new_item: [
        {
          type: 'audio' as const,
          status: draft.status,
          order: orderNum,
          fieldName,
        },
      ],
      files: [{ fieldName, file: draft.file }],
    }
  }

  return null
}

export function createDraftId() {
  return `draft_${Math.random().toString(36).slice(2, 9)}`
}

export function createEmptyTextDraft(): DraftTodoItem {
  return {
    id: createDraftId(),
    type: 'text',
    content: '',
    status: 'UPCOMING',
  }
}

export function createEmptyAudioDraft(): DraftTodoItem {
  return {
    id: createDraftId(),
    type: 'audio',
    file: null,
    status: 'UPCOMING',
  }
}

export function cloneFormData(formData: FormData) {
  const clone = new FormData()
  formData.forEach((value, key) => {
    clone.append(key, value)
  })
  return clone
}
