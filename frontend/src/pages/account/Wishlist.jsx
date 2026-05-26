import { useEffect, useState } from 'react'
import api from '../../lib/api'
import ProductCard from '../../components/ProductCard'
import Empty from '../../components/Empty'
import { Link } from 'react-router-dom'

export default function Wishlist() {
  const [items, setItems] = useState(null)
  useEffect(() => { api.get('/wishlist').then(({ data }) => setItems(data)) }, [])
  if (!items) return null
  if (items.length === 0) {
    return (
      <Empty
        title="No favorites yet"
        subtitle="Tap the heart on any product to save it here."
        action={<Link to="/shop" className="btn-primary">Browse the shop</Link>}
      />
    )
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3">
      {items.map((w) => <ProductCard key={w.id} product={w.product} />)}
    </div>
  )
}
