import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function Login() {
  const nav = useNavigate()
  const loc = useLocation()
  const login = useAuth((s) => s.login)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault(); setError(''); setBusy(true)
    try {
      const u = await login(form.email, form.password)
      const to = loc.state?.from || (u.role === 'admin' ? '/admin' : '/account')
      nav(to)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally { setBusy(false) }
  }

  return (
    <div className="container-narrow grid min-h-[70vh] items-center py-10 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center">
          <span className="eyebrow">Welcome</span>
          <h1 className="mt-2 display-1">Welcome back</h1>
          <p className="mt-2 text-sm text-ink-600">Sign in to your account.</p>
        </div>
        <form onSubmit={submit} className="card mt-8 space-y-4 p-6 sm:p-8">
          <div>
            <div className="label">Email</div>
            <input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <div className="label">Password</div>
            <input type="password" required className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          {error && <p className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700">{error}</p>}
          <button className="btn-primary w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
          <p className="text-center text-xs text-ink-500">
            No account? <Link to="/register" className="font-semibold text-ink-900 underline-offset-4 hover:underline">Register</Link>
          </p>
        </form>
        <div className="mt-6 rounded-2xl border border-ink-100 bg-white p-4 text-center text-xs text-ink-600">
          <strong className="font-semibold text-ink-900">Demo</strong> — admin@nhrtrio.test / password · customer@nhrtrio.test / password
        </div>
      </div>
    </div>
  )
}
