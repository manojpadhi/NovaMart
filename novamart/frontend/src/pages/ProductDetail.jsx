import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import AIChat from '../components/AIChat'
import { T, Stars, Badge, Btn, Input, Spinner, Toast, fmt, disc } from '../components/UI'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('overview')
  const [added, setAdded] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then(r => { setProduct(r.data); setLoading(false) })
      .catch(() => { setLoading(false) })
  }, [id])

  if (loading) return <div style={{ textAlign: 'center', padding: '80px 0' }}><Spinner /></div>
  if (!product) return <div style={{ textAlign: 'center', padding: '80px 0', color: T.muted }}>Product not found</div>

  const d = disc(product.price, product.mrp)

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product)
    setAdded(true)
    setToast({ msg: `${product.image} Added to cart!`, type: 'success' })
    setTimeout(() => setAdded(false), 1600)
  }

  const submitReview = async () => {
    if (!user) return navigate('/login')
    setSubmitting(true)
    try {
      await axios.post(`/api/products/${id}/reviews`, { rating: reviewRating, comment: reviewComment })
      const r = await axios.get(`/api/products/${id}`)
      setProduct(r.data)
      setReviewComment('')
      setToast({ msg: 'Review submitted!', type: 'success' })
    } catch (err) {
      setToast({ msg: err.response?.data?.message || 'Error', type: 'error' })
    }
    setSubmitting(false)
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px', animation: 'fadeUp 0.3s ease' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', fontSize: 13, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>← Back</button>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 28, marginBottom: 32 }}>
        {/* Image */}
        <div>
          <div style={{ background: '#161b22', border: `1px solid ${T.border}`, borderRadius: 14, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 110 }}>{product.image}</div>
        </div>

        {/* Info */}
        <div>
          {product.badge && <div style={{ marginBottom: 10 }}><Badge label={product.badge} /></div>}
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 700, color: T.text, marginBottom: 6, lineHeight: 1.3 }}>{product.name}</h1>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 10, fontFamily: "'DM Mono',monospace" }}>{product.brand} · {product.category}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Stars rating={product.rating} />
            <span style={{ fontSize: 12, color: T.muted }}>{(product.numReviews || 0).toLocaleString()} reviews</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: T.text, fontFamily: "'Outfit',sans-serif" }}>{fmt(product.price)}</span>
            <span style={{ fontSize: 16, color: T.subtle, textDecoration: 'line-through' }}>{fmt(product.mrp)}</span>
            <span style={{ fontSize: 14, color: T.red, fontWeight: 700 }}>{d}% off</span>
          </div>
          <div style={{ fontSize: 12, color: T.green, marginBottom: 20 }}>You save {fmt(product.mrp - product.price)}</div>
          <div style={{ padding: 12, background: '#0d1117', border: `1px solid ${T.border}`, borderRadius: 10, marginBottom: 18, fontSize: 12, color: T.muted, lineHeight: 1.8 }}>
            ✓ Free delivery above ₹499 &nbsp;·&nbsp; ✓ 7-day easy returns &nbsp;·&nbsp; ✓ {product.stock} in stock
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 12, color: T.muted }}>Qty:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0d1117', border: `1px solid ${T.border}`, borderRadius: 8, padding: '4px 12px' }}>
              <button onClick={() => setQty(q => Math.max(1,q-1))} style={{ background:'none',border:'none',color:T.text,fontSize:18,cursor:'pointer' }}>−</button>
              <span style={{ fontSize:14,color:T.text,fontWeight:600,minWidth:20,textAlign:'center' }}>{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock,q+1))} style={{ background:'none',border:'none',color:T.text,fontSize:18,cursor:'pointer' }}>+</button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <button onClick={handleAdd} style={{ flex:1, padding:'12px 0', background: added ? '#3fb95022':'rgba(240,136,62,0.12)', border:`1px solid ${added?'#3fb95055':'rgba(240,136,62,0.35)'}`, color: added ? T.green : T.accent, borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer', transition:'all 0.2s' }}>
              {added ? '✓ Added to Cart' : '🛒 Add to Cart'}
            </button>
            <button onClick={() => setAiOpen(true)} style={{ padding:'12px 16px', background:'#bc8cff22', border:'1px solid #bc8cff44', color:'#bc8cff', borderRadius:10, fontSize:14, cursor:'pointer', fontWeight:700 }}>◆ AI</button>
          </div>
          <Btn onClick={() => { addToCart(product,qty); navigate('/checkout') }} full size="lg">⚡ Buy Now</Btn>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#161b22', border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}` }}>
          {['overview','specs','reviews'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex:1, padding:'12px 0', background: tab===t ? 'rgba(240,136,62,0.08)':'transparent', borderBottom: tab===t ? `2px solid ${T.accent}`:'2px solid transparent', color: tab===t ? T.accent : T.muted, border:'none', cursor:'pointer', fontSize:13, fontWeight:600, textTransform:'capitalize' }}>{t}</button>
          ))}
        </div>
        <div style={{ padding: 20 }}>
          {tab === 'overview' && <p style={{ color:T.muted, fontSize:14, lineHeight:1.8 }}>{product.description}</p>}

          {tab === 'specs' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[['Brand',product.brand],['Category',product.category],['Rating',`${Number(product.rating).toFixed(1)} / 5`],['Reviews',(product.numReviews||0).toLocaleString()],['Stock',`${product.stock} units`],['Sold',`${product.sold||0} units`]].map(([k,v])=>(
                <div key={k} style={{ background:'#0d1117', border:`1px solid ${T.border}`, borderRadius:8, padding:'10px 14px', display:'flex', justifyContent:'space-between' }}>
                  <span style={{ color:T.muted, fontSize:12 }}>{k}</span>
                  <span style={{ color:T.text, fontSize:12, fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {tab === 'reviews' && (
            <div>
              <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
                {(product.reviews||[]).length === 0 ? <div style={{ color:T.muted, fontSize:13 }}>No reviews yet. Be the first!</div> :
                  product.reviews.map((r,i) => (
                    <div key={i} style={{ background:'#0d1117', border:`1px solid ${T.border}`, borderRadius:10, padding:'14px 16px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                        <span style={{ color:T.text, fontWeight:600, fontSize:13 }}>{r.name}</span>
                        <Stars rating={r.rating} small />
                      </div>
                      <p style={{ color:T.muted, fontSize:13, lineHeight:1.6 }}>{r.comment}</p>
                    </div>
                  ))
                }
              </div>
              {user && (
                <div style={{ background:'#0d1117', border:`1px solid ${T.border}`, borderRadius:10, padding:16 }}>
                  <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, color:T.text, fontSize:14, marginBottom:12 }}>Write a Review</div>
                  <div style={{ display:'flex', gap:6, marginBottom:10 }}>
                    {[1,2,3,4,5].map(s=>(
                      <button key={s} onClick={()=>setReviewRating(s)} style={{ background:'none',border:'none',cursor:'pointer',fontSize:22,color:s<=reviewRating?T.accent:T.subtle }}>★</button>
                    ))}
                  </div>
                  <Input value={reviewComment} onChange={setReviewComment} placeholder="Share your experience…" full />
                  <Btn onClick={submitReview} disabled={submitting||!reviewComment} style={{ marginTop:10 }}>Submit Review</Btn>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {aiOpen && <AIChat product={product} onClose={() => setAiOpen(false)} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  )
}
