import { useState } from 'react'

const STATS = [
  {
    label: 'Ventas del día',
    value: '$4,280',
    change: '+12.5%',
    up: true,
    icon: CartIcon,
    color: 'bg-accent-500/10 text-accent-500',
  },
  {
    label: 'Clientes activos',
    value: '284',
    change: '+3.2%',
    up: true,
    icon: PersonIcon,
    color: 'bg-jade-500/10 text-jade-500',
  },
  {
    label: 'Productos',
    value: '1,042',
    change: '+0.8%',
    up: true,
    icon: BoxIcon,
    color: 'bg-amber-500/10 text-amber-500',
  },
  {
    label: 'Ingresos totales',
    value: '$128,430',
    change: '-1.4%',
    up: false,
    icon: DollarIcon,
    color: 'bg-rose-500/10 text-rose-500',
  },
]

const WEEK_DATA = [
  { day: 'Lun', sales: 3200 },
  { day: 'Mar', sales: 5100 },
  { day: 'Mié', sales: 2800 },
  { day: 'Jue', sales: 6200 },
  { day: 'Vie', sales: 7400 },
  { day: 'Sáb', sales: 5900 },
  { day: 'Dom', sales: 4280 },
]

const TOP_PRODUCTS = [
  { name: 'Laptop Pro 15"', sales: 142, pct: 86 },
  { name: 'Mouse Inalámbrico', sales: 98, pct: 59 },
  { name: 'Teclado Mecánico', sales: 76, pct: 46 },
  { name: 'Monitor 27"', sales: 54, pct: 33 },
  { name: 'Audífonos BT', sales: 38, pct: 23 },
]

const RECENT_SALES = [
  { id: 'VTA-001', client: 'María García', products: 3, total: '$485.00', time: 'hace 5 min' },
  { id: 'VTA-002', client: 'Carlos López', products: 1, total: '$1,200.00', time: 'hace 22 min' },
  { id: 'VTA-003', client: 'Ana Martínez', products: 2, total: '$340.50', time: 'hace 1h' },
  { id: 'VTA-004', client: 'Pedro Rojas', products: 3, total: '$890.00', time: 'hace 2h' },
]

const maxSales = Math.max(...WEEK_DATA.map((d) => d.sales))

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <div key={s.label} className={`card fade-in-delay-${i + 1} group hover:shadow-card-hover transition-shadow`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.up ? 'bg-jade-500/10 text-jade-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {s.change}
              </span>
            </div>
            <p className="text-2xl font-display font-bold text-ink-800">{s.value}</p>
            <p className="text-xs text-ink-400 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Bar chart */}
        <div className="card xl:col-span-2 fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-ink-800 text-base">Ventas esta semana</h3>
              <p className="text-xs text-ink-400 mt-0.5">Ingresos diarios en $</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-accent-500" />
              <span className="text-xs text-ink-400">Ventas</span>
            </div>
          </div>
          <div className="flex items-end gap-3 h-40">
            {WEEK_DATA.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center" style={{ height: '120px' }}>
                  <div
                    className="w-full bg-accent-500/20 rounded-t-md relative group cursor-pointer hover:bg-accent-500/30 transition-colors"
                    style={{ height: `${(d.sales / maxSales) * 100}%` }}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-accent-500 rounded-t-md transition-all duration-300"
                      style={{ height: '60%' }}
                    />
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-ink-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${d.sales.toLocaleString()}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-ink-400 font-medium">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="card fade-in">
          <h3 className="font-display font-bold text-ink-800 text-base mb-5">Más vendidos</h3>
          <div className="space-y-4">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.name}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink-400 w-4">#{i + 1}</span>
                    <span className="text-xs font-medium text-ink-700 truncate max-w-28">{p.name}</span>
                  </div>
                  <span className="text-xs text-ink-400">{p.sales} uds.</span>
                </div>
                <div className="h-1.5 bg-surface-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-500 rounded-full"
                    style={{ width: `${p.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent sales */}
      <div className="card fade-in">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-ink-800 text-base">Ventas recientes</h3>
          <a href="/ventas" className="text-xs font-medium text-accent-500 hover:text-accent-400 transition-colors">
            Ver todas →
          </a>
        </div>
        <div className="overflow-x-auto -mx-6">
          <table className="w-full">
            <thead>
              <tr>
                {['ID', 'Cliente', 'Productos', 'Total', 'Hora'].map((h) => (
                  <th key={h} className="table-th first:pl-6 last:pr-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_SALES.map((s) => (
                <tr key={s.id} className="hover:bg-surface-100 transition-colors">
                  <td className="table-td pl-6 font-mono text-xs text-accent-500">{s.id}</td>
                  <td className="table-td font-medium">{s.client}</td>
                  <td className="table-td text-ink-400">{s.products}</td>
                  <td className="table-td font-semibold text-ink-800">{s.total}</td>
                  <td className="table-td pr-6 text-ink-400 text-xs">{s.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* icons */
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