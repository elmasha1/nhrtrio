import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import api from '../../lib/api'
import { money, date, prettyStatus, statusColor } from '../../lib/format'
import Loader from '../../components/Loader'
import Empty from '../../components/Empty'

export default function Orders() {
  const [orders, setOrders] = useState(null)
  useEffect(() => { api.get('/orders').then(({ data }) => setOrders(data.data)) }, [])
  if (!orders) return <Loader />
  if (orders.length === 0) return <Empty title="No orders yet" subtitle="Time to start shopping!" action={<Link to="/shop" className="btn-primary">Browse the shop</Link>} />

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <Link to={`/account/orders/${o.id}`} key={o.id} className="card flex flex-wrap items-center gap-4 p-5 hover:bg-ink-50">
          <Package className="h-6 w-6 text-ink-500" />
          <div className="flex-1">
            <div className="font-mono text-sm font-bold">{o.order_number}</div>
            <div className="text-xs text-ink-500">{date(o.created_at)} · {o.items.length} item{o.items.length !== 1 && 's'}</div>
          </div>
          <span className={`chip ${statusColor(o.status)}`}>{prettyStatus(o.status)}</span>
          <div className="font-bold">{money(o.total)}</div>
        </Link>
      ))}
    </div>
  )
}
