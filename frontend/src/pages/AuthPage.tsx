import { useState } from 'react'
import { Twitter, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { authAPI } from '../api/client'
import { useAuth } from '../contexts/AuthContext'
import { Alert } from '../components/UI'
import axios from 'axios'
import { SEO } from '../components/SEO'
export function AuthPage({ mode, onToggle, onBack }: {
  mode: 'login' | 'signup'
  onToggle: () => void
  onBack: () => void
}) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isLogin = mode === 'login'

  const validate = () => {
    if (!email.includes('@') || !email.includes('.')) return 'Enter a valid email address'
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (!isLogin && password !== confirm) return "Passwords don't match"
    return null
  }

  const handleSubmit = async () => {
    setError('')
    const err = validate()
    if (err) { setError(err); return }

    setLoading(true)
    try {
      const res = isLogin
        ? await authAPI.login(email.trim().toLowerCase(), password)
        : await authAPI.register(email.trim().toLowerCase(), password)

      login(res.data.token, res.data.user)
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.error || 'Something went wrong. Please try again.')
      } else {
        setError('Network error. Is the backend running?')
      }
    } finally {
      setLoading(false)
    }
  }

  const onKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSubmit() }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(140deg,#e8f5fe,#f8fafc,#e0f9fc)', padding: 24, position: 'relative' }}>
      <SEO
        title={isLogin ? 'Sign In' : 'Create Account'}
        description={isLogin
          ? 'Sign in to TweetBotAI and manage your AI-powered X automation bots.'
          : 'Create your free TweetBotAI account and start automating your X posts with AI in under 2 minutes.'
        }
        keywords={isLogin
          ? 'TweetBotAI login, sign in twitter bot, X automation login'
          : 'TweetBotAI signup, create account twitter bot, free X automation'
        }
        canonical="/auth"
        noIndex={true}
      />
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ position: 'absolute', top: 20, left: 20, gap: 5 }}>
        <ArrowLeft size={13} /> Back
      </button>

      {/* Blobs */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 320, height: 320, borderRadius: '60% 40% 70% 30%/60% 30% 70% 40%', background: 'rgba(29,155,240,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 260, height: 260, borderRadius: '30% 60% 40% 70%', background: 'rgba(0,188,212,0.05)', pointerEvents: 'none' }} />

      <div className="au" style={{ background: '#fff', borderRadius: 22, padding: '36px 40px', width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(15,23,42,0.12)' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Twitter size={20} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 18, color: 'var(--slate)' }}>
            TweetBot<span style={{ color: 'var(--blue)' }}>AI</span>
          </span>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, color: 'var(--slate)' }}>
          {isLogin ? 'Welcome back' : 'Create account'}
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 24 }}>
          {isLogin ? 'Sign in to manage your bots' : 'Start automating your X today'}
        </p>

        {error && <div style={{ marginBottom: 16 }}><Alert type="error" onClose={() => setError('')}>{error}</Alert></div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <div>
            <label className="field-label">Email Address</label>
            <input className="field" type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} onKeyDown={onKey} />
          </div>

          <div>
            <label className="field-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input className="field" type={showPass ? 'text' : 'password'}
                placeholder={isLogin ? 'Your password' : 'Minimum 8 characters'}
                value={password} onChange={e => setPassword(e.target.value)} onKeyDown={onKey}
                style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPass(v => !v)}
                style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="field-label">Confirm Password</label>
              <input className="field" type="password" placeholder="Repeat your password"
                value={confirm} onChange={e => setConfirm(e.target.value)} onKeyDown={onKey} />
            </div>
          )}
        </div>

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 22, padding: '13px' }}
          onClick={handleSubmit} disabled={loading}>
          {loading ? <span className="spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
        </button>

        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--muted)' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span style={{ color: 'var(--blue)', cursor: 'pointer', fontWeight: 600 }} onClick={onToggle}>
            {isLogin ? 'Sign up' : 'Log in'}
          </span>
        </div>
      </div>
    </div>
  )
}
