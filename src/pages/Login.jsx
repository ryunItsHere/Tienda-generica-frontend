import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../api/authService'

export default function Login() {
  const [form, setForm]     = useState({ username: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await authService.login(form.username, form.password)
      // data = { token, username, rol, mensaje }
      login(data.token, data.username, data.rol)
      navigate('/dashboard')
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('No se puede conectar con el servidor. Verifica que el backend esté corriendo.')
      } else {
        setError(err.response?.data?.mensaje ?? err.response?.data?.error ?? 'Credenciales incorrectas')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-900 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-accent-500 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-jade-500 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-amber-500 blur-2xl" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            color: 'white',
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 rounded-xl bg-accent-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-display font-bold text-base">S</span>
            </div>
            <span className="font-display font-bold text-white text-xl tracking-tight">StoreAdmin</span>
          </div>
          <h2 className="font-display font-bold text-white text-4xl leading-tight mb-4">
            Gestiona tu tienda<br />desde un solo lugar
          </h2>
          <p className="text-ink-400 text-base leading-relaxed max-w-sm">
            Panel administrativo completo para ventas, inventario, clientes y reportes empresariales.
          </p>
        </div>
        <div className="relative grid grid-cols-3 gap-4">
          {[
            { label: 'Módulos', value: '7' },
            { label: 'Reportes', value: '∞' },
            { label: 'Uptime', value: '99%' },
          ].map((s) => (
            <div key={s.label} className="bg-ink-800/60 rounded-xl p-4 border border-ink-700">
              <p className="font-display font-bold text-white text-2xl">{s.value}</p>
              <p className="text-ink-400 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm fade-in">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">S</span>
            </div>
            <span className="font-display font-bold text-ink-800 text-lg">StoreAdmin</span>
          </div>

          <h1 className="font-display font-bold text-ink-900 text-2xl mb-1">Bienvenido de vuelta</h1>
          <p className="text-ink-400 text-sm mb-8">Ingresa tus credenciales para continuar</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-600 uppercase tracking-wide mb-1.5">
                Usuario
              </label>
              <input
                type="text"
                placeholder="Tu nombre de usuario"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-600 uppercase tracking-wide mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="input-field"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-ink-900 text-white text-sm font-semibold hover:bg-ink-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-ink-400">
            Sistema administrativo protegido · Solo personal autorizado
          </p>
        </div>
      </div>
    </div>
  )
}