import { useState, useEffect } from 'react'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import AIChat from '../components/AIChat'
import { T, Spinner } from '../components/UI'

const CATS = ['All','Electronics','Footwear','Kitchen','Furniture','Health','Fitness','Home']

export default function Home({ search }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('featured')
  const [aiProduct, setAiProduct] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const params = {}
        if (category !== 'All') params.category = category
        if (search) params.search = search
        if (sort !== 'featured') params.sort = sort
        const { data } = await axios.get('/api/products', { params })
        setProducts(data)
      } catch {
        setProducts([])
      }
      setLoading(false)
    }
    load()
  }, [category, search, sort])

  return (
    <div style={{ maxWidth: 1260, margin: '0 auto', padding: '24px 16px' }}>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, rgba(240,136,62,0.1) 0%, rgba(88,166,255,0.07) 60%, transparent 100%)`, border: `1px solid ${T.border}`, borderRadius: 14, padding: '28px 28px', marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,136,62,0.12), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ fontSize: 11, color: T.accent, fontFamily: "'DM Mono',monospace", letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>◆ AI-Powered Shopping</div>
        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(22px,4vw,38px)', fontWeight: 800, color: T.text, marginBottom: 6, lineHeight: 1.2 }}>
          Smart Picks. <span style={{ color: T.accent }}>Real Savings.</span>
        </h1>
        <p style={{ color: T.muted, fontSize: 14, maxWidth: 440 }}>Click ◆ on any product for instant AI analysis powered by Claude — comparisons, reviews & buying advice.</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{ padding: '5px 13px', borderRadius: 20, background: category === c ? T.accent : '#161b22', color: category === c ? '#000' : T.muted, border: category === c ? 'none' : `1px solid ${T.border}`, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>{c}</button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ padding: '6px 12px', background: '#161b22', border: `1px solid ${T.border}`, color: T.muted, borderRadius: 8, fontSize: 12, cursor: 'pointer', outline: 'none' }}>
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}><Spinner /></div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: T.muted }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔍</div>
          <div>No products found</div>
        </div>
      ) : (
        <>
          <div style={{ color: T.subtle, fontSize: 12, marginBottom: 16 }}>
            Showing <strong style={{ color: T.accent }}>{products.length}</strong> products
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px,1fr))', gap: 16 }}>
            {products.map((p, i) => (
              <ProductCard key={p._id} product={p} onAI={setAiProduct} delay={i * 0.04} />
            ))}
          </div>
        </>
      )}

      {aiProduct && <AIChat product={aiProduct} onClose={() => setAiProduct(null)} />}
    </div>
  )
}
