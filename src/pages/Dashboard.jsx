import { useState, useEffect } from 'react'
import { reporteService } from '../api/reporteService'
import { clienteService } from '../api/clienteService'
import { productoService } from '../api/productoService'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const fmt = (n) => `$${Number(n || 0).toLocaleString('es-CO')}`

export default function Dashboard() {
  const { isAdmin } = useAuth()
  const [totalGeneral, setTotalGeneral] = useState(null)
  const [clientes, setClientes]         = useState([])
  const [productos, setProductos]       = useState([])
  const [ventas, setVentas]             = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        if (isAdmin()) {
          const [resReporte, resClientes, resProductos, resVentas] = await Promise.allSettled([
            reporteService.getTotalGeneral(),
            clienteService.getAll(),
            productoService.getAll(),
            reporteService.getVentas(),
          ])
          if (resReporte.status === 'fulfilled')   setTotalGeneral(resReporte.value.data)
          if (resClientes.status === 'fulfilled')  setClientes(resClientes.value.data ?? [])
          if (resProductos.status === 'fulfilled') setProductos(resProductos.value.data ?? [])
          if (resVentas.status === 'fulfilled')    setVentas(resVentas.value.data ?? [])
        } else {
          const [resClientes, resProductos] = await Promise.allSettled([
            clienteService.getAll(),
            productoService.getAll(),
          ])
          if (resClientes.status === 'fulfilled')  setClientes(resClientes.value.data ?? [])
          if (resProductos.status === 'fulfilled') setProductos(resProductos.value.data ?? [])
        }
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const totalFacturado = totalGeneral?.totalFacturado ?? 0
  const ventasHoy = ventas.filter((v) => {
    if (!v.fecha) return false
    return new Date(v.fecha).toDateString() === new Date().toDateString()
  })
  const totalHoy = ventasHoy.reduce((a, v) => a + (v.total ?? 0), 0)
  const ventasRecientes = [...ventas]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5)

  const conteoProductos = {}
  ventas.forEach((v) => {
    ;(v.detalles ?? []).forEach((d) => {
      if (!d.nombreProducto) return
      if (!conteoProductos[d.nombreProducto])
        conteoProductos[d.nombreProducto] = { nombre: d.nombreProducto, unidades: 0 }
      conteoProductos[d.nombreProducto].unidades += d.cantidad ?? 0
    })
  })
  const topProductos = Object.values(conteoProductos)
    .sort((a, b) => b.unidades - a.unidades)
    .slice(0, 5)
  const maxUnidades = topProductos[0]?.unidades || 1

  const hoy = new Date()
  const dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(hoy)
    d.setDate(hoy.getDate() - (6 - i))
    return d
  })
  const ventasPorDia = dias.map((d) => ({
    label: d.toLocaleDateString('es-CO', { weekday: 'short' }),
    total: ventas
      .filter((v) => v.fecha && new Date(v.fecha).toDateString() === d.toDateString())
      .reduce((a, v) => a + (v.total ?? 0), 0),
  }))
  const maxDia = Math.max(...ventasPorDia.map((d) => d.total), 1)

  const STATS_ADMIN = [
    { label: 'Ventas del día',   value: fmt(totalHoy),       sub: `${ventasHoy.length} transacciones`,  icon: CartIcon,   color: 'bg-accent-500/10 text-accent-500' },
    { label: 'Clientes activos', value: clientes.length,     sub: 'registrados en sistema',             icon: PersonIcon, color: 'bg-jade-500/10 text-jade-500' },
    { label: 'Productos',        value: productos.length,    sub: 'en inventario',                      icon: BoxIcon,    color: 'bg-amber-500/10 text-amber-500' },
    { label: 'Ingresos totales', value: fmt(totalFacturado), sub: `${ventas.length} ventas totales`,    icon: DollarIcon, color: 'bg-rose-500/10 text-rose-500' },
  ]

  const STATS_EMPLEADO = [
    { label: 'Clientes',  value: clientes.length,  sub: 'registrados en sistema', icon: PersonIcon, color: 'bg-jade-500/10 text-jade-500' },
    { label: 'Productos', value: productos.length, sub: 'en inventario',          icon: BoxIcon,    color: 'bg-amber-500/10 text-amber-500' },
  ]

  const STATS = isAdmin() ? STATS_ADMIN : STATS_EMPLEADO

  return (
    <div className="space-y-6">

      {/* Stat cards */}
      <div className={`grid gap-4 ${isAdmin() ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 max-w-xl'}`}>
        {STATS.map((s, i) => (
          <div key={s.label} className={`card fade-in-delay-${i + 1} hover:shadow-card-hover transition-shadow`}>
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="w-10 h-10 rounded-xl bg-surface-300" />
                <div className="h-7 w-24 bg-surface-300 rounded" />
                <div className="h-3 w-32 bg-surface-200 rounded" />
              </div>
            ) : (
              <>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-display font-bold text-ink-800">{s.value}</p>
                <p className="text-xs text-ink-400 mt-1 font-medium">{s.label}</p>
                <p className="text-xs text-ink-400 mt-0.5">{s.sub}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Solo ADMIN */}
      {isAdmin() && (
        <>
          {/* Gráficos */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

            {/* Ventas por día */}
            <div className="card xl:col-span-2 fade-in">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-bold text-ink-800 text-base">Ventas últimos 7 días</h3>
                  <p className="text-xs text-ink-400 mt-0.5">Total facturado por día</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm bg-accent-500" />
                  <span className="text-xs text-ink-400">Ventas</span>
                </div>
              </div>
              {loading ? (
                <div className="h-40 bg-surface-200 rounded-xl animate-pulse" />
              ) : (
                <div className="flex items-end gap-3 h-40">
                  {ventasPorDia.map((d) => (
                    <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex items-end justify-center" style={{ height: '120px' }}>
                        <div
                          className="w-full rounded-t-md relative group cursor-pointer bg-accent-500/10 hover:bg-accent-500/20 transition-colors"
                          style={{ height: d.total === 0 ? '4px' : `${(d.total / maxDia) * 100}%` }}
                        >
                          {d.total > 0 && (
                            <>
                              <div className="absolute bottom-0 left-0 right-0 bg-accent-500 rounded-t-md" style={{ height: '60%' }} />
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-ink-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {fmt(d.total)}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-ink-400 font-medium capitalize">{d.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top productos */}
            <div className="card fade-in">
              <h3 className="font-display font-bold text-ink-800 text-base mb-5">Más vendidos</h3>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse space-y-1.5">
                      <div className="h-3 bg-surface-300 rounded w-3/4" />
                      <div className="h-1.5 bg-surface-200 rounded" />
                    </div>
                  ))}
                </div>
              ) : topProductos.length === 0 ? (
                <p className="text-sm text-ink-400 text-center py-8">Sin datos de ventas aún</p>
              ) : (
                <div className="space-y-4">
                  {topProductos.map((p, i) => (
                    <div key={p.nombre}>
                      <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-ink-400 w-4">#{i + 1}</span>
                          <span className="text-xs font-medium text-ink-700 truncate max-w-32" title={p.nombre}>
                            {p.nombre}
                          </span>
                        </div>
                        <span className="text-xs text-ink-400">{p.unidades} uds.</span>
                      </div>
                      <div className="h-1.5 bg-surface-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent-500 rounded-full transition-all duration-500"
                          style={{ width: `${(p.unidades / maxUnidades) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Ventas recientes */}
          <div className="card fade-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-ink-800 text-base">Ventas recientes</h3>
              <a href="/ventas" className="text-xs font-medium text-accent-500 hover:text-accent-400 transition-colors">
                Nueva venta →
              </a>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse h-10 bg-surface-200 rounded-lg" />
                ))}
              </div>
            ) : ventasRecientes.length === 0 ? (
              <p className="text-sm text-ink-400 text-center py-8">No hay ventas registradas aún</p>
            ) : (
              <div className="overflow-x-auto -mx-6">
                <table className="w-full">
                  <thead>
                    <tr>
                      {['ID', 'Cliente', 'Fecha', 'Productos', 'Total'].map((h) => (
                        <th key={h} className="table-th first:pl-6 last:pr-6">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ventasRecientes.map((v) => (
                      <tr key={v.id} className="hover:bg-surface-100 transition-colors">
                        <td className="table-td pl-6 font-mono text-xs text-accent-500">#{v.id}</td>
                        <td className="table-td font-medium">{v.cedulaCliente}</td>
                        <td className="table-td text-ink-400 text-xs">
                          {v.fecha ? new Date(v.fecha).toLocaleString('es-CO') : '—'}
                        </td>
                        <td className="table-td text-ink-400">{v.detalles?.length ?? 0}</td>
                        <td className="table-td pr-6 font-semibold text-ink-800">{fmt(v.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Solo EMPLEADO: accesos rápidos */}
      {!isAdmin() && (
  <div className="space-y-5">
    {/* Cards informativas */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="card bg-gradient-to-br from-accent-500/5 to-accent-500/10 border border-accent-500/20 fade-in">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center flex-shrink-0">
            <CartIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-ink-800 text-base">Registrar venta</p>
            <p className="text-xs text-ink-400 mt-1 leading-relaxed">
              Busca un cliente por cédula, agrega hasta 3 productos y registra la venta con cálculo automático de IVA.
            </p>
            <Link to="/ventas" className="inline-flex items-center gap-1 text-xs font-semibold text-accent-500 hover:text-accent-400 mt-3 transition-colors">
              Ir a ventas →
            </Link>
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-br from-jade-500/5 to-jade-500/10 border border-jade-500/20 fade-in">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-jade-500 flex items-center justify-center flex-shrink-0">
            <PersonIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-ink-800 text-base">Gestión de clientes</p>
            <p className="text-xs text-ink-400 mt-1 leading-relaxed">
              Consulta, crea y actualiza clientes del sistema. Busca por nombre, cédula o correo.
            </p>
            <Link to="/clientes" className="inline-flex items-center gap-1 text-xs font-semibold text-jade-500 hover:text-jade-400 mt-3 transition-colors">
              Ir a clientes →
            </Link>
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-br from-amber-500/5 to-amber-500/10 border border-amber-500/20 fade-in">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
            <BoxIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-ink-800 text-base">Inventario de productos</p>
            <p className="text-xs text-ink-400 mt-1 leading-relaxed">
              Consulta el catálogo de productos disponibles, precios y proveedores asociados.
            </p>
            <Link to="/productos" className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500 hover:text-amber-400 mt-3 transition-colors">
              Ir a productos →
            </Link>
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-br from-ink-600/5 to-ink-600/10 border border-ink-600/20 fade-in">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-ink-600 flex items-center justify-center flex-shrink-0">
            <TruckIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-ink-800 text-base">Proveedores</p>
            <p className="text-xs text-ink-400 mt-1 leading-relaxed">
              Consulta y gestiona los proveedores registrados en el sistema con su información de contacto.
            </p>
            <Link to="/proveedores" className="inline-flex items-center gap-1 text-xs font-semibold text-ink-500 hover:text-ink-700 mt-3 transition-colors">
              Ir a proveedores →
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  )
}

function CartIcon({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></svg>
}
function PersonIcon({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}
function BoxIcon({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
}
function DollarIcon({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
}
function TruckIcon({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 5v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
}