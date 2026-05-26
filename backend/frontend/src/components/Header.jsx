import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, Menu, X, Search, Heart, LayoutDashboard, LogOut } from 'lucide-react'
import { useAuth } from '../store/auth'
import { useCart } from '../store/cart'

const navItems = [
  { to: '/shop', label: 'Shop' },
  { to: '/shop/men', label: 'Men' },
  { to: '/shop/women', label: 'Women' },
  { to: '/shop/outerwear', label: 'Outerwear' },
  { to: '/shop/footwear', label: 'Footwear' },
  { to: '/shop/accessories', label: 'Accessories' },
]

export default function Header() {
  const nav = useNavigate()
  const { user, logout } = useAuth()
  const cartCount = useCart((s) => s.count())
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [q, setQ] = useState('')

  const submitSearch = (e) => {
    e.preventDefault()
    if (q.trim()) nav(`/shop?search=${encodeURIComponent(q.trim())}`)
    setSearchOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/85 backdrop-blur-xl">
      <div className="bg-ink-900 text-center text-xs font-medium uppercase tracking-widest text-ink-100 py-2">
        Free shipping on orders over $100 · 30-day returns
      </div>
      <div className="container-narrow flex h-16 items-center justify-between gap-6">
        <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Menu">
          <Menu className="h-6 w-6" />
        </button>

        <Link to="/" className="font-display text-2xl font-bold tracking-tight">
          NHR<span className="text-accent-400">·</span>Trio
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/shop'}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-ink-900' : 'text-ink-600 hover:text-ink-900'}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={() => setSearchOpen((v) => !v)} className="btn-ghost !px-2 !py-2" aria-label="Search">
            <Search className="h-5 w-5" />
          </button>

          {user ? (
            <div className="relative group">
              <button className="btn-ghost !px-2 !py-2">
                <User className="h-5 w-5" />
              </button>
              <div className="invisible absolute right-0 top-full w-56 origin-top-right opacity-0 transition group-hover:visible group-hover:opacity-100">
                <div className="mt-2 card p-2">
                  <div className="px-3 py-2 text-xs text-ink-500">Signed in as<br/><span className="font-semibold text-ink-900">{user.email}</span></div>
                  <hr className="my-1 border-ink-100" />
                  <Link to="/account" className="block rounded-lg px-3 py-2 text-sm hover:bg-ink-50">My account</Link>
                  <Link to="/account/orders" className="block rounded-lg px-3 py-2 text-sm hover:bg-ink-50">Orders</Link>
                  <Link to="/account/wishlist" className="block rounded-lg px-3 py-2 text-sm hover:bg-ink-50">Wishlist</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-ink-50">
                      <LayoutDashboard className="h-4 w-4" /> Admin
                    </Link>
                  )}
                  <hr className="my-1 border-ink-100" />
                  <button
                    onClick={async () => { await logout(); nav('/') }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-ink-50"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn-ghost !px-2 !py-2" aria-label="Sign in">
              <User className="h-5 w-5" />
            </Link>
          )}

          <Link to="/account/wishlist" className="btn-ghost !px-2 !py-2 hidden sm:inline-flex">
            <Heart className="h-5 w-5" />
          </Link>
          <Link to="/cart" className="btn-ghost relative !px-2 !py-2">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent-400 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={submitSearch} className="border-t border-ink-100 bg-white">
          <div className="container-narrow flex items-center gap-3 py-3">
            <Search className="h-5 w-5 text-ink-400" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products, categories…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-400"
            />
            <button type="button" onClick={() => setSearchOpen(false)} className="text-ink-400 hover:text-ink-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </form>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-72 bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-xl font-bold">NHR·Trio</span>
              <button onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <nav className="space-y-2">
              {navItems.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-ink-100">
                  {n.label}
                </Link>
              ))}
              <hr className="my-3" />
              <Link to="/track" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm hover:bg-ink-100">Track order</Link>
              <Link to="/account" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm hover:bg-ink-100">My account</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
