import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Landing } from './pages/Landing'
import { AuthPage } from './pages/AuthPage'
import { Dashboard } from './pages/Dashboard'
import { Toaster } from 'react-hot-toast'

type View = 'landing' | 'login' | 'signup'

function AppInner() {
  const { user, loading } = useAuth()
  const [view, setView] = useState<View>('landing')
  useEffect(() => {
    if (!loading && !user && view !== 'login' && view !== 'signup') {
      setView('landing')
    }
  }, [user, loading])

  if (loading) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
          <div style={{ width:40, height:40, borderRadius:11, background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
          </div>
          <div className="spin spin-blue" style={{ width:24, height:24 }}/>
        </div>
      </div>
    )
  }

  // Authenticated → show dashboard
  if (user) return <Dashboard/>

  // Auth pages
  if (view === 'login' || view === 'signup') {
    return (
      <AuthPage
        mode={view}
        onToggle={() => setView(view === 'login' ? 'signup' : 'login')}
        onBack={() => setView('landing')}
      />
    )
  }

  // Landing
  return (
    <Landing
      onLogin={() => setView('login')}
      onSignup={() => setView('signup')}
    />
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner/>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { fontFamily:'DM Sans, sans-serif', fontSize:13, borderRadius:12, boxShadow:'0 8px 30px rgba(15,23,42,0.12)' },
          success: { style: { background:'#f0fdf4', color:'#166534', border:'1px solid #bbf7d0' }, iconTheme:{ primary:'#16a34a', secondary:'#fff' } },
          error:   { style: { background:'#fef2f2', color:'#991b1b', border:'1px solid #fecaca' }, iconTheme:{ primary:'#dc2626', secondary:'#fff' } },
          duration: 4000,
        }}
      />
    </AuthProvider>
  )
}
