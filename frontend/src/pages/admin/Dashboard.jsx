import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DollarSign, ShoppingBag, Users, Package, MessageSquare, AlertTriangle } from 'lucide-react'
import api from '../../lib/api'
import { money, prettyStatus, statusColor } from '../../lib/format'
import Loader from '../../components/Loader'

export default function Dashboard() {
  const [d, setD] = useState(null)
  useEffect(() => { api.get('/admin/dashboard').then(({ data }) => setD(data)) }, [])
  if (!d) return <Loader />

  const t = d.totals
  const cards = [
    { label: 'Revenue (all time)', value: money(t.revenue),       icon: DollarSign },
    { label: 'Revenue this month', value: money(t.revenue_month), icon: DollarSign },
    { label: 'Orders',             value: t.orders,               icon: ShoppingBag },
    { label: 'Customers',          value: t.customers,            icon: Users },
    { label: 'Products',           value: t.products,             icon: Package },
    { label: 'Open chats',         value: t.open_chats,           icon: MessageSquare },
  ]

  return (
    <div className="space-y-8">
      <div>
        <span className="eyebrow">Overview</span>
        <h1 className="mt-2 display-2">Dashboard</h1>
        <p className="mt-2 text-sm text-ink-600">Snapshot of your store performance.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className="card p-4 sm:p-5">
            <c.icon className="h-5 w-5 text-ink-500" />
            <div className="mt-3 font-display text-2xl font-semibold">{c.value}</div>
            <div className="text-[11px] uppercase tracking-luxe text-ink-500">{c.label}</div>
          </div>
        ))}
      </div>

      {t.low_stock > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-accent-50 p-4 text-sm text-accent-800 ring-1 ring-accent-200">
          <AlertTriangle className="h-5 w-5" />
          <span className="flex-1">{t.low_stock} product(s) running low on stock.</span>
          <Link className="font-semibold underline" to="/admin/products">Review</Link>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Sales — last 30 days</h2>
          <div className="mt-4 overflow-hidden">
            <SalesSpark data={d.sales_by_day} />
          </div>
        </div>
        <div className="card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Orders by status</h2>
          <div className="mt-4 space-y-2">
            {Object.entries(d.orders_by_status).map(([s, c]) => (
              <div key={s} className="flex items-center justify-between text-sm">
                <span className={`chip ${statusColor(s)}`}>{prettyStatus(s)}</span>
                <span className="font-bold">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Top products</h2>
          <ul className="mt-3 divide-y divide-ink-100">
            {d.top_products.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span className="truncate">{p.name}</span>
                <span className="text-ink-500 whitespace-nowrap">{p.sold_count} sold · {money(p.price)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Recent orders</h2>
          <ul className="mt-3 divide-y divide-ink-100">
            {d.recent_orders.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <Link to={`/admin/orders/${o.id}`} className="truncate font-mono hover:underline">{o.order_number}</Link>
                <span className={`chip flex-shrink-0 ${statusColor(o.status)}`}>{prettyStatus(o.status)}</span>
                <span className="font-bold whitespace-nowrap">{money(o.total)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function SalesSpark({ data }) {
  if (!data?.length) return <p className="text-sm text-ink-500">No data yet.</p>
  const max = Math.max(...data.map((d) => Number(d.total)), 1)
  return (
    <div className="flex h-32 items-end gap-1">
      {data.map((d, i) => (
        <div key={i} className="flex-1 group relative">
          <div
            className="rounded-t bg-accent-300 transition group-hover:bg-accent-500"
            style={{ height: `${(Number(d.total) / max) * 100}%` }}
          />
          <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-ink-900 px-2 py-1 text-[10px] text-white opacity-0 group-hover:opacity-100">
            {d.d}: {money(d.total)}
          </div>
        </div>
      ))}
    </div>
  )
}
