import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { T, Btn, Input, fmt } from '../components/UI'

export default function Checkout() {
  const { cart, total, savings, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [form, setForm] = useState({
    name: user?.name || '', phone: '', address: '', city: '', pincode: '', payment: 'UPI'
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const placeOrder = async () => {
    setLoading(true)
    try {
      const items = cart.map(i => ({ product: i._id, name: i.name, image: i.image, price: i.price, qty: i.qty }))
      const { data } = await axios.post('/api/orders', {
        items,
        shippingAddress: { name: form.name, phone: form.phone, address: form.address, city: form.city, pincode: form.pincode },
        paymentMethod: form.payment,
        totalPrice: total,
        savedAmount: savings,
      })
      setOrderId(data._id)
      clearCart()
      setStep(3)
    } catch (err) {
      alert(err.response?.data?.message || 'Order failed')
    }
    setLoading(false)
  }

  if (step === 3) return (
    <div style={{ maxWidth: 500, margin: '60px auto', padding: '0 16px', textAlign: 'center', animation: 'fadeUp 0.4s ease' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontFamily: "'Outfit',sans-serif", color: T.text, fontSize: 26, marginBottom: 8 }}>Order Placed!</h2>
      <div style={{ color: T.accent, fontFamily: "'DM Mono',monospace", fontSize: 13, marginBottom: 12, wordBreak: 'break-all' }}>ID: {orderId}</div>
      <div style={{ color: T.muted, fontSize: 14, marginBottom: 28 }}>Estimated delivery: 3–5 business days</div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <Btn onClick={() => navigate('/orders')}>View Orders</Btn>
        <Btn onClick={() => navigate('/')} variant="outline">Continue Shopping</Btn>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 660, margin: '0 auto', padding: '24px 16px', animation: 'fadeUp 0.3s ease' }}>
      <button onClick={() => step === 1 ? navigate(-1) : setStep(1)} style={{ background:'none',border:'none',color:T.muted,cursor:'pointer',fontSize:13,marginBottom:20 }}>← Back</button>
      <h2 style={{ fontFamily:"'Outfit',sans-serif", color:T.text, marginBottom:24, fontSize:22 }}>Checkout</h2>

      {/* Steps */}
      <div style={{ display:'flex', alignItems:'center', marginBottom:28, gap:4 }}>
        {['Shipping','Review'].map((s,i)=>(
          <div key={s} style={{ display:'flex', alignItems:'center', gap:4, flex:1 }}>
            <div style={{ width:26,height:26,borderRadius:'50%',border:`2px solid ${step>i?T.accent:T.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,background:step>i?T.accent:'transparent',color:step>i?'#000':T.muted }}>{step>i+1?'✓':i+1}</div>
            <span style={{ fontSize:12,color:step===i+1?T.text:T.subtle,fontWeight:step===i+1?600:400 }}>{s}</span>
            {i<1&&<div style={{ flex:1,height:1,background:T.border,margin:'0 4px' }}/>}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
            <Input label="Full Name" value={form.name} onChange={v=>set('name',v)} full required />
            <Input label="Phone" value={form.phone} onChange={v=>set('phone',v)} full required />
          </div>
          <Input label="Address" value={form.address} onChange={v=>set('address',v)} placeholder="Street, Area, Locality" full required />
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
            <Input label="City" value={form.city} onChange={v=>set('city',v)} full required />
            <Input label="Pincode" value={form.pincode} onChange={v=>set('pincode',v)} full required />
          </div>
          <div>
            <div style={{ fontSize:12,color:T.muted,marginBottom:8 }}>Payment Method</div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8 }}>
              {[['UPI','📱 UPI'],['Card','💳 Card'],['COD','💵 COD']].map(([v,l])=>(
                <button key={v} onClick={()=>set('payment',v)} style={{ padding:'10px 0',background:form.payment===v?T.accentD:'#0d1117',border:`1px solid ${form.payment===v?T.accentB:T.border}`,color:form.payment===v?T.accent:T.muted,borderRadius:8,cursor:'pointer',fontSize:13,fontWeight:600 }}>{l}</button>
              ))}
            </div>
          </div>
          <Btn onClick={()=>setStep(2)} full size="lg" disabled={!form.name||!form.phone||!form.address||!form.city||!form.pincode}>Review Order →</Btn>
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{ background:'#161b22',border:`1px solid ${T.border}`,borderRadius:12,padding:16,marginBottom:16 }}>
            {cart.map(item=>(
              <div key={item._id} style={{ display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:`1px solid ${T.border}` }}>
                <span style={{ color:T.muted,fontSize:13 }}>{item.image} {item.name} × {item.qty}</span>
                <span style={{ color:T.text,fontSize:13,fontWeight:600 }}>{fmt(item.price*item.qty)}</span>
              </div>
            ))}
            <div style={{ display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:`1px solid ${T.border}` }}>
              <span style={{ color:T.green,fontSize:13 }}>You save</span>
              <span style={{ color:T.green,fontSize:13,fontWeight:600 }}>{fmt(savings)}</span>
            </div>
            <div style={{ display:'flex',justifyContent:'space-between',paddingTop:10 }}>
              <span style={{ color:T.text,fontWeight:700,fontFamily:"'Outfit',sans-serif",fontSize:16 }}>Total</span>
              <span style={{ color:T.accent,fontWeight:800,fontFamily:"'Outfit',sans-serif",fontSize:18 }}>{fmt(total)}</span>
            </div>
          </div>
          <div style={{ background:'#161b22',border:`1px solid ${T.border}`,borderRadius:12,padding:16,marginBottom:20,fontSize:13,color:T.muted,lineHeight:2 }}>
            <div>📦 {form.address}, {form.city} – {form.pincode}</div>
            <div>📱 {form.phone}</div>
            <div>💳 {form.payment}</div>
          </div>
          <Btn onClick={placeOrder} full size="lg" disabled={loading}>{loading ? 'Placing…' : '✓ Confirm & Place Order'}</Btn>
        </div>
      )}
    </div>
  )
}
