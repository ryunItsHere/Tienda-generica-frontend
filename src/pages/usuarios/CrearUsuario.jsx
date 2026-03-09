import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormInput from '../../components/FormInput'
import Alert from '../../components/Alert'

const EMPTY = { cedula: '', nombre: '', email: '', username: '', password: '', activo: true }

export default function CrearUsuario() {
  const [form, setForm] = useState(EMPTY)
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Real call: await usuarioService.create(form)
      await new Promise((r) => setTimeout(r, 800))
      setAlert({ type: 'success', msg: 'Usuario creado correctamente.' })
      setTimeout(() => navigate('/usuarios'), 1200)
    } catch {
      setAlert({ type: 'error', msg: 'Error al crear el usuario.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5 fade-in max-w-xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/usuarios')}
          className="text-ink-400 hover:text-ink-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div>
          <h2 className="font-display font-bold text-ink-800 text-xl">Crear usuario</h2>
          <p className="text-sm text-ink-400 mt-0.5">Completa los datos del nuevo usuario</p>
        </div>
      </div>

      {alert && <Alert variant={alert.type} message={alert.msg} onClose={() => setAlert(null)} />}

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Cédula"
              value={form.cedula}
              onChange={(e) => setForm({ ...form, cedula: e.target.value })}
              placeholder="Ej: 1001234567"
              required
            />
            <FormInput
              label="Nombre completo"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: Ana Torres"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Correo electrónico"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="correo@ejemplo.com"
              required
            />
            <FormInput
              label="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Ej: ana.torres"
              required
            />
          </div>
          <FormInput
            label="Contraseña"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            required
          />
          <div className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              id="activo"
              checked={form.activo}
              onChange={(e) => setForm({ ...form, activo: e.target.checked })}
              className="w-4 h-4 rounded accent-accent-500"
            />
            <label htmlFor="activo" className="text-sm font-medium text-ink-700">
              Usuario activo
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 justify-center disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Guardando…
                </>
              ) : 'Crear usuario'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/usuarios')}
              className="btn-secondary flex-1 justify-center"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}