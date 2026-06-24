import { apiFetch, apiFormData, setAccessToken } from './client'
import type { AuthPayload, User } from '../types'

export async function registerUser(data: {
  userName: string
  email: string
  password: string
  avatar?: File
}) {
  const formData = new FormData()
  formData.append('userName', data.userName)
  formData.append('email', data.email)
  formData.append('password', data.password)
  if (data.avatar) {
    formData.append('avatar', data.avatar)
  }

  const res = await apiFormData<AuthPayload & { createdUser: User }>(
    '/user/register',
    formData,
  )

  if (res.data?.accessToken) {
    setAccessToken(res.data.accessToken)
  }

  return res.data
}

export async function loginUser(data: {
  userName?: string
  email?: string
  password: string
}) {
  const formData = new FormData()
  if (data.userName) formData.append('userName', data.userName)
  if (data.email) formData.append('email', data.email)
  formData.append('password', data.password)

  const res = await apiFormData<AuthPayload>('/user/login', formData)

  if (res.data?.accessToken) {
    setAccessToken(res.data.accessToken)
  }

  return res.data
}

export async function logoutUser() {
  try {
    await apiFetch('/user/logout', { method: 'POST' })
  } finally {
    setAccessToken(null)
  }
}

export async function refreshToken() {
  const res = await apiFetch<{ accessToken: string }>('/user/refresh')
  if (res.data?.accessToken) {
    setAccessToken(res.data.accessToken)
  }
  return res.data
}
