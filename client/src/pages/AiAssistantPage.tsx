import { useCallback, useEffect, useState } from 'react'
import { getAiInsights, type AiInsights } from '../api/ai'
import { ApiError } from '../api/client'

function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5">
      <p className="text-xs tracking-wider text-zinc-400 uppercase">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-black">{value}</p>
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </div>
  )
}

function formatShortDate(dateKey: string) {
  const date = new Date(`${dateKey}T12:00:00`)
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function AiAssistantPage() {
  const [insights, setInsights] = useState<AiInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadInsights = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAiInsights(7)
      if (data) setInsights(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load insights')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadInsights()
  }, [loadInsights])

  if (loading) {
    return <p className="text-sm text-zinc-500">Analyzing your productivity...</p>
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
        {error}
      </div>
    )
  }

  if (!insights) {
    return (
      <p className="text-sm text-zinc-500">
        No insights available yet. Create a few tasks to get started.
      </p>
    )
  }

  const maxDailyCompleted = Math.max(
    ...insights.dailyTrend.map((day) => day.completed),
    1,
  )

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.2em] text-zinc-400 uppercase">
            AI Assistant
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-black">
            Your productivity snapshot
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Based on the last {insights.periodDays} days of task activity.
          </p>
        </div>
        <button
          type="button"
          onClick={loadInsights}
          className="rounded-md border border-zinc-200 px-4 py-2 text-sm text-zinc-600 hover:border-black hover:text-black"
        >
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg">✦</span>
          <p className="text-sm font-semibold text-black">Summary</p>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] tracking-wider text-zinc-500 uppercase">
            {insights.aiPowered ? 'GPT powered' : 'Local insights'}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-zinc-600">{insights.summary}</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Completion rate"
          value={`${insights.totals.completionRate}%`}
          hint={`${insights.totals.completed} of ${insights.totals.totalTasks} tasks done`}
        />
        <StatCard
          label="Completed"
          value={String(insights.totals.completed)}
          hint="Tasks marked done"
        />
        <StatCard
          label="Upcoming"
          value={String(insights.totals.upcoming)}
          hint="Still in progress"
        />
        <StatCard
          label="Lists"
          value={String(insights.totals.listsCount)}
          hint="Active todo documents"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-black">Most productive time</h2>
          {insights.mostProductiveTime ? (
            <>
              <p className="mt-3 text-3xl font-semibold text-black">
                {insights.mostProductiveTime.label}
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                {insights.mostProductiveTime.completions} completion
                {insights.mostProductiveTime.completions === 1 ? '' : 's'} logged
                in this hour over the last {insights.periodDays} days.
              </p>
            </>
          ) : (
            <p className="mt-3 text-sm text-zinc-500">
              Complete more tasks to reveal your peak focus window.
            </p>
          )}
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-black">Daily completions</h2>
          <div className="mt-4 space-y-3">
            {insights.dailyTrend.map((day) => (
              <div key={day.date}>
                <div className="mb-1 flex items-center justify-between text-xs text-zinc-500">
                  <span>{formatShortDate(day.date)}</span>
                  <span>{day.completed} done</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100">
                  <div
                    className="h-2 rounded-full bg-black transition-all"
                    style={{
                      width: `${(day.completed / maxDailyCompleted) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {insights.listBreakdown.length > 0 && (
        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-black">By list</h2>
          <div className="mt-4 space-y-3">
            {insights.listBreakdown.map((list) => (
              <div
                key={list.todoName}
                className="flex items-center justify-between border-b border-zinc-100 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium text-black">{list.todoName}</p>
                  <p className="text-xs text-zinc-500">
                    {list.completed}/{list.total} completed
                  </p>
                </div>
                <span className="text-sm font-semibold text-black">
                  {list.completionRate}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!insights.aiPowered && (
        <p className="mt-6 text-xs text-zinc-400">
          Add <code className="text-zinc-600">OPENAI_API_KEY</code> to{' '}
          <code className="text-zinc-600">server/.env</code> for GPT-powered summaries.
        </p>
      )}
    </div>
  )
}
