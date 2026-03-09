import { useState } from 'react'
import Table from '../../components/Table'

const VENTAS = [
  { id: 'VTA-001', cliente: 'Laura Gómez', cedula: '1012345678', productos: 3, subtotal: 1395000, iva: 225225, total: 1620225, fecha: '2025-01-08' },
  { id: 'VTA-002', cliente: 'Juan Pérez', cedula: '1098765432', productos: 1, subtotal: 1200000, iva: 144000, total: 1344000, fecha: '2025-01-08' },
  { id: 'VTA-003', cliente: 'Laura Gómez', cedula: '1012345678', productos: 2, subtotal: 195000, iva: 37050, total: 232050, fecha: '2025-01-07' },
  { id: 'VTA-004', cliente: 'Diana Mora', cedula: '1056781234', productos: 3, subtotal: 1395000, iva: 225225, total: 1620225, fecha: '2025-01-07' },
]

const fmt = (n) => `$${Number(n).toLocaleString('es-CO')}`

const byCliente = VENTAS.reduce((acc, v) => {
  if (!acc[v.cedula]) acc[v.cedula] = { cliente: v.cliente, cedula: v.cedula, ventas: 0, total: 0 }
  acc[v.cedula].ventas++
  acc[v.cedula].total += v.total
  return acc
}, {})

const CLIENTE_COLS = [
  { key: 'cliente', label: 'Cliente' },
  { key: 'cedula', label: 'Cédula' },
  { key: 'ventas', label: 'Nº Ventas' },
  { key: 'total', label: 'Total comprado', render: (v) => <span className="font-semibold text-ink-800">{fmt(v)}</span> },
]

const VENTA_COLS = [
  { key: 'id', label: 'ID', render: (v) => <span className="font-mono text-xs text-accent-500">{v}</span> },
  { key: 'fecha', label: 'Fecha' },
  { key: 'cliente', label: 'Cliente' },
  { key: 'productos', label: 'Productos' },
  { key: 'subtotal', label: 'Subtotal', render: (v) => fmt(v) },
  { key: 'iva', label: 'IVA', render: (v) => fmt(v) },
  { key: 'total', label: 'Total', render: (v) => <span className="font-bold text-ink-800">{fmt(v)}</span> },
]

const totalGlobal = VENTAS.reduce((a, v) => a + v.total, 0)
const ivaGlobal = VENTAS.reduce((a, v) => a + v.iva, 0)
const subtotalGlobal = VENTAS.reduce((a, v) => a + v.subtotal, 0)

export default function ReporteVentasCliente() {
  const [tab, setTab] = useState('resumen')

  return (
    <div className="space-y-5 fade-in">
      <div>
        <h2 className="font-display font-bold text-ink-800 text-xl">Reportes de ventas</h2>
        <p className="text-sm text-ink-400 mt-0.5">Análisis de ventas y clientes</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Subtotal ventas', value: fmt(subtotalGlobal), color: 'text-ink-800' },
          { label: 'IVA recaudado', value: fmt(ivaGlobal), color: 'text-amber-500' },
          { label: 'Total ingresos', value: fmt(totalGlobal), color: 'text-jade-500' },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <p className={`font-display font-bold text-2xl ${s.color}`}>{s.value}</p>
            <p className="text-xs text-ink-400 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-surface-200 p-1 rounded-xl w-fit">
        {[
          { id: 'resumen', label: 'Por cliente' },
          { id: 'listado', label: 'Listado de ventas' },
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

      <div className="card">
        {tab === 'resumen' ? (
          <>
            <h3 className="font-display font-bold text-ink-700 text-base mb-4">Ventas por cliente</h3>
            <Table columns={CLIENTE_COLS} data={Object.values(byCliente)} loading={false} />
          </>
        ) : (
          <>
            <h3 className="font-display font-bold text-ink-700 text-base mb-4">Listado completo de ventas</h3>
            <Table columns={VENTA_COLS} data={VENTAS} loading={false} />
          </>
        )}
      </div>
    </div>
  )
}