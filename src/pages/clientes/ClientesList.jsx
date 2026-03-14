import { useState, useEffect } from 'react'
import Table from '../../components/Table'
import Modal from '../../components/Modal'
import FormInput from '../../components/FormInput'
import Alert from '../../components/Alert'
import { clienteService } from '../../api/clienteService'

const COLS = [
  { key: 'cedula', label: 'Cédula' },
  { key: 'nombreCompleto', label: 'Nombre' },
  { key: 'ciudad', label: 'Ciudad' },
  { key: 'direccion', label: 'Dirección' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'email', label: 'Correo' },
  { key: '_actions', label: 'Acciones' },
]

const EMPTY = { cedula: '', nombreCompleto: '', ciudad: '', direccion: '', telefono: '', email: '' }

export default function ClientesList() {
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
      const { data: res } = await clienteService.getAll()
      setData(Array.isArray(res) ? res : [])
    } catch {
      showAlert('error', 'Error al cargar clientes')
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
      ciudad:         row.ciudad,
      direccion:      row.direccion,
      telefono:       row.telefono,
      email:          row.email,
    })
    setEditing(row.cedula)
    setModalOpen(true)
  }

  const handleDelete = async (cedula) => {
    if (!confirm('¿Eliminar este cliente? Esta acción no se puede deshacer.')) return
    try {
      await clienteService.delete(cedula)
      showAlert('success', 'Cliente eliminado correctamente')
      fetchData()
    } catch {
      showAlert('error', 'Error al eliminar cliente')
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        const { cedula, ...rest } = form
        await clienteService.update(editing, rest)
        showAlert('success', 'Cliente actualizado correctamente')
      } else {
        await clienteService.create(form)
        showAlert('success', 'Cliente creado correctamente')
      }
      setModalOpen(false)
      fetchData()
    } catch (err) {
      showAlert('error', err.response?.data?.mensaje ?? err.response?.data?.message ?? 'Error al guardar cliente')
    }
  }

  const filtered = data.filter((c) =>
    c.nombreCompleto?.toLowerCase().includes(search.toLowerCase()) ||
    c.cedula?.includes(search) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  const tableData = filtered.map((c) => ({
    ...c,
    _actions: (
      <div className="flex items-center gap-2">
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
          <PlusIcon /> Nuevo cliente
        </button>
      </div>

      <div className="card">
        <input
          className="input-field max-w-xs mb-4"
          placeholder="Buscar por nombre, cédula o correo…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Table columns={COLS} data={tableData} loading={loading} emptyMessage="No hay clientes registrados" />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar cliente' : 'Nuevo cliente'}
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
              label="Ciudad"
              value={form.ciudad}
              onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
            />
            <FormInput
              label="Dirección"
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Teléfono"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />
            <FormInput
              label="Correo electrónico"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
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