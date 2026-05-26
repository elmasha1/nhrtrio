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
    <div className="container-narrow py-10">
      <h1 className="text-4xl font-bold">My account</h1>
      <p className="mt-1 text-sm text-ink-600">Welcome back, {user?.name}.</p>

      <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr]">
        <aside>
          <div className="card p-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-ink-900 text-white' : 'hover:bg-ink-100'}`
                }
              >
                <l.icon className="h-4 w-4" /> {l.label}
              </NavLink>
            ))}
            <button onClick={async () => { await logout(); nav('/') }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-100">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </aside>
        <div><Outlet /></div>
      </div>
    </div>
  )
}
