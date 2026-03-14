import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Table from '../../components/Table'
import Modal from '../../components/Modal'
import FormInput from '../../components/FormInput'
import Alert from '../../components/Alert'
import { productoService } from '../../api/productoService'

const fmt = (n) => `$${Number(n || 0).toLocaleString('es-CO')}`

const COLS = [
  { key: 'codigoProducto', label: 'Código' },
  { key: 'nombreProducto', label: 'Nombre' },
  { key: 'nitproveedor', label: 'NIT Proveedor' },
  { key: 'precioCompra', label: 'P. Compra', render: (v) => fmt(v) },
  { key: 'ivacompra', label: 'IVA', render: (v) => `${v}%` },
  { key: 'precioVenta', label: 'P. Venta', render: (v) => fmt(v) },
  { key: 'stock', label: 'Stock', render: (v) => (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
      v > 10 ? 'bg-jade-500/10 text-jade-500' :
      v > 0  ? 'bg-amber-500/10 text-amber-500' :
               'bg-rose-500/10 text-rose-500'
    }`}>
      {v}
    </span>
  )},
  { key: '_actions', label: 'Acciones' },
]

const EMPTY = {
  nombreProducto: '',
  nitproveedor:   '',
  precioCompra:   '',
  ivacompra:      '',
  precioVenta:    '',
}

export default function ProductosList() {
  const [data, setData]               = useState([])
  const [loading, setLoading]         = useState(true)
  const [modalOpen, setModalOpen]     = useState(false)
  const [form, setForm]               = useState(EMPTY)
  const [editingCodigo, setEditingCodigo] = useState(null)
  const [alert, setAlert]             = useState(null)
  const [search, setSearch]           = useState('')

  const showAlert = (type, msg) => {
    setAlert({ type, msg })
    setTimeout(() => setAlert(null), 4000)
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: res } = await productoService.getAll()
      setData(Array.isArray(res) ? res : [])
    } catch {
      showAlert('error', 'Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => {
    setForm(EMPTY)
    setEditingCodigo(null)
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setForm({
      nombreProducto: row.nombreProducto,
      nitproveedor:   row.nitproveedor,
      precioCompra:   row.precioCompra,
      ivacompra:      row.ivacompra,
      precioVenta:    row.precioVenta,
      stock:          row.stock,
    })
    setEditingCodigo(row.codigoProducto)
    setModalOpen(true)
  }

  const handleDelete = async (codigo) => {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
    try {
      await productoService.delete(codigo)
      showAlert('success', 'Producto eliminado correctamente')
      fetchData()
    } catch {
      showAlert('error', 'Error al eliminar producto')
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      nitproveedor: Number(form.nitproveedor),
      precioCompra: Number(form.precioCompra),
      ivacompra:    Number(form.ivacompra),
      precioVenta:  Number(form.precioVenta),
      stock:        Number(form.stock),
    }
    try {
      if (editingCodigo) {
        await productoService.update(editingCodigo, payload)
        showAlert('success', 'Producto actualizado correctamente')
      } else {
        await productoService.create(payload)
        showAlert('success', 'Producto creado correctamente')
      }
      setModalOpen(false)
      fetchData()
    } catch (err) {
      showAlert('error', err.response?.data?.mensaje ?? err.response?.data?.message ?? 'Error al guardar producto')
    }
  }

  const filtered = data.filter((p) =>
    p.nombreProducto?.toLowerCase().includes(search.toLowerCase()) ||
    String(p.codigoProducto)?.includes(search) ||
    String(p.nitproveedor)?.includes(search)
  )

  const tableData = filtered.map((p) => ({
    ...p,
    _actions: (
      <div className="flex items-center gap-2">
        <button onClick={() => openEdit(p)} className="btn-secondary py-1 px-3 text-xs">Editar</button>
        <button onClick={() => handleDelete(p.codigoProducto)} className="btn-danger py-1 px-3 text-xs">Eliminar</button>
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
            <UploadIcon /> Cargar CSV
          </Link>
          <button onClick={openCreate} className="btn-primary">
            <PlusIcon /> Nuevo producto
          </button>
        </div>
      </div>

      <div className="card">
        <input
          className="input-field max-w-xs mb-4"
          placeholder="Buscar por nombre, código o NIT…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Table columns={COLS} data={tableData} loading={loading} emptyMessage="No hay productos registrados" />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCodigo ? 'Editar producto' : 'Nuevo producto'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Nombre producto"
              value={form.nombreProducto}
              onChange={(e) => setForm({ ...form, nombreProducto: e.target.value })}
              required
            />
            <FormInput
              label="NIT proveedor"
              type="number"
              value={form.nitproveedor}
              onChange={(e) => setForm({ ...form, nitproveedor: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormInput
              label="Precio compra"
              type="number"
              value={form.precioCompra}
              onChange={(e) => setForm({ ...form, precioCompra: e.target.value })}
              required
            />
            <FormInput
              label="IVA compra (%)"
              type="number"
              value={form.ivacompra}
              onChange={(e) => setForm({ ...form, ivacompra: e.target.value })}
              required
            />
            <FormInput
              label="Precio venta"
              type="number"
              value={form.precioVenta}
              onChange={(e) => setForm({ ...form, precioVenta: e.target.value })}
              required
            />
          </div>
          <FormInput
            label="Stock inicial"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
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

function UploadIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}