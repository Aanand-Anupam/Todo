import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getTodos } from '../api/todos'
import { ApiError } from '../api/client'
import type { Todo } from '../types'

interface TodosContextValue {
  todos: Todo[]
  activeTodos: Todo[]
  isLoading: boolean
  error: string
  refreshTodos: () => Promise<void>
  getTodoById: (id: string) => Todo | undefined
}

const TodosContext = createContext<TodosContextValue | null>(null)

export function TodosProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const refreshTodos = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await getTodos()
      setTodos(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load todos')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshTodos()
  }, [refreshTodos])

  const activeTodos = useMemo(
    () => todos.filter((t) => t.deleteStatus !== 'PENDING'),
    [todos],
  )

  const getTodoById = useCallback(
    (id: string) => activeTodos.find((t) => t._id === id),
    [activeTodos],
  )

  const value = useMemo(
    () => ({
      todos,
      activeTodos,
      isLoading,
      error,
      refreshTodos,
      getTodoById,
    }),
    [todos, activeTodos, isLoading, error, refreshTodos, getTodoById],
  )

  return <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
}

export function useTodos() {
  const ctx = useContext(TodosContext)
  if (!ctx) throw new Error('useTodos must be used within TodosProvider')
  return ctx
}
