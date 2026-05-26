import { useEffect, useState } from 'react'
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const submitSearch = (e) => {
    e.preventDefault()
    if (q.trim()) nav(`/shop?search=${encodeURIComponent(q.trim())}`)
    setSearchOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/85 backdrop-blur-xl">
      {/* Announcement strip */}
      <div className="bg-ink-900 px-4 py-2 text-center text-[10px] font-medium uppercase tracking-luxe text-ink-100 sm:text-[11px]">
        Complimentary shipping on orders over $100 · 30-day returns
      </div>

      <div className="container-narrow flex h-16 items-center justify-between gap-2 sm:h-20 sm:gap-4">
        {/* Mobile: menu toggle */}
        <button
          className="tap-target -ml-2 grid place-items-center lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Brand wordmark — sized for mobile-first */}
        <Link
          to="/"
          className="font-display text-xl font-medium tracking-tight sm:text-2xl lg:text-[1.7rem]"
          aria-label="NHR Trio home"
        >
          NHR<span className="mx-1 text-accent-400">·</span>Trio
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex xl:gap-9">
          {navItems.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/shop'}
              className={({ isActive }) =>
                `relative text-[13px] font-medium tracking-wide transition ${
                  isActive ? 'text-ink-900' : 'text-ink-600 hover:text-ink-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {n.label}
                  <span
                    className={`absolute -bottom-1.5 left-1/2 h-px w-4 -translate-x-1/2 bg-accent-400 transition-opacity ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="tap-target grid place-items-center text-ink-700 hover:text-ink-900"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {user ? (
            <div className="relative hidden sm:block">
              <div className="group relative">
                <button className="tap-target grid place-items-center text-ink-700 hover:text-ink-900" aria-label="Account">
                  <User className="h-5 w-5" />
                </button>
                <div className="invisible absolute right-0 top-full w-60 origin-top-right opacity-0 transition group-hover:visible group-hover:opacity-100">
                  <div className="mt-2 card p-2">
                    <div className="px-3 py-2 text-[11px] text-ink-500">
                      Signed in as<br />
                      <span className="font-semibold text-ink-900 normal-case tracking-normal">{user.email}</span>
                    </div>
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
            </div>
          ) : (
            <Link
              to="/login"
              className="tap-target hidden place-items-center text-ink-700 hover:text-ink-900 sm:grid"
              aria-label="Sign in"
            >
              <User className="h-5 w-5" />
            </Link>
          )}

          <Link
            to="/account/wishlist"
            className="tap-target hidden place-items-center text-ink-700 hover:text-ink-900 md:grid"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
          </Link>

          <Link
            to="/cart"
            className="tap-target relative grid place-items-center text-ink-700 hover:text-ink-900"
            aria-label={`Cart, ${cartCount} items`}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute right-1 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent-400 px-1 text-[10px] font-bold text-ink-900">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Search drawer */}
      {searchOpen && (
        <div className="border-t border-ink-100 bg-gradient-to-b from-white to-ink-50/50">
          <form onSubmit={submitSearch} className="container-narrow py-3 sm:py-4">
            <label
              htmlFor="header-search"
              className="group mx-auto flex max-w-2xl items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2 shadow-soft transition focus-within:border-accent-400 focus-within:shadow-ring"
            >
              <Search className="h-4 w-4 flex-shrink-0 text-ink-400 transition group-focus-within:text-accent-500" />
              <input
                id="header-search"
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                placeholder="Search the collection…"
                className="flex-1 bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400 placeholder:font-light"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ('')}
                  className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-full text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                  aria-label="Clear"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
              <span className="hidden flex-shrink-0 rounded border border-ink-200 bg-ink-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-luxe text-ink-500 sm:inline-block">
                Enter
              </span>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                aria-label="Close search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </label>

            {/* Curated quick links */}
            <div className="mx-auto mt-3 flex max-w-2xl flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-luxe text-ink-500">
                Trending
              </span>
              {['Cashmere coat', 'Silk blouse', 'Leather loafers', 'Wool trousers'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setQ(t); nav(`/shop?search=${encodeURIComponent(t)}`); setSearchOpen(false) }}
                  className="rounded-full border border-ink-200 bg-white px-2.5 py-1 text-[11px] font-medium text-ink-700 transition hover:border-accent-400 hover:text-ink-900"
                >
                  {t}
                </button>
              ))}
            </div>
          </form>
        </div>
      )}

      {/* Mobile dropdown menu */}
      {open && (
        <>
          {/* Backdrop, sits below the dropdown but above page content */}
          <div
            className="fixed inset-0 z-[55] bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
          />
          {/* Dropdown panel — drops from top, sits flush under the header */}
          <div
            className="absolute left-0 right-0 top-full z-[60] max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-ink-100 bg-white text-ink-900 shadow-2xl safe-bottom lg:hidden"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="container-narrow py-4">
              <nav className="flex flex-col">
                {navItems.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className="block border-b border-ink-100 py-3.5 font-display text-xl font-medium tracking-tight text-ink-900 hover:text-accent-600"
                  >
                    {n.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
                <Link
                  to="/track"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-ink-200 px-3 py-3 text-center font-semibold text-ink-900 hover:bg-ink-100"
                >
                  Track order
                </Link>
                {user ? (
                  <Link
                    to="/account"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-ink-200 px-3 py-3 text-center font-semibold text-ink-900 hover:bg-ink-100"
                  >
                    My account
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-ink-900 px-3 py-3 text-center font-semibold text-white hover:bg-ink-800"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
