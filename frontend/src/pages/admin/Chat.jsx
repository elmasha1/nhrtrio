import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import api from '../../lib/api'
import { date } from '../../lib/format'

export default function Chat() {
  const [convs, setConvs] = useState([])
  const [active, setActive] = useState(null)
  const [body, setBody] = useState('')
  const bottomRef = useRef(null)

  const loadList = () => api.get('/admin/conversations').then(({ data }) => setConvs(data.data))
  const loadActive = (id) => api.get(`/admin/conversations/${id}`).then(({ data }) => setActive(data))

  useEffect(() => {
    loadList()
    const t = setInterval(loadList, 8000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [active])

  const send = async (e) => {
    e.preventDefault()
    if (!body.trim() || !active) return
    await api.post(`/admin/conversations/${active.id}/reply`, { body })
    setBody('')
    loadActive(active.id); loadList()
  }

  const close = async () => {
    if (!active) return
    await api.patch(`/admin/conversations/${active.id}/close`)
    loadList(); loadActive(active.id)
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Live Chat</h1>
      <div className="grid h-[70vh] gap-4 md:grid-cols-[320px_1fr]">
        <div className="card overflow-y-auto">
          <ul className="divide-y divide-ink-100">
            {convs.map((c) => (
              <li key={c.id}>
                <button onClick={() => loadActive(c.id)}
                  className={`flex w-full items-start gap-3 p-4 text-left hover:bg-ink-50 ${active?.id === c.id ? 'bg-ink-100' : ''}`}>
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-ink-900 text-xs font-bold text-white">
                    {(c.user?.name || c.guest_name || '?')[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="text-sm font-semibold">{c.user?.name || c.guest_name || 'Guest'}</div>
                      {c.unread_count > 0 && <span className="ml-2 grid h-5 min-w-5 place-items-center rounded-full bg-accent-400 px-1.5 text-[10px] font-bold text-white">{c.unread_count}</span>}
                    </div>
                    <div className="text-xs text-ink-500 line-clamp-1">{c.user?.email || c.guest_email}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-wider text-ink-400">{date(c.last_message_at || c.created_at)} · {c.status}</div>
                  </div>
                </button>
              </li>
            ))}
            {convs.length === 0 && <li className="p-6 text-center text-sm text-ink-500">No conversations yet.</li>}
          </ul>
        </div>

        <div className="card flex flex-col">
          {active ? (
            <>
              <div className="flex items-center justify-between border-b border-ink-100 p-4">
                <div>
                  <div className="font-semibold">{active.user?.name || active.guest_name}</div>
                  <div className="text-xs text-ink-500">{active.user?.email || active.guest_email}</div>
                </div>
                <button onClick={close} className="btn-outline !py-1 !px-3 text-xs">{active.status === 'closed' ? 'Closed' : 'Close conversation'}</button>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto bg-ink-50 p-4">
                {active.messages.map((m) => {
                  const isAdmin = m.sender_type === 'admin'
                  return (
                    <div key={m.id} className={isAdmin ? 'flex justify-end' : 'flex justify-start'}>
                      <div className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm shadow-soft ${isAdmin ? 'bg-ink-900 text-white' : 'bg-white'}`}>
                        <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider opacity-70">{m.sender?.name || (isAdmin ? 'You' : 'Customer')}</div>
                        <div className="whitespace-pre-wrap">{m.body}</div>
                        <div className="mt-1 text-[9px] opacity-60">{date(m.created_at)}</div>
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={send} className="flex gap-2 border-t border-ink-100 p-3">
                <input className="input" placeholder="Type a reply…" value={body} onChange={(e) => setBody(e.target.value)} />
                <button className="btn-primary !px-3"><Send className="h-4 w-4" /></button>
              </form>
            </>
          ) : (
            <div className="grid flex-1 place-items-center text-sm text-ink-500">Select a conversation to start replying.</div>
          )}
        </div>
      </div>
    </div>
  )
}
