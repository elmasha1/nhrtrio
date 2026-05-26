import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Package, Mail } from 'lucide-react'

export default function OrderSuccess() {
  const { orderNumber } = useParams()
  return (
    <div className="container-narrow py-20">
      <div className="mx-auto max-w-xl text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
        <h1 className="mt-6 text-4xl font-bold">Thank you!</h1>
        <p className="mt-2 text-ink-600">Your order has been placed and payment confirmed.</p>
        <p className="mt-1 text-sm text-ink-500">Order number: <span className="font-mono font-bold text-ink-900">{orderNumber}</span></p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link to={`/track/${orderNumber}`} className="card flex items-center gap-3 p-4 text-left hover:bg-ink-50">
            <Package className="h-5 w-5" />
            <div>
              <div className="text-sm font-semibold">Track order</div>
              <div className="text-xs text-ink-500">Follow your delivery</div>
            </div>
          </Link>
          <Link to="/account/orders" className="card flex items-center gap-3 p-4 text-left hover:bg-ink-50">
            <Mail className="h-5 w-5" />
            <div>
              <div className="text-sm font-semibold">View all orders</div>
              <div className="text-xs text-ink-500">In your account</div>
            </div>
          </Link>
        </div>

        <Link to="/shop" className="btn-primary mt-8">Continue shopping</Link>
      </div>
    </div>
  )
}
