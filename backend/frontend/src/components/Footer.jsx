import { Link } from 'react-router-dom'
import { Camera, Send, Globe, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink-900 text-ink-100">
      <div className="container-narrow grid gap-10 py-16 md:grid-cols-4">
        <div>
          <Link to="/" className="font-display text-2xl font-bold">NHR<span className="text-accent-400">·</span>Trio</Link>
          <p className="mt-4 max-w-xs text-sm text-ink-300">
            Premium clothing, ethically made and built to last. Designed for everyday refinement.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="#" className="rounded-full bg-ink-800 p-2 hover:bg-ink-700"><Camera className="h-4 w-4" /></a>
            <a href="#" className="rounded-full bg-ink-800 p-2 hover:bg-ink-700"><Send className="h-4 w-4" /></a>
            <a href="#" className="rounded-full bg-ink-800 p-2 hover:bg-ink-700"><Globe className="h-4 w-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink-300">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop/men" className="hover:text-white">Men</Link></li>
            <li><Link to="/shop/women" className="hover:text-white">Women</Link></li>
            <li><Link to="/shop/outerwear" className="hover:text-white">Outerwear</Link></li>
            <li><Link to="/shop/footwear" className="hover:text-white">Footwear</Link></li>
            <li><Link to="/shop/accessories" className="hover:text-white">Accessories</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink-300">Customer Care</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/track" className="hover:text-white">Track your order</Link></li>
            <li><Link to="/account" className="hover:text-white">Account</Link></li>
            <li><a href="#" className="hover:text-white">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-white">Size Guide</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink-300">Newsletter</h4>
          <p className="mb-3 text-sm text-ink-300">Be the first to know about new drops and exclusive offers.</p>
          <form className="flex">
            <input
              className="w-full rounded-l-xl border-0 bg-ink-800 px-3 py-2.5 text-sm placeholder:text-ink-400 focus:outline-none"
              placeholder="your@email.com"
            />
            <button type="button" className="rounded-r-xl bg-accent-400 px-4 hover:bg-accent-500">
              <Mail className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-ink-800">
        <div className="container-narrow flex flex-col items-center justify-between gap-2 py-6 text-xs text-ink-400 md:flex-row">
          <span>© {new Date().getFullYear()} NHR Trio. All rights reserved.</span>
          <span>Stripe · Visa · Mastercard · Amex · PayPal</span>
        </div>
      </div>
    </footer>
  )
}
