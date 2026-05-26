import { useEffect, useState } from 'react'
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingBag, Users, Star, Tags,
  BadgePercent, MessageSquare, LogOut, Home, Menu, X,
} from 'lucide-react'
import { useAuth } from '../store/auth'

const links = [
  { to: '/admin',            icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products',   icon: Package,         label: 'Products' },
  { to: '/admin/categories', icon: Tags,            label: 'Categories' },
  { to: '/admin/orders',     icon: ShoppingBag,     label: 'Orders' },
  { to: '/admin/users',      icon: Users,           label: 'Customers' },
  { to: '/admin/reviews',    icon: Star,            label: 'Reviews' },
  { to: '/admin/coupons',    icon: BadgePercent,    label: 'Coupons' },
  { to: '/admin/chat',       icon: MessageSquare,   label: 'Chat' },
]

function SideNav({ onNavigate, user, logout, nav }) {
  return (
    <>
      <div className="px-6 pt-6 sm:pt-8">
        <Link to="/" className="font-display text-2xl font-medium tracking-tight text-white">
          NHR<span className="mx-1 text-accent-300">·</span>Trio
        </Link>
        <p className="mt-1 text-[10px] uppercase tracking-luxe text-ink-400">Admin Console</p>
      </div>

      <nav className="mt-6 flex-1 space-y-1 px-3">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium tracking-wide transition ${
                isActive ? 'bg-white/10 text-white' : 'text-ink-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <l.icon className="h-4 w-4" /> {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-300 hover:bg-white/5 hover:text-white"
        >
          <Home className="h-4 w-4" /> View storefront
        </Link>
        <button
          onClick={async () => { onNavigate?.(); await logout(); nav('/') }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-300 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
        <div className="mt-3 truncate px-3 text-xs text-ink-400">{user?.email}</div>
      </div>
    </>
  )
}

export default function AdminLayout() {
  const nav = useNavigate()
  const loc = useLocation()
  const { user, logout } = useAuth()
  const [drawer, setDrawer] = useState(false)

  useEffect(() => { setDrawer(false) }, [loc.pathname])
  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawer])

  return (
    <div className="min-h-screen bg-ink-50 lg:grid lg:grid-cols-[260px_1fr]">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-100 bg-white px-4 py-3 lg:hidden">
        <button
          className="tap-target grid place-items-center"
          onClick={() => setDrawer(true)}
          aria-label="Open admin menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/admin" className="font-display text-lg font-medium">
          NHR<span className="mx-1 text-accent-400">·</span>Trio
          <span className="ml-2 text-[10px] uppercase tracking-luxe text-ink-500">Admin</span>
        </Link>
        <Link to="/" className="text-[11px] uppercase tracking-luxe text-ink-500 hover:text-ink-900">
          Storefront
        </Link>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden flex-col bg-luxe-dark text-ink-100 lg:flex lg:min-h-screen">
        <SideNav user={user} logout={logout} nav={nav} />
      </aside>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setDrawer(false)}>
          <aside
            className="absolute left-0 top-0 flex h-full w-[80%] max-w-xs flex-col bg-luxe-dark text-ink-100 shadow-lux"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDrawer(false)}
              className="absolute right-3 top-3 tap-target grid place-items-center text-ink-300 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <SideNav user={user} logout={logout} nav={nav} onNavigate={() => setDrawer(false)} />
          </aside>
        </div>
      )}

      <main className="min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  )
}
