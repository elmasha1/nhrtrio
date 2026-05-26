import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Package, Mail } from 'lucide-react'

export default function OrderSuccess() {
  const { orderNumber } = useParams()
  return (
    <div className="container-narrow py-16 sm:py-24">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-accent-50 ring-1 ring-accent-200">
          <CheckCircle2 className="h-10 w-10 text-accent-500" />
        </div>
        <span className="mt-8 inline-block eyebrow">Confirmed</span>
        <h1 className="mt-2 display-1">Thank you.</h1>
        <p className="mt-3 text-base text-ink-700">Your order has been placed and payment confirmed.</p>
        <p className="mt-1 text-[11px] uppercase tracking-luxe text-ink-500">
          Order number: <span className="font-mono text-sm font-bold tracking-normal text-ink-900">{orderNumber}</span>
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <Link to={`/track/${orderNumber}`} className="card flex items-center gap-3 p-5 text-left transition hover:bg-ink-50">
            <Package className="h-5 w-5" />
            <div>
              <div className="text-sm font-semibold">Track order</div>
              <div className="text-xs text-ink-500">Follow your delivery</div>
            </div>
          </Link>
          <Link to="/account/orders" className="card flex items-center gap-3 p-5 text-left transition hover:bg-ink-50">
            <Mail className="h-5 w-5" />
            <div>
              <div className="text-sm font-semibold">View all orders</div>
              <div className="text-xs text-ink-500">In your account</div>
            </div>
          </Link>
        </div>

        <Link to="/shop" className="btn-primary mt-10">Continue shopping</Link>
      </div>
    </div>
  )
}
