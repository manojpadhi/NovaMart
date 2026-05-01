import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { T, Btn, Input } from '../components/UI'

function AuthCard({ children, title, sub }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#04080f', padding: 16 }}>
      <div style={{ width: 'min(400px,100%)', animation: 'fadeUp 0.4s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 36, marginBottom: 8, color: T.accent }}>◆</div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 26, color: T.text }}>
            <span style={{ color: T.accent }}>nova</span>mart
          </div>
          <div style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>AI-Powered Shopping</div>
        </div>
        <div style={{ background: '#161b22', border: `1px solid ${T.border}`, borderRadius: 16, padding: 28 }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 19, color: T.text, marginBottom: 4 }}>{title}</div>
          <div style={{ color: T.muted, fontSize: 13, marginBottom: 22 }}>{sub}</div>
          {children}
        </div>
      </div>
    </div>
  )
}

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async () => {
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <AuthCard title="Welcome back" sub="Sign in to your account">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="you@email.com" full required />
        <Input label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" full required />
        {error && <div style={{ color: T.red, fontSize: 12, background: T.redD, border: `1px solid ${T.red}33`, padding: '8px 12px', borderRadius: 8 }}>{error}</div>}
        <Btn onClick={handle} full size="lg" disabled={loading || !email || !password}>{loading ? 'Signing in…' : 'Sign In'}</Btn>
        <div style={{ textAlign: 'center', fontSize: 13, color: T.muted }}>
          No account? <Link to="/register" style={{ color: T.accent, fontWeight: 600 }}>Register free</Link>
        </div>
      </div>
    </AuthCard>
  )
}

export function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async () => {
    setError('')
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <AuthCard title="Create account" sub="Join NovaMart today">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input label="Full Name" value={name} onChange={setName} placeholder="Your name" full required />
        <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="you@email.com" full required />
        <Input label="Password" value={password} onChange={setPassword} type="password" placeholder="Min 6 characters" full required />
        {error && <div style={{ color: T.red, fontSize: 12, background: T.redD, border: `1px solid ${T.red}33`, padding: '8px 12px', borderRadius: 8 }}>{error}</div>}
        <Btn onClick={handle} full size="lg" disabled={loading || !name || !email || !password}>{loading ? 'Creating…' : 'Create Account'}</Btn>
        <div style={{ textAlign: 'center', fontSize: 13, color: T.muted }}>
          Have an account? <Link to="/login" style={{ color: T.accent, fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </AuthCard>
  )
}
