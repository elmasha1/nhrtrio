import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { money, date } from '../../lib/format'

export default function Users() {
  const [data, setData] = useState({ data: [] })
  const [q, setQ] = useState('')

  const load = () => api.get('/admin/users', { params: { search: q } }).then(({ data }) => setData(data))
  useEffect(() => { load() }, [q])

  const toggle = async (u) => {
    await api.patch(`/admin/users/${u.id}/role`, { role: u.role === 'admin' ? 'customer' : 'admin' })
    load()
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Customers</h1>
      <input className="input max-w-md" placeholder="Search by name or email…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-500">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Lifetime value</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {data.data?.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3">
                  <div className="font-semibold">{u.name}</div>
                  <div className="text-xs text-ink-500">{u.email}</div>
                </td>
                <td className="px-4 py-3">{u.orders_count}</td>
                <td className="px-4 py-3 font-semibold">{money(u.lifetime_value || 0)}</td>
                <td className="px-4 py-3 text-ink-500">{date(u.created_at)}</td>
                <td className="px-4 py-3"><span className="chip">{u.role}</span></td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => toggle(u)} className="btn-outline !py-1.5 !px-3 text-xs">
                    {u.role === 'admin' ? 'Demote to customer' : 'Promote to admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
