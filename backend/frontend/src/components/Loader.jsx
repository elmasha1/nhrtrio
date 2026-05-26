export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="grid place-items-center py-16 text-sm text-ink-500">
      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-ink-300 border-t-ink-900" />
      <span className="mt-3">{label}</span>
    </div>
  )
}
