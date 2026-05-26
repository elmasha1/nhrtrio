import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function Register() {
  const nav = useNavigate()
  const register = useAuth((s) => s.register)
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', phone: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault(); setError(''); setBusy(true)
    try {
      await register(form)
      nav('/account')
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors).flat().join(' ') : 'Could not create account')
    } finally { setBusy(false) }
  }

  return (
    <div className="container-narrow grid min-h-[70vh] items-center py-10 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center">
          <span className="eyebrow">Join</span>
          <h1 className="mt-2 display-1">Create an account</h1>
          <p className="mt-2 text-sm text-ink-600">Join the NHR Trio circle.</p>
        </div>
        <form onSubmit={submit} className="card mt-8 space-y-4 p-6 sm:p-8">
          <div><div className="label">Full name</div><input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><div className="label">Email</div><input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><div className="label">Phone (optional)</div><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><div className="label">Password</div><input type="password" required className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            <div><div className="label">Confirm</div><input type="password" required className="input" value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} /></div>
          </div>
          {error && <p className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700">{error}</p>}
          <button className="btn-primary w-full" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
          <p className="text-center text-xs text-ink-500">
            Have an account? <Link to="/login" className="font-semibold text-ink-900 underline-offset-4 hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
