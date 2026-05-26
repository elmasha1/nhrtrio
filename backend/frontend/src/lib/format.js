export const money = (n, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(n || 0))

export const date = (s) => s ? new Date(s).toLocaleString('en-US', {
  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
}) : ''

export const dayOnly = (s) => s ? new Date(s).toLocaleDateString('en-US', {
  year: 'numeric', month: 'short', day: 'numeric',
}) : ''

export const cls = (...xs) => xs.filter(Boolean).join(' ')

export const statusColor = (s) => ({
  pending:          'bg-amber-100 text-amber-800',
  paid:             'bg-emerald-100 text-emerald-800',
  processing:       'bg-blue-100 text-blue-800',
  shipped:          'bg-indigo-100 text-indigo-800',
  out_for_delivery: 'bg-purple-100 text-purple-800',
  delivered:        'bg-green-100 text-green-800',
  cancelled:        'bg-rose-100 text-rose-800',
  refunded:         'bg-gray-200 text-gray-800',
}[s] || 'bg-ink-100 text-ink-800')

export const prettyStatus = (s) => (s || '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
