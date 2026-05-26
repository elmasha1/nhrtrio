import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'
import { money, date, prettyStatus, statusColor } from '../../lib/format'

export default function Orders() {
  const [data, setData] = useState({ data: [] })
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')

  const load = () => api.get('/admin/orders', { params: { search: q, status } }).then(({ data }) => setData(data))
  useEffect(() => { load() }, [q, status])

  return (
    <div className="space-y-5">
      <h1 className="display-2">Orders</h1>
      <div className="grid gap-2 sm:grid-cols-[1fr_220px]">
        <input
          className="input"
          placeholder="Search order # or email…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {['pending','paid','processing','shipped','out_for_delivery','delivered','cancelled','refunded'].map((s) =>
            <option key={s} value={s}>{prettyStatus(s)}</option>)}
        </select>
      </div>

      {/* Mobile list */}
      <div className="grid gap-3 sm:hidden">
        {data.data?.map((o) => (
          <Link to={`/admin/orders/${o.id}`} key={o.id} className="card flex flex-col gap-2 p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono font-semibold">{o.order_number}</span>
              <span className={`chip ${statusColor(o.status)}`}>{prettyStatus(o.status)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-600">{o.user?.name || o.guest_email || '—'}</span>
              <span className="font-display text-lg font-semibold">{money(o.total)}</span>
            </div>
            <div className="text-[11px] uppercase tracking-luxe text-ink-400">{date(o.created_at)}</div>
          </Link>
        ))}
      </div>

      {/* Desktop table */}
      <div className="card hidden overflow-hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-ink-50 text-left text-[11px] uppercase tracking-luxe text-ink-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Placed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {data.data?.map((o) => (
                <tr key={o.id} className="hover:bg-ink-50/60">
                  <td className="px-4 py-3"><Link to={`/admin/orders/${o.id}`} className="font-mono font-semibold hover:underline">{o.order_number}</Link></td>
                  <td className="px-4 py-3">{o.user?.name || o.guest_email || '—'}</td>
                  <td className="px-4 py-3"><span className={`chip ${statusColor(o.status)}`}>{prettyStatus(o.status)}</span></td>
                  <td className="px-4 py-3 font-semibold">{money(o.total)}</td>
                  <td className="px-4 py-3 text-ink-500 whitespace-nowrap">{date(o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
