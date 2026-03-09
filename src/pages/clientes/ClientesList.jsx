import { useState } from 'react'
import Table from '../../components/Table'
import Modal from '../../components/Modal'
import FormInput from '../../components/FormInput'
import Alert from '../../components/Alert'

const MOCK = [
  { cedula: '1012345678', nombre: 'Laura Gómez', direccion: 'Cra 10 #25-30', telefono: '3001234567', correo: 'laura@correo.com' },
  { cedula: '1098765432', nombre: 'Juan Pérez', direccion: 'Cll 50 #12-45', telefono: '3109876543', correo: 'juan@correo.com' },
  { cedula: '1056781234', nombre: 'Diana Mora', direccion: 'Av. 68 #3-10', telefono: '3204567890', correo: 'diana@correo.com' },
]

const COLS = [
  { key: 'cedula', label: 'Cédula' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'direccion', label: 'Dirección' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'correo', label: 'Correo' },
  { key: '_actions', label: 'Acciones' },
]

const EMPTY = { cedula: '', nombre: '', direccion: '', telefono: '', correo: '' }

export default function ClientesList() {
  const [data, setData] = useState(MOCK)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [alert, setAlert] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = data.filter((c) =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    c.cedula.includes(search)
  )

  const openCreate = () => { setForm(EMPTY); setEditing(null); setModalOpen(true) }
  const openEdit = (row) => { setForm({ ...row }); setEditing(row.cedula); setModalOpen(true) }

  const handleDelete = (id) => {
    if (!confirm('¿Eliminar cliente?')) return
    setData((d) => d.filter((c) => c.cedula !== id))
    setAlert({ type: 'success', msg: 'Cliente eliminado' })
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (editing) setData((d) => d.map((c) => c.cedula === editing ? form : c))
    else setData((d) => [...d, form])
    setAlert({ type: 'success', msg: editing ? 'Cliente actualizado' : 'Cliente creado' })
    setModalOpen(false)
  }

  const tableData = filtered.map((c) => ({
    ...c,
    _actions: (
      <div className="flex gap-2">
        <button onClick={() => openEdit(c)} className="btn-secondary py-1 px-3 text-xs">Editar</button>
        <button onClick={() => handleDelete(c.cedula)} className="btn-danger py-1 px-3 text-xs">Eliminar</button>
      </div>
    ),
  }))

  return (
    <div className="space-y-5 fade-in">
      {alert && <Alert variant={alert.type} message={alert.msg} onClose={() => setAlert(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-ink-800 text-xl">Clientes</h2>
          <p className="text-sm text-ink-400 mt-0.5">{data.length} clientes registrados</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuevo cliente
        </button>
      </div>

      <div className="card">
        <input
          className="input-field max-w-xs mb-4"
          placeholder="Buscar por nombre o cédula…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Table columns={COLS} data={tableData} loading={false} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar cliente' : 'Nuevo cliente'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Cédula" value={form.cedula} onChange={(e) => setForm({ ...form, cedula: e.target.value })} required disabled={!!editing} />
            <FormInput label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          </div>
          <FormInput label="Dirección" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
            <FormInput label="Correo" type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} />
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