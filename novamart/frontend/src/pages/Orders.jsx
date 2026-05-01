import { useState, useEffect } from 'react'
import axios from 'axios'
import { T, Spinner, fmt } from '../components/UI'

const statusColor = { Delivered: T.green, Shipped: T.blue, Processing: T.accent, Confirmed: T.purple, Cancelled: T.red }

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/orders/myorders')
      .then(r => { setOrders(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px', animation: 'fadeUp 0.3s ease' }}>
      <h2 style={{ fontFamily: "'Outfit',sans-serif", color: T.text, marginBottom: 24, fontSize: 22 }}>My Orders</h2>

      {loading ? <div style={{ textAlign:'center',padding:'60px 0' }}><Spinner /></div> :
       orders.length === 0 ? (
        <div style={{ textAlign:'center',padding:'60px 0',color:T.muted }}>
          <div style={{ fontSize:48,marginBottom:12 }}>📦</div>
          <div>No orders yet</div>
        </div>
       ) : orders.map(order => {
        const c = statusColor[order.status] || T.accent
        return (
          <div key={order._id} style={{ background:'#161b22',border:`1px solid ${T.border}`,borderRadius:12,padding:20,marginBottom:14 }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14 }}>
              <div>
                <div style={{ color:T.text,fontWeight:700,fontFamily:"'Outfit',sans-serif",fontSize:14,wordBreak:'break-all' }}>#{order._id.slice(-8).toUpperCase()}</div>
                <div style={{ color:T.muted,fontSize:12,marginTop:2 }}>{new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div>
              </div>
              <span style={{ fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:20,background:c+'22',color:c,border:`1px solid ${c}44`,whiteSpace:'nowrap' }}>{order.status}</span>
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:6,marginBottom:14 }}>
              {order.items.map((item,i)=>(
                <div key={i} style={{ display:'flex',alignItems:'center',gap:10,padding:'7px 10px',background:'#0d1117',borderRadius:8 }}>
                  <span style={{ fontSize:22 }}>{item.image}</span>
                  <span style={{ flex:1,color:T.text,fontSize:13 }}>{item.name}</span>
                  <span style={{ color:T.muted,fontSize:12 }}>×{item.qty}</span>
                  <span style={{ color:T.accent,fontSize:13,fontWeight:700 }}>{fmt(item.price*item.qty)}</span>
                </div>
              ))}
            </div>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
              <div style={{ fontSize:12,color:T.muted }}>
                📍 {order.shippingAddress?.city} · {order.paymentMethod}
              </div>
              <span style={{ color:T.text,fontWeight:700,fontFamily:"'Outfit',sans-serif" }}>{fmt(order.totalPrice)}</span>
            </div>
          </div>
        )
       })
      }
    </div>
  )
}
