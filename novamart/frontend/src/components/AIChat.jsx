import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { T } from './UI'

export default function AIChat({ product, onClose }) {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', content: `Hi! I'm your AI shopping assistant 🤖\nAsk me anything about **${product.name}** — worth buying, alternatives, issues, best price!` }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const quickQ = ['Worth buying?', 'Any known issues?', 'Better alternatives?', 'Is the price good?']

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  const send = async (text) => {
    const q = (text || input).trim()
    if (!q || loading) return
    setInput('')
    const newMsgs = [...msgs, { role: 'user', content: q }]
    setMsgs(newMsgs)
    setLoading(true)
    try {
      const apiMsgs = newMsgs.filter((_, i) => i > 0).map(m => ({ role: m.role, content: m.content }))
      const { data } = await axios.post('/api/ai/chat', { messages: apiMsgs, product })
      setMsgs(p => [...p, { role: 'assistant', content: data.reply }])
    } catch {
      setMsgs(p => [...p, { role: 'assistant', content: '⚠️ Error connecting. Please try again.' }])
    }
    setLoading(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: 'min(520px,95vw)', maxHeight: '85vh', background: '#161b22', borderRadius: 16, border: `1px solid rgba(240,136,62,0.35)`, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.8)' }}>

        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.border}`, background: 'rgba(240,136,62,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: T.accent, fontSize: 16 }}>◆</span>
              <span style={{ color: T.text, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>AI Shopping Assistant</span>
            </div>
            <div style={{ color: T.accent, fontSize: 11, marginTop: 2 }}>{product.image} {product.name}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ padding: '8px 14px', borderBottom: `1px solid ${T.border}`, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {quickQ.map(q => (
            <button key={q} onClick={() => send(q)} style={{ padding: '3px 9px', background: 'rgba(240,136,62,0.1)', border: '1px solid rgba(240,136,62,0.3)', color: T.accent, borderRadius: 20, fontSize: 11, cursor: 'pointer' }}>{q}</button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '84%', padding: '10px 14px', background: m.role === 'user' ? T.accent : '#0d1117', color: m.role === 'user' ? '#000' : T.text, borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', fontSize: 13, lineHeight: 1.6, border: m.role !== 'user' ? `1px solid ${T.border}` : 'none', whiteSpace: 'pre-wrap' }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 5, padding: '10px 14px', background: '#0d1117', border: `1px solid ${T.border}`, borderRadius: '16px 16px 16px 4px', width: 62 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: T.accent, animation: `bounce 1s ${i*0.15}s infinite` }} />)}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={{ padding: '10px 14px', borderTop: `1px solid ${T.border}`, display: 'flex', gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask anything about this product…"
            style={{ flex: 1, padding: '10px 14px', background: '#0d1117', border: `1px solid ${T.border}`, borderRadius: 10, color: T.text, fontSize: 13, outline: 'none' }}
          />
          <button onClick={() => send()} style={{ padding: '10px 16px', background: T.accent, color: '#000', border: 'none', borderRadius: 10, fontSize: 15, cursor: 'pointer', fontWeight: 700 }}>→</button>
        </div>
      </div>
    </div>
  )
}
