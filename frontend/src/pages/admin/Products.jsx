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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="display-2">Products</h1>
        <Link to="/admin/products/new" className="btn-primary"><Plus className="h-4 w-4" /> New product</Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input className="input pl-9" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 sm:hidden">
        {data.data?.map((p) => (
          <div key={p.id} className="card p-4">
            <div className="flex items-start gap-3">
              <img src={p.images?.[0]?.url} className="h-16 w-14 rounded-md object-cover" alt="" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{p.name}</div>
                <div className="mt-0.5 text-[11px] uppercase tracking-luxe text-ink-500">SKU {p.sku}</div>
                <div className="mt-1 text-sm">{p.category?.name}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-semibold">{money(p.price)}</span>
                  <span className={p.stock < 5 ? 'text-amber-700 font-semibold' : 'text-ink-500'}>Stock {p.stock}</span>
                  <span className="chip">{p.status}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Link to={`/admin/products/${p.id}`} className="btn-outline !py-2 !px-3 text-xs"><Pencil className="h-4 w-4" /> Edit</Link>
              <button onClick={() => del(p.id)} className="btn-ghost !py-2 !px-3 text-xs text-rose-600">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="card hidden overflow-hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-ink-50 text-left text-[11px] uppercase tracking-luxe text-ink-500">
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
                <tr key={p.id} className="hover:bg-ink-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]?.url} className="h-12 w-10 rounded-md object-cover" alt="" />
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-[11px] uppercase tracking-luxe text-ink-500">SKU {p.sku}</div>
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
    </div>
  )
}
