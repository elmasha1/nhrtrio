import { Star } from 'lucide-react'

export default function Stars({ value = 0, size = 16, showValue = false, count }) {
  const v = Number(value) || 0
  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(v) ? 'fill-amber-400 text-amber-400' : 'text-ink-200'}
        />
      ))}
      {showValue && (
        <span className="ml-1 text-xs font-medium text-ink-600">
          {v.toFixed(1)}{count != null && <span className="text-ink-400"> ({count})</span>}
        </span>
      )}
    </div>
  )
}
