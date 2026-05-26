import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Heart, ShoppingBag, Check, Truck, RotateCcw, Star } from 'lucide-react'
import api from '../lib/api'
import { useCart } from '../store/cart'
import { useAuth } from '../store/auth'
import { money } from '../lib/format'
import Stars from '../components/Stars'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'

export default function ProductDetail() {
  const { slug } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()
  const add = useCart((s) => s.add)

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [activeImg, setActiveImg] = useState(0)
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [tab, setTab] = useState('details')

  // review form
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setProduct(null); setActiveImg(0); setAdded(false)
    api.get(`/products/${slug}`).then((r) => {
      setProduct(r.data)
      setSize(r.data.sizes?.[0] || '')
      setColor(r.data.colors?.[0] || '')
    })
    api.get(`/products/${slug}/related`).then((r) => setRelated(r.data))
  }, [slug])

  if (!product) return <Loader />

  const imgs = product.images?.length ? product.images : [{ url: product.primary_image }]
  const onSale = product.compare_price && Number(product.compare_price) > Number(product.price)

  const addToCart = () => {
    add({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.primary_image,
      price: Number(product.price),
      size, color, quantity: qty,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const buyNow = () => { addToCart(); nav('/checkout') }

  const submitReview = async (e) => {
    e.preventDefault()
    if (!user) return nav('/login')
    setSubmitting(true)
    try {
      await api.post(`/products/${slug}/reviews`, reviewForm)
      const r = await api.get(`/products/${slug}`)
      setProduct(r.data)
      setReviewForm({ rating: 5, title: '', body: '' })
    } finally { setSubmitting(false) }
  }

  return (
    <div className="container-narrow py-10">
      <nav className="mb-6 text-xs text-ink-500">
        <Link to="/" className="hover:underline">Home</Link> / <Link to="/shop" className="hover:underline">Shop</Link>
        {product.category && <> / <Link to={`/shop/${product.category.slug}`} className="hover:underline">{product.category.name}</Link></>}
        / <span className="text-ink-800">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-ink-100">
            <img src={imgs[activeImg]?.url} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {imgs.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto scrollbar-hide">
              {imgs.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg border ${i === activeImg ? 'border-ink-900' : 'border-ink-200'}`}>
                  <img src={img.url} className="h-full w-full object-cover" alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs uppercase tracking-widest text-ink-500">{product.category?.name}</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <Stars value={product.rating_avg} size={14} />
            <span className="text-xs text-ink-500">{product.rating_count} reviews · {product.sold_count} sold</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{money(product.price)}</span>
            {onSale && <span className="text-lg text-ink-400 line-through">{money(product.compare_price)}</span>}
            {onSale && <span className="chip bg-rose-100 text-rose-700">
              Save {money(product.compare_price - product.price)}
            </span>}
          </div>

          <p className="mt-5 text-sm text-ink-600">{product.short_description}</p>

          {product.colors?.length > 0 && (
            <div className="mt-6">
              <div className="label">Color: <span className="text-ink-900 font-semibold normal-case">{color}</span></div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setColor(c)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-medium ${color === c ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-200 hover:border-ink-400'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes?.length > 0 && (
            <div className="mt-4">
              <div className="label">Size: <span className="text-ink-900 font-semibold normal-case">{size}</span></div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`min-w-12 rounded-lg border px-3 py-2 text-xs font-semibold ${size === s ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-200 hover:border-ink-400'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <div className="inline-flex items-center rounded-xl border border-ink-200">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2">−</button>
              <span className="w-10 text-center text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock || 50, q + 1))} className="px-3 py-2">+</button>
            </div>
            <span className="text-xs text-ink-500">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={addToCart} disabled={product.stock === 0} className="btn-primary flex-1 min-w-[180px]">
              {added ? <><Check className="h-4 w-4" /> Added</> : <><ShoppingBag className="h-4 w-4" /> Add to cart</>}
            </button>
            <button onClick={buyNow} disabled={product.stock === 0} className="btn-accent flex-1 min-w-[180px]">
              Buy now
            </button>
            <button className="btn-outline !px-3" onClick={async () => {
              if (!user) return nav('/login')
              await api.post('/wishlist/toggle', { product_id: product.id })
            }}>
              <Heart className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 grid gap-2 rounded-xl bg-ink-50 p-4 text-sm">
            <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-ink-500" /> Free shipping over $100</div>
            <div className="flex items-center gap-2"><RotateCcw className="h-4 w-4 text-ink-500" /> 30-day returns</div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex gap-6 border-b border-ink-200 text-sm">
          {['details', 'reviews'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`relative pb-3 font-semibold capitalize transition ${tab === t ? 'text-ink-900' : 'text-ink-500'}`}>
              {t} {t === 'reviews' && <span className="text-ink-400">({product.rating_count})</span>}
              {tab === t && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-ink-900" />}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === 'details' && (
            <div className="prose max-w-none text-sm text-ink-700">
              <p className="whitespace-pre-wrap">{product.description}</p>
              {product.material && <p><strong>Material:</strong> {product.material}</p>}
              {product.gender && <p><strong>Fit:</strong> {product.gender}</p>}
              {product.sku && <p className="text-xs text-ink-500">SKU: {product.sku}</p>}
            </div>
          )}
          {tab === 'reviews' && (
            <div className="grid gap-8 md:grid-cols-[1fr_320px]">
              <div className="space-y-5">
                {product.reviews?.length === 0 && <p className="text-sm text-ink-500">No reviews yet — be the first.</p>}
                {product.reviews?.map((r) => (
                  <div key={r.id} className="card p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-ink-900 text-sm font-semibold text-white">
                          {r.user?.name?.[0] || 'U'}
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{r.user?.name}</div>
                          {r.is_verified_purchase && <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Verified purchase</div>}
                        </div>
                      </div>
                      <Stars value={r.rating} size={14} />
                    </div>
                    {r.title && <h4 className="mt-3 font-semibold">{r.title}</h4>}
                    {r.body && <p className="mt-1 text-sm text-ink-700">{r.body}</p>}
                  </div>
                ))}
              </div>
              <form onSubmit={submitReview} className="card sticky top-24 h-fit p-5">
                <h3 className="font-semibold">Write a review</h3>
                <p className="mt-1 text-xs text-ink-500">{user ? '' : 'Sign in to leave a review.'}</p>
                <div className="mt-3">
                  <div className="label">Rating</div>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((n) => (
                      <button type="button" key={n} onClick={() => setReviewForm({ ...reviewForm, rating: n })}>
                        <Star className={`h-6 w-6 ${n <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-ink-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-3">
                  <div className="label">Title</div>
                  <input className="input" value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })} />
                </div>
                <div className="mt-3">
                  <div className="label">Review</div>
                  <textarea rows={4} className="input resize-none" value={reviewForm.body} onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })} />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary mt-4 w-full">
                  {user ? (submitting ? 'Submitting…' : 'Submit review') : 'Sign in to review'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-bold">You may also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
