import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { User, Package, MapPin, Heart, LogOut } from 'lucide-react'
import { useAuth } from '../../store/auth'

const links = [
  { to: '/account',           icon: User,    label: 'Profile', end: true },
  { to: '/account/orders',    icon: Package, label: 'Orders' },
  { to: '/account/addresses', icon: MapPin,  label: 'Addresses' },
  { to: '/account/wishlist',  icon: Heart,   label: 'Wishlist' },
]

export default function Account() {
  const nav = useNavigate()
  const { user, logout } = useAuth()
  return (
    <div className="container-narrow py-8 sm:py-12">
      <span className="eyebrow">Your account</span>
      <h1 className="mt-2 display-1">My account</h1>
      <p className="mt-2 text-sm text-ink-600">Welcome back, {user?.name}.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-[240px_1fr] md:gap-10">
        <aside>
          <div className="card p-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive ? 'bg-ink-900 text-white' : 'text-ink-700 hover:bg-ink-100'
                  }`
                }
              >
                <l.icon className="h-4 w-4" /> {l.label}
              </NavLink>
            ))}
            <button
              onClick={async () => { await logout(); nav('/') }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-100"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </aside>
        <div className="min-w-0"><Outlet /></div>
      </div>
    </div>
  )
}
