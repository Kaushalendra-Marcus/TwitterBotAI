import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '../types'
import { userAPI } from '../api/client'

interface AuthCtx {
  user: User | null
  token: string | null
  login:  (token: string, user: User) => void
  logout: () => void
  refreshUser: () => Promise<void>
  loading: boolean
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null)
  const [token,   setToken]   = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (t && u) {
      try {
        setToken(t)
        setUser(JSON.parse(u))
        // silently refresh profile
        userAPI.profile().then(r => {
          setUser(r.data)
          localStorage.setItem('user', JSON.stringify(r.data))
        }).catch(() => {
          // token expired
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setToken(null); setUser(null)
        })
      } catch { /* ignore */ }
    }
    setLoading(false)
  }, [])

  const login = (t: string, u: User) => {
    setToken(t); setUser(u)
    localStorage.setItem('token', t)
    localStorage.setItem('user', JSON.stringify(u))
  }

  const logout = () => {
    setToken(null); setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const refreshUser = async () => {
    try {
      const r = await userAPI.profile()
      setUser(r.data)
      localStorage.setItem('user', JSON.stringify(r.data))
    } catch { /* ignore */ }
  }

  return (
    <Ctx.Provider value={{ user, token, login, logout, refreshUser, loading }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
