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
      <h1 className="display-2">Customers</h1>
      <input
        className="input max-w-md"
        placeholder="Search by name or email…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {/* Mobile cards */}
      <div className="grid gap-3 sm:hidden">
        {data.data?.map((u) => (
          <div key={u.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate font-semibold">{u.name}</div>
                <div className="truncate text-xs text-ink-500">{u.email}</div>
              </div>
              <span className="chip">{u.role}</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div><div className="font-semibold">{u.orders_count}</div><div className="text-[10px] uppercase tracking-luxe text-ink-500">Orders</div></div>
              <div><div className="font-semibold">{money(u.lifetime_value || 0)}</div><div className="text-[10px] uppercase tracking-luxe text-ink-500">LTV</div></div>
              <div><div className="font-semibold">{date(u.created_at)}</div><div className="text-[10px] uppercase tracking-luxe text-ink-500">Joined</div></div>
            </div>
            <button onClick={() => toggle(u)} className="btn-outline mt-3 w-full !py-2 text-xs">
              {u.role === 'admin' ? 'Demote to customer' : 'Promote to admin'}
            </button>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="card hidden overflow-hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-ink-50 text-left text-[11px] uppercase tracking-luxe text-ink-500">
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
                <tr key={u.id} className="hover:bg-ink-50/60">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{u.name}</div>
                    <div className="text-xs text-ink-500">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">{u.orders_count}</td>
                  <td className="px-4 py-3 font-semibold">{money(u.lifetime_value || 0)}</td>
                  <td className="px-4 py-3 text-ink-500 whitespace-nowrap">{date(u.created_at)}</td>
                  <td className="px-4 py-3"><span className="chip">{u.role}</span></td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => toggle(u)} className="btn-outline !py-1.5 !px-3 text-xs whitespace-nowrap">
                      {u.role === 'admin' ? 'Demote to customer' : 'Promote to admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
