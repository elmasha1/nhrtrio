import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ArrowRight } from 'lucide-react'
import { useCart } from '../store/cart'
import { money } from '../lib/format'
import Empty from '../components/Empty'

export default function Cart() {
  const nav = useNavigate()
  const { items, update, remove, keyOf, subtotal } = useCart()
  const sub = subtotal()
  const shipping = sub >= 100 || sub === 0 ? 0 : 9.99
  const tax = Math.round(sub * 0.08 * 100) / 100
  const total = sub + shipping + tax

  if (items.length === 0) {
    return (
      <div className="container-narrow py-16 sm:py-24">
        <Empty
          title="Your cart is empty"
          subtitle="Discover pieces you'll love."
          action={<Link to="/shop" className="btn-primary">Continue shopping</Link>}
        />
      </div>
    )
  }

  return (
    <div className="container-narrow py-8 sm:py-12">
      <span className="eyebrow">Cart</span>
      <h1 className="mt-2 display-1">Your cart</h1>
      <p className="mt-2 text-sm text-ink-600">
        {items.length} item{items.length !== 1 && 's'}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-10">
        <div className="space-y-4">
          {items.map((i) => (
            <div key={keyOf(i)} className="card flex gap-4 p-4 sm:gap-5 sm:p-5">
              <Link
                to={`/product/${i.slug}`}
                className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-ink-100 sm:h-28 sm:w-24"
              >
                <img src={i.image} className="h-full w-full object-cover" alt="" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      to={`/product/${i.slug}`}
                      className="block truncate font-display text-base font-semibold hover:underline sm:text-lg"
                    >
                      {i.name}
                    </Link>
                    <p className="mt-0.5 text-[11px] uppercase tracking-luxe text-ink-500">
                      {[i.size && `Size ${i.size}`, i.color && `Color ${i.color}`].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(keyOf(i))}
                    className="tap-target grid place-items-center text-ink-400 hover:text-rose-500"
                    aria-label="Remove from cart"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
                  <div className="inline-flex items-center rounded-full border border-ink-200">
                    <button onClick={() => update(keyOf(i), i.quantity - 1)} className="px-3 py-1.5 text-sm">−</button>
                    <span className="w-10 text-center text-sm font-semibold">{i.quantity}</span>
                    <button onClick={() => update(keyOf(i), i.quantity + 1)} className="px-3 py-1.5 text-sm">+</button>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-lg font-semibold">{money(i.price * i.quantity)}</div>
                    <div className="text-[11px] uppercase tracking-luxe text-ink-500">{money(i.price)} each</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card h-fit p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-xl font-semibold">Order summary</h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between"><dt className="text-ink-600">Subtotal</dt><dd className="font-medium">{money(sub)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-600">Shipping</dt><dd className="font-medium">{shipping ? money(shipping) : 'Free'}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-600">Estimated tax</dt><dd className="font-medium">{money(tax)}</dd></div>
            <div className="rule my-3" />
            <div className="flex justify-between font-display text-lg font-semibold"><dt>Total</dt><dd>{money(total)}</dd></div>
          </dl>
          <button onClick={() => nav('/checkout')} className="btn-primary mt-6 w-full">
            Checkout <ArrowRight className="h-4 w-4" />
          </button>
          <Link to="/shop" className="mt-3 block text-center text-xs text-ink-500 hover:underline">Continue shopping</Link>
          <p className="mt-4 text-center text-[10px] uppercase tracking-luxe text-ink-400">Secure checkout · Stripe encrypted payments</p>
        </div>
      </div>
    </div>
  )
}
