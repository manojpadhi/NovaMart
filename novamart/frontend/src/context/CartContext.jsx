import { createContext, useContext, useState } from 'react'

const CartCtx = createContext(null)
export const useCart = () => useContext(CartCtx)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === product._id)
      if (exists) return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { ...product, qty }]
    })
  }

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i._id !== id))

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id)
    setCart(prev => prev.map(i => i._id === id ? { ...i, qty } : i))
  }

  const clearCart = () => setCart([])

  const total    = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const savings  = cart.reduce((s, i) => s + (i.mrp - i.price) * i.qty, 0)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <CartCtx.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total, savings, cartCount }}>
      {children}
    </CartCtx.Provider>
  )
}
