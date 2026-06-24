import { useEffect, useRef, useState } from 'react'

interface AudioTaskInputProps {
  value?: File | null
  onFileReady: (file: File | null) => void
  disabled?: boolean
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function isAllowedAudioFile(file: File) {
  if (file.type.startsWith('audio/')) return true
  return /\.(mp3|wav|webm|m4a|ogg|aac|flac|mp4)$/i.test(file.name)
}

export function AudioTaskInput({
  value = null,
  onFileReady,
  disabled,
}: AudioTaskInputProps) {
  const [mode, setMode] = useState<'record' | 'upload'>('record')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState('')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (!value) {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
      return
    }

    const url = URL.createObjectURL(value)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [value])

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [])

  const clearAudio = () => {
    setDuration(0)
    onFileReady(null)
  }

  const setFile = (file: File) => {
    setError('')
    onFileReady(file)
  }

  const startRecording = async () => {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4'

      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        streamRef.current = null

        if (chunksRef.current.length === 0) {
          setError('Recording failed. Please try again.')
          setIsRecording(false)
          if (timerRef.current) {
            window.clearInterval(timerRef.current)
            timerRef.current = null
          }
          return
        }

        const blob = new Blob(chunksRef.current, { type: mimeType })
        const ext = mimeType.includes('webm') ? 'webm' : 'm4a'
        const file = new File([blob], `recording-${Date.now()}.${ext}`, {
          type: mimeType.split(';')[0],
        })
        setFile(file)
        setIsRecording(false)
        if (timerRef.current) {
          window.clearInterval(timerRef.current)
          timerRef.current = null
        }
      }

      recorder.start(250)
      setIsRecording(true)
      setDuration(0)
      timerRef.current = window.setInterval(() => {
        setDuration((d) => d + 1)
      }, 1000)
    } catch {
      setError('Microphone access is required to record audio.')
    }
  }

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop()
    }
  }

  const handleUpload = (file: File | null) => {
    if (!file) return
    if (!isAllowedAudioFile(file)) {
      setError('Please select an audio file (MP3, WAV, WebM, M4A).')
      return
    }
    setFile(file)
  }

  return (
    <div className="space-y-4">
      <div className="flex rounded-md border border-zinc-200 p-1">
        <button
          type="button"
          disabled={disabled || isRecording}
          onClick={() => {
            setMode('record')
            if (mode !== 'record') clearAudio()
            setError('')
          }}
          className={`flex-1 rounded py-2 text-xs font-medium transition ${
            mode === 'record'
              ? 'bg-black text-white'
              : 'text-zinc-500 hover:text-black'
          }`}
        >
          Record
        </button>
        <button
          type="button"
          disabled={disabled || isRecording}
          onClick={() => {
            setMode('upload')
            if (mode !== 'upload') clearAudio()
            setError('')
          }}
          className={`flex-1 rounded py-2 text-xs font-medium transition ${
            mode === 'upload'
              ? 'bg-black text-white'
              : 'text-zinc-500 hover:text-black'
          }`}
        >
          Upload
        </button>
      </div>

      {mode === 'record' ? (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-5 text-center">
          {isRecording ? (
            <>
              <p className="text-xs tracking-wider text-red-500 uppercase">
                Recording
              </p>
              <p className="mt-2 text-2xl font-medium text-black tabular-nums">
                {formatDuration(duration)}
              </p>
              <button
                type="button"
                onClick={stopRecording}
                className="mt-4 rounded-md bg-black px-5 py-2 text-xs font-medium text-white hover:bg-zinc-800"
              >
                Stop
              </button>
            </>
          ) : value && previewUrl ? (
            <>
              <audio controls src={previewUrl} className="w-full" />
              <p className="mt-2 truncate text-xs text-zinc-400">{value.name}</p>
              <button
                type="button"
                onClick={clearAudio}
                className="mt-3 text-xs text-zinc-500 hover:text-black"
              >
                Re-record
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-zinc-500">
                Capture a voice note for this task.
              </p>
              <button
                type="button"
                disabled={disabled}
                onClick={startRecording}
                className="mt-4 rounded-md border border-zinc-300 bg-white px-5 py-2 text-xs font-medium text-black hover:border-black disabled:opacity-50"
              >
                Start Recording
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 px-4 py-5 text-center">
          {value && previewUrl ? (
            <>
              <audio controls src={previewUrl} className="w-full" />
              <p className="mt-2 truncate text-xs text-zinc-400">{value.name}</p>
              <button
                type="button"
                onClick={clearAudio}
                className="mt-3 text-xs text-zinc-500 hover:text-black"
              >
                Choose another file
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-zinc-500">
                Upload an audio file (MP3, WAV, M4A, WebM).
              </p>
              <button
                type="button"
                disabled={disabled}
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 rounded-md border border-zinc-300 bg-white px-5 py-2 text-xs font-medium text-black hover:border-black disabled:opacity-50"
              >
                Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.webm,.m4a,.ogg,.aac"
                className="hidden"
                onChange={(e) => handleUpload(e.target.files?.[0] ?? null)}
              />
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
