import { useRef, useState } from 'react'
import type { FlatTask } from '../../types'
import { AudioTaskInput } from './AudioTaskInput'

interface AudioTaskCardContentProps {
  task: FlatTask
  isDone: boolean
  onReplace?: (file: File) => Promise<void>
}

export function AudioTaskCardContent({
  task,
  isDone,
  onReplace,
}: AudioTaskCardContentProps) {
  const [replacing, setReplacing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const replaceFileRef = useRef<File | null>(null)

  const handleReplace = async () => {
    if (!replaceFileRef.current || !onReplace) return
    setUploading(true)
    setError('')
    try {
      await onReplace(replaceFileRef.current)
      setReplacing(false)
      replaceFileRef.current = null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to replace audio')
    } finally {
      setUploading(false)
    }
  }

  if (replacing) {
    return (
      <div className="space-y-3">
        <AudioTaskInput
          onFileReady={(file) => {
            replaceFileRef.current = file
          }}
          disabled={uploading}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setReplacing(false)
              replaceFileRef.current = null
              setError('')
            }}
            className="text-xs text-zinc-500 hover:text-black"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleReplace}
            disabled={!replaceFileRef.current || uploading}
            className="text-xs font-medium text-black hover:underline disabled:opacity-40"
          >
            {uploading ? 'Saving...' : 'Save replacement'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={isDone ? 'opacity-60' : ''}>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium tracking-wider text-zinc-400 uppercase">
          Voice note
        </span>
        {!isDone && onReplace && (
          <button
            type="button"
            onClick={() => setReplacing(true)}
            className="text-xs text-zinc-400 hover:text-black"
          >
            Replace
          </button>
        )}
      </div>
      {task.item.url ? (
        <audio
          controls
          src={task.item.url}
          className="mt-2 h-8 w-full max-w-md"
          preload="metadata"
        />
      ) : (
        <p className="mt-1 text-sm text-zinc-400 italic">Audio unavailable</p>
      )}
    </div>
  )
}
