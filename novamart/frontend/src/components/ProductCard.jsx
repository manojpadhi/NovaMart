import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { T, Stars, Badge, fmt, disc } from './UI'

export default function ProductCard({ product, onAI, delay = 0 }) {
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [added, setAdded] = useState(false)
  const d = disc(product.price, product.mrp)

  const handleAdd = (e) => {
    e.stopPropagation()
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      style={{ background: '#161b22', border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', position: 'relative', transition: 'all 0.25s', animation: `fadeUp 0.35s ease ${delay}s both` }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderH; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(0,0,0,0.5)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {product.badge && <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 2 }}><Badge label={product.badge} /></div>}
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2, background: '#f8514922', border: '1px solid #f8514944', color: '#f85149', fontSize: 10, fontWeight: 700, padding: '3px 7px', borderRadius: 20 }}>-{d}%</div>

      <div style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, rgba(240,136,62,0.07), rgba(88,166,255,0.07))`, fontSize: 64 }}>
        {product.image}
      </div>

      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontSize: 10, color: T.muted, fontFamily: "'DM Mono',monospace", marginBottom: 3, textTransform: 'uppercase', letterSpacing: 1 }}>{product.brand}</div>
        <div style={{ fontSize: 14, color: T.text, fontWeight: 600, fontFamily: "'Outfit',sans-serif", marginBottom: 5, lineHeight: 1.35, minHeight: 38 }}>{product.name}</div>
        <Stars rating={product.rating} small />
        <div style={{ fontSize: 11, color: T.subtle, marginBottom: 8 }}>({(product.numReviews || 0).toLocaleString()} reviews)</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: T.text, fontFamily: "'Outfit',sans-serif" }}>{fmt(product.price)}</span>
          <span style={{ fontSize: 12, color: T.subtle, textDecoration: 'line-through' }}>{fmt(product.mrp)}</span>
        </div>
        {product.stock <= 10 && <div style={{ fontSize: 11, color: T.accent, marginBottom: 8 }}>⚡ Only {product.stock} left</div>}
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={handleAdd}
            style={{ flex: 1, padding: '8px 0', background: added ? '#3fb95022' : 'rgba(240,136,62,0.12)', border: `1px solid ${added ? '#3fb95055' : 'rgba(240,136,62,0.35)'}`, color: added ? '#3fb950' : T.accent, borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
            {added ? '✓ Added' : '＋ Cart'}
          </button>
          {onAI && (
            <button onClick={e => { e.stopPropagation(); onAI(product) }}
              style={{ padding: '8px 11px', background: '#bc8cff22', border: '1px solid #bc8cff44', color: '#bc8cff', borderRadius: 8, fontSize: 13, cursor: 'pointer' }} title="AI Analysis">◆</button>
          )}
        </div>
      </div>
    </div>
  )
}
