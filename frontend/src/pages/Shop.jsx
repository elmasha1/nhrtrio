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

  useEffect(() => {
    document.body.style.overflow = showFilters ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showFilters])

  const set = (k, v) => {
    const p = new URLSearchParams(params)
    if (v == null || v === '') p.delete(k); else p.set(k, v)
    setParams(p, { replace: true })
  }

  const heading = category ? cats.find((c) => c.slug === category)?.name || category : 'All products'

  const Filters = (
    <div className="space-y-6">
      <div>
        <div className="label">Category</div>
        <ul className="space-y-1">
          {cats.map((c) => (
            <li key={c.id}>
              <a
                href={`/shop/${c.slug}`}
                className={`block rounded-md px-2 py-1.5 text-sm transition hover:bg-ink-100 ${
                  category === c.slug ? 'bg-ink-900 text-white hover:bg-ink-900' : 'text-ink-700'
                }`}
              >
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
      <div className="flex flex-wrap gap-2">
        {[
          { k: 'featured', v: '1', label: 'Featured' },
          { k: 'on_sale', v: '1', label: 'On sale' },
        ].map((f) => {
          const active = params.get(f.k) === f.v
          return (
            <button
              key={f.k}
              onClick={() => set(f.k, active ? null : f.v)}
              className={`chip cursor-pointer ${active ? 'bg-ink-900 text-white border-ink-900' : ''}`}
            >
              {f.label}
            </button>
          )
        })}
      </div>
      <button onClick={() => setParams({})} className="btn-outline w-full">Clear all</button>
    </div>
  )

  return (
    <div className="container-narrow py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <span className="eyebrow">Collection</span>
        <h1 className="mt-2 display-1 capitalize">{heading}</h1>
        <p className="mt-2 text-sm text-ink-600">
          {meta.total ?? 0} products{search && ` matching “${search}”`}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 border-y border-ink-100 py-3">
        <button
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink-700 hover:text-ink-900 lg:hidden"
          onClick={() => setShowFilters(true)}
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
        <div className="hidden gap-2 lg:flex">
          {[
            { k: 'featured', v: '1', label: 'Featured' },
            { k: 'on_sale', v: '1', label: 'On sale' },
          ].map((f) => {
            const active = params.get(f.k) === f.v
            return (
              <button
                key={f.k}
                onClick={() => set(f.k, active ? null : f.v)}
                className={`chip cursor-pointer ${active ? 'bg-ink-900 text-white border-ink-900' : ''}`}
              >
                {f.label}
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-[11px] uppercase tracking-luxe text-ink-500 sm:inline">Sort</span>
          <select
            value={sort}
            onChange={(e) => set('sort', e.target.value)}
            className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-800 focus:border-ink-900 focus:outline-none sm:text-sm"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most popular</option>
            <option value="rating">Top rated</option>
            <option value="price_asc">Price: low → high</option>
            <option value="price_desc">Price: high → low</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-10 xl:grid-cols-[260px_1fr]">
        {/* Desktop filters */}
        <aside className="hidden lg:block">
          <div className="card sticky top-24 p-5">{Filters}</div>
        </aside>

        {/* Mobile filters drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setShowFilters(false)}>
            <aside
              className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-lux safe-bottom"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="tap-target grid place-items-center" aria-label="Close filters">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {Filters}
              <button onClick={() => setShowFilters(false)} className="btn-primary mt-6 w-full">Show results</button>
            </aside>
          </div>
        )}

        <div className="min-w-0">
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <Empty title="No products match those filters" subtitle="Try widening your search." />
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
