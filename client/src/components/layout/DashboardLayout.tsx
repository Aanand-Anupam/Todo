import { Outlet, useSearchParams } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { TodosProvider } from '../../context/TodosContext'
import { CreateTodoDocumentModal } from '../todos/CreateTodoDocumentModal'

function DashboardShell() {
  const [searchParams, setSearchParams] = useSearchParams()
  const showCreateModal = searchParams.get('new') === '1'

  const closeCreateModal = () => {
    searchParams.delete('new')
    setSearchParams(searchParams)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa]">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex flex-1 flex-col">
          <div className="flex-1 px-10 py-8">
            <Outlet />
          </div>
          <Footer compact />
        </main>
      </div>

      {showCreateModal && (
        <CreateTodoDocumentModal onClose={closeCreateModal} />
      )}
    </div>
  )
}

export function DashboardLayout() {
  return (
    <TodosProvider>
      <DashboardShell />
    </TodosProvider>
  )
}
