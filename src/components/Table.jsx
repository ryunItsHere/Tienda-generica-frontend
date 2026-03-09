export default function Table({ columns, data, loading, emptyMessage = 'Sin datos disponibles' }) {
  if (loading) {
    return (
      <div className="w-full overflow-hidden rounded-xl border border-surface-300 bg-white">
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3 text-ink-500">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            <span className="text-sm font-medium">Cargando datos…</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-surface-300 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="table-th first:rounded-tl-xl last:rounded-tr-xl">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-sm text-ink-400">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth={1.5} />
                    </svg>
                    {emptyMessage}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className="hover:bg-surface-100 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="table-td">
                      {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}