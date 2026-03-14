import { useAuth } from '../context/AuthContext'

export default function Navbar({ title = 'Dashboard' }) {
  const { user } = useAuth()

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'SA'

  return (
    <header className="h-14 bg-white border-b border-surface-300 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-10">
      <h1 className="font-display font-bold text-ink-800 text-base tracking-tight">{title}</h1>
      <div className="flex items-center gap-4">
        {/* Notificaciones */}
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-500 hover:bg-surface-200 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        {/* Usuario — solo display, sin acción */}
        <div className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-accent-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-ink-700 leading-tight">
              {user?.username || 'Usuario'}
            </span>
            {user?.rol && (
              <span className="text-xs text-ink-400 leading-tight">{user.rol}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}