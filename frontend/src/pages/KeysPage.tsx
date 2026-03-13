import { useState } from 'react'
import { Sparkles, Twitter, Save, Shield, CheckCircle, AlertCircle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { userAPI } from '../api/client'
import { useAuth } from '../contexts/AuthContext'
import { Alert, MaskedInput } from '../components/UI'
import toast from 'react-hot-toast'
import axios from 'axios'

const TWITTER_STEPS = [
  {
    step: 1,
    title: 'Create a Developer Account',
    desc: 'Go to the Twitter Developer Portal and sign in with your Twitter account.',
    link: { label: 'developer.twitter.com', href: 'https://developer.twitter.com/en/portal/dashboard' },
  },
  {
    step: 2,
    title: 'Create a New Project and App',
    desc: 'Click "+ Create Project", give it a name, select a use case (Automation or Making a bot), then click "Create App".',
  },
  {
    step: 3,
    title: 'Set Read & Write Permissions',
    desc: 'Go to App Settings → "User authentication settings" → set App permissions to "Read and Write". Without this step, the bot cannot post tweets.',
  },
  {
    step: 4,
    title: 'Copy your API Key & Secret',
    desc: 'Go to the "Keys and tokens" tab → under "API Key and Secret", copy your API Key and API Key Secret.',
  },
  {
    step: 5,
    title: 'Generate Access Token & Secret',
    desc: 'On the same page under "Access Token and Secret", click "Generate". Copy the tokens immediately — they are only shown once.',
  },
  {
    step: 6,
    title: 'Paste all keys below',
    desc: 'Paste all four values into the fields below and click "Save Twitter Keys".',
  },
]

export function KeysPage() {
  const { user, refreshUser } = useAuth()
  const [geminiKey,     setGeminiKey]     = useState('')
  const [loadingGemini, setLoadingGemini] = useState(false)
  const [geminiError,   setGeminiError]   = useState('')
  const [apiKey,        setApiKey]        = useState('')
  const [apiSecret,     setApiSecret]     = useState('')
  const [accessToken,   setAccessToken]   = useState('')
  const [accessSecret,  setAccessSecret]  = useState('')
  const [loadingTw,     setLoadingTw]     = useState(false)
  const [twError,       setTwError]       = useState('')
  const [showGuide,     setShowGuide]     = useState(false)

  const saveGemini = async () => {
    if (!geminiKey.trim()) return
    setGeminiError(''); setLoadingGemini(true)
    try {
      await userAPI.saveKeys({ geminiApiKey: geminiKey.trim() })
      await refreshUser()
      setGeminiKey('')
      toast.success('Gemini API key saved & encrypted')
    } catch (e) {
      setGeminiError(axios.isAxiosError(e) ? (e.response?.data?.error || 'Failed to save') : 'Network error')
    } finally { setLoadingGemini(false) }
  }

  const saveTwitter = async () => {
    if (!apiKey || !apiSecret || !accessToken || !accessSecret) { setTwError('All four Twitter fields are required'); return }
    setTwError(''); setLoadingTw(true)
    try {
      await userAPI.saveKeys({
        twitterApiKey: apiKey, twitterApiSecret: apiSecret,
        twitterAccessToken: accessToken, twitterAccessSecret: accessSecret
      })
      await refreshUser()
      setApiKey(''); setApiSecret(''); setAccessToken(''); setAccessSecret('')
      toast.success('Twitter credentials saved')
    } catch (e) {
      setTwError(axios.isAxiosError(e) ? (e.response?.data?.error || 'Failed to save') : 'Network error')
    } finally { setLoadingTw(false) }
  }

  const hasGeminiKey  = !!user?.hasGeminiKey
  const hasTwitterKey = !!user?.hasTwitterKeys

  const StatusBadge = ({ ok }: { ok: boolean }) => (
    <div style={{ display:'flex',alignItems:'center',gap:5,padding:'4px 10px',borderRadius:999,fontSize:11,fontWeight:600,background: ok ? '#d1fae5' : '#fee2e2',color: ok ? '#065f46' : '#991b1b',flexShrink:0 }}>
      {ok ? <CheckCircle size={11}/> : <AlertCircle size={11}/>} {ok ? 'Connected' : 'Not set'}
    </div>
  )

  return (
    <div style={{ padding:'28px 32px',maxWidth:700 }} className="main-content">
      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontSize:22,fontWeight:700,color:'var(--slate)',marginBottom:4 }}>API Keys</h2>
        <p style={{ color:'var(--muted)',fontSize:13 }}>Encrypted with AES-256-GCM before storage. Never exposed in logs.</p>
      </div>

      <div className="alert alert-info au" style={{ marginBottom:24 }}>
        <Shield size={14} style={{ flexShrink:0,marginTop:1 }}/>
        <span>Keys are only decrypted in server memory at the exact moment a tweet is being posted.</span>
      </div>

      {/* Gemini */}
      <div className="card au d1" style={{ padding:'24px',marginBottom:20 }}>
        <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:20,flexWrap:'wrap' }}>
          <div style={{ width:42,height:42,borderRadius:11,background:'#eef2ff',display:'flex',alignItems:'center',justifyContent:'center',color:'#4f46e5',flexShrink:0 }}>
            <Sparkles size={19}/>
          </div>
          <div style={{ flex:1 }}>
            <h3 style={{ fontSize:15,fontWeight:700,color:'var(--slate)' }}>AI API Key (Gemini / Groq)</h3>
            <p style={{ fontSize:12,color:'var(--muted)' }}>Powers tweet generation</p>
          </div>
          <StatusBadge ok={hasGeminiKey}/>
        </div>
        {geminiError && <div style={{ marginBottom:14 }}><Alert type="error" onClose={() => setGeminiError('')}>{geminiError}</Alert></div>}
        <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
          <div>
            <label className="field-label">API Key</label>
            <MaskedInput value={geminiKey} onChange={setGeminiKey} placeholder="AIzaSy... or gsk_..."/>
            <p style={{ fontSize:11,color:'var(--muted)',marginTop:5 }}>
              Gemini: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color:'var(--blue)' }}>aistudio.google.com</a>
              {' · '}
              Groq: <a href="https://console.groq.com" target="_blank" rel="noreferrer" style={{ color:'var(--blue)' }}>console.groq.com</a>
            </p>
          </div>
          <button className="btn btn-primary" onClick={saveGemini} disabled={!geminiKey.trim() || loadingGemini} style={{ alignSelf:'flex-start',padding:'9px 20px' }}>
            {loadingGemini ? <span className="spin"/> : <><Save size={13}/> Save Key</>}
          </button>
        </div>
      </div>

      {/* Twitter */}
      <div className="card au d2" style={{ padding:'24px' }}>
        <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:20,flexWrap:'wrap' }}>
          <div style={{ width:42,height:42,borderRadius:11,background:'var(--blue-light)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--blue)',flexShrink:0 }}>
            <Twitter size={19} fill="var(--blue)"/>
          </div>
          <div style={{ flex:1 }}>
            <h3 style={{ fontSize:15,fontWeight:700,color:'var(--slate)' }}>Twitter / X API</h3>
            <p style={{ fontSize:12,color:'var(--muted)' }}>OAuth 1.0a · Read + Write permissions required</p>
          </div>
          <StatusBadge ok={hasTwitterKey}/>
        </div>

        {twError && <div style={{ marginBottom:14 }}><Alert type="error" onClose={() => setTwError('')}>{twError}</Alert></div>}

        {/* Quick links */}
        <div style={{ display:'flex',gap:10,marginBottom:16,flexWrap:'wrap' }}>
          <a
            href="https://developer.twitter.com/en/portal/dashboard"
            target="_blank"
            rel="noreferrer"
            style={{ display:'inline-flex',alignItems:'center',gap:6,fontSize:12,fontWeight:600,color:'var(--blue)',background:'var(--blue-light)',padding:'7px 14px',borderRadius:8,textDecoration:'none' }}
          >
            <ExternalLink size={12}/> Twitter Developer Portal
          </a>
          <a
            href="https://developer.twitter.com/en/portal/apps/new"
            target="_blank"
            rel="noreferrer"
            style={{ display:'inline-flex',alignItems:'center',gap:6,fontSize:12,fontWeight:600,color:'#059669',background:'#d1fae5',padding:'7px 14px',borderRadius:8,textDecoration:'none' }}
          >
            <ExternalLink size={12}/> Create New App
          </a>
        </div>

        {/* Step-by-step guide toggle */}
        <button
          onClick={() => setShowGuide(v => !v)}
          style={{ display:'flex',alignItems:'center',gap:8,width:'100%',padding:'11px 14px',background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius: showGuide ? '10px 10px 0 0' : 10,cursor:'pointer',marginBottom:0,fontSize:13,fontWeight:600,color:'var(--slate)',textAlign:'left' }}
        >
          {showGuide ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}
          How to get your Twitter API keys? — Step by step guide
        </button>

        {showGuide && (
          <div style={{ border:'1px solid #e2e8f0',borderTop:'none',borderRadius:'0 0 10px 10px',padding:'18px 16px',marginBottom:18,background:'#fafbfc' }}>
            {TWITTER_STEPS.map((s, i) => (
              <div key={i} style={{ display:'flex',gap:14,paddingBottom: i < TWITTER_STEPS.length - 1 ? 16 : 0,marginBottom: i < TWITTER_STEPS.length - 1 ? 16 : 0,borderBottom: i < TWITTER_STEPS.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ width:26,height:26,borderRadius:999,background:'var(--blue)',color:'#fff',fontSize:12,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1 }}>
                  {s.step}
                </div>
                <div>
                  <div style={{ fontSize:13,fontWeight:700,color:'var(--slate)',marginBottom:3 }}>{s.title}</div>
                  <div style={{ fontSize:12,color:'var(--muted)',lineHeight:1.6 }}>{s.desc}</div>
                  {s.link && (
                    <a href={s.link.href} target="_blank" rel="noreferrer" style={{ display:'inline-flex',alignItems:'center',gap:4,fontSize:11,color:'var(--blue)',marginTop:5,textDecoration:'none',fontWeight:600 }}>
                      <ExternalLink size={10}/> {s.link.label}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="alert alert-warn" style={{ marginBottom:18, marginTop: showGuide ? 0 : 18 }}>
          <AlertCircle size={13} style={{ flexShrink:0 }}/>
          <span>App must have <strong>Read &amp; Write</strong> permissions in the <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noreferrer" style={{ color:'inherit' }}>Developer Portal</a>.</span>
        </div>

        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:18 }}>
          <div><label className="field-label">API Key (Consumer Key)</label><MaskedInput value={apiKey} onChange={setApiKey} placeholder="xvz1evFS4wE..."/></div>
          <div><label className="field-label">API Key Secret</label><MaskedInput value={apiSecret} onChange={setApiSecret} placeholder="L8qq9PZyRg6..."/></div>
          <div><label className="field-label">Access Token</label><MaskedInput value={accessToken} onChange={setAccessToken} placeholder="756201191646..."/></div>
          <div><label className="field-label">Access Token Secret</label><MaskedInput value={accessSecret} onChange={setAccessSecret} placeholder="janf3ZdBZHV..."/></div>
        </div>
        <button className="btn btn-primary" onClick={saveTwitter} disabled={!apiKey || !apiSecret || !accessToken || !accessSecret || loadingTw} style={{ padding:'9px 22px' }}>
          {loadingTw ? <><span className="spin"/> Saving...</> : <><Save size={13}/> Save Twitter Keys</>}
        </button>
      </div>
    </div>
  )
}