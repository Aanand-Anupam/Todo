import { useMemo, useState } from 'react'
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import {
  deleteItemFromTodo,
  deleteTodo,
  replaceAudioItem,
  toggleItemStatus,
} from '../api/todos'
import { ApiError } from '../api/client'
import { useTodos } from '../context/TodosContext'
import { AddTodoItemModal } from '../components/todos/AddTodoItemModal'
import { TaskCard } from '../components/todos/TaskCard'
import type { TodoItem } from '../types'

export function TodoDocumentPage() {
  const { todoId } = useParams<{ todoId: string }>()
  const navigate = useNavigate()
  const { isLoading, error: loadError, refreshTodos, getTodoById } = useTodos()

  const [error, setError] = useState('')
  const [showAddItem, setShowAddItem] = useState(false)

  const todo = todoId ? getTodoById(todoId) : undefined

  const items = useMemo(
    () =>
      [...(todo?.items ?? [])].sort(
        (a, b) => a.order - b.order,
      ),
    [todo?.items],
  )

  const handleToggle = async (item: TodoItem) => {
    if (!todo || !item._id) return
    try {
      await toggleItemStatus(todo, item)
      await refreshTodos()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update task')
    }
  }

  const handleDeleteItem = async (item: TodoItem) => {
    if (!todo || !item._id) return
    try {
      await deleteItemFromTodo(todo, item._id)
      await refreshTodos()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete task')
    }
  }

  const handleReplaceAudio = async (item: TodoItem, file: File) => {
    if (!todo) return
    await replaceAudioItem(todo, item, file)
    await refreshTodos()
  }

  const handleDeleteDocument = async () => {
    if (!todo) return
    if (!window.confirm(`Delete list "${todo.todoName}"?`)) return
    try {
      await deleteTodo(todo._id)
      await refreshTodos()
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete list')
    }
  }

  if (isLoading) {
    return <p className="text-sm text-zinc-500">Loading lists...</p>
  }

  if (!todoId) {
    return <Navigate to="/dashboard" replace />
  }

  if (!todo) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-200 bg-white px-6 py-12 text-center">
        <p className="text-sm text-zinc-500">This todo list was not found.</p>
        <Link
          to="/dashboard"
          className="mt-4 inline-block text-sm font-medium text-black underline"
        >
          Back to all lists
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-wider text-zinc-400 uppercase">
            Todo document
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-black">
            {todo.todoName}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            {items.length} task{items.length === 1 ? '' : 's'} in this document
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setShowAddItem(true)}
            className="rounded-md border border-zinc-200 px-4 py-2 text-sm text-zinc-700 hover:border-black hover:text-black"
          >
            + Add item
          </button>
          <button
            type="button"
            onClick={handleDeleteDocument}
            className="rounded-md border border-zinc-200 px-4 py-2 text-sm text-zinc-500 hover:border-red-300 hover:text-red-600"
          >
            Delete list
          </button>
        </div>
      </div>

      {(error || loadError) && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error || loadError}
        </p>
      )}

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-200 bg-white px-6 py-12 text-center">
          <p className="text-sm text-zinc-500">No tasks in this list yet.</p>
          <button
            type="button"
            onClick={() => setShowAddItem(true)}
            className="mt-4 text-sm font-medium text-black underline"
          >
            Add the first task
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <TaskCard
              key={item._id}
              item={item}
              onToggle={() => handleToggle(item)}
              onDelete={() => handleDeleteItem(item)}
              onReplaceAudio={(file) => handleReplaceAudio(item, file)}
            />
          ))}
        </ul>
      )}

      {showAddItem && (
        <AddTodoItemModal
          todo={todo}
          onClose={() => setShowAddItem(false)}
          onAdded={refreshTodos}
        />
      )}
    </div>
  )
}

export function DashboardHomePage() {
  const { activeTodos, isLoading, error } = useTodos()
  const [searchParams, setSearchParams] = useSearchParams()
  const showCreateModal = searchParams.get('new') === '1'

  if (isLoading) {
    return <p className="text-sm text-zinc-500">Loading lists...</p>
  }

  if (activeTodos.length === 1 && !showCreateModal) {
    return <Navigate to={`/dashboard/lists/${activeTodos[0]._id}`} replace />
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black">
            Your Todo Lists
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Each document keeps its tasks together. Select a list to open it.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSearchParams({ new: '1' })}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          + New List
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {activeTodos.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-200 bg-white px-6 py-12 text-center">
          <p className="text-sm text-zinc-500">No todo lists yet.</p>
          <button
            type="button"
            onClick={() => setSearchParams({ new: '1' })}
            className="mt-4 text-sm font-medium text-black underline"
          >
            Create your first list
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activeTodos.map((todo) => (
            <Link
              key={todo._id}
              to={`/dashboard/lists/${todo._id}`}
              className="rounded-lg border border-zinc-200 bg-white p-5 transition hover:border-zinc-400"
            >
              <h2 className="text-lg font-semibold text-black">{todo.todoName}</h2>
              <p className="mt-2 text-sm text-zinc-500">
                {todo.items.length} task{todo.items.length === 1 ? '' : 's'}
              </p>
              <p className="mt-4 text-xs font-medium text-black">
                Open list →
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
