import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import api from '../../lib/api'
import { date } from '../../lib/format'

const blank = { code: '', type: 'percent', value: 10, min_total: 0, usage_limit: '', starts_at: '', expires_at: '', is_active: true }

export default function Coupons() {
  const [data, setData] = useState({ data: [] })
  const [editing, setEditing] = useState(null)

  const load = () => api.get('/admin/coupons').then(({ data }) => setData(data))
  useEffect(() => { load() }, [])

  const save = async (e) => {
    e.preventDefault()
    const payload = { ...editing, usage_limit: editing.usage_limit || null, starts_at: editing.starts_at || null, expires_at: editing.expires_at || null }
    if (editing.id) await api.put(`/admin/coupons/${editing.id}`, payload)
    else await api.post('/admin/coupons', payload)
    setEditing(null); load()
  }

  const del = async (c) => { if (confirm('Delete coupon?')) { await api.delete(`/admin/coupons/${c.id}`); load() } }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Coupons</h1>
        <button onClick={() => setEditing(blank)} className="btn-primary"><Plus className="h-4 w-4" /> New</button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-500">
            <tr><th className="px-4 py-3">Code</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Value</th><th className="px-4 py-3">Min total</th><th className="px-4 py-3">Used</th><th className="px-4 py-3">Expires</th><th></th></tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {data.data?.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-mono font-bold">{c.code}</td>
                <td className="px-4 py-3">{c.type}</td>
                <td className="px-4 py-3">{c.type === 'percent' ? `${c.value}%` : `$${c.value}`}</td>
                <td className="px-4 py-3">${c.min_total}</td>
                <td className="px-4 py-3">{c.used_count}{c.usage_limit ? ` / ${c.usage_limit}` : ''}</td>
                <td className="px-4 py-3 text-ink-500">{c.expires_at ? date(c.expires_at) : '—'}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(c)} className="btn-ghost !py-1 !px-2 text-xs">Edit</button>
                  <button onClick={() => del(c)} className="btn-ghost !py-1 !px-2 text-xs text-rose-600"><Trash2 className="h-3 w-3" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <form onSubmit={save} className="card p-6">
          <h2 className="font-semibold">{editing.id ? 'Edit' : 'New'} coupon</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div><div className="label">Code</div><input className="input uppercase" value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })} required /></div>
            <div><div className="label">Type</div>
              <select className="input" value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })}>
                <option value="percent">Percent</option><option value="fixed">Fixed amount</option>
              </select>
            </div>
            <div><div className="label">Value</div><input type="number" step="0.01" className="input" value={editing.value} onChange={(e) => setEditing({ ...editing, value: e.target.value })} required /></div>
            <div><div className="label">Min total</div><input type="number" step="0.01" className="input" value={editing.min_total || 0} onChange={(e) => setEditing({ ...editing, min_total: e.target.value })} /></div>
            <div><div className="label">Usage limit</div><input type="number" className="input" value={editing.usage_limit || ''} onChange={(e) => setEditing({ ...editing, usage_limit: e.target.value })} /></div>
            <div><div className="label">Expires</div><input type="datetime-local" className="input" value={editing.expires_at ? editing.expires_at.slice(0, 16) : ''} onChange={(e) => setEditing({ ...editing, expires_at: e.target.value })} /></div>
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={!!editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} /> Active</label>
          </div>
          <div className="mt-4 flex gap-2"><button className="btn-primary">Save</button><button type="button" onClick={() => setEditing(null)} className="btn-ghost">Cancel</button></div>
        </form>
      )}
    </div>
  )
}
