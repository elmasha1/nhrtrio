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
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-ink-100">
          <img
            src={img}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            loading="lazy"
          />
          {onSale && (
            <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Sale
            </span>
          )}
          {product.stock < 5 && product.stock > 0 && (
            <span className="absolute right-3 top-3 rounded-full bg-amber-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Low stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute right-3 top-3 rounded-full bg-ink-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Sold out
            </span>
          )}
        </div>
        <div className="mt-3 px-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold leading-snug line-clamp-1">{product.name}</h3>
          </div>
          <p className="mt-0.5 text-xs text-ink-500">{product.category?.name}</p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-ink-900">{money(product.price)}</span>
              {onSale && <span className="text-xs text-ink-400 line-through">{money(product.compare_price)}</span>}
            </div>
            {product.rating_avg > 0 && <Stars value={product.rating_avg} size={12} />}
          </div>
        </div>
      </Link>
      {onWishlist && (
        <button
          onClick={(e) => { e.preventDefault(); onWishlist(product) }}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
