import type { DraftTodoItem } from '../../utils/todoPayload'
import { AudioTaskInput } from '../tasks/AudioTaskInput'

interface DraftItemEditorProps {
  index: number
  draft: DraftTodoItem
  onChange: (draft: DraftTodoItem) => void
  onRemove?: () => void
  showRemove?: boolean
  disabled?: boolean
}

export function DraftItemEditor({
  index,
  draft,
  onChange,
  onRemove,
  showRemove = true,
  disabled,
}: DraftItemEditorProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium tracking-wider text-zinc-400 uppercase">
          Item {index + 1} • {draft.type}
        </span>
        {showRemove && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-zinc-400 hover:text-red-500"
          >
            Remove
          </button>
        )}
      </div>

      {draft.type === 'text' ? (
        <input
          value={draft.content}
          onChange={(e) =>
            onChange({ ...draft, content: e.target.value })
          }
          disabled={disabled}
          className="w-full rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black disabled:opacity-60"
          placeholder="Wake up early"
        />
      ) : (
        <div>
          <p className="mb-2 text-xs text-zinc-500">
            Upload or record audio. Saved as audio1, audio2, … in the request.
          </p>
          <AudioTaskInput
            disabled={disabled}
            value={draft.type === 'audio' ? draft.file : null}
            onFileReady={(file) => {
              if (draft.type === 'audio') {
                onChange({ ...draft, file })
              }
            }}
          />
        </div>
      )}

      <div className="mt-3">
        <label className="mb-1 block text-xs text-zinc-500">status</label>
        <select
          value={draft.status}
          disabled={disabled}
          onChange={(e) => {
            const status = e.target.value as DraftTodoItem['status']
            if (draft.type === 'text') {
              onChange({ ...draft, status })
            } else {
              onChange({ ...draft, status })
            }
          }}
          className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-black disabled:opacity-60"
        >
          <option value="UPCOMING">UPCOMING</option>
          <option value="DONE">DONE</option>
          <option value="MISSED">MISSED</option>
        </select>
      </div>
    </div>
  )
}
