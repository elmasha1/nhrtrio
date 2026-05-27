import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './store/auth'

import SiteLayout from './layouts/SiteLayout'
import AdminLayout from './layouts/AdminLayout'
import DocumentTitle from './components/DocumentTitle'

import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import TrackOrder from './pages/TrackOrder'
import Login from './pages/Login'
import Register from './pages/Register'
import Account from './pages/account/Account'
import Profile from './pages/account/Profile'
import Orders from './pages/account/Orders'
import OrderDetail from './pages/account/OrderDetail'
import Addresses from './pages/account/Addresses'
import Wishlist from './pages/account/Wishlist'

import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminProductForm from './pages/admin/ProductForm'
import AdminOrders from './pages/admin/Orders'
import AdminOrderDetail from './pages/admin/OrderDetail'
import AdminUsers from './pages/admin/Users'
import AdminReviews from './pages/admin/Reviews'
import AdminCategories from './pages/admin/Categories'
import AdminCoupons from './pages/admin/Coupons'
import AdminChat from './pages/admin/Chat'

function Protected({ children, admin = false }) {
  const { token, user } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  if (admin && user?.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App() {
  const refresh = useAuth((s) => s.refresh)
  useEffect(() => { refresh() }, [refresh])

  return (
    <>
      <DocumentTitle />
      <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:category" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Protected><Checkout /></Protected>} />
        <Route path="/orders/:orderNumber/success" element={<Protected><OrderSuccess /></Protected>} />
        <Route path="/track" element={<TrackOrder />} />
        <Route path="/track/:orderNumber" element={<TrackOrder />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/account" element={<Protected><Account /></Protected>}>
          <Route index element={<Profile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="wishlist" element={<Wishlist />} />
        </Route>
      </Route>

      <Route path="/admin" element={<Protected admin><AdminLayout /></Protected>}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/:id" element={<AdminProductForm />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrderDetail />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="chat" element={<AdminChat />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
