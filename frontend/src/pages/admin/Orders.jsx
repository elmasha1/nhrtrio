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
      <h1 className="text-3xl font-bold">Orders</h1>
      <div className="flex flex-wrap gap-2">
        <input className="input max-w-sm" placeholder="Search order # or email…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input max-w-xs" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {['pending','paid','processing','shipped','out_for_delivery','delivered','cancelled','refunded'].map((s) =>
            <option key={s} value={s}>{prettyStatus(s)}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-500">
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
              <tr key={o.id}>
                <td className="px-4 py-3"><Link to={`/admin/orders/${o.id}`} className="font-mono font-semibold hover:underline">{o.order_number}</Link></td>
                <td className="px-4 py-3">{o.user?.name || o.guest_email || '—'}</td>
                <td className="px-4 py-3"><span className={`chip ${statusColor(o.status)}`}>{prettyStatus(o.status)}</span></td>
                <td className="px-4 py-3 font-semibold">{money(o.total)}</td>
                <td className="px-4 py-3 text-ink-500">{date(o.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
