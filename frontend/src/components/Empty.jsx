export default function Empty({ title = 'Nothing here yet', subtitle, action }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center sm:p-14">
      <h3 className="font-display text-xl font-semibold sm:text-2xl">{title}</h3>
      {subtitle && <p className="mt-2 max-w-sm text-sm text-ink-600">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
