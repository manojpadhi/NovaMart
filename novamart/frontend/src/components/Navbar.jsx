import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useState } from 'react'
import { T } from './UI'

export default function Navbar({ onCartOpen, search, setSearch }) {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 500, background: 'rgba(4,8,15,0.94)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${T.border}`, padding: '0 20px' }}>
      <div style={{ maxWidth: 1260, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 14, height: 60 }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
          <span style={{ color: T.accent, fontSize: 20 }}>◆</span>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 19 }}>
            <span style={{ color: T.accent }}>nova</span><span style={{ color: T.text }}>mart</span>
          </span>
        </Link>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 440, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: T.subtle, fontSize: 14 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products & brands…"
            style={{ width: '100%', padding: '8px 14px 8px 34px', background: '#0d1117', border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 13, outline: 'none' }}
            onFocus={e => e.target.style.borderColor = T.accent}
            onBlur={e => e.target.style.borderColor = T.border}
          />
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {user ? (
            <>
              <Link to="/orders" style={{ fontSize: 13, color: T.muted, fontWeight: 600, padding: '4px 8px' }}>Orders</Link>
              {user.role === 'admin' && <Link to="/admin" style={{ fontSize: 13, color: T.accent, fontWeight: 600, padding: '4px 8px' }}>Admin</Link>}

              <div style={{ position: 'relative' }}>
                <button onClick={() => setMenuOpen(!menuOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', background: '#0d1117', border: `1px solid ${T.border}`, borderRadius: 20, cursor: 'pointer' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: T.accentD, border: `1px solid ${T.accentB}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: T.accent }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 12, color: T.muted }}>{user.name?.split(' ')[0]}</span>
                </button>
                {menuOpen && (
                  <div style={{ position: 'absolute', right: 0, top: '110%', background: '#161b22', border: `1px solid ${T.border}`, borderRadius: 10, padding: '6px', minWidth: 150, boxShadow: '0 12px 32px rgba(0,0,0,0.6)', zIndex: 100 }}>
                    <Link to="/profile" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '8px 12px', color: T.muted, fontSize: 13, borderRadius: 6 }}
                      onMouseEnter={e => e.target.style.background = '#21262d'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}>👤 Profile</Link>
                    <Link to="/orders" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '8px 12px', color: T.muted, fontSize: 13, borderRadius: 6 }}
                      onMouseEnter={e => e.target.style.background = '#21262d'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}>📦 My Orders</Link>
                    <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '8px 12px', color: T.red, fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', borderRadius: 6 }}
                      onMouseEnter={e => e.target.style.background = '#21262d'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}>🚪 Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: 13, color: T.muted, fontWeight: 600, padding: '4px 8px' }}>Login</Link>
              <Link to="/register" style={{ fontSize: 13, color: '#000', fontWeight: 700, padding: '7px 14px', background: T.accent, borderRadius: 8 }}>Register</Link>
            </>
          )}

          {/* Cart */}
          <button onClick={onCartOpen} style={{ position: 'relative', background: '#0d1117', border: `1px solid ${T.border}`, color: T.text, padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            🛒
            {cartCount > 0 && (
              <span style={{ background: T.accent, color: '#000', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}
