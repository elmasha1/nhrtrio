import { useEffect } from 'react'
import { useLocation, matchPath } from 'react-router-dom'
import { SUFFIX } from '../lib/useTitle'

// Static path → title. Dynamic-data pages set their own title via useTitle().
const routes = [
  { path: '/',                          title: 'Premium Clothing for Him & Her' },
  { path: '/shop',                      title: 'Shop the Collection' },
  { path: '/shop/:category',            title: (m) => titleCase(m.params.category) },
  { path: '/cart',                      title: 'Your Cart' },
  { path: '/checkout',                  title: 'Checkout' },
  { path: '/orders/:orderNumber/success', title: 'Order Confirmed' },
  { path: '/track',                     title: 'Track Your Order' },
  { path: '/track/:orderNumber',        title: 'Track Your Order' },
  { path: '/login',                     title: 'Sign In' },
  { path: '/register',                  title: 'Create Account' },

  { path: '/account',                   title: 'My Account' },
  { path: '/account/orders',            title: 'My Orders' },
  { path: '/account/orders/:id',        title: 'Order Details' },
  { path: '/account/addresses',         title: 'Addresses' },
  { path: '/account/wishlist',          title: 'Wishlist' },

  { path: '/admin',                     title: 'Admin Dashboard' },
  { path: '/admin/products',            title: 'Admin · Products' },
  { path: '/admin/products/new',        title: 'New Product' },
  { path: '/admin/products/:id',        title: 'Edit Product' },
  { path: '/admin/categories',          title: 'Admin · Categories' },
  { path: '/admin/orders',              title: 'Admin · Orders' },
  { path: '/admin/orders/:id',          title: 'Order Details' },
  { path: '/admin/users',               title: 'Admin · Customers' },
  { path: '/admin/reviews',             title: 'Admin · Reviews' },
  { path: '/admin/coupons',             title: 'Admin · Coupons' },
  { path: '/admin/chat',                title: 'Admin · Live Chat' },
]

function titleCase(slug = '') {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function resolveTitle(pathname) {
  // Most specific first — sort by descending segment count
  const sorted = [...routes].sort(
    (a, b) => b.path.split('/').length - a.path.split('/').length,
  )
  for (const r of sorted) {
    const m = matchPath({ path: r.path, end: true }, pathname)
    if (m) return typeof r.title === 'function' ? r.title(m) : r.title
  }
  return null
}

// Don't override the dynamic-content pages whose own components set the title.
const SKIP = [
  '/product/:slug', // ProductDetail sets its own title
]

function isSkipped(pathname) {
  return SKIP.some((p) => matchPath({ path: p, end: true }, pathname))
}

export default function DocumentTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (isSkipped(pathname)) return
    const t = resolveTitle(pathname)
    document.title = t ? `${t} · ${SUFFIX}` : `${SUFFIX} — Premium Clothing`
  }, [pathname])

  return null
}
