export default function FormInput({ label, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-ink-600 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input className={`input-field ${error ? 'border-rose-400 focus:ring-rose-400' : ''}`} {...props} />
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  )
}