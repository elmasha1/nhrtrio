import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Sparkles } from 'lucide-react'
import api from '../lib/api'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [newest, setNewest] = useState([])
  const [cats, setCats] = useState([])

  useEffect(() => {
    api.get('/products/featured').then((r) => setFeatured(r.data)).catch(() => {})
    api.get('/products/new-arrivals').then((r) => setNewest(r.data)).catch(() => {})
    api.get('/categories').then((r) => setCats(r.data)).catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=2000&q=80"
            className="h-full w-full object-cover opacity-60"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/70 to-transparent" />
        </div>
        <div className="container-narrow relative grid min-h-[78vh] items-center py-20">
          <div className="max-w-2xl animate-slide-up">
            <span className="chip bg-white/10 text-white/80">New Season · Spring '26</span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] sm:text-6xl md:text-7xl">
              Considered<br/>essentials,<br/>
              <span className="text-accent-300">crafted to last.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base text-ink-200">
              Premium clothing made from natural materials, designed with quiet confidence
              and built for everyday refinement.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-accent">
                Shop the collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/shop/women" className="btn btn-outline border-white/30 text-white hover:bg-white/10">
                For her
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-b border-ink-100 bg-white">
        <div className="container-narrow grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Truck, title: 'Free shipping', desc: 'On orders over $100' },
            { icon: RotateCcw, title: '30-day returns', desc: 'No questions asked' },
            { icon: ShieldCheck, title: 'Secure checkout', desc: 'Powered by Stripe' },
            { icon: Sparkles, title: 'Premium materials', desc: 'Cashmere, silk, leather' },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-ink-100">
                <f.icon className="h-5 w-5 text-ink-700" />
              </div>
              <div>
                <div className="text-sm font-semibold">{f.title}</div>
                <div className="text-xs text-ink-500">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories grid */}
      <section className="container-narrow py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">Shop by category</h2>
            <p className="mt-1 text-sm text-ink-600">Curated edits for every occasion.</p>
          </div>
          <Link to="/shop" className="hidden text-sm font-semibold underline-offset-4 hover:underline sm:inline">View all</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {cats.slice(0, 5).map((c, i) => (
            <Link
              key={c.id}
              to={`/shop/${c.slug}`}
              className={`group relative overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-[3/4]' : 'aspect-[3/4]'}`}
            >
              <img src={c.image} alt={c.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-xs text-white/80">{c.products_count} products</div>
                <div className="font-display text-xl font-semibold text-white sm:text-2xl">{c.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container-narrow py-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">Featured</h2>
            <p className="mt-1 text-sm text-ink-600">Our most loved pieces this season.</p>
          </div>
          <Link to="/shop?featured=1" className="text-sm font-semibold underline-offset-4 hover:underline">All featured →</Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Big editorial */}
      <section className="my-20 bg-ink-100">
        <div className="container-narrow grid items-center gap-10 py-16 md:grid-cols-2">
          <img src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1400&q=70" className="aspect-[4/3] w-full rounded-2xl object-cover" alt="" />
          <div>
            <span className="chip">The Atelier</span>
            <h2 className="mt-3 text-4xl font-bold">Designed in our atelier.<br/>Made to last a lifetime.</h2>
            <p className="mt-4 text-ink-600">
              Every piece is the result of careful sourcing, slow stitching, and an obsession
              with the small details that quietly make all the difference.
            </p>
            <Link to="/shop" className="mt-6 inline-flex btn-primary">Explore the collection</Link>
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="container-narrow pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">New arrivals</h2>
            <p className="mt-1 text-sm text-ink-600">Fresh off the line.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {newest.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  )
}
