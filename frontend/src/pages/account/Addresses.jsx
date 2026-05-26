import { useEffect, useState } from 'react'
import { Plus, Trash2, Star } from 'lucide-react'
import api from '../../lib/api'

const blank = { full_name: '', phone: '', line1: '', line2: '', city: '', state: '', postal_code: '', country: 'US', is_default: false }

export default function Addresses() {
  const [list, setList] = useState([])
  const [editing, setEditing] = useState(null)

  const load = () => api.get('/addresses').then(({ data }) => setList(data))
  useEffect(() => { load() }, [])

  const save = async (e) => {
    e.preventDefault()
    if (editing.id) await api.put(`/addresses/${editing.id}`, editing)
    else await api.post('/addresses', editing)
    setEditing(null); load()
  }

  const remove = async (id) => {
    if (!confirm('Delete this address?')) return
    await api.delete(`/addresses/${id}`); load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Addresses</h2>
        <button onClick={() => setEditing(blank)} className="btn-primary !py-2"><Plus className="h-4 w-4" /> Add</button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {list.map((a) => (
          <div key={a.id} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{a.full_name}</div>
                <div className="text-sm text-ink-600">{a.line1}{a.line2 && `, ${a.line2}`}</div>
                <div className="text-sm text-ink-600">{a.city}, {a.state} {a.postal_code}, {a.country}</div>
                <div className="mt-1 text-xs text-ink-500">{a.phone}</div>
              </div>
              {a.is_default && <span className="chip bg-emerald-100 text-emerald-700"><Star className="h-3 w-3" /> Default</span>}
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setEditing(a)} className="btn-outline !py-1.5 !px-3 text-xs">Edit</button>
              <button onClick={() => remove(a.id)} className="btn-ghost !py-1.5 !px-3 text-xs text-rose-600"><Trash2 className="h-3 w-3" /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <form onSubmit={save} className="card p-6">
          <h3 className="font-semibold">{editing.id ? 'Edit address' : 'New address'}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2"><div className="label">Full name</div><input className="input" value={editing.full_name} onChange={(e) => setEditing({ ...editing, full_name: e.target.value })} required /></div>
            <div><div className="label">Phone</div><input className="input" value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} required /></div>
            <div><div className="label">Country (ISO 2)</div><input className="input" value={editing.country} maxLength={2} onChange={(e) => setEditing({ ...editing, country: e.target.value.toUpperCase() })} required /></div>
            <div className="sm:col-span-2"><div className="label">Address line 1</div><input className="input" value={editing.line1} onChange={(e) => setEditing({ ...editing, line1: e.target.value })} required /></div>
            <div className="sm:col-span-2"><div className="label">Address line 2</div><input className="input" value={editing.line2 || ''} onChange={(e) => setEditing({ ...editing, line2: e.target.value })} /></div>
            <div><div className="label">City</div><input className="input" value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })} required /></div>
            <div><div className="label">State</div><input className="input" value={editing.state || ''} onChange={(e) => setEditing({ ...editing, state: e.target.value })} /></div>
            <div><div className="label">Postal code</div><input className="input" value={editing.postal_code} onChange={(e) => setEditing({ ...editing, postal_code: e.target.value })} required /></div>
            <label className="sm:col-span-2 inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!editing.is_default} onChange={(e) => setEditing({ ...editing, is_default: e.target.checked })} /> Make this my default address
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="btn-primary">Save</button>
            <button type="button" onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
          </div>
        </form>
      )}
    </div>
  )
}
