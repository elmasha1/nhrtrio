import { useState } from 'react'
import api from '../../lib/api'
import { useAuth } from '../../store/auth'

export default function Profile() {
  const { user, setUser } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [pw, setPw] = useState({ current_password: '', password: '', password_confirmation: '' })
  const [msg, setMsg] = useState('')

  const save = async (e) => {
    e.preventDefault(); setMsg('')
    try {
      const { data } = await api.patch('/auth/profile', form)
      setUser(data.user); setMsg('Profile updated.')
    } catch { setMsg('Could not update.') }
  }

  const changePw = async (e) => {
    e.preventDefault(); setMsg('')
    try {
      await api.post('/auth/password', pw)
      setPw({ current_password: '', password: '', password_confirmation: '' })
      setMsg('Password updated.')
    } catch (err) {
      setMsg(err.response?.data?.message || 'Could not change password.')
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={save} className="card p-5 sm:p-6">
        <h2 className="font-display text-xl font-semibold">Profile</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div><div className="label">Name</div><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><div className="label">Email</div><input className="input" value={user?.email} disabled /></div>
          <div className="sm:col-span-2"><div className="label">Phone</div><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        </div>
        <button className="btn-primary mt-5">Save changes</button>
      </form>

      <form onSubmit={changePw} className="card p-5 sm:p-6">
        <h2 className="font-display text-xl font-semibold">Change password</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2"><div className="label">Current password</div><input type="password" className="input" value={pw.current_password} onChange={(e) => setPw({ ...pw, current_password: e.target.value })} /></div>
          <div><div className="label">New password</div><input type="password" className="input" value={pw.password} onChange={(e) => setPw({ ...pw, password: e.target.value })} /></div>
          <div><div className="label">Confirm</div><input type="password" className="input" value={pw.password_confirmation} onChange={(e) => setPw({ ...pw, password_confirmation: e.target.value })} /></div>
        </div>
        <button className="btn-primary mt-5">Update password</button>
      </form>

      {msg && <p className="rounded-2xl bg-ink-100 p-3 text-sm">{msg}</p>}
    </div>
  )
}
