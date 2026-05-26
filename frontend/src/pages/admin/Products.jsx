import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import api from '../../lib/api'
import { money } from '../../lib/format'

export default function Products() {
  const [data, setData] = useState({ data: [] })
  const [q, setQ] = useState('')

  const load = () => api.get('/admin/products', { params: { search: q } }).then(({ data }) => setData(data))
  useEffect(() => { load() }, [q])

  const del = async (id) => {
    if (!confirm('Delete this product?')) return
    await api.delete(`/admin/products/${id}`); load()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link to="/admin/products/new" className="btn-primary"><Plus className="h-4 w-4" /> New product</Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input className="input pl-9" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {data.data?.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images?.[0]?.url} className="h-12 w-10 rounded-md object-cover" alt="" />
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-xs text-ink-500">SKU {p.sku}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{p.category?.name}</td>
                <td className="px-4 py-3 font-semibold">{money(p.price)}</td>
                <td className={`px-4 py-3 ${p.stock < 5 ? 'text-amber-700 font-semibold' : ''}`}>{p.stock}</td>
                <td className="px-4 py-3"><span className="chip">{p.status}</span></td>
                <td className="px-4 py-3 text-right">
                  <Link to={`/admin/products/${p.id}`} className="btn-ghost !px-2 !py-1"><Pencil className="h-4 w-4" /></Link>
                  <button onClick={() => del(p.id)} className="btn-ghost !px-2 !py-1 text-rose-600"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
