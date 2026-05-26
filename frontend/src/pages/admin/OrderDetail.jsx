import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../lib/api'
import { money, date, prettyStatus, statusColor } from '../../lib/format'
import Loader from '../../components/Loader'

const statuses = ['pending','paid','processing','shipped','out_for_delivery','delivered','cancelled','refunded']

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [form, setForm] = useState({ status: '', tracking_number: '', carrier: '', location: '', description: '' })
  const [saving, setSaving] = useState(false)

  const load = () => api.get(`/admin/orders/${id}`).then(({ data }) => {
    setOrder(data)
    setForm({ status: data.status, tracking_number: data.tracking_number || '', carrier: data.carrier || '', location: '', description: '' })
  })
  useEffect(() => { load() }, [id])

  const update = async (e) => {
    e.preventDefault(); setSaving(true)
    try { await api.patch(`/admin/orders/${id}/status`, form); load() } finally { setSaving(false) }
  }

  if (!order) return <Loader />

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-ink-500">Order</p>
          <h1 className="font-mono text-2xl font-bold">{order.order_number}</h1>
          <p className="mt-1 text-xs text-ink-500">{date(order.created_at)}</p>
        </div>
        <span className={`chip ${statusColor(order.status)}`}>{prettyStatus(order.status)}</span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div className="card p-6">
            <h2 className="font-semibold">Items</h2>
            <div className="mt-3 space-y-3">
              {order.items.map((i) => (
                <div key={i.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <img src={i.product_image} className="h-12 w-10 rounded-md object-cover" alt="" />
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
              {Number(order.discount) > 0 && <div className="flex justify-between"><dt>Discount</dt><dd>−{money(order.discount)}</dd></div>}
              <div className="flex justify-between"><dt>Shipping</dt><dd>{money(order.shipping)}</dd></div>
              <div className="flex justify-between"><dt>Tax</dt><dd>{money(order.tax)}</dd></div>
              <div className="flex justify-between text-base font-bold border-t border-ink-100 pt-2"><dt>Total</dt><dd>{money(order.total)}</dd></div>
            </dl>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold">Customer</h2>
            <p className="mt-2 text-sm">{order.user?.name || 'Guest'} · {order.user?.email || order.guest_email}</p>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold">Shipping address</h2>
            {order.shipping_address && (
              <div className="mt-2 text-sm text-ink-700">
                <div className="font-semibold">{order.shipping_address.full_name}</div>
                <div>{order.shipping_address.line1}{order.shipping_address.line2 && `, ${order.shipping_address.line2}`}</div>
                <div>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</div>
                <div>{order.shipping_address.country}</div>
                <div className="mt-1 text-xs text-ink-500">{order.shipping_address.phone}</div>
              </div>
            )}
          </div>

          <div className="card p-6">
            <h2 className="font-semibold">Timeline</h2>
            <ol className="mt-3 space-y-3">
              {order.events?.map((e) => (
                <li key={e.id} className="flex gap-3">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-ink-900" />
                  <div>
                    <div className="text-sm font-semibold">{prettyStatus(e.status)}{e.location && <span className="ml-2 text-xs text-ink-500">({e.location})</span>}</div>
                    {e.description && <p className="text-sm text-ink-600">{e.description}</p>}
                    <p className="text-xs text-ink-400">{date(e.occurred_at)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <aside className="space-y-5">
          <form onSubmit={update} className="card p-6">
            <h2 className="font-semibold">Update status</h2>
            <div className="mt-4 space-y-3">
              <div><div className="label">Status</div>
                <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {statuses.map((s) => <option key={s} value={s}>{prettyStatus(s)}</option>)}
                </select>
              </div>
              <div><div className="label">Tracking number</div><input className="input" value={form.tracking_number} onChange={(e) => setForm({ ...form, tracking_number: e.target.value })} /></div>
              <div><div className="label">Carrier</div><input className="input" value={form.carrier} onChange={(e) => setForm({ ...form, carrier: e.target.value })} placeholder="UPS, FedEx…" /></div>
              <div><div className="label">Event location</div><input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
              <div><div className="label">Note</div><textarea rows={3} className="input resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <button className="btn-primary w-full" disabled={saving}>{saving ? 'Saving…' : 'Save & add event'}</button>
            </div>
          </form>
        </aside>
      </div>
    </div>
  )
}
