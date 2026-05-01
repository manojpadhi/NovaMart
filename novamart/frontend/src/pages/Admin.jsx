import { useState, useEffect } from 'react'
import axios from 'axios'
import { T, Btn, Input, Spinner, Toast, fmt } from '../components/UI'

export default function AdminDashboard() {
  const [tab, setTab]         = useState('overview')
  const [stats, setStats]     = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders]   = useState([])
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast]     = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [pForm, setPForm] = useState({ name:'', description:'', price:'', mrp:'', category:'', brand:'', image:'📦', badge:'', stock:'' })

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [s, p, o, u] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/products'),
        axios.get('/api/orders'),
        axios.get('/api/admin/users'),
      ])
      setStats(s.data); setProducts(p.data); setOrders(o.data); setUsers(u.data)
    } catch {}
    setLoading(false)
  }

  const saveProduct = async () => {
    try {
      if (editProduct) await axios.put(`/api/products/${editProduct._id}`, { ...pForm, price: Number(pForm.price), mrp: Number(pForm.mrp), stock: Number(pForm.stock) })
      else await axios.post('/api/products', { ...pForm, price: Number(pForm.price), mrp: Number(pForm.mrp), stock: Number(pForm.stock) })
      setShowForm(false); setEditProduct(null); setPForm({ name:'',description:'',price:'',mrp:'',category:'',brand:'',image:'📦',badge:'',stock:'' })
      loadAll(); setToast({ msg: editProduct ? 'Product updated!' : 'Product added!', type: 'success' })
    } catch (err) { setToast({ msg: err.response?.data?.message || 'Error', type: 'error' }) }
  }

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    try { await axios.delete(`/api/products/${id}`); loadAll(); setToast({ msg: 'Deleted!', type: 'success' }) }
    catch { setToast({ msg: 'Delete failed', type: 'error' }) }
  }

  const updateStatus = async (id, status) => {
    try { await axios.put(`/api/orders/${id}/status`, { status }); loadAll() }
    catch { setToast({ msg: 'Update failed', type: 'error' }) }
  }

  const openEdit = (p) => {
    setEditProduct(p)
    setPForm({ name:p.name, description:p.description, price:p.price, mrp:p.mrp, category:p.category, brand:p.brand, image:p.image, badge:p.badge, stock:p.stock })
    setShowForm(true)
  }

  const statusColor = { Delivered:'#3fb950', Shipped:'#58a6ff', Processing:'#f0883e', Confirmed:'#bc8cff', Cancelled:'#f85149' }

  if (loading) return <div style={{ textAlign:'center',padding:'60px 0' }}><Spinner /></div>

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px', animation: 'fadeUp 0.3s ease' }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24 }}>
        <h2 style={{ fontFamily:"'Outfit',sans-serif",color:T.text,fontSize:22 }}>Admin Dashboard</h2>
        <span style={{ fontSize:11,color:T.accent,background:T.accentD,border:`1px solid ${T.accentB}`,padding:'4px 12px',borderRadius:20,fontFamily:"'DM Mono',monospace" }}>ADMIN</span>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24 }}>
          {[['₹',fmt(stats.revenue),'Revenue','#3fb950'],['📦',stats.totalProducts,'Products','#58a6ff'],['🛒',stats.totalOrders,'Orders','#f0883e'],['👤',stats.totalUsers,'Users','#bc8cff']].map(([icon,val,label,color])=>(
            <div key={label} style={{ background:'#161b22',border:`1px solid ${T.border}`,borderRadius:12,padding:'18px 20px' }}>
              <div style={{ fontSize:22,marginBottom:8 }}>{icon}</div>
              <div style={{ fontSize:20,fontWeight:800,color,fontFamily:"'Outfit',sans-serif" }}>{val}</div>
              <div style={{ fontSize:12,color:T.muted,marginTop:4 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display:'flex',gap:4,marginBottom:20,borderBottom:`1px solid ${T.border}`,paddingBottom:1 }}>
        {['overview','products','orders','users'].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:'8px 16px',background:'none',border:'none',borderBottom:tab===t?`2px solid ${T.accent}`:'2px solid transparent',color:tab===t?T.accent:T.muted,cursor:'pointer',fontSize:13,fontWeight:600,textTransform:'capitalize',marginBottom:-1 }}>{t}</button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && stats && (
        <div>
          {stats.lowStock?.length > 0 && (
            <div style={{ background:'#f8514922',border:'1px solid #f8514944',borderRadius:10,padding:'12px 16px',marginBottom:16,color:'#f85149',fontSize:13 }}>
              ⚠️ Low stock: {stats.lowStock.map(p=>`${p.name} (${p.stock})`).join(', ')}
            </div>
          )}
          <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,color:T.text,fontSize:15,marginBottom:12 }}>Recent Orders</div>
          {stats.recentOrders?.map(o => (
            <div key={o._id} style={{ background:'#161b22',border:`1px solid ${T.border}`,borderRadius:10,padding:'12px 16px',marginBottom:8,display:'flex',alignItems:'center',gap:14 }}>
              <span style={{ color:T.text,fontWeight:700,fontFamily:"'DM Mono',monospace",fontSize:11 }}>#{o._id.slice(-8).toUpperCase()}</span>
              <span style={{ flex:1,color:T.muted,fontSize:12 }}>{o.user?.name} · {new Date(o.createdAt).toLocaleDateString()}</span>
              <span style={{ color:T.accent,fontWeight:700,fontSize:13 }}>{fmt(o.totalPrice)}</span>
              <span style={{ fontSize:11,padding:'3px 8px',borderRadius:20,background:(statusColor[o.status]||T.accent)+'22',color:statusColor[o.status]||T.accent,border:`1px solid ${(statusColor[o.status]||T.accent)}44` }}>{o.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* PRODUCTS */}
      {tab === 'products' && (
        <div>
          <div style={{ display:'flex',justifyContent:'space-between',marginBottom:14 }}>
            <span style={{ color:T.muted,fontSize:13 }}>{products.length} products</span>
            <Btn size="sm" variant="success" onClick={()=>{ setShowForm(true); setEditProduct(null) }}>+ Add Product</Btn>
          </div>

          {showForm && (
            <div style={{ background:'#161b22',border:`1px solid ${T.border}`,borderRadius:12,padding:20,marginBottom:16 }}>
              <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,color:T.text,fontSize:15,marginBottom:14 }}>{editProduct?'Edit':'Add'} Product</div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10 }}>
                <Input label="Name" value={pForm.name} onChange={v=>setPForm(f=>({...f,name:v}))} full />
                <Input label="Brand" value={pForm.brand} onChange={v=>setPForm(f=>({...f,brand:v}))} full />
                <Input label="Price (₹)" value={pForm.price} onChange={v=>setPForm(f=>({...f,price:v}))} type="number" full />
                <Input label="MRP (₹)" value={pForm.mrp} onChange={v=>setPForm(f=>({...f,mrp:v}))} type="number" full />
                <Input label="Category" value={pForm.category} onChange={v=>setPForm(f=>({...f,category:v}))} full />
                <Input label="Stock" value={pForm.stock} onChange={v=>setPForm(f=>({...f,stock:v}))} type="number" full />
                <Input label="Image (emoji)" value={pForm.image} onChange={v=>setPForm(f=>({...f,image:v}))} full />
                <Input label="Badge" value={pForm.badge} onChange={v=>setPForm(f=>({...f,badge:v}))} placeholder="Bestseller, New…" full />
              </div>
              <Input label="Description" value={pForm.description} onChange={v=>setPForm(f=>({...f,description:v}))} placeholder="Product description" full />
              <div style={{ display:'flex',gap:8,marginTop:12 }}>
                <Btn onClick={saveProduct} variant="success">Save</Btn>
                <Btn onClick={()=>{setShowForm(false);setEditProduct(null)}} variant="outline">Cancel</Btn>
              </div>
            </div>
          )}

          <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
            {products.map(p=>(
              <div key={p._id} style={{ background:'#161b22',border:`1px solid ${T.border}`,borderRadius:10,padding:'10px 14px',display:'flex',alignItems:'center',gap:12 }}>
                <span style={{ fontSize:22 }}>{p.image}</span>
                <span style={{ flex:1,color:T.text,fontSize:13,fontWeight:600 }}>{p.name}</span>
                <span style={{ color:T.muted,fontSize:11,minWidth:80 }}>{p.category}</span>
                <span style={{ color:T.accent,fontSize:13,fontWeight:700,minWidth:80,textAlign:'right' }}>{fmt(p.price)}</span>
                <span style={{ color:p.stock<15?T.red:T.green,fontSize:11,minWidth:55,textAlign:'right' }}>{p.stock} left</span>
                <div style={{ display:'flex',gap:6 }}>
                  <Btn size="sm" variant="blue" onClick={()=>openEdit(p)}>Edit</Btn>
                  <Btn size="sm" variant="danger" onClick={()=>deleteProduct(p._id)}>Del</Btn>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ORDERS */}
      {tab === 'orders' && (
        <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
          {orders.map(o=>(
            <div key={o._id} style={{ background:'#161b22',border:`1px solid ${T.border}`,borderRadius:10,padding:'12px 16px',display:'flex',alignItems:'center',gap:14,flexWrap:'wrap' }}>
              <span style={{ color:T.text,fontWeight:700,fontFamily:"'DM Mono',monospace",fontSize:11,minWidth:90 }}>#{o._id.slice(-8).toUpperCase()}</span>
              <span style={{ color:T.muted,fontSize:12,flex:1 }}>{o.user?.name} · {o.items?.length} items</span>
              <span style={{ color:T.accent,fontWeight:700,fontSize:13 }}>{fmt(o.totalPrice)}</span>
              <select value={o.status} onChange={e=>updateStatus(o._id,e.target.value)}
                style={{ padding:'4px 8px',background:'#0d1117',border:`1px solid ${T.border}`,color:statusColor[o.status]||T.accent,borderRadius:8,fontSize:11,cursor:'pointer',outline:'none' }}>
                {['Processing','Confirmed','Shipped','Delivered','Cancelled'].map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* USERS */}
      {tab === 'users' && (
        <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
          {users.map(u=>(
            <div key={u._id} style={{ background:'#161b22',border:`1px solid ${T.border}`,borderRadius:10,padding:'12px 16px',display:'flex',alignItems:'center',gap:14 }}>
              <div style={{ width:34,height:34,borderRadius:'50%',background:T.accentD,border:`1px solid ${T.accentB}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:T.accent }}>{u.name?.charAt(0).toUpperCase()}</div>
              <div style={{ flex:1 }}>
                <div style={{ color:T.text,fontSize:13,fontWeight:600 }}>{u.name}</div>
                <div style={{ color:T.muted,fontSize:11 }}>{u.email}</div>
              </div>
              <span style={{ fontSize:10,padding:'2px 8px',borderRadius:20,background:u.role==='admin'?'#bc8cff22':'#58a6ff22',color:u.role==='admin'?'#bc8cff':'#58a6ff',border:`1px solid ${u.role==='admin'?'#bc8cff44':'#58a6ff44'}` }}>{u.role}</span>
              <span style={{ color:T.subtle,fontSize:11 }}>{new Date(u.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)} />}
    </div>
  )
}
