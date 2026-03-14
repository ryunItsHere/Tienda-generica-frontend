import { useState, useEffect } from 'react'
import Table from '../../components/Table'
import Modal from '../../components/Modal'
import FormInput from '../../components/FormInput'
import Alert from '../../components/Alert'
import { usuarioService } from '../../api/usuarioService'

const COLS = [
  { key: 'cedula', label: 'Cédula' },
  { key: 'nombreCompleto', label: 'Nombre completo' },
  { key: 'email', label: 'Correo' },
  { key: 'username', label: 'Username' },
  { key: 'rol', label: 'Rol', render: (v) => (
    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-accent-500/10 text-accent-500">
      {v ?? '—'}
    </span>
  )},
  { key: 'activo', label: 'Estado', render: (v) => (
    <span className={v ? 'badge-active' : 'badge-inactive'}>
      {v ? 'Activo' : 'Inactivo'}
    </span>
  )},
  { key: '_actions', label: 'Acciones' },
]

const EMPTY = { cedula: '', nombreCompleto: '', email: '', username: '', password: '', idRol: 2 }

export default function UsuariosList() {
  const [data, setData]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm]           = useState(EMPTY)
  const [editing, setEditing]     = useState(null)
  const [alert, setAlert]         = useState(null)
  const [search, setSearch]       = useState('')

  const showAlert = (type, msg) => {
    setAlert({ type, msg })
    setTimeout(() => setAlert(null), 4000)
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: res } = await usuarioService.getAll()
      setData(Array.isArray(res) ? res : [])
    } catch {
      showAlert('error', 'Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => {
    setForm(EMPTY)
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setForm({
      cedula:         row.cedula,
      nombreCompleto: row.nombreCompleto,
      email:          row.email,
      username:       row.username,
      password:       '',
      idRol:          row.rol === 'ADMIN' ? 1 : 2,
    })
    setEditing(row.cedula)
    setModalOpen(true)
  }

  const handleToggleEstado = async (row) => {
    try {
      await usuarioService.toggleEstado(row.cedula)
      showAlert('success', `Usuario ${row.activo ? 'desactivado' : 'activado'} correctamente`)
      fetchData()
    } catch {
      showAlert('error', 'Error al cambiar estado del usuario')
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        const { cedula, ...rest } = form
        await usuarioService.update(editing, rest)
        showAlert('success', 'Usuario actualizado correctamente')
      } else {
        await usuarioService.create(form)
        showAlert('success', 'Usuario creado correctamente')
      }
      setModalOpen(false)
      fetchData()
    } catch (err) {
      showAlert('error', err.response?.data?.mensaje ?? err.response?.data?.message ?? 'Error al guardar usuario')
    }
  }

  const filtered = data.filter((u) =>
    u.nombreCompleto?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.cedula?.includes(search)
  )

  const tableData = filtered.map((u) => ({
    ...u,
    _actions: (
      <div className="flex items-center gap-2">
        <button onClick={() => openEdit(u)} className="btn-secondary py-1 px-3 text-xs">
          Editar
        </button>
        <button
          onClick={() => handleToggleEstado(u)}
          className={`py-1 px-3 text-xs rounded-lg font-medium transition-colors ${
            u.activo
              ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
              : 'bg-jade-500/10 text-jade-500 hover:bg-jade-500/20'
          }`}
        >
          {u.activo ? 'Desactivar' : 'Activar'}
        </button>
      </div>
    ),
  }))

  return (
    <div className="space-y-5 fade-in">
      {alert && (
        <Alert variant={alert.type} message={alert.msg} onClose={() => setAlert(null)} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-ink-800 text-xl">Usuarios del sistema</h2>
          <p className="text-sm text-ink-400 mt-0.5">{data.length} usuarios registrados</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <PlusIcon /> Nuevo usuario
        </button>
      </div>

      <div className="card">
        <input
          className="input-field max-w-xs mb-4"
          placeholder="Buscar por nombre, cédula o username…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Table columns={COLS} data={tableData} loading={loading} emptyMessage="No hay usuarios registrados" />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar usuario' : 'Crear usuario'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Cédula"
              value={form.cedula}
              onChange={(e) => setForm({ ...form, cedula: e.target.value })}
              required
              disabled={!!editing}
            />
            <FormInput
              label="Nombre completo"
              value={form.nombreCompleto}
              onChange={(e) => setForm({ ...form, nombreCompleto: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Correo electrónico"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <FormInput
              label="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          {!editing && (
            <FormInput
              label="Contraseña (mín. 8 caracteres)"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ink-600 uppercase tracking-wide">Rol</label>
            <select
              className="input-field"
              value={form.idRol}
              onChange={(e) => setForm({ ...form, idRol: Number(e.target.value) })}
            >
              <option value={1}>ADMIN</option>
              <option value={2}>EMPLEADO</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 justify-center">Guardar</button>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1 justify-center">Cancelar</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}