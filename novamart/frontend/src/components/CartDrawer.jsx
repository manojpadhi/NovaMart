import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { T, Btn, fmt } from './UI'

export default function CartDrawer({ onClose }) {
  const { cart, removeFromCart, updateQty, total, savings } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    onClose()
    if (!user) navigate('/login')
    else navigate('/checkout')
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)', zIndex: 1500 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 'min(420px,100vw)', background: '#161b22', borderLeft: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', animation: 'slideIn 0.3s ease' }}>

        <div style={{ padding: '18px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: T.text, fontWeight: 700, fontFamily: "'Outfit',sans-serif", fontSize: 18 }}>Shopping Cart</div>
            <div style={{ color: T.muted, fontSize: 12 }}>{cart.length} item{cart.length !== 1 ? 's' : ''}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 60, color: T.subtle }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
              <div>Your cart is empty</div>
            </div>
          ) : cart.map(item => (
            <div key={item._id} style={{ background: '#0d1117', border: `1px solid ${T.border}`, borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 12 }}>
              <div style={{ fontSize: 36, width: 46, textAlign: 'center' }}>{item.image}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: T.text, fontSize: 13, fontWeight: 600, fontFamily: "'Outfit',sans-serif", marginBottom: 2, lineHeight: 1.3 }}>{item.name}</div>
                <div style={{ color: T.accent, fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{fmt(item.price)}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#161b22', border: `1px solid ${T.border}`, borderRadius: 6, padding: '2px 8px' }}>
                    <button onClick={() => updateQty(item._id, item.qty - 1)} style={{ background: 'none', border: 'none', color: T.text, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>−</button>
                    <span style={{ fontSize: 13, color: T.text, minWidth: 18, textAlign: 'center' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item._id, item.qty + 1)} style={{ background: 'none', border: 'none', color: T.text, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>+</button>
                  </div>
                  <span style={{ fontSize: 12, color: T.muted }}>= {fmt(item.price * item.qty)}</span>
                </div>
              </div>
              <button onClick={() => removeFromCart(item._id)} style={{ background: 'none', border: 'none', color: T.subtle, cursor: 'pointer', fontSize: 16, alignSelf: 'flex-start', padding: 4 }}>✕</button>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: 16, borderTop: `1px solid ${T.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: T.muted, fontSize: 13 }}>You save</span>
              <span style={{ color: T.green, fontSize: 13, fontWeight: 600 }}>{fmt(savings)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ color: T.text, fontSize: 17, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>Total</span>
              <span style={{ color: T.text, fontSize: 17, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>{fmt(total)}</span>
            </div>
            <Btn onClick={handleCheckout} full size="lg">Proceed to Checkout →</Btn>
          </div>
        )}
      </div>
    </div>
  )
}
