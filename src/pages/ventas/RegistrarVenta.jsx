import { useState } from 'react'
import FormInput from '../../components/FormInput'
import Alert from '../../components/Alert'

const MOCK_CLIENTES = {
  '1012345678': { nombre: 'Laura Gómez', correo: 'laura@correo.com' },
  '1098765432': { nombre: 'Juan Pérez', correo: 'juan@correo.com' },
}
const MOCK_PRODUCTOS = {
  'PROD-001': { nombre: 'Laptop Pro 15"', precioVenta: 1200000, iva: 12 },
  'PROD-002': { nombre: 'Mouse Inalámbrico', precioVenta: 45000, iva: 19 },
  'PROD-003': { nombre: 'Teclado Mecánico', precioVenta: 150000, iva: 19 },
}

const MAX_PRODUCTS = 3
const EMPTY_LINE = { codigo: '', nombre: '', cantidad: '', precioUnitario: 0, iva: 0 }

const fmt = (n) => `$${Number(n || 0).toLocaleString('es-CO')}`

export default function RegistrarVenta() {
  const [cedulaCliente, setCedulaCliente] = useState('')
  const [cliente, setCliente] = useState(null)
  const [clienteError, setClienteError] = useState('')
  const [lineas, setLineas] = useState([{ ...EMPTY_LINE }])
  const [alert, setAlert] = useState(null)

  const buscarCliente = () => {
    const found = MOCK_CLIENTES[cedulaCliente]
    if (found) { setCliente(found); setClienteError('') }
    else { setCliente(null); setClienteError('Cliente no encontrado con esa cédula.') }
  }

  const buscarProducto = (idx, codigo) => {
    const found = MOCK_PRODUCTOS[codigo]
    setLineas((prev) => prev.map((l, i) =>
      i === idx
        ? { ...l, codigo, nombre: found?.nombre ?? '', precioUnitario: found?.precioVenta ?? 0, iva: found?.iva ?? 0 }
        : l
    ))
  }

  const updateLinea = (idx, key, val) => {
    setLineas((prev) => prev.map((l, i) => i === idx ? { ...l, [key]: val } : l))
  }

  const addLinea = () => {
    if (lineas.length < MAX_PRODUCTS) setLineas((l) => [...l, { ...EMPTY_LINE }])
  }

  const removeLinea = (idx) => {
    setLineas((l) => l.filter((_, i) => i !== idx))
  }

  const subtotalLinea = (l) => Number(l.precioUnitario) * Number(l.cantidad || 0)
  const ivaLinea = (l) => subtotalLinea(l) * (l.iva / 100)
  const totalLinea = (l) => subtotalLinea(l) + ivaLinea(l)

  const subtotalTotal = lineas.reduce((a, l) => a + subtotalLinea(l), 0)
  const ivaTotal = lineas.reduce((a, l) => a + ivaLinea(l), 0)
  const grandTotal = subtotalTotal + ivaTotal

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!cliente) return setAlert({ type: 'error', msg: 'Debes seleccionar un cliente.' })
    if (lineas.every((l) => !l.codigo)) return setAlert({ type: 'error', msg: 'Agrega al menos un producto.' })
    setAlert({ type: 'success', msg: `Venta registrada por ${fmt(grandTotal)} para ${cliente.nombre}.` })
    setLineas([{ ...EMPTY_LINE }])
    setCedulaCliente('')
    setCliente(null)
  }

  return (
    <div className="space-y-5 fade-in max-w-3xl">
      <div>
        <h2 className="font-display font-bold text-ink-800 text-xl">Registrar venta</h2>
        <p className="text-sm text-ink-400 mt-0.5">Máximo {MAX_PRODUCTS} productos por venta</p>
      </div>

      {alert && <Alert variant={alert.type} message={alert.msg} onClose={() => setAlert(null)} />}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Cliente */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-ink-700 text-sm uppercase tracking-wide">1. Cliente</h3>
          <div className="flex gap-3">
            <FormInput
              label="Cédula del cliente"
              value={cedulaCliente}
              onChange={(e) => setCedulaCliente(e.target.value)}
              placeholder="Ej: 1012345678"
              className="flex-1"
              error={clienteError}
            />
            <div className="flex items-end">
              <button type="button" onClick={buscarCliente} className="btn-secondary">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                Buscar
              </button>
            </div>
          </div>
          {cliente && (
            <div className="flex items-center gap-3 bg-jade-500/5 border border-jade-500/20 rounded-xl px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-jade-500/20 flex items-center justify-center text-jade-500 font-bold text-sm">
                {cliente.nombre[0]}
              </div>
              <div>
                <p className="font-semibold text-ink-800 text-sm">{cliente.nombre}</p>
                <p className="text-xs text-ink-400">{cliente.correo}</p>
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
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-600 uppercase tracking-wide mb-1.5">Código</label>
                  <div className="flex gap-2">
                    <input
                      className="input-field"
                      placeholder="PROD-001"
                      value={l.codigo}
                      onChange={(e) => updateLinea(i, 'codigo', e.target.value)}
                      onBlur={(e) => buscarProducto(i, e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-ink-600 uppercase tracking-wide mb-1.5">Producto</label>
                  <input className="input-field bg-surface-100" value={l.nombre} readOnly placeholder="Auto-completado al ingresar código" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <FormInput label="Cantidad" type="number" min="1" value={l.cantidad} onChange={(e) => updateLinea(i, 'cantidad', e.target.value)} placeholder="1" />
                <div>
                  <label className="block text-xs font-semibold text-ink-600 uppercase tracking-wide mb-1.5">P. Unitario</label>
                  <div className="input-field bg-surface-100 text-ink-600">{fmt(l.precioUnitario)}</div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-600 uppercase tracking-wide mb-1.5">IVA</label>
                  <div className="input-field bg-surface-100 text-ink-600">{l.iva}%</div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-600 uppercase tracking-wide mb-1.5">Total línea</label>
                  <div className="input-field bg-surface-100 font-semibold text-ink-800">{fmt(totalLinea(l))}</div>
                </div>
              </div>
            </div>
          ))}

          {lineas.length < MAX_PRODUCTS && (
            <button type="button" onClick={addLinea} className="btn-secondary w-full justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Agregar producto ({lineas.length}/{MAX_PRODUCTS})
            </button>
          )}
        </div>

        {/* Totals */}
        <div className="card">
          <h3 className="font-semibold text-ink-700 text-sm uppercase tracking-wide mb-4">3. Totales</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-ink-600"><span>Subtotal</span><span className="font-medium">{fmt(subtotalTotal)}</span></div>
            <div className="flex justify-between text-ink-600"><span>IVA</span><span className="font-medium">{fmt(ivaTotal)}</span></div>
            <div className="border-t border-surface-300 pt-3 flex justify-between"><span className="font-bold text-ink-800">Total a pagar</span><span className="font-display font-bold text-xl text-ink-900">{fmt(grandTotal)}</span></div>
          </div>
          <button type="submit" className="btn-primary w-full justify-center mt-5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
            Registrar venta
          </button>
        </div>
      </form>
    </div>
  )
}