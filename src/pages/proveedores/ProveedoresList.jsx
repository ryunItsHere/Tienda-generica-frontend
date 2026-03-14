import { useState, useEffect } from 'react'
import Table from '../../components/Table'
import Modal from '../../components/Modal'
import FormInput from '../../components/FormInput'
import Alert from '../../components/Alert'
import { proveedorService } from '../../api/proveedorService'

const COLS = [
  { key: 'nitProveedor', label: 'NIT' },
  { key: 'nombreProveedor', label: 'Nombre proveedor' },
  { key: 'direccionProveedor', label: 'Dirección' },
  { key: 'telefonoProveedor', label: 'Teléfono' },
  { key: 'ciudadProveedor', label: 'Ciudad' },
  { key: '_actions', label: 'Acciones' },
]

const EMPTY = {
  nitProveedor:       '',
  nombreProveedor:    '',
  direccionProveedor: '',
  telefonoProveedor:  '',
  ciudadProveedor:    '',
}

export default function ProveedoresList() {
  const [data, setData]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm]           = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [alert, setAlert]         = useState(null)
  const [search, setSearch]       = useState('')

  const showAlert = (type, msg) => {
    setAlert({ type, msg })
    setTimeout(() => setAlert(null), 4000)
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: res } = await proveedorService.getAll()
      setData(Array.isArray(res) ? res : [])
    } catch {
      showAlert('error', 'Error al cargar proveedores')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => {
    setForm(EMPTY)
    setEditingId(null)
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setForm({
      nitProveedor:       row.nitProveedor,
      nombreProveedor:    row.nombreProveedor,
      direccionProveedor: row.direccionProveedor,
      telefonoProveedor:  row.telefonoProveedor,
      ciudadProveedor:    row.ciudadProveedor,
    })
    setEditingId(row.id)
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este proveedor? Esta acción no se puede deshacer.')) return
    try {
      await proveedorService.delete(id)
      showAlert('success', 'Proveedor eliminado correctamente')
      fetchData()
    } catch {
      showAlert('error', 'Error al eliminar proveedor')
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await proveedorService.update(editingId, form)
        showAlert('success', 'Proveedor actualizado correctamente')
      } else {
        await proveedorService.create(form)
        showAlert('success', 'Proveedor creado correctamente')
      }
      setModalOpen(false)
      fetchData()
    } catch (err) {
      showAlert('error', err.response?.data ?? 'Error al guardar proveedor')
    }
  }

  const filtered = data.filter((p) =>
    p.nombreProveedor?.toLowerCase().includes(search.toLowerCase()) ||
    String(p.nitProveedor)?.includes(search) ||
    p.ciudadProveedor?.toLowerCase().includes(search.toLowerCase())
  )

  const tableData = filtered.map((p) => ({
    ...p,
    _actions: (
      <div className="flex items-center gap-2">
        <button onClick={() => openEdit(p)} className="btn-secondary py-1 px-3 text-xs">
          Editar
        </button>
        <button onClick={() => handleDelete(p.id)} className="btn-danger py-1 px-3 text-xs">
          Eliminar
        </button>
      </div>
    ),
  }))

  return (
    <div className="space-y-5 fade-in">
      {alert && <Alert variant={alert.type} message={alert.msg} onClose={() => setAlert(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-ink-800 text-xl">Proveedores</h2>
          <p className="text-sm text-ink-400 mt-0.5">{data.length} proveedores registrados</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <PlusIcon /> Nuevo proveedor
        </button>
      </div>

      <div className="card">
        <input
          className="input-field max-w-xs mb-4"
          placeholder="Buscar por nombre, NIT o ciudad…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Table columns={COLS} data={tableData} loading={loading} emptyMessage="No hay proveedores registrados" />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Editar proveedor' : 'Nuevo proveedor'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="NIT"
              type="number"
              value={form.nitProveedor}
              onChange={(e) => setForm({ ...form, nitProveedor: Number(e.target.value) })}
              required
              disabled={!!editingId}
            />
            <FormInput
              label="Nombre proveedor"
              value={form.nombreProveedor}
              onChange={(e) => setForm({ ...form, nombreProveedor: e.target.value })}
              required
            />
          </div>
          <FormInput
            label="Dirección"
            value={form.direccionProveedor}
            onChange={(e) => setForm({ ...form, direccionProveedor: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Teléfono"
              value={form.telefonoProveedor}
              onChange={(e) => setForm({ ...form, telefonoProveedor: e.target.value })}
            />
            <FormInput
              label="Ciudad"
              value={form.ciudadProveedor}
              onChange={(e) => setForm({ ...form, ciudadProveedor: e.target.value })}
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