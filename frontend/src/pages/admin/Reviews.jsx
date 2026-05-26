import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Stars from '../../components/Stars'
import { date } from '../../lib/format'

export default function Reviews() {
  const [data, setData] = useState({ data: [] })
  const [status, setStatus] = useState('')

  const load = () => api.get('/admin/reviews', { params: { status } }).then(({ data }) => setData(data))
  useEffect(() => { load() }, [status])

  const setS = async (r, s) => { await api.patch(`/admin/reviews/${r.id}/status`, { status: s }); load() }
  const del = async (r) => { if (confirm('Delete review?')) { await api.delete(`/admin/reviews/${r.id}`); load() } }

  return (
    <div className="space-y-5">
      <h1 className="display-2">Reviews</h1>
      <select className="input max-w-xs" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>

      <div className="space-y-3">
        {data.data?.map((r) => (
          <div key={r.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold">{r.user?.name}</div>
                <div className="text-[11px] uppercase tracking-luxe text-ink-500">on {r.product?.name} · {date(r.created_at)}</div>
              </div>
              <Stars value={r.rating} size={14} />
            </div>
            {r.title && <h4 className="mt-3 font-display text-lg font-semibold">{r.title}</h4>}
            {r.body && <p className="mt-1 text-sm leading-relaxed text-ink-700">{r.body}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="chip">{r.status}</span>
              {r.status !== 'approved' && <button onClick={() => setS(r, 'approved')} className="btn-outline !py-1.5 !px-3 text-xs">Approve</button>}
              {r.status !== 'rejected' && <button onClick={() => setS(r, 'rejected')} className="btn-outline !py-1.5 !px-3 text-xs">Reject</button>}
              <button onClick={() => del(r)} className="btn-ghost !py-1.5 !px-3 text-xs text-rose-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
