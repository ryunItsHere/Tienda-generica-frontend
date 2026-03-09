import { useState } from 'react'
import Table from '../../components/Table'
import Modal from '../../components/Modal'
import FormInput from '../../components/FormInput'
import Alert from '../../components/Alert'

const MOCK = [
  { nit: '900123456-1', nombre: 'TechDistrib S.A.', direccion: 'Cra 30 #45-60', telefono: '6012345678', ciudad: 'Bogotá' },
  { nit: '800987654-2', nombre: 'Importaciones XYZ', direccion: 'Cll 72 #20-15', telefono: '6048765432', ciudad: 'Medellín' },
  { nit: '890111222-3', nombre: 'Global Supplies Ltda.', direccion: 'Av. 3N #14-50', telefono: '6023334444', ciudad: 'Cali' },
]

const COLS = [
  { key: 'nit', label: 'NIT' },
  { key: 'nombre', label: 'Nombre proveedor' },
  { key: 'direccion', label: 'Dirección' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'ciudad', label: 'Ciudad' },
  { key: '_actions', label: 'Acciones' },
]

const EMPTY = { nit: '', nombre: '', direccion: '', telefono: '', ciudad: '' }

export default function ProveedoresList() {
  const [data, setData] = useState(MOCK)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [alert, setAlert] = useState(null)

  const openCreate = () => { setForm(EMPTY); setEditing(null); setModalOpen(true) }
  const openEdit = (row) => { setForm({ ...row }); setEditing(row.nit); setModalOpen(true) }

  const handleDelete = (id) => {
    if (!confirm('¿Eliminar proveedor?')) return
    setData((d) => d.filter((p) => p.nit !== id))
    setAlert({ type: 'success', msg: 'Proveedor eliminado' })
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (editing) setData((d) => d.map((p) => p.nit === editing ? form : p))
    else setData((d) => [...d, form])
    setAlert({ type: 'success', msg: editing ? 'Proveedor actualizado' : 'Proveedor creado' })
    setModalOpen(false)
  }

  const tableData = data.map((p) => ({
    ...p,
    _actions: (
      <div className="flex gap-2">
        <button onClick={() => openEdit(p)} className="btn-secondary py-1 px-3 text-xs">Editar</button>
        <button onClick={() => handleDelete(p.nit)} className="btn-danger py-1 px-3 text-xs">Eliminar</button>
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
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuevo proveedor
        </button>
      </div>

      <div className="card">
        <Table columns={COLS} data={tableData} loading={false} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar proveedor' : 'Nuevo proveedor'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="NIT" value={form.nit} onChange={(e) => setForm({ ...form, nit: e.target.value })} required disabled={!!editing} />
            <FormInput label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          </div>
          <FormInput label="Dirección" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
            <FormInput label="Ciudad" value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} />
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