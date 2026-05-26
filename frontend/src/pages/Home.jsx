import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Sparkles } from 'lucide-react'
import api from '../lib/api'
import ProductCard from '../components/ProductCard'

const heroSlides = [
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=2000&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=2000&q=80',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=2000&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=2000&q=80',
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [newest, setNewest] = useState([])
  const [cats, setCats] = useState([])
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    api.get('/products/featured').then((r) => setFeatured(r.data)).catch(() => {})
    api.get('/products/new-arrivals').then((r) => setNewest(r.data)).catch(() => {})
    api.get('/categories').then((r) => setCats(r.data)).catch(() => {})
  }, [])

  // Auto-rotate hero background every 6s
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 6000)
    return () => clearInterval(t)
  }, [])

  return (
    <div>
      {/* ——————————————————————————— Hero */}
      <section className="relative overflow-hidden bg-luxe-dark text-white">
        {/* Background slideshow with crossfade */}
        <div className="absolute inset-0">
          {heroSlides.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden="true"
              loading={i === 0 ? 'eager' : 'lazy'}
              className={`absolute inset-0 h-full w-full object-cover opacity-40 transition-opacity duration-[1400ms] ease-in-out sm:opacity-55 ${
                i === slide ? 'opacity-40 sm:opacity-55' : '!opacity-0'
              }`}
            />
          ))}
          {/* Mobile: heavy uniform darken so heading is always legible */}
          <div className="absolute inset-0 bg-ink-900/65 md:hidden" />
          {/* Desktop: directional gradient from solid dark to clear image */}
          <div className="absolute inset-0 hidden bg-gradient-to-r from-ink-900 via-ink-900/80 to-transparent md:block" />
          {/* Extra bottom gradient on mobile for button-area contrast */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-900 to-transparent md:hidden" />
        </div>

        <div className="container-narrow relative grid min-h-[70vh] items-center py-14 sm:py-18 lg:min-h-[78vh]">
          <div className="max-w-xl animate-slide-up">
            <span className="eyebrow text-accent-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
              New Season · Spring '26
            </span>
            <h1 className="mt-4 font-display font-medium leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] text-[clamp(2rem,5.5vw+0.25rem,4.5rem)]">
              Considered<br />
              essentials,<br />
              <span className="italic text-accent-300">crafted to last.</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] sm:text-base sm:text-ink-200 sm:drop-shadow-none">
              Premium clothing made from natural materials, designed with quiet confidence
              and built for everyday refinement.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 sm:mt-9">
              <Link to="/shop" className="btn-accent">
                Shop the collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/shop/women"
                className="btn border border-white/40 bg-white/5 text-white backdrop-blur-sm hover:bg-white/15"
              >
                For her
              </Link>
            </div>
          </div>

          {/* Slide indicators */}
          <div className="pointer-events-auto absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:left-auto sm:right-10 sm:translate-x-0">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Show slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === slide ? 'w-8 bg-accent-300' : 'w-4 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ——————————————————————————— Value props */}
      <section className="border-b border-ink-100 bg-white">
        <div className="container-narrow grid gap-6 py-8 sm:gap-8 sm:py-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Truck,       title: 'Complimentary shipping', desc: 'On orders over $100' },
            { icon: RotateCcw,   title: '30-day returns',          desc: 'No questions asked' },
            { icon: ShieldCheck, title: 'Secure checkout',         desc: 'Powered by Stripe' },
            { icon: Sparkles,    title: 'Premium materials',       desc: 'Cashmere, silk, leather' },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-4">
              <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full border border-ink-200 bg-ink-50">
                <f.icon className="h-5 w-5 text-ink-700" />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-wide">{f.title}</div>
                <div className="mt-0.5 text-xs text-ink-500">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ——————————————————————————— Categories */}
      <section className="container-narrow py-14 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-12">
          <div>
            <span className="eyebrow">The Edit</span>
            <h2 className="mt-2 display-2">Shop by category</h2>
            <p className="mt-2 max-w-md text-sm text-ink-600 sm:text-base">
              Curated edits for every occasion.
            </p>
          </div>
          <Link
            to="/shop"
            className="hidden text-[11px] font-semibold uppercase tracking-luxe underline-offset-4 hover:underline sm:inline"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          {cats.slice(0, 5).map((c, i) => (
            <Link
              key={c.id}
              to={`/shop/${c.slug}`}
              className={`group relative overflow-hidden rounded-2xl ${
                i === 0
                  ? 'col-span-2 row-span-2 aspect-[4/5] sm:aspect-square md:aspect-[3/4]'
                  : 'aspect-[3/4]'
              }`}
            >
              <img
                src={c.image}
                alt={c.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div className="absolute inset-x-3 bottom-3 sm:inset-x-5 sm:bottom-5">
                <div className="text-[10px] uppercase tracking-luxe text-white/75">{c.products_count} products</div>
                <div className={`mt-1 font-display font-medium text-white ${i === 0 ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'}`}>
                  {c.name}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link
          to="/shop"
          className="mt-6 inline-flex text-[11px] font-semibold uppercase tracking-luxe underline-offset-4 hover:underline sm:hidden"
        >
          View all →
        </Link>
      </section>

      {/* ——————————————————————————— Featured */}
      <section className="container-narrow pb-14 sm:pb-20">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-12">
          <div>
            <span className="eyebrow">Most loved</span>
            <h2 className="mt-2 display-2">Featured</h2>
            <p className="mt-2 text-sm text-ink-600 sm:text-base">Our most loved pieces this season.</p>
          </div>
          <Link
            to="/shop?featured=1"
            className="text-[11px] font-semibold uppercase tracking-luxe underline-offset-4 hover:underline"
          >
            All featured →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ——————————————————————————— Editorial */}
      <section className="my-14 bg-ink-100 sm:my-20">
        <div className="container-narrow grid items-center gap-8 py-14 sm:gap-12 sm:py-20 md:grid-cols-2">
          <img
            src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1400&q=70"
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lux"
            alt="Inside the NHR Trio atelier"
            loading="lazy"
          />
          <div>
            <span className="eyebrow">The Atelier</span>
            <h2 className="mt-3 display-2">
              Designed in our atelier.<br />
              <span className="italic">Made to last a lifetime.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-700">
              Every piece is the result of careful sourcing, slow stitching, and an obsession
              with the small details that quietly make all the difference.
            </p>
            <Link to="/shop" className="btn-primary mt-7 inline-flex">
              Explore the collection
            </Link>
          </div>
        </div>
      </section>

      {/* ——————————————————————————— New arrivals */}
      <section className="container-narrow pb-20 sm:pb-28">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-12">
          <div>
            <span className="eyebrow">Fresh in</span>
            <h2 className="mt-2 display-2">New arrivals</h2>
            <p className="mt-2 text-sm text-ink-600 sm:text-base">Fresh off the line.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
          {newest.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  )
}
