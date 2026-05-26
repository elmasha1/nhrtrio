import { create } from 'zustand'

const load = () => {
  try { return JSON.parse(localStorage.getItem('cart')) || [] } catch { return [] }
}
const persist = (items) => localStorage.setItem('cart', JSON.stringify(items))

const keyOf = (i) => `${i.product_id}:${i.size || ''}:${i.color || ''}`

export const useCart = create((set, get) => ({
  items: load(),

  add(item) {
    const items = [...get().items]
    const idx = items.findIndex((i) => keyOf(i) === keyOf(item))
    if (idx >= 0) items[idx].quantity = Math.min(50, items[idx].quantity + (item.quantity || 1))
    else items.push({ ...item, quantity: item.quantity || 1 })
    persist(items)
    set({ items })
  },

  update(key, quantity) {
    const items = get().items.map((i) =>
      keyOf(i) === key ? { ...i, quantity: Math.max(1, Math.min(50, quantity)) } : i
    )
    persist(items)
    set({ items })
  },

  remove(key) {
    const items = get().items.filter((i) => keyOf(i) !== key)
    persist(items)
    set({ items })
  },

  clear() {
    persist([])
    set({ items: [] })
  },

  count: () => get().items.reduce((s, i) => s + i.quantity, 0),

  subtotal: () => get().items.reduce((s, i) => s + (Number(i.price) || 0) * i.quantity, 0),

  keyOf,
}))
