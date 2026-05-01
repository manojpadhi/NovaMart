import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nm_user')) } catch { return null }
  })

  const setUserHeader = (userId) => {
    if (userId) axios.defaults.headers.common['x-user-id'] = userId
    else delete axios.defaults.headers.common['x-user-id']
  }

  useEffect(() => { if (user?._id) setUserHeader(user._id) }, [])

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password })
    setUser(data)
    localStorage.setItem('nm_user', JSON.stringify(data))
    setUserHeader(data._id)
    return data
  }

  const register = async (name, email, password) => {
    const { data } = await axios.post('/api/auth/register', { name, email, password })
    setUser(data)
    localStorage.setItem('nm_user', JSON.stringify(data))
    setUserHeader(data._id)
    return data
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('nm_user')
    setUserHeader(null)
  }

  const updateProfile = async (updates) => {
    const { data } = await axios.put('/api/auth/profile', updates)
    const updated = { ...user, ...data }
    setUser(updated)
    localStorage.setItem('nm_user', JSON.stringify(updated))
    return updated
  }

  return (
    <AuthCtx.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthCtx.Provider>
  )
}
