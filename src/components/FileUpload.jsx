import { useRef, useState } from 'react'

export default function FileUpload({ accept = '.csv', onFileSelect, label = 'Seleccionar archivo' }) {
  const ref = useRef()
  const [fileName, setFileName] = useState(null)

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFileName(file.name)
    onFileSelect?.(file)
  }

  return (
    <div
      className="border-2 border-dashed border-surface-300 rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-accent-500 hover:bg-accent-500/5 transition-all duration-200 group"
      onClick={() => ref.current?.click()}
    >
      <div className="w-12 h-12 rounded-full bg-surface-200 group-hover:bg-accent-500/10 flex items-center justify-center transition-colors">
        <svg className="w-6 h-6 text-ink-400 group-hover:text-accent-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      {fileName ? (
        <div className="text-center">
          <p className="text-sm font-semibold text-accent-500">{fileName}</p>
          <p className="text-xs text-ink-400 mt-1">Haz clic para cambiar</p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm font-semibold text-ink-700">{label}</p>
          <p className="text-xs text-ink-400 mt-1">o arrastra el archivo aquí · {accept.toUpperCase()}</p>
        </div>
      )}
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={handleChange} />
    </div>
  )
}