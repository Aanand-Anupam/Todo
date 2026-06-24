import { apiFetch } from './client'

export interface AiInsights {
  summary: string
  aiPowered: boolean
  periodDays: number
  totals: {
    totalTasks: number
    completed: number
    upcoming: number
    missed: number
    completionRate: number
    listsCount: number
  }
  mostProductiveTime: {
    hour: number
    label: string
    completions: number
  } | null
  dailyTrend: Array<{
    date: string
    completed: number
    completionRate: number
  }>
  listBreakdown: Array<{
    todoName: string
    total: number
    completed: number
    completionRate: number
  }>
}

export async function getAiInsights(days = 7) {
  const res = await apiFetch<AiInsights>(`/ai/insights?days=${days}`)
  return res.data
}
