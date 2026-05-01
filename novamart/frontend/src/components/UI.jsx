import { useEffect } from 'react'

const T = {
  accent: '#f0883e', accentD: 'rgba(240,136,62,0.12)', accentB: 'rgba(240,136,62,0.35)',
  blue: '#58a6ff', blueD: 'rgba(88,166,255,0.1)',
  green: '#3fb950', greenD: 'rgba(63,185,80,0.1)',
  red: '#f85149', redD: 'rgba(248,81,73,0.1)',
  purple: '#bc8cff', purpleD: 'rgba(188,140,255,0.1)',
  text: '#e6edf3', muted: '#8b949e', subtle: '#484f58',
  card: '#161b22', surface: '#0d1117', border: '#21262d',
}
export { T }

export function Btn({ children, onClick, variant = 'primary', size = 'md', disabled, full, style: sx, type = 'button' }) {
  const sizes = { sm: { fontSize: 12, padding: '6px 12px' }, md: { fontSize: 13, padding: '9px 18px' }, lg: { fontSize: 15, padding: '12px 26px' } }
  const variants = {
    primary: { background: T.accent, color: '#000', border: 'none' },
    outline:  { background: 'transparent', border: `1px solid ${T.border}`, color: T.text },
    ghost:    { background: 'transparent', border: 'none', color: T.muted },
    danger:   { background: T.redD, border: `1px solid ${T.red}55`, color: T.red },
    success:  { background: T.greenD, border: `1px solid ${T.green}55`, color: T.green },
    blue:     { background: T.blueD, border: `1px solid ${T.blue}55`, color: T.blue },
  }
  return (
    <button type={type} onClick={!disabled ? onClick : undefined} style={{
      ...sizes[size], ...variants[variant],
      borderRadius: 8, cursor: disabled ? 'not-allowed' : 'pointer',
      fontWeight: 600, opacity: disabled ? 0.5 : 1,
      width: full ? '100%' : undefined, transition: 'all 0.2s', ...sx,
    }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '0.82' }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
    >{children}</button>
  )
}

export function Input({ label, value, onChange, type = 'text', placeholder, full, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, width: full ? '100%' : undefined }}>
      {label && <label style={{ fontSize: 12, color: T.muted }}>{label}{required && <span style={{ color: T.red }}> *</span>}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required}
        style={{ padding: '9px 13px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 13, outline: 'none', width: full ? '100%' : undefined }}
        onFocus={e => e.target.style.borderColor = T.accent}
        onBlur={e => e.target.style.borderColor = T.border}
      />
    </div>
  )
}

export function Stars({ rating, small }) {
  return (
    <span style={{ fontSize: small ? 11 : 13 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? T.accent : T.subtle }}>{i <= Math.round(rating) ? '★' : '☆'}</span>
      ))}
      <span style={{ color: T.muted, fontSize: small ? 10 : 11, marginLeft: 4 }}>{Number(rating).toFixed(1)}</span>
    </span>
  )
}

const badgeColors = { Bestseller: T.green, Trending: T.accent, 'Top Rated': T.blue, Premium: T.purple, New: T.blue, 'AI Pick': T.purple, Deal: T.red, Eco: T.green }
export function Badge({ label, small }) {
  const c = badgeColors[label] || T.accent
  return (
    <span style={{ background: c + '22', border: `1px solid ${c}55`, color: c, fontSize: small ? 9 : 10, fontWeight: 700, padding: small ? '2px 6px' : '3px 9px', borderRadius: 20, letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>{label}</span>
  )
}

export function Spinner() {
  return <div style={{ width: 22, height: 22, border: `2px solid ${T.border}`, borderTop: `2px solid ${T.accent}`, borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
}

export function Toast({ msg, type = 'success', onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t) }, [])
  const colors = { success: T.green, error: T.red, info: T.blue }
  const c = colors[type] || T.accent
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: T.card, border: `1px solid ${c}55`, borderLeft: `3px solid ${c}`, color: T.text, padding: '12px 18px', borderRadius: 10, fontSize: 13, boxShadow: '0 8px 32px rgba(0,0,0,0.6)', animation: 'toastIn 0.3s ease', display: 'flex', alignItems: 'center', gap: 8, maxWidth: 300 }}>
      <span style={{ color: c, fontSize: 16 }}>{type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      {msg}
    </div>
  )
}

export const fmt = n => '₹' + Number(n).toLocaleString('en-IN')
export const disc = (p, m) => Math.round((1 - p / m) * 100)
