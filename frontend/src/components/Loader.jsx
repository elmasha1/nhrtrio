export default function Loader({ label = 'Loading' }) {
  return (
    <div className="grid place-items-center py-20 text-xs uppercase tracking-luxe text-ink-500">
      <div className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-ink-200 border-t-ink-900" />
      <span className="mt-4">{label}</span>
    </div>
  )
}
