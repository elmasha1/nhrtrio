import { Link } from 'react-router-dom'
import { Camera, Send, Globe, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-20 sm:mt-28 bg-luxe-dark text-ink-100">
      <div className="container-narrow grid gap-10 py-14 sm:gap-12 sm:py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to="/" className="font-display text-2xl font-medium tracking-tight">
            NHR<span className="mx-1 text-accent-300">·</span>Trio
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-300">
            Premium clothing, ethically made and built to last. Designed for everyday refinement.
          </p>
          <div className="mt-6 flex gap-2.5">
            <a href="#" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 transition hover:bg-white/10">
              <Camera className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Newsletter" className="grid h-9 w-9 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 transition hover:bg-white/10">
              <Send className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Website" className="grid h-9 w-9 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 transition hover:bg-white/10">
              <Globe className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-luxe text-ink-300">Shop</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/shop/men"          className="text-ink-200 hover:text-white">Men</Link></li>
            <li><Link to="/shop/women"        className="text-ink-200 hover:text-white">Women</Link></li>
            <li><Link to="/shop/outerwear"    className="text-ink-200 hover:text-white">Outerwear</Link></li>
            <li><Link to="/shop/footwear"     className="text-ink-200 hover:text-white">Footwear</Link></li>
            <li><Link to="/shop/accessories"  className="text-ink-200 hover:text-white">Accessories</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-luxe text-ink-300">Customer Care</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/track"   className="text-ink-200 hover:text-white">Track your order</Link></li>
            <li><Link to="/account" className="text-ink-200 hover:text-white">Account</Link></li>
            <li><a href="#"         className="text-ink-200 hover:text-white">Shipping &amp; Returns</a></li>
            <li><a href="#"         className="text-ink-200 hover:text-white">Size Guide</a></li>
            <li><a href="#"         className="text-ink-200 hover:text-white">Contact</a></li>
          </ul>
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-luxe text-ink-300">Newsletter</h4>
          <p className="mb-4 text-sm leading-relaxed text-ink-300">
            Be the first to know about new drops and exclusive offers.
          </p>
          <form className="flex w-full max-w-sm">
            <input
              className="min-w-0 flex-1 rounded-l-xl border-0 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-ink-400 ring-1 ring-white/10 focus:outline-none focus:ring-accent-400"
              placeholder="your@email.com"
              type="email"
            />
            <button
              type="button"
              className="grid place-items-center rounded-r-xl bg-accent-400 px-5 text-ink-900 hover:bg-accent-300"
              aria-label="Subscribe"
            >
              <Mail className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-narrow flex flex-col items-center justify-between gap-3 py-6 text-[11px] text-ink-400 sm:flex-row">
          <span className="uppercase tracking-luxe">© {new Date().getFullYear()} NHR Trio · All rights reserved</span>
          <span className="uppercase tracking-luxe">Stripe · Visa · Mastercard · Amex · PayPal</span>
        </div>
      </div>
    </footer>
  )
}
