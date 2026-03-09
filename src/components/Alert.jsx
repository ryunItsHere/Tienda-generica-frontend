const VARIANTS = {
  success: 'bg-jade-500/10 text-jade-500 border-jade-500/20',
  error:   'bg-rose-500/10 text-rose-500 border-rose-500/20',
  warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  info:    'bg-accent-500/10 text-accent-500 border-accent-500/20',
}

export default function Alert({ variant = 'info', message, onClose }) {
  if (!message) return null
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-sm font-medium fade-in ${VARIANTS[variant]}`}>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}