import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
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
      <div className="container-narrow py-20">
        <Empty
          title="Your cart is empty"
          subtitle="Discover pieces you'll love."
          action={<Link to="/shop" className="btn-primary">Continue shopping</Link>}
        />
      </div>
    )
  }

  return (
    <div className="container-narrow py-10">
      <h1 className="text-4xl font-bold">Your cart</h1>
      <p className="mt-1 text-sm text-ink-600">{items.length} item{items.length !== 1 && 's'}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((i) => (
            <div key={keyOf(i)} className="card flex gap-4 p-4">
              <Link to={`/product/${i.slug}`} className="h-28 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-ink-100">
                <img src={i.image} className="h-full w-full object-cover" alt="" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link to={`/product/${i.slug}`} className="font-semibold hover:underline">{i.name}</Link>
                    <p className="mt-1 text-xs text-ink-500">
                      {[i.size && `Size: ${i.size}`, i.color && `Color: ${i.color}`].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <button onClick={() => remove(keyOf(i))} className="text-ink-400 hover:text-rose-500"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="mt-auto flex items-end justify-between">
                  <div className="inline-flex items-center rounded-xl border border-ink-200">
                    <button onClick={() => update(keyOf(i), i.quantity - 1)} className="px-3 py-1.5">−</button>
                    <span className="w-10 text-center text-sm font-semibold">{i.quantity}</span>
                    <button onClick={() => update(keyOf(i), i.quantity + 1)} className="px-3 py-1.5">+</button>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{money(i.price * i.quantity)}</div>
                    <div className="text-xs text-ink-500">{money(i.price)} each</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card h-fit p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-ink-600">Subtotal</dt><dd>{money(sub)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-600">Shipping</dt><dd>{shipping ? money(shipping) : 'Free'}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-600">Estimated tax</dt><dd>{money(tax)}</dd></div>
            <hr className="my-3 border-ink-100" />
            <div className="flex justify-between text-base font-bold"><dt>Total</dt><dd>{money(total)}</dd></div>
          </dl>
          <button onClick={() => nav('/checkout')} className="btn-primary mt-6 w-full">
            Checkout <ArrowRight className="h-4 w-4" />
          </button>
          <Link to="/shop" className="mt-3 block text-center text-xs text-ink-500 hover:underline">Continue shopping</Link>
          <p className="mt-4 text-center text-[11px] text-ink-400">Secure checkout · Stripe encrypted payments</p>
        </div>
      </div>
    </div>
  )
}
