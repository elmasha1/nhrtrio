export default function Empty({ title = 'Nothing here yet', subtitle, action }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-ink-600">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
