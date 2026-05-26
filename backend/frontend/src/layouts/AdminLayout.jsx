import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, Users, Star, Tags, BadgePercent, MessageSquare, LogOut, Home } from 'lucide-react'
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

export default function AdminLayout() {
  const nav = useNavigate()
  const { user, logout } = useAuth()

  return (
    <div className="grid min-h-screen grid-cols-[260px_1fr] bg-ink-50">
      <aside className="bg-ink-900 text-ink-100">
        <div className="p-6">
          <Link to="/" className="font-display text-2xl font-bold text-white">NHR<span className="text-accent-400">·</span>Trio</Link>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-ink-400">Admin Console</p>
        </div>
        <nav className="space-y-1 px-3">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-white/10 text-white' : 'text-ink-300 hover:bg-white/5 hover:text-white'}`}>
              <l.icon className="h-4 w-4" /> {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-8 border-t border-white/10 p-3">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-300 hover:bg-white/5 hover:text-white"><Home className="h-4 w-4" /> View storefront</Link>
          <button onClick={async () => { await logout(); nav('/') }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-300 hover:bg-white/5 hover:text-white">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
          <div className="mt-3 px-3 text-xs text-ink-400">{user?.email}</div>
        </div>
      </aside>
      <main className="overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}
