import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { T, Btn, Input, Toast } from '../components/UI'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [name, setName]       = useState(user?.name || '')
  const [phone, setPhone]     = useState(user?.phone || '')
  const [address, setAddress] = useState(user?.address || '')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast]     = useState(null)

  const save = async () => {
    setLoading(true)
    try {
      await updateProfile({ name, phone, address, ...(password ? { password } : {}) })
      setPassword('')
      setToast({ msg: 'Profile updated!', type: 'success' })
    } catch {
      setToast({ msg: 'Update failed', type: 'error' })
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '24px 16px', animation: 'fadeUp 0.3s ease' }}>
      <h2 style={{ fontFamily: "'Outfit',sans-serif", color: T.text, marginBottom: 24, fontSize: 22 }}>My Profile</h2>

      <div style={{ background: '#161b22', border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
        <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:24,paddingBottom:16,borderBottom:`1px solid ${T.border}` }}>
          <div style={{ width:52,height:52,borderRadius:'50%',background:'rgba(240,136,62,0.12)',border:'1px solid rgba(240,136,62,0.35)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:700,color:'#f0883e' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ color:T.text,fontWeight:700,fontFamily:"'Outfit',sans-serif",fontSize:16 }}>{user?.name}</div>
            <div style={{ color:T.muted,fontSize:13 }}>{user?.email}</div>
            <div style={{ fontSize:11,marginTop:3,color:user?.role==='admin'?'#bc8cff':'#58a6ff',background:user?.role==='admin'?'#bc8cff22':'#58a6ff22',border:`1px solid ${user?.role==='admin'?'#bc8cff44':'#58a6ff44'}`,padding:'1px 8px',borderRadius:20,display:'inline-block' }}>{user?.role?.toUpperCase()}</div>
          </div>
        </div>

        <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
          <Input label="Full Name" value={name} onChange={setName} full />
          <Input label="Email (cannot change)" value={user?.email || ''} onChange={()=>{}} type="email" full />
          <Input label="Phone" value={phone} onChange={setPhone} placeholder="+91 XXXXX XXXXX" full />
          <Input label="Default Address" value={address} onChange={setAddress} placeholder="City, State" full />
          <Input label="New Password (leave blank to keep current)" value={password} onChange={setPassword} type="password" placeholder="••••••••" full />
          <Btn onClick={save} full size="lg" disabled={loading}>{loading ? 'Saving…' : 'Save Changes'}</Btn>
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  )
}
