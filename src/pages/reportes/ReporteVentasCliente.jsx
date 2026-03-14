import { useState, useEffect } from 'react'
import Table from '../../components/Table'
import Alert from '../../components/Alert'
import { reporteService } from '../../api/reporteService'

const fmt = (n) => `$${Number(n || 0).toLocaleString('es-CO')}`

const COLS_VENTAS = [
  { key: 'id', label: 'ID', render: (v) => (
    <span className="font-mono text-xs text-accent-500">#{v}</span>
  )},
  { key: 'fecha', label: 'Fecha', render: (v) => (
    v ? new Date(v).toLocaleString('es-CO') : '—'
  )},
  { key: 'cedulaCliente', label: 'Cliente' },
  { key: 'total', label: 'Total', render: (v) => (
    <span className="font-bold text-ink-800">{fmt(v)}</span>
  )},
]

const COLS_DETALLES = [
  { key: 'codigoProducto', label: 'Código' },
  { key: 'nombreProducto', label: 'Producto' },
  { key: 'cantidad', label: 'Cantidad' },
  { key: 'precioUnitario', label: 'P. Unitario', render: (v) => fmt(v) },
  { key: 'iva', label: 'IVA', render: (v) => fmt(v) },
  { key: 'subtotal', label: 'Subtotal', render: (v) => fmt(v) },
]

export default function ReporteVentasCliente() {
  const [tab, setTab]                   = useState('general')
  const [ventas, setVentas]             = useState([])
  const [loading, setLoading]           = useState(false)
  const [alert, setAlert]               = useState(null)
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null)

  // Totales calculados del listado
  const [totales, setTotales] = useState({ totalFacturado: 0, totalIva: 0, subtotal: 0 })

  // Por cliente
  const [cedulaInput, setCedulaInput]     = useState('')
  const [reporteCliente, setReporteCliente] = useState(null)
  const [loadingCliente, setLoadingCliente] = useState(false)

  const showAlert = (type, msg) => {
    setAlert({ type, msg })
    setTimeout(() => setAlert(null), 4000)
  }

  useEffect(() => { fetchVentas() }, [])

  const fetchVentas = async () => {
    setLoading(true)
    try {
      const { data } = await reporteService.getVentas()
      const lista = Array.isArray(data) ? data : []
      setVentas(lista)

      // Calcular totales desde el listado
      const totalFacturado = lista.reduce((a, v) => a + (v.total ?? 0), 0)
      const totalIva = lista.reduce((a, v) => {
        const ivaVenta = (v.detalles ?? []).reduce((s, d) => s + (d.iva ?? 0), 0)
        return a + ivaVenta
      }, 0)
      setTotales({
        totalFacturado,
        totalIva,
        subtotal: totalFacturado - totalIva,
      })
    } catch {
      showAlert('error', 'Error al cargar ventas')
    } finally {
      setLoading(false)
    }
  }

  const buscarPorCliente = async () => {
    if (!cedulaInput.trim()) return
    setLoadingCliente(true)
    setReporteCliente(null)
    try {
      const { data } = await reporteService.porCliente(cedulaInput.trim())
      setReporteCliente(data)
    } catch {
      showAlert('error', 'No se encontraron ventas para esa cédula.')
    } finally {
      setLoadingCliente(false)
    }
  }

  const descargarPDF = async (tipo, cedula = null) => {
    try {
      let res
      if (tipo === 'ventas')  res = await reporteService.getVentasPDF()
      if (tipo === 'total')   res = await reporteService.getTotalPDF()
      if (tipo === 'cliente') res = await reporteService.porClientePDF(cedula)

      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a   = document.createElement('a')
      a.href    = url
      a.download = `reporte-${tipo}${cedula ? `-${cedula}` : ''}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      showAlert('error', 'Error al generar el PDF')
    }
  }

  const ventasConAccion = ventas.map((v) => ({
    ...v,
    _detalles: (
      <button
        onClick={() => setVentaSeleccionada(ventaSeleccionada?.id === v.id ? null : v)}
        className="btn-secondary py-1 px-3 text-xs"
      >
        {ventaSeleccionada?.id === v.id ? 'Ocultar' : 'Ver detalles'}
      </button>
    ),
  }))

  const COLS_CON_ACCION = [...COLS_VENTAS, { key: '_detalles', label: 'Detalles' }]

  return (
    <div className="space-y-5 fade-in">
      {alert && <Alert variant={alert.type} message={alert.msg} onClose={() => setAlert(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-ink-800 text-xl">Reportes de ventas</h2>
          <p className="text-sm text-ink-400 mt-0.5">Análisis completo de ventas del sistema</p>
        </div>
        <button onClick={() => descargarPDF('ventas')} className="btn-secondary">
          <PDFIcon /> Exportar PDF
        </button>
      </div>

      {/* Cards totales calculados */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center fade-in-delay-1">
          <p className="font-display font-bold text-2xl text-ink-800">{fmt(totales.subtotal)}</p>
          <p className="text-xs text-ink-400 mt-1 font-medium">Subtotal ventas</p>
        </div>
        <div className="card text-center fade-in-delay-2">
          <p className="font-display font-bold text-2xl text-amber-500">{fmt(totales.totalIva)}</p>
          <p className="text-xs text-ink-400 mt-1 font-medium">IVA recaudado</p>
        </div>
        <div className="card text-center fade-in-delay-3">
          <p className="font-display font-bold text-2xl text-jade-500">{fmt(totales.totalFacturado)}</p>
          <p className="text-xs text-ink-400 mt-1 font-medium">Total ingresos</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-200 p-1 rounded-xl w-fit">
        {[
          { id: 'general', label: 'Listado de ventas' },
          { id: 'cliente', label: 'Por cliente' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id ? 'bg-white shadow text-ink-800' : 'text-ink-400 hover:text-ink-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab general */}
      {tab === 'general' && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-display font-bold text-ink-700 text-base mb-4">Todas las ventas</h3>
            <Table columns={COLS_CON_ACCION} data={ventasConAccion} loading={loading} emptyMessage="No hay ventas registradas" />
          </div>

          {ventaSeleccionada && (
            <div className="card fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-ink-700 text-base">
                  Detalle de venta #{ventaSeleccionada.id}
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-ink-400">
                    Cliente: <strong className="text-ink-700">{ventaSeleccionada.cedulaCliente}</strong>
                  </span>
                  <span className="text-sm font-bold text-ink-800">
                    Total: {fmt(ventaSeleccionada.total)}
                  </span>
                </div>
              </div>
              <Table
                columns={COLS_DETALLES}
                data={ventaSeleccionada.detalles ?? []}
                loading={false}
                emptyMessage="Sin detalles disponibles"
              />
            </div>
          )}
        </div>
      )}

      {/* Tab por cliente */}
      {tab === 'cliente' && (
        <div className="card space-y-5">
          <h3 className="font-display font-bold text-ink-700 text-base">Ventas por cliente</h3>
          <div className="flex gap-3">
            <input
              className="input-field max-w-xs"
              placeholder="Cédula del cliente…"
              value={cedulaInput}
              onChange={(e) => setCedulaInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buscarPorCliente()}
            />
            <button onClick={buscarPorCliente} disabled={loadingCliente} className="btn-primary disabled:opacity-50">
              {loadingCliente ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              ) : <SearchIcon />}
              Buscar
            </button>
            {reporteCliente && (
              <button onClick={() => descargarPDF('cliente', cedulaInput)} className="btn-secondary">
                <PDFIcon /> PDF
              </button>
            )}
          </div>

          {reporteCliente && (
            <div className="space-y-4 fade-in">
              {/* Info cliente */}
              {reporteCliente.nombreCliente && (
                <div className="flex items-center gap-3 bg-accent-500/5 border border-accent-500/20 rounded-xl px-4 py-3">
                  <div className="w-9 h-9 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-500 font-bold text-sm">
                    {reporteCliente.nombreCliente?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-ink-800 text-sm">{reporteCliente.nombreCliente}</p>
                    <p className="text-xs text-ink-400">Cédula: {reporteCliente.cedula}</p>
                  </div>
                </div>
              )}

              {/* Resumen */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-surface-100 rounded-xl p-4 text-center">
                  <p className="font-display font-bold text-xl text-ink-800">
                    {reporteCliente.totalVentas ?? reporteCliente.ventas?.length ?? 0}
                  </p>
                  <p className="text-xs text-ink-400 mt-1">Ventas realizadas</p>
                </div>
                <div className="bg-surface-100 rounded-xl p-4 text-center">
                  <p className="font-display font-bold text-xl text-amber-500">
                    {fmt((reporteCliente.totalFacturado ?? 0) - ((reporteCliente.totalFacturado ?? 0) / 1.19))}
                  </p>
                  <p className="text-xs text-ink-400 mt-1">IVA estimado</p>
                </div>
                <div className="bg-surface-100 rounded-xl p-4 text-center">
                  <p className="font-display font-bold text-xl text-jade-500">
                    {fmt(reporteCliente.totalFacturado ?? 0)}
                  </p>
                  <p className="text-xs text-ink-400 mt-1">Total comprado</p>
                </div>
              </div>

              {/* Listado ventas del cliente */}
              {reporteCliente.ventas && reporteCliente.ventas.length > 0 && (
                <Table
                  columns={COLS_VENTAS}
                  data={reporteCliente.ventas}
                  loading={false}
                  emptyMessage="Sin ventas"
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SearchIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
}
function PDFIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
}