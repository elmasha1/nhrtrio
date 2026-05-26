import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../lib/api'
import { money, date, prettyStatus, statusColor } from '../../lib/format'
import Loader from '../../components/Loader'

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  const reload = () => api.get(`/orders/${id}`).then(({ data }) => setOrder(data))
  useEffect(() => { reload() }, [id])

  const cancel = async () => {
    if (!confirm('Cancel this order?')) return
    await api.post(`/orders/${id}/cancel`); reload()
  }

  if (!order) return <Loader />

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-ink-500">Order</p>
          <h2 className="font-mono text-2xl font-bold">{order.order_number}</h2>
          <p className="mt-1 text-xs text-ink-500">{date(order.created_at)}</p>
        </div>
        <span className={`chip ${statusColor(order.status)}`}>{prettyStatus(order.status)}</span>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold">Items</h3>
        <div className="mt-4 space-y-3">
          {order.items.map((i) => (
            <div key={i.id} className="flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-3">
                <img src={i.product_image} className="h-14 w-12 rounded-md object-cover" alt="" />
                <div>
                  <div className="font-semibold">{i.product_name}</div>
                  <div className="text-xs text-ink-500">{[i.size, i.color].filter(Boolean).join(' · ')} · Qty {i.quantity}</div>
                </div>
              </div>
              <div className="font-semibold">{money(i.subtotal)}</div>
            </div>
          ))}
        </div>
        <hr className="my-4 border-ink-100" />
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(order.subtotal)}</dd></div>
          {Number(order.discount) > 0 && <div className="flex justify-between text-emerald-700"><dt>Discount</dt><dd>−{money(order.discount)}</dd></div>}
          <div className="flex justify-between"><dt>Shipping</dt><dd>{Number(order.shipping) > 0 ? money(order.shipping) : 'Free'}</dd></div>
          <div className="flex justify-between"><dt>Tax</dt><dd>{money(order.tax)}</dd></div>
          <div className="flex justify-between text-base font-bold pt-2 border-t border-ink-100"><dt>Total</dt><dd>{money(order.total)}</dd></div>
        </dl>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold">Shipping</h3>
        {order.shipping_address && (
          <div className="mt-2 text-sm text-ink-700">
            <div className="font-semibold">{order.shipping_address.full_name}</div>
            <div>{order.shipping_address.line1}{order.shipping_address.line2 && `, ${order.shipping_address.line2}`}</div>
            <div>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</div>
            <div>{order.shipping_address.country}</div>
          </div>
        )}
        {order.tracking_number && (
          <p className="mt-3 text-sm">Tracking: <span className="font-mono">{order.tracking_number}</span> {order.carrier && `via ${order.carrier}`}</p>
        )}
        <Link to={`/track/${order.order_number}`} className="btn-outline mt-4">Track this order</Link>
      </div>

      {['pending', 'paid', 'processing'].includes(order.status) && (
        <button onClick={cancel} className="btn-outline text-rose-700">Cancel order</button>
      )}
    </div>
  )
}
