import { Link } from 'react-router-dom'

interface NavbarProps {
  variant?: 'landing' | 'auth' | 'minimal'
}

export function Navbar({ variant = 'landing' }: NavbarProps) {
  if (variant === 'minimal') {
    return (
      <header className="flex items-center justify-between px-8 py-6">
        <Link to="/" className="text-lg font-semibold tracking-tight text-black">
          Do2Done AI
        </Link>
        <Link
          to="/"
          className="text-xs font-medium tracking-[0.2em] text-zinc-500 uppercase hover:text-black"
        >
          Back to site
        </Link>
      </header>
    )
  }

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
      <Link to="/" className="text-lg font-semibold tracking-tight text-black">
        Do2Done AI
      </Link>

      {variant === 'landing' && (
        <nav className="hidden items-center gap-8 text-sm text-zinc-500 md:flex">
          <Link to="/" className="border-b border-black pb-0.5 text-black">
            Product
          </Link>
          <span className="cursor-default">About</span>
        </nav>
      )}

      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="text-sm text-zinc-600 transition hover:text-black"
        >
          Log In
        </Link>
        <Link
          to="/signup"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          Sign Up
        </Link>
      </div>
    </header>
  )
}
