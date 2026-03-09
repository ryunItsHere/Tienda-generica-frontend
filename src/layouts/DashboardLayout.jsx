import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { Outlet, useLocation } from 'react-router-dom'

const PAGE_TITLES = {
  '/dashboard':   'Dashboard',
  '/usuarios':    'Usuarios',
  '/clientes':    'Clientes',
  '/proveedores': 'Proveedores',
  '/productos':   'Productos',
  '/ventas':      'Ventas',
  '/reportes':    'Reportes',
}

export default function DashboardLayout() {
  const { pathname } = useLocation()
  const title = Object.entries(PAGE_TITLES).find(([path]) => pathname.startsWith(path))?.[1] ?? 'Panel'

  return (
    <div className="flex h-screen overflow-hidden bg-surface-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}