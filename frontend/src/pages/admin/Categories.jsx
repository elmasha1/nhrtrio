import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import api from '../../lib/api'

const blank = { name: '', description: '', image: '', is_active: true, sort_order: 0 }

export default function Categories() {
  const [list, setList] = useState([])
  const [editing, setEditing] = useState(null)

  const load = () => api.get('/admin/categories').then(({ data }) => setList(data))
  useEffect(() => { load() }, [])

  const save = async (e) => {
    e.preventDefault()
    if (editing.id) await api.put(`/admin/categories/${editing.id}`, editing)
    else await api.post('/admin/categories', editing)
    setEditing(null); load()
  }

  const del = async (c) => { if (confirm('Delete category?')) { await api.delete(`/admin/categories/${c.id}`); load() } }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <button onClick={() => setEditing(blank)} className="btn-primary"><Plus className="h-4 w-4" /> New</button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <div key={c.id} className="card overflow-hidden">
            <img src={c.image} className="aspect-[4/3] w-full object-cover" alt="" />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{c.name}</div>
                <span className="chip">{c.products_count} products</span>
              </div>
              <p className="mt-1 text-xs text-ink-500 line-clamp-2">{c.description}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setEditing(c)} className="btn-outline !py-1.5 !px-3 text-xs">Edit</button>
                <button onClick={() => del(c)} className="btn-ghost !py-1.5 !px-3 text-xs text-rose-600"><Trash2 className="h-3 w-3" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <form onSubmit={save} className="card p-6">
          <h2 className="font-semibold">{editing.id ? 'Edit' : 'New'} category</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div><div className="label">Name</div><input className="input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required /></div>
            <div><div className="label">Sort order</div><input type="number" className="input" value={editing.sort_order || 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></div>
            <div className="sm:col-span-2"><div className="label">Image URL</div><input className="input" value={editing.image || ''} onChange={(e) => setEditing({ ...editing, image: e.target.value })} /></div>
            <div className="sm:col-span-2"><div className="label">Description</div><textarea className="input resize-none" rows={3} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={!!editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} /> Active</label>
          </div>
          <div className="mt-4 flex gap-2"><button className="btn-primary">Save</button><button type="button" onClick={() => setEditing(null)} className="btn-ghost">Cancel</button></div>
        </form>
      )}
    </div>
  )
}
