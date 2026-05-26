import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Package, MapPin, Truck, Check, Clock } from 'lucide-react'
import api from '../lib/api'
import { money, date, prettyStatus, statusColor } from '../lib/format'

const flow = ['pending', 'paid', 'processing', 'shipped', 'out_for_delivery', 'delivered']
const stepIdx = (s) => Math.max(0, flow.indexOf(s))

export default function TrackOrder() {
  const { orderNumber: param } = useParams()
  const nav = useNavigate()
  const [num, setNum] = useState(param || '')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchOrder = async (n) => {
    setLoading(true); setError(''); setOrder(null)
    try {
      const { data } = await api.get(`/track/${n}`)
      setOrder(data)
    } catch (e) {
      setError('Order not found. Check the number and try again.')
    } finally { setLoading(false) }
  }

  useEffect(() => { if (param) fetchOrder(param) }, [param])

  const idx = order ? stepIdx(order.status) : -1

  return (
    <div className="container-narrow py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold">Track your order</h1>
        <form onSubmit={(e) => { e.preventDefault(); nav(`/track/${num}`); fetchOrder(num) }} className="mt-6 flex gap-2">
          <input className="input" placeholder="Order number (e.g. NHR-20260514-XXXXXX)" value={num} onChange={(e) => setNum(e.target.value.toUpperCase())} />
          <button className="btn-primary" disabled={!num || loading}>Track</button>
        </form>
        {error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

        {order && (
          <div className="mt-10 space-y-6">
            <div className="card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-ink-500">Order</p>
                  <p className="font-mono text-lg font-bold">{order.order_number}</p>
                </div>
                <span className={`chip ${statusColor(order.status)}`}>{prettyStatus(order.status)}</span>
              </div>
              {order.tracking_number && (
                <p className="mt-3 text-sm">Tracking: <span className="font-mono">{order.tracking_number}</span> {order.carrier && `via ${order.carrier}`}</p>
              )}

              <ol className="mt-6 grid grid-cols-3 gap-3 md:grid-cols-6">
                {flow.map((s, i) => {
                  const done = i <= idx
                  return (
                    <li key={s} className="text-center">
                      <div className={`mx-auto grid h-10 w-10 place-items-center rounded-full ${done ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-400'}`}>
                        {done ? <Check className="h-5 w-5" /> : i + 1}
                      </div>
                      <div className={`mt-2 text-[11px] font-semibold uppercase tracking-wider ${done ? 'text-ink-900' : 'text-ink-400'}`}>
                        {prettyStatus(s)}
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>

            {order.events?.length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold">Timeline</h2>
                <ol className="mt-4 space-y-4">
                  {order.events.map((e) => (
                    <li key={e.id} className="flex gap-3">
                      <div className="mt-0.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-ink-900" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold">{prettyStatus(e.status)}</span>
                          {e.location && <span className="inline-flex items-center gap-1 text-xs text-ink-500"><MapPin className="h-3 w-3" />{e.location}</span>}
                        </div>
                        {e.description && <p className="text-sm text-ink-600">{e.description}</p>}
                        <p className="text-xs text-ink-400">{date(e.occurred_at)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="card p-6">
              <h2 className="text-lg font-semibold">Items</h2>
              <div className="mt-4 space-y-3">
                {order.items?.map((i) => (
                  <div key={i.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <img src={i.product_image} className="h-12 w-10 rounded-md object-cover" alt="" />
                      <div>
                        <div className="font-semibold">{i.product_name}</div>
                        <div className="text-xs text-ink-500">Qty {i.quantity}</div>
                      </div>
                    </div>
                    <div className="font-semibold">{money(i.subtotal)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between border-t border-ink-100 pt-3 text-base font-bold">
                <span>Total</span><span>{money(order.total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
