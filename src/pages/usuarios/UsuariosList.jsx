import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Table from '../../components/Table'
import Modal from '../../components/Modal'
import FormInput from '../../components/FormInput'
import Alert from '../../components/Alert'

const MOCK = [
  { cedula: '1001234567', nombre: 'Ana Torres', email: 'ana@tienda.com', username: 'ana.torres', activo: true },
  { cedula: '1009876543', nombre: 'Carlos Ruiz', email: 'carlos@tienda.com', username: 'carlos.ruiz', activo: true },
  { cedula: '1005555555', nombre: 'María López', email: 'maria@tienda.com', username: 'maria.lopez', activo: false },
]

const EMPTY_FORM = { cedula: '', nombre: '', email: '', username: '', password: '', activo: true }

const COLS = [
  { key: 'cedula', label: 'Cédula' },
  { key: 'nombre', label: 'Nombre completo' },
  { key: 'email', label: 'Correo' },
  { key: 'username', label: 'Username' },
  { key: 'activo', label: 'Estado', render: (v) => (
    <span className={v ? 'badge-active' : 'badge-inactive'}>{v ? 'Activo' : 'Inactivo'}</span>
  )},
  { key: '_actions', label: 'Acciones' },
]

export default function UsuariosList() {
  const [data, setData] = useState(MOCK)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editing, setEditing] = useState(null)
  const [alert, setAlert] = useState(null)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = data.filter((u) =>
    u.nombre.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  )

  const openEdit = (row) => { setForm({ ...row, password: '' }); setEditing(row.cedula); setModalOpen(true) }

  const handleDelete = (cedula) => {
    if (!confirm('¿Eliminar este usuario?')) return
    setData((d) => d.filter((u) => u.cedula !== cedula))
    setAlert({ type: 'success', msg: 'Usuario eliminado correctamente' })
  }

  const handleSave = (e) => {
    e.preventDefault()
    setData((d) => d.map((u) => u.cedula === editing ? { ...form } : u))
    setAlert({ type: 'success', msg: 'Usuario actualizado' })
    setModalOpen(false)
  }

  const tableData = filtered.map((u) => ({
    ...u,
    _actions: (
      <div className="flex items-center gap-2">
        <button onClick={() => openEdit(u)} className="btn-secondary py-1 px-3 text-xs">Editar</button>
        <button onClick={() => handleDelete(u.cedula)} className="btn-danger py-1 px-3 text-xs">Eliminar</button>
      </div>
    ),
  }))

  return (
    <div className="space-y-5 fade-in">
      {alert && <Alert variant={alert.type} message={alert.msg} onClose={() => setAlert(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-ink-800 text-xl">Usuarios del sistema</h2>
          <p className="text-sm text-ink-400 mt-0.5">{data.length} usuarios registrados</p>
        </div>
        <button onClick={() => navigate('/usuarios/crear')} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuevo usuario
        </button>
      </div>

      <div className="card">
        <input
          className="input-field max-w-xs mb-4"
          placeholder="Buscar por nombre o username…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Table columns={COLS} data={tableData} loading={false} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Editar usuario">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Cédula" value={form.cedula} disabled />
            <FormInput label="Nombre completo" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Correo electrónico" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <FormInput label="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="activo"
              checked={form.activo}
              onChange={(e) => setForm({ ...form, activo: e.target.checked })}
              className="w-4 h-4 rounded accent-accent-500"
            />
            <label htmlFor="activo" className="text-sm font-medium text-ink-700">Usuario activo</label>
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