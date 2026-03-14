import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { to: '/dashboard',   label: 'Dashboard',   icon: GridIcon,   adminOnly: false },
  { to: '/usuarios',    label: 'Usuarios',    icon: UsersIcon,  adminOnly: true  },
  { to: '/clientes',    label: 'Clientes',    icon: PersonIcon, adminOnly: false },
  { to: '/proveedores', label: 'Proveedores', icon: TruckIcon,  adminOnly: false },
  { to: '/productos',   label: 'Productos',   icon: BoxIcon,    adminOnly: false },
  { to: '/ventas',      label: 'Ventas',      icon: CartIcon,   adminOnly: false },
  { to: '/reportes',    label: 'Reportes',    icon: ChartIcon,  adminOnly: true  },
]

export default function Sidebar() {
  const { logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const itemsVisibles = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin())

  return (
    <aside className="w-60 min-h-screen bg-ink-900 shadow-sidebar flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-ink-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-display font-bold text-sm">S</span>
          </div>
          <span className="font-display font-bold text-white text-lg tracking-tight">StoreAdmin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="px-4 mb-3 text-xs font-semibold text-ink-500 uppercase tracking-widest">Menú principal</p>
        {itemsVisibles.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Rol badge */}
      <div className="px-5 py-3 border-t border-ink-800">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
          isAdmin()
            ? 'bg-accent-500/10 text-accent-400'
            : 'bg-ink-800 text-ink-400'
        }`}>
          <ShieldIcon className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-xs font-semibold">{isAdmin() ? 'ADMIN' : 'EMPLEADO'}</span>
        </div>
      </div>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-ink-800">
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
        >
          <LogoutIcon className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

function GridIcon({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
}
function UsersIcon({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
}
function PersonIcon({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}
function TruckIcon({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 5v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
}
function BoxIcon({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
}
function CartIcon({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
}
function ChartIcon({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" /></svg>
}
function LogoutIcon({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
}
function ShieldIcon({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
}