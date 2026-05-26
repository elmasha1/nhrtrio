import { create } from 'zustand'
import api from '../lib/api'

const loadUser = () => {
  try { return JSON.parse(localStorage.getItem('auth_user')) } catch { return null }
}

export const useAuth = create((set, get) => ({
  user: loadUser(),
  token: localStorage.getItem('auth_token'),

  isAuthenticated: () => !!get().token,
  isAdmin: () => get().user?.role === 'admin',

  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('auth_user', JSON.stringify(data.user))
    set({ token: data.token, user: data.user })
    return data.user
  },

  async register(payload) {
    const { data } = await api.post('/auth/register', payload)
    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('auth_user', JSON.stringify(data.user))
    set({ token: data.token, user: data.user })
    return data.user
  },

  async refresh() {
    if (!get().token) return null
    try {
      const { data } = await api.get('/auth/me')
      localStorage.setItem('auth_user', JSON.stringify(data.user))
      set({ user: data.user })
      return data.user
    } catch {
      get().logout()
      return null
    }
  },

  async logout() {
    try { await api.post('/auth/logout') } catch {}
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    set({ user: null, token: null })
  },

  setUser(user) {
    localStorage.setItem('auth_user', JSON.stringify(user))
    set({ user })
  },
}))
