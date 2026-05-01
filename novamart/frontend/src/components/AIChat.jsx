import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { T } from './UI'

export default function AIChat({ product, onClose }) {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', content: `Hi! I'm your AI shopping assistant 🤖\nAsk me anything about **${product.name}** — worth buying, alternatives, issues, best price!` }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [recording, setRecording] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [voiceOn, setVoiceOn] = useState(true)   // auto-speak toggle
  const bottomRef = useRef(null)
  const mediaRef = useRef(null)
  const chunksRef = useRef([])
  const audioRef = useRef(null)
  const quickQ = ['Worth buying?', 'Any known issues?', 'Better alternatives?', 'Is the price good?']

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  // Play base64 WAV audio from Sarvam TTS
  const playAudio = async (text) => {
    try {
      setSpeaking(true)
      const { data } = await axios.post('/api/ai/speak', { text })
      const audio = new Audio(`data:audio/wav;base64,${data.audio}`)
      audioRef.current = audio
      audio.onended = () => setSpeaking(false)
      audio.onerror = () => setSpeaking(false)
      audio.play()
    } catch {
      setSpeaking(false)
    }
  }

  const stopAudio = () => {
    audioRef.current?.pause()
    audioRef.current = null
    setSpeaking(false)
  }

  const send = async (text) => {
    const q = (text || input).trim()
    if (!q || loading) return
    setInput('')
    stopAudio()
    const newMsgs = [...msgs, { role: 'user', content: q }]
    setMsgs(newMsgs)
    setLoading(true)
    try {
      const apiMsgs = newMsgs.filter((_, i) => i > 0).map(m => ({ role: m.role, content: m.content }))
      const { data } = await axios.post('/api/ai/chat', { messages: apiMsgs, product })
      setMsgs(p => [...p, { role: 'assistant', content: data.reply }])
      if (voiceOn) playAudio(data.reply)
    } catch {
      setMsgs(p => [...p, { role: 'assistant', content: '⚠️ Error connecting. Please try again.' }])
    }
    setLoading(false)
  }

  // --- Voice Input (STT) ---
  const startRecording = async () => {
    try {
      stopAudio()
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      chunksRef.current = []
      // Pick a mime type Sarvam accepts; prefer webm, fallback to default
      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : ''
      const mr = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream)
      mediaRef.current = mr
      mr.ondataavailable = e => chunksRef.current.push(e.data)
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        const actualMime = mr.mimeType || 'audio/webm'
        const blob = new Blob(chunksRef.current, { type: actualMime })
        const form = new FormData()
        form.append('file', blob, 'audio.webm')
        try {
          const { data } = await axios.post('/api/ai/transcribe', form, { headers: { 'Content-Type': 'multipart/form-data' } })
          if (data.transcript) send(data.transcript)
          else setMsgs(p => [...p, { role: 'assistant', content: '⚠️ Could not understand audio. Please try again.' }])
        } catch (err) {
          const msg = err.response?.data?.message || 'Voice transcription failed.'
          setMsgs(p => [...p, { role: 'assistant', content: `⚠️ ${msg}` }])
        }
      }
      mr.start()
      setRecording(true)
    } catch {
      alert('Microphone access denied.')
    }
  }

  const stopRecording = () => {
    mediaRef.current?.stop()
    setRecording(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: 'min(520px,95vw)', maxHeight: '85vh', background: '#161b22', borderRadius: 16, border: `1px solid rgba(240,136,62,0.35)`, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.8)' }}>

        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.border}`, background: 'rgba(240,136,62,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: T.accent, fontSize: 16 }}>◆</span>
              <span style={{ color: T.text, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>AI Shopping Assistant</span>
              <span style={{ fontSize: 10, color: T.muted, background: 'rgba(240,136,62,0.15)', padding: '2px 6px', borderRadius: 8 }}>Sarvam AI</span>
            </div>
            <div style={{ color: T.accent, fontSize: 11, marginTop: 2 }}>{product.image} {product.name}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Auto-speak toggle */}
            <button onClick={() => { setVoiceOn(v => !v); stopAudio() }}
              title={voiceOn ? 'Mute AI voice' : 'Unmute AI voice'}
              style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', opacity: voiceOn ? 1 : 0.4 }}>
              {voiceOn ? '🔊' : '🔇'}
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 18, cursor: 'pointer' }}>✕</button>
          </div>
        </div>

        {/* Quick questions */}
        <div style={{ padding: '8px 14px', borderBottom: `1px solid ${T.border}`, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {quickQ.map(q => (
            <button key={q} onClick={() => send(q)} style={{ padding: '3px 9px', background: 'rgba(240,136,62,0.1)', border: '1px solid rgba(240,136,62,0.3)', color: T.accent, borderRadius: 20, fontSize: 11, cursor: 'pointer' }}>{q}</button>
          ))}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 6 }}>
              <div style={{ maxWidth: '84%', padding: '10px 14px', background: m.role === 'user' ? T.accent : '#0d1117', color: m.role === 'user' ? '#000' : T.text, borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', fontSize: 13, lineHeight: 1.6, border: m.role !== 'user' ? `1px solid ${T.border}` : 'none', whiteSpace: 'pre-wrap' }}>
                {m.content}
              </div>
              {/* Replay speaker button on AI messages */}
              {m.role === 'assistant' && i > 0 && (
                <button onClick={() => speaking ? stopAudio() : playAudio(m.content)}
                  title={speaking ? 'Stop' : 'Play aloud'}
                  style={{ background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', opacity: 0.6, padding: '0 2px', flexShrink: 0 }}>
                  {speaking ? '⏹' : '🔈'}
                </button>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 5, padding: '10px 14px', background: '#0d1117', border: `1px solid ${T.border}`, borderRadius: '16px 16px 16px 4px', width: 62 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: T.accent, animation: `bounce 1s ${i*0.15}s infinite` }} />)}
            </div>
          )}
          {/* Speaking indicator */}
          {speaking && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.accent, fontSize: 11 }}>
              <span style={{ animation: 'bounce 1s infinite' }}>🔊</span> Speaking…
              <button onClick={stopAudio} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 11, cursor: 'pointer' }}>stop</button>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div style={{ padding: '10px 14px', borderTop: `1px solid ${T.border}`, display: 'flex', gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={recording ? '🎤 Listening… click mic to send' : 'Ask anything about this product…'}
            style={{ flex: 1, padding: '10px 14px', background: '#0d1117', border: `1px solid ${recording ? T.accent : T.border}`, borderRadius: 10, color: T.text, fontSize: 13, outline: 'none', transition: 'border 0.2s' }}
          />
          {/* Mic button */}
          <button
            onClick={recording ? stopRecording : startRecording}
            title={recording ? 'Stop & send voice' : 'Start voice input'}
            style={{ padding: '10px 13px', background: recording ? 'rgba(229,62,62,0.2)' : 'rgba(240,136,62,0.15)', border: `1px solid ${recording ? '#e53e3e' : 'rgba(240,136,62,0.3)'}`, borderRadius: 10, fontSize: 15, cursor: 'pointer', transition: 'all 0.2s' }}>
            {recording ? '⏹' : '🎤'}
          </button>
          <button onClick={() => send()} style={{ padding: '10px 16px', background: T.accent, color: '#000', border: 'none', borderRadius: 10, fontSize: 15, cursor: 'pointer', fontWeight: 700 }}>→</button>
        </div>
      </div>
    </div>
  )
}
