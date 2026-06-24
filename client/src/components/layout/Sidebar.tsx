import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTodos } from '../../context/TodosContext'

export function Sidebar() {
  const { user, logout } = useAuth()
  const { activeTodos, isLoading } = useTodos()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const openCreateModal = () => {
    const params = new URLSearchParams(location.search)
    params.set('new', '1')
    navigate(`${location.pathname}?${params.toString()}`)
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-zinc-200 bg-white">
      <div className="border-b border-zinc-100 px-6 py-8">
        <p className="text-lg font-semibold tracking-tight text-black">
          DO2DONE AI
        </p>
        <p className="mt-1 text-sm text-zinc-400">Productive Morning</p>
      </div>

      <div className="px-4 py-6">
        <button
          type="button"
          onClick={openCreateModal}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          + New List
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3">
        <p className="mb-2 px-3 text-[10px] font-medium tracking-[0.2em] text-zinc-400 uppercase">
          Your Lists
        </p>

        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `relative mb-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
              isActive
                ? 'bg-zinc-100 font-medium text-black'
                : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
            }`
          }
        >
          All Lists
        </NavLink>

        {isLoading ? (
          <p className="px-3 py-2 text-xs text-zinc-400">Loading...</p>
        ) : (
          activeTodos.map((todo) => (
            <NavLink
              key={todo._id}
              to={`/dashboard/lists/${todo._id}`}
              className={({ isActive }) =>
                `relative mb-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
                  isActive
                    ? 'bg-zinc-100 font-medium text-black'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 bg-black" />
                  )}
                  <span className="truncate">{todo.todoName}</span>
                  <span className="ml-auto text-xs text-zinc-400">
                    {todo.items.length}
                  </span>
                </>
              )}
            </NavLink>
          ))
        )}

        <div className="my-4 border-t border-zinc-100" />

        <NavLink
          to="/dashboard/ai"
          className={({ isActive }) =>
            `relative mb-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
              isActive
                ? 'bg-zinc-100 font-medium text-black'
                : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
            }`
          }
        >
          AI Assistant
        </NavLink>
      </nav>

      <div className="border-t border-zinc-100 px-3 py-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-zinc-500 hover:bg-zinc-50 hover:text-black"
        >
          Log Out
        </button>
      </div>

      {user?.avatar?.avatar_url && (
        <div className="border-t border-zinc-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar.avatar_url}
              alt={user.userName}
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-black">
                {user.userName}
              </p>
              <p className="truncate text-xs text-zinc-400">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
