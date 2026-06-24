import { Link } from 'react-router-dom'

export function Footer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <footer className="border-t border-zinc-200 px-8 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-zinc-400 md:flex-row">
          <span className="font-semibold tracking-wide text-zinc-900 uppercase">
            Do2Done AI
          </span>
          <div className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Help</span>
          </div>
          <span>© 2024 Do2Done AI. Designed for Focus.</span>
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-zinc-400 md:flex-row">
        <div>
          <p className="font-semibold tracking-wide text-zinc-900 uppercase">
            Do2Done AI
          </p>
          <p className="mt-1">© 2024 Do2Done AI. Designed for Focus.</p>
        </div>
        <div className="flex gap-6">
          <Link to="#" className="hover:text-zinc-700">
            Privacy
          </Link>
          <Link to="#" className="hover:text-zinc-700">
            Terms
          </Link>
          <Link to="#" className="hover:text-zinc-700">
            API
          </Link>
          <Link to="#" className="hover:text-zinc-700">
            Twitter
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="tracking-wider text-zinc-500 uppercase">
            Systems Operational
          </span>
        </div>
      </div>
    </footer>
  )
}
