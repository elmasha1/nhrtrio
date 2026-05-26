import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { money } from '../lib/format'
import Stars from './Stars'

export default function ProductCard({ product, onWishlist }) {
  const img = product.primary_image || product.images?.[0]?.url || 'https://placehold.co/600x800/eee/aaa?text=NHR'
  const onSale = product.compare_price && Number(product.compare_price) > Number(product.price)

  return (
    <div className="group relative animate-fade-in">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-ink-100 sm:rounded-2xl">
          <img
            src={img}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            loading="lazy"
          />
          {onSale && (
            <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-bold uppercase tracking-luxe text-ink-900 sm:left-3 sm:top-3">
              Sale
            </span>
          )}
          {product.stock < 5 && product.stock > 0 && (
            <span className="absolute right-2 top-2 rounded-full bg-accent-400 px-2.5 py-1 text-[9px] font-bold uppercase tracking-luxe text-ink-900 sm:right-3 sm:top-3">
              Low stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute right-2 top-2 rounded-full bg-ink-900 px-2.5 py-1 text-[9px] font-bold uppercase tracking-luxe text-white sm:right-3 sm:top-3">
              Sold out
            </span>
          )}
        </div>
        <div className="mt-3 px-0.5 sm:mt-4">
          <h3 className="font-display text-base font-medium leading-snug line-clamp-1 sm:text-lg">{product.name}</h3>
          <p className="mt-0.5 text-[11px] uppercase tracking-luxe text-ink-500">{product.category?.name}</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2 min-w-0">
              <span className="truncate text-sm font-semibold text-ink-900">{money(product.price)}</span>
              {onSale && <span className="truncate text-xs text-ink-400 line-through">{money(product.compare_price)}</span>}
            </div>
            {product.rating_avg > 0 && <Stars value={product.rating_avg} size={12} />}
          </div>
        </div>
      </Link>
      {onWishlist && (
        <button
          onClick={(e) => { e.preventDefault(); onWishlist(product) }}
          aria-label="Save to wishlist"
          className="tap-target absolute right-2 top-2 grid place-items-center rounded-full bg-white/95 opacity-100 backdrop-blur transition hover:bg-white sm:right-3 sm:top-3 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <Heart className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
