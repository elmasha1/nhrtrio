import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../lib/api'

const empty = {
  category_id: '', name: '', sku: '', short_description: '', description: '',
  price: '', compare_price: '', stock: 0, sizes: '', colors: '', material: '',
  gender: 'unisex', is_featured: false, status: 'active', images: '',
}

export default function ProductForm() {
  const { id } = useParams()
  const nav = useNavigate()
  const [form, setForm] = useState(empty)
  const [cats, setCats] = useState([])
  const [err, setErr] = useState('')

  useEffect(() => {
    api.get('/admin/categories').then(({ data }) => setCats(data))
    if (id) api.get(`/admin/products/${id}`).then(({ data }) => {
      setForm({
        ...data,
        sizes: (data.sizes || []).join(','),
        colors: (data.colors || []).join(','),
        images: (data.images || []).map((i) => i.url).join('\n'),
      })
    })
  }, [id])

  const submit = async (e) => {
    e.preventDefault(); setErr('')
    const payload = {
      ...form,
      sizes: form.sizes ? form.sizes.split(',').map((s) => s.trim()).filter(Boolean) : [],
      colors: form.colors ? form.colors.split(',').map((s) => s.trim()).filter(Boolean) : [],
      images: form.images ? form.images.split('\n').map((s) => s.trim()).filter(Boolean) : [],
      category_id: form.category_id || null,
      compare_price: form.compare_price || null,
    }
    try {
      if (id) await api.put(`/admin/products/${id}`, payload)
      else await api.post('/admin/products', payload)
      nav('/admin/products')
    } catch (e) {
      const errors = e.response?.data?.errors
      setErr(errors ? Object.values(errors).flat().join(' ') : 'Could not save')
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <h1 className="display-2">{id ? 'Edit product' : 'New product'}</h1>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px] lg:gap-6">
        <div className="space-y-5 min-w-0">
          <div className="card p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold">Basic info</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2"><div className="label">Name</div><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div><div className="label">SKU</div><input className="input" value={form.sku || ''} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></div>
              <div><div className="label">Category</div>
                <select className="input" value={form.category_id || ''} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                  <option value="">—</option>
                  {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2"><div className="label">Short description</div><input className="input" value={form.short_description || ''} onChange={(e) => setForm({ ...form, short_description: e.target.value })} /></div>
              <div className="sm:col-span-2"><div className="label">Description</div><textarea rows={6} className="input resize-none" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold">Variants</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div><div className="label">Sizes (comma-separated)</div><input className="input" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="XS,S,M,L,XL" /></div>
              <div><div className="label">Colors (comma-separated)</div><input className="input" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="Black,Ivory,Navy" /></div>
              <div><div className="label">Material</div><input className="input" value={form.material || ''} onChange={(e) => setForm({ ...form, material: e.target.value })} /></div>
              <div><div className="label">Gender</div>
                <select className="input" value={form.gender || ''} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                  <option value="">—</option><option value="men">Men</option><option value="women">Women</option><option value="unisex">Unisex</option><option value="kids">Kids</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold">Images</h2>
            <p className="mt-1 text-xs text-ink-500">Paste one image URL per line. The first image is the cover.</p>
            <textarea rows={5} className="input mt-3 resize-none font-mono text-xs" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="https://..." />
          </div>
        </div>

        <aside className="space-y-5">
          <div className="card p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold">Pricing &amp; stock</h2>
            <div className="mt-4 space-y-3">
              <div><div className="label">Price</div><input type="number" step="0.01" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
              <div><div className="label">Compare-at price</div><input type="number" step="0.01" className="input" value={form.compare_price || ''} onChange={(e) => setForm({ ...form, compare_price: e.target.value })} /></div>
              <div><div className="label">Stock</div><input type="number" className="input" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required /></div>
            </div>
          </div>

          <div className="card p-5 sm:p-6 space-y-3">
            <h2 className="font-display text-xl font-semibold">Status</h2>
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option>
            </select>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured on home
            </label>
          </div>

          {err && <p className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{err}</p>}
          <button className="btn-primary w-full">{id ? 'Save changes' : 'Create product'}</button>
        </aside>
      </div>
    </form>
  )
}
