import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getAccessToken, setAccessToken } from '../api/client'
import { loginUser, logoutUser, registerUser } from '../api/auth'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: {
    userName?: string
    email?: string
    password: string
  }) => Promise<void>
  register: (data: {
    userName: string
    email: string
    password: string
    avatar?: File
  }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [isLoading, setIsLoading] = useState(true)

  const persistUser = useCallback((next: User | null) => {
    setUser(next)
    if (next) {
      localStorage.setItem('user', JSON.stringify(next))
    } else {
      localStorage.removeItem('user')
    }
  }, [])

  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      setIsLoading(false)
      return
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(
    async (data: { userName?: string; email?: string; password: string }) => {
      const result = await loginUser(data)
      persistUser(result?.user ?? result?.createdUser ?? null)
    },
    [persistUser],
  )

  const register = useCallback(
    async (data: {
      userName: string
      email: string
      password: string
      avatar?: File
    }) => {
      const result = await registerUser(data)
      persistUser(result?.createdUser ?? null)
    },
    [persistUser],
  )

  const logout = useCallback(async () => {
    await logoutUser()
    setAccessToken(null)
    persistUser(null)
  }, [persistUser])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user && !!getAccessToken(),
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
