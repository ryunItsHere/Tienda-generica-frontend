import { useState } from 'react'
import { Link } from 'react-router-dom'
import Table from '../../components/Table'
import Modal from '../../components/Modal'
import FormInput from '../../components/FormInput'
import Alert from '../../components/Alert'

const MOCK = [
  { codigo: 'PROD-001', nombre: 'Laptop Pro 15"', precioCompra: 800000, ivaCompra: 12, precioVenta: 1200000, proveedor: 'TechDistrib S.A.' },
  { codigo: 'PROD-002', nombre: 'Mouse Inalámbrico', precioCompra: 25000, ivaCompra: 19, precioVenta: 45000, proveedor: 'TechDistrib S.A.' },
  { codigo: 'PROD-003', nombre: 'Teclado Mecánico', precioCompra: 90000, ivaCompra: 19, precioVenta: 150000, proveedor: 'Global Supplies Ltda.' },
  { codigo: 'PROD-004', nombre: 'Monitor 27"', precioCompra: 450000, ivaCompra: 12, precioVenta: 750000, proveedor: 'Importaciones XYZ' },
]

const fmt = (n) => `$${Number(n).toLocaleString('es-CO')}`

const COLS = [
  { key: 'codigo', label: 'Código' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'precioCompra', label: 'P. Compra', render: (v) => fmt(v) },
  { key: 'ivaCompra', label: 'IVA', render: (v) => `${v}%` },
  { key: 'precioVenta', label: 'P. Venta', render: (v) => fmt(v) },
  { key: 'proveedor', label: 'Proveedor' },
  { key: '_actions', label: 'Acciones' },
]

const EMPTY = { codigo: '', nombre: '', precioCompra: '', ivaCompra: '', precioVenta: '', proveedor: '' }

export default function ProductosList() {
  const [data, setData] = useState(MOCK)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [alert, setAlert] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = data.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.codigo.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => { setForm(EMPTY); setEditing(null); setModalOpen(true) }
  const openEdit = (row) => { setForm({ ...row }); setEditing(row.codigo); setModalOpen(true) }

  const handleDelete = (id) => {
    if (!confirm('¿Eliminar producto?')) return
    setData((d) => d.filter((p) => p.codigo !== id))
    setAlert({ type: 'success', msg: 'Producto eliminado' })
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (editing) setData((d) => d.map((p) => p.codigo === editing ? form : p))
    else setData((d) => [...d, form])
    setAlert({ type: 'success', msg: editing ? 'Producto actualizado' : 'Producto creado' })
    setModalOpen(false)
  }

  const tableData = filtered.map((p) => ({
    ...p,
    _actions: (
      <div className="flex gap-2">
        <button onClick={() => openEdit(p)} className="btn-secondary py-1 px-3 text-xs">Editar</button>
        <button onClick={() => handleDelete(p.codigo)} className="btn-danger py-1 px-3 text-xs">Eliminar</button>
      </div>
    ),
  }))

  return (
    <div className="space-y-5 fade-in">
      {alert && <Alert variant={alert.type} message={alert.msg} onClose={() => setAlert(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-ink-800 text-xl">Productos</h2>
          <p className="text-sm text-ink-400 mt-0.5">{data.length} productos en inventario</p>
        </div>
        <div className="flex gap-2">
          <Link to="/productos/cargar-csv" className="btn-secondary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Cargar CSV
          </Link>
          <button onClick={openCreate} className="btn-primary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nuevo producto
          </button>
        </div>
      </div>

      <div className="card">
        <input
          className="input-field max-w-xs mb-4"
          placeholder="Buscar por nombre o código…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Table columns={COLS} data={tableData} loading={false} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar producto' : 'Nuevo producto'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Código" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} required disabled={!!editing} />
            <FormInput label="Nombre producto" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormInput label="Precio compra" type="number" value={form.precioCompra} onChange={(e) => setForm({ ...form, precioCompra: e.target.value })} required />
            <FormInput label="IVA compra (%)" type="number" value={form.ivaCompra} onChange={(e) => setForm({ ...form, ivaCompra: e.target.value })} required />
            <FormInput label="Precio venta" type="number" value={form.precioVenta} onChange={(e) => setForm({ ...form, precioVenta: e.target.value })} required />
          </div>
          <FormInput label="Proveedor" value={form.proveedor} onChange={(e) => setForm({ ...form, proveedor: e.target.value })} />
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 justify-center">Guardar</button>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1 justify-center">Cancelar</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}