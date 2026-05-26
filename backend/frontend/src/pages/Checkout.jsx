import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Tag } from 'lucide-react'
import api from '../lib/api'
import { useCart } from '../store/cart'
import { useAuth } from '../store/auth'
import { money } from '../lib/format'

export default function Checkout() {
  const nav = useNavigate()
  const { user } = useAuth()
  const { items, clear } = useCart()
  const [addresses, setAddresses] = useState([])
  const [selectedAddr, setSelectedAddr] = useState(null)
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [notes, setNotes] = useState('')
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')
  const [totals, setTotals] = useState({ subtotal: 0, shipping: 0, tax: 0, discount: 0, total: 0 })

  const [form, setForm] = useState({
    full_name: user?.name || '', phone: '', line1: '', line2: '',
    city: '', state: '', postal_code: '', country: 'US',
  })

  useEffect(() => {
    api.get('/addresses').then(({ data }) => {
      setAddresses(data)
      const def = data.find((a) => a.is_default) || data[0]
      if (def) { setSelectedAddr(def.id); setForm(def) }
    })
  }, [])

  useEffect(() => {
    if (!items.length) return
    api.post('/checkout/quote', {
      items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity, size: i.size, color: i.color })),
      coupon_code: appliedCoupon?.code || null,
    }).then(({ data }) => setTotals(data)).catch(() => {})
  }, [items, appliedCoupon])

  const applyCoupon = async () => {
    setError('')
    try {
      const { data } = await api.post('/coupons/validate', { code: coupon, subtotal: totals.subtotal || 0 })
      if (data.valid) setAppliedCoupon(data)
    } catch (e) {
      setError(e.response?.data?.message || 'Invalid coupon')
      setAppliedCoupon(null)
    }
  }

  const placeOrder = async () => {
    setError('')
    setPlacing(true)
    try {
      const { data } = await api.post('/checkout/place', {
        items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity, size: i.size, color: i.color })),
        shipping_address: form,
        billing_address: form,
        coupon_code: appliedCoupon?.code || null,
        customer_notes: notes,
      })

      // In a real Stripe integration we'd confirm card via Stripe.js here.
      // For now we simulate confirmation server-side (works in test/mock mode).
      const orderNumber = data.order.order_number
      const orderId = data.order.id
      await api.post(`/orders/${orderId}/confirm-payment`, {
        payment_intent_id: data.client_secret?.split('_secret_')?.[0] || 'pi_mock',
      })

      clear()
      nav(`/orders/${orderNumber}/success`)
    } catch (e) {
      setError(e.response?.data?.message || 'Payment failed. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  if (items.length === 0) {
    nav('/cart')
    return null
  }

  return (
    <div className="container-narrow py-10">
      <h1 className="text-4xl font-bold">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="text-lg font-semibold">Shipping address</h2>

            {addresses.length > 0 && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {addresses.map((a) => (
                  <button key={a.id} type="button" onClick={() => { setSelectedAddr(a.id); setForm(a) }}
                    className={`rounded-xl border p-4 text-left text-sm ${selectedAddr === a.id ? 'border-ink-900 bg-ink-50' : 'border-ink-200'}`}>
                    <div className="font-semibold">{a.full_name}</div>
                    <div className="text-ink-600">{a.line1}, {a.city} {a.postal_code}</div>
                  </button>
                ))}
                <button type="button" onClick={() => { setSelectedAddr(null); setForm({ ...form, full_name: '', line1: '', city: '', postal_code: '' }) }}
                  className="rounded-xl border border-dashed border-ink-300 p-4 text-sm text-ink-600 hover:bg-ink-100">
                  + Use a different address
                </button>
              </div>
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2"><div className="label">Full name</div><input className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
              <div><div className="label">Phone</div><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div><div className="label">Country</div>
                <select className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                  <option value="US">United States</option><option value="CA">Canada</option><option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option><option value="DE">Germany</option><option value="FR">France</option>
                </select>
              </div>
              <div className="sm:col-span-2"><div className="label">Address line 1</div><input className="input" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} /></div>
              <div className="sm:col-span-2"><div className="label">Address line 2</div><input className="input" value={form.line2 || ''} onChange={(e) => setForm({ ...form, line2: e.target.value })} /></div>
              <div><div className="label">City</div><input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
              <div><div className="label">State / Province</div><input className="input" value={form.state || ''} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
              <div><div className="label">Postal code</div><input className="input" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} /></div>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="text-lg font-semibold">Payment</h2>
            <p className="mt-1 text-sm text-ink-500">Powered by Stripe · your card details are encrypted.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2"><div className="label">Card number</div><input className="input" placeholder="4242 4242 4242 4242" /></div>
              <div><div className="label">Expiry</div><input className="input" placeholder="MM / YY" /></div>
              <div><div className="label">CVC</div><input className="input" placeholder="123" /></div>
            </div>
            <p className="mt-3 inline-flex items-center gap-1 text-xs text-ink-500"><Lock className="h-3 w-3" /> This form is for UI preview — real Stripe.js integration is wired on the backend.</p>
          </section>

          <section className="card p-6">
            <h2 className="text-lg font-semibold">Order notes</h2>
            <textarea rows={3} className="input mt-3 resize-none" placeholder="Anything we should know about your order?" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </section>
        </div>

        <aside className="card h-fit p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="mt-4 space-y-3">
            {items.map((i, idx) => (
              <div key={idx} className="flex gap-3 text-sm">
                <img src={i.image} alt="" className="h-14 w-12 rounded-md object-cover" />
                <div className="flex-1">
                  <div className="font-semibold">{i.name}</div>
                  <div className="text-xs text-ink-500">{[i.size, i.color].filter(Boolean).join(' · ')} · Qty {i.quantity}</div>
                </div>
                <div className="font-semibold">{money(i.price * i.quantity)}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <input className="input" placeholder="Promo code (try WELCOME10)" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} />
            <button onClick={applyCoupon} className="btn-outline !px-3"><Tag className="h-4 w-4" /></button>
          </div>
          {appliedCoupon && <div className="mt-2 text-xs text-emerald-700">✓ {appliedCoupon.code} applied — saved {money(appliedCoupon.discount)}</div>}

          <hr className="my-5 border-ink-100" />
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(totals.subtotal)}</dd></div>
            {totals.discount > 0 && <div className="flex justify-between text-emerald-700"><dt>Discount</dt><dd>−{money(totals.discount)}</dd></div>}
            <div className="flex justify-between"><dt>Shipping</dt><dd>{totals.shipping > 0 ? money(totals.shipping) : 'Free'}</dd></div>
            <div className="flex justify-between"><dt>Tax</dt><dd>{money(totals.tax)}</dd></div>
            <hr className="border-ink-100" />
            <div className="flex justify-between text-base font-bold"><dt>Total</dt><dd>{money(totals.total)}</dd></div>
          </dl>
          {error && <p className="mt-3 rounded-lg bg-rose-50 p-3 text-xs text-rose-700">{error}</p>}
          <button onClick={placeOrder} disabled={placing} className="btn-accent mt-5 w-full">
            {placing ? 'Placing order…' : `Pay ${money(totals.total)}`}
          </button>
          <p className="mt-3 text-center text-[11px] text-ink-400">
            By placing your order you agree to our <Link to="#" className="underline">Terms</Link>.
          </p>
        </aside>
      </div>
    </div>
  )
}
