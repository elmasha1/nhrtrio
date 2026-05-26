import { useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { useAuth } from '../store/auth'
import api from '../lib/api'

export default function ChatWidget() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const sinceRef = useRef(0)
  const bottomRef = useRef(null)

  // Guest form
  const [guest, setGuest] = useState({ name: '', email: '', body: '' })
  const [guestStarted, setGuestStarted] = useState(false)

  useEffect(() => { if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, open])

  useEffect(() => {
    if (!open || !user) return
    let stop = false
    const poll = async () => {
      try {
        const { data } = await api.get('/chat/poll', { params: { since: sinceRef.current } })
        if (data.messages?.length) {
          setMessages((prev) => [...prev, ...data.messages])
          sinceRef.current = data.messages[data.messages.length - 1].id
        }
      } catch {}
      if (!stop) setTimeout(poll, 4000)
    }
    // initial fetch
    api.get('/chat/me').then(({ data }) => {
      setMessages(data.messages || [])
      sinceRef.current = data.messages?.[data.messages.length - 1]?.id || 0
    }).catch(() => {})
    poll()
    return () => { stop = true }
  }, [open, user])

  const send = async (e) => {
    e?.preventDefault()
    if (!body.trim() || sending) return
    setSending(true)
    try {
      const { data } = await api.post('/chat/send', { body })
      setMessages((p) => [...p, data])
      sinceRef.current = data.id
      setBody('')
    } catch {} finally { setSending(false) }
  }

  const sendGuest = async (e) => {
    e.preventDefault()
    if (!guest.name || !guest.email || !guest.body) return
    setSending(true)
    try {
      await api.post('/chat/guest', guest)
      setGuestStarted(true)
    } catch {} finally { setSending(false) }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-ink-900 text-white shadow-soft transition hover:bg-ink-800"
        aria-label="Live chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-ink-200 animate-slide-up">
          <div className="bg-ink-900 p-4 text-white">
            <div className="text-sm font-semibold">NHR Trio Support</div>
            <div className="text-xs text-ink-300">We typically reply in a few minutes</div>
          </div>

          {!user && !guestStarted ? (
            <form onSubmit={sendGuest} className="flex flex-1 flex-col gap-3 p-4">
              <p className="text-sm text-ink-600">Leave us a message and we'll get back to you.</p>
              <input className="input" placeholder="Your name" value={guest.name} onChange={(e) => setGuest({ ...guest, name: e.target.value })} required />
              <input className="input" type="email" placeholder="Email" value={guest.email} onChange={(e) => setGuest({ ...guest, email: e.target.value })} required />
              <textarea className="input flex-1 resize-none" placeholder="How can we help?" value={guest.body} onChange={(e) => setGuest({ ...guest, body: e.target.value })} required />
              <button className="btn-primary" disabled={sending}>Send message</button>
            </form>
          ) : !user ? (
            <div className="grid flex-1 place-items-center p-6 text-center text-sm text-ink-600">
              <div>
                <p className="mb-2">Thanks! Your message was sent.</p>
                <p>An agent will follow up by email.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto bg-ink-50 p-4">
                {messages.length === 0 && (
                  <div className="rounded-2xl bg-white p-3 text-xs text-ink-600 shadow-soft">
                    Hi {user.name?.split(' ')[0]}! How can we help today?
                  </div>
                )}
                {messages.map((m) => {
                  const mine = m.sender_type === 'customer'
                  return (
                    <div key={m.id} className={mine ? 'flex justify-end' : 'flex justify-start'}>
                      <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-soft ${mine ? 'bg-ink-900 text-white' : 'bg-white text-ink-900'}`}>
                        {!mine && <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-500">{m.sender?.name || 'Support'}</div>}
                        <div className="whitespace-pre-wrap">{m.body}</div>
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={send} className="flex gap-2 border-t border-ink-100 p-3">
                <input className="input" placeholder="Type a message…" value={body} onChange={(e) => setBody(e.target.value)} />
                <button className="btn-primary !px-3" disabled={sending || !body.trim()}><Send className="h-4 w-4" /></button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  )
}
