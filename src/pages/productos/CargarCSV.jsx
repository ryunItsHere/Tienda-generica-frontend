import { useState } from 'react'
import { Link } from 'react-router-dom'
import FileUpload from '../../components/FileUpload'
import Alert from '../../components/Alert'

export default function CargarCSV() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [alert, setAlert] = useState(null)

  const handleUpload = async () => {
    if (!file) return setAlert({ type: 'warning', msg: 'Selecciona un archivo CSV primero.' })
    setLoading(true)
    setProgress(0)
    setAlert(null)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) { clearInterval(interval); return p }
        return p + 10
      })
    }, 200)

    try {
      // Real call: await productoService.uploadCSV(formData)
      await new Promise((r) => setTimeout(r, 2200))
      setProgress(100)
      setAlert({ type: 'success', msg: `Archivo "${file.name}" cargado correctamente. Productos importados.` })
      setFile(null)
    } catch {
      setAlert({ type: 'error', msg: 'Error al cargar el archivo. Verifica el formato CSV.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5 fade-in max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to="/productos" className="text-ink-400 hover:text-ink-700 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
        </Link>
        <div>
          <h2 className="font-display font-bold text-ink-800 text-xl">Cargar CSV de productos</h2>
          <p className="text-sm text-ink-400 mt-0.5">Importa productos masivamente desde un archivo CSV</p>
        </div>
      </div>

      {alert && <Alert variant={alert.type} message={alert.msg} onClose={() => setAlert(null)} />}

      <div className="card space-y-5">
        {/* Format hint */}
        <div className="bg-accent-500/5 border border-accent-500/20 rounded-xl p-4">
          <p className="text-xs font-semibold text-accent-500 mb-2 uppercase tracking-wide">Formato esperado</p>
          <code className="text-xs text-ink-600 font-mono block bg-white rounded-lg px-3 py-2 border border-surface-300">
            codigo,nombre,precioCompra,ivaCompra,precioVenta,proveedor
          </code>
        </div>

        <FileUpload accept=".csv" onFileSelect={setFile} label="Seleccionar archivo CSV" />

        {/* Progress bar */}
        {loading && (
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-medium text-ink-600">Cargando…</span>
              <span className="text-xs font-semibold text-accent-500">{progress}%</span>
            </div>
            <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
              Subiendo…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              Subir archivo
            </>
          )}
        </button>
      </div>
    </div>
  )
}