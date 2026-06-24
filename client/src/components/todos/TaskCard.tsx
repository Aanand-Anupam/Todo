import type { TodoItem } from '../../types'
import { AudioTaskCardContent } from '../tasks/AudioTaskCardContent'

interface TaskCardProps {
  item: TodoItem
  onToggle: () => void
  onDelete: () => void
  onReplaceAudio?: (file: File) => Promise<void>
}

export function TaskCard({
  item,
  onToggle,
  onDelete,
  onReplaceAudio,
}: TaskCardProps) {
  const isDone = item.status === 'DONE'
  const isAudio = item.type === 'audio'

  return (
    <li className="group flex items-start gap-4 rounded-lg border border-zinc-200 bg-white px-5 py-4 transition hover:border-zinc-300">
      <button
        type="button"
        onClick={onToggle}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
          isDone
            ? 'border-black bg-black text-[10px] text-white'
            : 'border-zinc-300 hover:border-black'
        }`}
      >
        {isDone ? '✓' : ''}
      </button>

      <div className="min-w-0 flex-1">
        {isAudio ? (
          <AudioTaskCardContent
            task={{
              todoId: '',
              todoName: '',
              item,
            }}
            isDone={isDone}
            onReplace={onReplaceAudio}
          />
        ) : (
          <p
            className={`text-sm font-medium ${
              isDone ? 'text-zinc-400 line-through' : 'text-black'
            }`}
          >
            {item.content}
          </p>
        )}
        <p className="mt-1 text-xs text-zinc-400">
          {isAudio ? 'Voice note' : 'Text'}
          {isDone ? ' • Completed' : ` • ${item.status}`}
          {item.order ? ` • order ${item.order}` : ''}
        </p>
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="text-xs text-zinc-300 opacity-0 transition group-hover:opacity-100 hover:text-red-500"
      >
        Delete
      </button>
    </li>
  )
}
