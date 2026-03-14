import { useState } from 'react'
import FormInput from '../../components/FormInput'
import Alert from '../../components/Alert'
import { ventaService } from '../../api/ventaService'
import { clienteService } from '../../api/clienteService'
import { productoService } from '../../api/productoService'

const MAX_PRODUCTOS = 3
const EMPTY_LINEA = { codigoProducto: '', nombreProducto: '', precioVenta: 0, ivacompra: 0, cantidad: '' }
const fmt = (n) => `$${Number(n || 0).toLocaleString('es-CO')}`

export default function RegistrarVenta() {
  const [cedulaInput, setCedulaInput] = useState('')
  const [cliente, setCliente]         = useState(null)
  const [clienteError, setClienteError] = useState('')
  const [lineas, setLineas]           = useState([{ ...EMPTY_LINEA }])
  const [alert, setAlert]             = useState(null)
  const [loading, setLoading]         = useState(false)

  const showAlert = (type, msg) => {
    setAlert({ type, msg })
    setTimeout(() => setAlert(null), 5000)
  }

  // Buscar cliente por cédula
  const buscarCliente = async () => {
    if (!cedulaInput.trim()) return
    setClienteError('')
    setCliente(null)
    try {
      const { data } = await clienteService.getById(cedulaInput.trim())
      setCliente(data)
    } catch {
      setClienteError('Cliente no encontrado con esa cédula.')
    }
  }

  // Buscar producto por código al salir del campo
  const buscarProducto = async (idx, codigo) => {
    if (!codigo.trim()) return
    try {
      const { data } = await productoService.getById(Number(codigo))
      setLineas((prev) => prev.map((l, i) =>
        i === idx ? {
          ...l,
          codigoProducto: data.codigoProducto,
          nombreProducto: data.nombreProducto,
          precioVenta:    data.precioVenta,
          ivacompra:      data.ivacompra,
        } : l
      ))
    } catch {
      setLineas((prev) => prev.map((l, i) =>
        i === idx ? { ...EMPTY_LINEA, codigoProducto: codigo } : l
      ))
      showAlert('warning', `Producto con código ${codigo} no encontrado.`)
    }
  }

  const updateLinea = (idx, key, val) => {
    setLineas((prev) => prev.map((l, i) => i === idx ? { ...l, [key]: val } : l))
  }

  const addLinea = () => {
    if (lineas.length < MAX_PRODUCTOS)
      setLineas((l) => [...l, { ...EMPTY_LINEA }])
  }

  const removeLinea = (idx) => {
    setLineas((l) => l.filter((_, i) => i !== idx))
  }

  // Cálculos
  const subtotalLinea = (l) => Number(l.precioVenta) * Number(l.cantidad || 0)
  const ivaLinea      = (l) => subtotalLinea(l) * (Number(l.ivacompra) / 100)
  const totalLinea    = (l) => subtotalLinea(l) + ivaLinea(l)
  const subtotal      = lineas.reduce((a, l) => a + subtotalLinea(l), 0)
  const ivaTotal      = lineas.reduce((a, l) => a + ivaLinea(l), 0)
  const grandTotal    = subtotal + ivaTotal

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!cliente) return showAlert('error', 'Debes seleccionar un cliente válido.')

    const lineasValidas = lineas.filter((l) => l.codigoProducto && l.cantidad)
    if (lineasValidas.length === 0) return showAlert('error', 'Agrega al menos un producto válido.')

    const payload = {
      cedulaCliente: cliente.cedula,
      detalles: lineasValidas.map((l) => ({
        codigoProducto: Number(l.codigoProducto),
        cantidad:       Number(l.cantidad),
      })),
    }

    setLoading(true)
    try {
      const { data } = await ventaService.create(payload)
      showAlert('success', `Venta #${data.id} registrada por ${fmt(data.total)} para ${cliente.nombreCompleto}.`)
      setLineas([{ ...EMPTY_LINEA }])
      setCedulaInput('')
      setCliente(null)
    } catch (err) {
      showAlert('error', err.response?.data?.mensaje ?? err.response?.data?.message ?? 'Error al registrar la venta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5 fade-in max-w-3xl">
      <div>
        <h2 className="font-display font-bold text-ink-800 text-xl">Registrar venta</h2>
        <p className="text-sm text-ink-400 mt-0.5">Máximo {MAX_PRODUCTOS} productos por venta</p>
      </div>

      {alert && <Alert variant={alert.type} message={alert.msg} onClose={() => setAlert(null)} />}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Cliente */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-ink-700 text-sm uppercase tracking-wide">1. Cliente</h3>
          <div className="flex gap-3">
            <FormInput
              label="Cédula del cliente"
              value={cedulaInput}
              onChange={(e) => setCedulaInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), buscarCliente())}
              placeholder="Ej: 1012345678"
              className="flex-1"
              error={clienteError}
            />
            <div className="flex items-end">
              <button type="button" onClick={buscarCliente} className="btn-secondary">
                <SearchIcon /> Buscar
              </button>
            </div>
          </div>
          {cliente && (
            <div className="flex items-center gap-3 bg-jade-500/5 border border-jade-500/20 rounded-xl px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-jade-500/20 flex items-center justify-center text-jade-500 font-bold text-sm flex-shrink-0">
                {cliente.nombreCompleto?.[0]}
              </div>
              <div>
                <p className="font-semibold text-ink-800 text-sm">{cliente.nombreCompleto}</p>
                <p className="text-xs text-ink-400">{cliente.email} · {cliente.telefono}</p>
              </div>
              <span className="ml-auto badge-active">Encontrado</span>
            </div>
          )}
        </div>

        {/* Productos */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-ink-700 text-sm uppercase tracking-wide">2. Productos</h3>

          {lineas.map((l, i) => (
            <div key={i} className="border border-surface-300 rounded-xl p-4 space-y-3 bg-surface-100/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink-400">Producto #{i + 1}</span>
                {lineas.length > 1 && (
                  <button type="button" onClick={() => removeLinea(i)} className="text-rose-400 hover:text-rose-500 transition-colors">
                    <TrashIcon />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-600 uppercase tracking-wide mb-1.5">Código</label>
                  <input
                    className="input-field"
                    placeholder="Ej: 1"
                    value={l.codigoProducto}
                    onChange={(e) => updateLinea(i, 'codigoProducto', e.target.value)}
                    onBlur={(e) => buscarProducto(i, e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-ink-600 uppercase tracking-wide mb-1.5">Producto</label>
                  <input
                    className="input-field bg-surface-100 cursor-not-allowed"
                    value={l.nombreProducto}
                    readOnly
                    placeholder="Se completa automáticamente"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <FormInput
                  label="Cantidad"
                  type="number"
                  min="1"
                  value={l.cantidad}
                  onChange={(e) => updateLinea(i, 'cantidad', e.target.value)}
                  placeholder="1"
                />
                <div>
                  <label className="block text-xs font-semibold text-ink-600 uppercase tracking-wide mb-1.5">P. Unitario</label>
                  <div className="input-field bg-surface-100 text-ink-600 cursor-not-allowed">{fmt(l.precioVenta)}</div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-600 uppercase tracking-wide mb-1.5">IVA</label>
                  <div className="input-field bg-surface-100 text-ink-600 cursor-not-allowed">{l.ivacompra}%</div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-600 uppercase tracking-wide mb-1.5">Total línea</label>
                  <div className="input-field bg-surface-100 font-semibold text-ink-800 cursor-not-allowed">{fmt(totalLinea(l))}</div>
                </div>
              </div>
            </div>
          ))}

          {lineas.length < MAX_PRODUCTOS && (
            <button type="button" onClick={addLinea} className="btn-secondary w-full justify-center">
              <PlusIcon /> Agregar producto ({lineas.length}/{MAX_PRODUCTOS})
            </button>
          )}
        </div>

        {/* Totales */}
        <div className="card">
          <h3 className="font-semibold text-ink-700 text-sm uppercase tracking-wide mb-4">3. Totales</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-ink-600">
              <span>Subtotal</span>
              <span className="font-medium">{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-600">
              <span>IVA</span>
              <span className="font-medium">{fmt(ivaTotal)}</span>
            </div>
            <div className="border-t border-surface-300 pt-3 flex justify-between">
              <span className="font-bold text-ink-800">Total a pagar</span>
              <span className="font-display font-bold text-xl text-ink-900">{fmt(grandTotal)}</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center mt-5 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Registrando…
              </>
            ) : (
              <>
                <CheckIcon /> Registrar venta
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  )
}

function SearchIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
}
function PlusIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
}
function TrashIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>
}
function CheckIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
}