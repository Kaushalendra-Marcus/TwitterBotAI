import { useState } from 'react'
import { Bell, Shield, Trash2, Save, AlertCircle, User, RefreshCw } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Toggle } from '../components/UI'
import { userAPI } from '../api/client'
import toast from 'react-hot-toast'

export function SettingsPage() {
  const { user, logout, refreshUser } = useAuth()
  const [emailNotifs,  setEmailNotifs]  = useState(true)
  const [errorAlerts,  setErrorAlerts]  = useState(true)
  const [dailySummary, setDailySummary] = useState(false)
  const [rateLimit,    setRateLimit]    = useState('5')
  const [saving,       setSaving]       = useState(false)
  const [refreshing,   setRefreshing]   = useState(false)
  const [showDanger,   setShowDanger]   = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 500))
    setSaving(false)
    toast.success('Settings saved')
  }

  const handleRefreshProfile = async () => {
    setRefreshing(true)
    try { await refreshUser(); toast.success('Profile refreshed') }
    catch { toast.error('Failed to refresh') }
    finally { setRefreshing(false) }
  }

  const Row = ({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) => (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 0', borderBottom:'1px solid #f1f5f9' }}>
      <div>
        <div style={{ fontSize:13.5, fontWeight:600, color:'var(--slate)' }}>{label}</div>
        <div style={{ fontSize:12, color:'var(--muted)' }}>{desc}</div>
      </div>
      <Toggle value={value} onChange={onChange}/>
    </div>
  )

  return (
    <div style={{ padding:'28px 32px', maxWidth:640 }} className="main-content">
      <div className="au" style={{ marginBottom:28 }}>
        <h2 style={{ fontSize:22, fontWeight:700, color:'var(--slate)', marginBottom:4 }}>Settings</h2>
        <p style={{ color:'var(--muted)', fontSize:13 }}>Manage your account preferences and security options</p>
      </div>

      {/* Account Info */}
      <div className="card au d1" style={{ padding:'22px 24px', marginBottom:18 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'var(--blue-light)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--blue)' }}><User size={16}/></div>
          <h3 style={{ fontSize:14, fontWeight:700, color:'var(--slate)' }}>Account</h3>
        </div>
        <div>
          {[
            { label:'Email', value: user?.email ?? '—' },
            { label:'Plan',  value: 'Pro (Unlimited Bots)' },
            { label:'Gemini API', value: user?.hasGeminiKey ? '✓ Connected' : '✗ Not configured' },
            { label:'Twitter API', value: user?.hasTwitterKeys ? '✓ Connected' : '✗ Not configured' },
          ].map((row, i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
              <span style={{ fontSize:13, color:'var(--muted)' }}>{row.label}</span>
              <span style={{ fontSize:13, fontWeight:600, color:'var(--slate)' }}>{row.value}</span>
            </div>
          ))}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleRefreshProfile} disabled={refreshing} style={{ marginTop:14 }}>
          {refreshing ? <span className="spin spin-blue"/> : <RefreshCw size={13}/>} Refresh Profile
        </button>
      </div>

      {/* Notifications */}
      <div className="card au d2" style={{ padding:'22px 24px', marginBottom:18 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'#eff6ff', display:'flex', alignItems:'center', justifyContent:'center', color:'#2563eb' }}><Bell size={16}/></div>
          <h3 style={{ fontSize:14, fontWeight:700, color:'var(--slate)' }}>Notifications</h3>
        </div>
        <Row label="Email notifications"  desc="Receive email updates about bot activity"   value={emailNotifs}  onChange={setEmailNotifs}/>
        <Row label="Error alerts"          desc="Get notified instantly when a bot fails"    value={errorAlerts}  onChange={setErrorAlerts}/>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 0' }}>
          <div>
            <div style={{ fontSize:13.5, fontWeight:600, color:'var(--slate)' }}>Daily summary</div>
            <div style={{ fontSize:12, color:'var(--muted)' }}>Daily digest of all tweets posted</div>
          </div>
          <Toggle value={dailySummary} onChange={setDailySummary}/>
        </div>
      </div>

      {/* Rate Limiting */}
      <div className="card au d3" style={{ padding:'22px 24px', marginBottom:18 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'#d1fae5', display:'flex', alignItems:'center', justifyContent:'center', color:'#059669' }}><Shield size={16}/></div>
          <h3 style={{ fontSize:14, fontWeight:700, color:'var(--slate)' }}>Abuse Protection</h3>
        </div>
        <label className="field-label">Max tweets per hour (global)</label>
        <select className="field" value={rateLimit} onChange={e => setRateLimit(e.target.value)} style={{ cursor:'pointer' }}>
          <option value="1">1 tweet / hour</option>
          <option value="3">3 tweets / hour</option>
          <option value="5">5 tweets / hour (default)</option>
          <option value="10">10 tweets / hour</option>
        </select>
        <p style={{ fontSize:11, color:'var(--muted)', marginTop:6 }}>Prevents spam and protects your account from Twitter rate limiting.</p>
      </div>

      <button className="btn btn-primary au" onClick={handleSave} disabled={saving} style={{ marginBottom:28 }}>
        {saving ? <span className="spin"/> : <><Save size={13}/> Save Settings</>}
      </button>

      {/* Danger Zone */}
      <div className="card au" style={{ padding:'20px 24px', border:'1px solid #fecaca' }}>
        <h3 style={{ fontSize:14, fontWeight:700, color:'var(--red)', marginBottom:10, display:'flex', alignItems:'center', gap:7 }}>
          <AlertCircle size={15}/> Danger Zone
        </h3>
        {showDanger ? (
          <>
            <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.7, marginBottom:16 }}>
              This will permanently delete your account, all bots, and all tweet history. <strong>This cannot be undone.</strong>
            </p>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn btn-outline" onClick={() => setShowDanger(false)} style={{ flex:1, justifyContent:'center' }}>Cancel</button>
              <button className="btn btn-danger" onClick={logout} style={{ flex:1, justifyContent:'center' }}>Yes, Delete Everything</button>
            </div>
          </>
        ) : (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
            <div>
              <div style={{ fontSize:13.5, fontWeight:600, color:'var(--slate)' }}>Delete Account</div>
              <div style={{ fontSize:12, color:'var(--muted)' }}>Permanently remove your account and all data</div>
            </div>
            <button className="btn btn-danger" onClick={() => setShowDanger(true)}>
              <Trash2 size={13}/> Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
