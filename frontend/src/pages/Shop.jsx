import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import api from '../lib/api'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import Empty from '../components/Empty'

export default function Shop() {
  const { category } = useParams()
  const [params, setParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [meta, setMeta] = useState({})
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [cats, setCats] = useState([])

  const search = params.get('search') || ''
  const sort = params.get('sort') || 'newest'
  const minPrice = params.get('min_price') || ''
  const maxPrice = params.get('max_price') || ''
  const featured = params.get('featured') === '1'
  const onSale = params.get('on_sale') === '1'

  useEffect(() => { api.get('/categories').then((r) => setCats(r.data)) }, [])

  useEffect(() => {
    setLoading(true)
    api.get('/products', {
      params: {
        category: category || undefined,
        search: search || undefined,
        sort, min_price: minPrice || undefined, max_price: maxPrice || undefined,
        featured: featured ? 1 : undefined, on_sale: onSale ? 1 : undefined,
        per_page: 24,
      },
    }).then(({ data }) => {
      setProducts(data.data)
      setMeta({ total: data.total, from: data.from, to: data.to })
    }).finally(() => setLoading(false))
  }, [category, search, sort, minPrice, maxPrice, featured, onSale])

  const set = (k, v) => {
    const p = new URLSearchParams(params)
    if (v == null || v === '') p.delete(k); else p.set(k, v)
    setParams(p, { replace: true })
  }

  const heading = category ? cats.find((c) => c.slug === category)?.name || category : 'All products'

  return (
    <div className="container-narrow py-10">
      <div className="mb-6">
        <h1 className="text-4xl font-bold capitalize">{heading}</h1>
        <p className="mt-1 text-sm text-ink-600">{meta.total ?? 0} products{search && ` matching "${search}"`}</p>
      </div>

      <div className="flex items-center justify-between gap-4 border-y border-ink-100 py-3">
        <button className="btn-ghost !py-2 md:hidden" onClick={() => setShowFilters((v) => !v)}>
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
        <div className="hidden gap-2 md:flex">
          {[
            { k: 'featured', v: '1', label: 'Featured' },
            { k: 'on_sale', v: '1', label: 'On sale' },
          ].map((f) => {
            const active = params.get(f.k) === f.v
            return (
              <button key={f.k} onClick={() => set(f.k, active ? null : f.v)}
                className={`chip cursor-pointer ${active ? 'bg-ink-900 text-white' : ''}`}>
                {f.label}
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-500">Sort:</span>
          <select value={sort} onChange={(e) => set('sort', e.target.value)} className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-sm">
            <option value="newest">Newest</option>
            <option value="popular">Most popular</option>
            <option value="rating">Top rated</option>
            <option value="price_asc">Price: low → high</option>
            <option value="price_desc">Price: high → low</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="card p-4 space-y-5">
            <div className="flex items-center justify-between lg:hidden">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)}><X className="h-4 w-4" /></button>
            </div>
            <div>
              <div className="label">Category</div>
              <ul className="space-y-1">
                <li><button onClick={() => set('search', null) /* nav: keep simple */} className="text-sm text-ink-700">All</button></li>
                {cats.map((c) => (
                  <li key={c.id}>
                    <a href={`/shop/${c.slug}`} className={`block rounded-md px-2 py-1 text-sm hover:bg-ink-100 ${category === c.slug ? 'bg-ink-900 text-white hover:bg-ink-900' : ''}`}>
                      {c.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="label">Price</div>
              <div className="flex items-center gap-2">
                <input className="input !py-2" placeholder="Min" type="number" value={minPrice} onChange={(e) => set('min_price', e.target.value)} />
                <span className="text-ink-400">—</span>
                <input className="input !py-2" placeholder="Max" type="number" value={maxPrice} onChange={(e) => set('max_price', e.target.value)} />
              </div>
            </div>
            <button onClick={() => setParams({})} className="btn-outline w-full">Clear all</button>
          </div>
        </aside>

        <div>
          {loading ? <Loader /> : products.length === 0 ? (
            <Empty title="No products match those filters" subtitle="Try widening your search." />
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
