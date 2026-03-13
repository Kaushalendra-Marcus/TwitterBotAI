import { useState } from 'react'
import { BarChart3, Bot, MessageSquare, Key, Settings, LogOut, Twitter, Menu, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

type Page = 'overview' | 'bots' | 'logs' | 'keys' | 'settings'

const NAV = [
  { id: 'overview' as Page, label: 'Overview',   icon: <BarChart3 size={16} /> },
  { id: 'bots'     as Page, label: 'My Bots',    icon: <Bot size={16} /> },
  { id: 'logs'     as Page, label: 'Tweet Logs', icon: <MessageSquare size={16} /> },
  { id: 'keys'     as Page, label: 'API Keys',   icon: <Key size={16} /> },
  { id: 'settings' as Page, label: 'Settings',   icon: <Settings size={16} /> },
]

function NavContent({ page, setPage, user, logout, close }: {
  page: Page; setPage: (p: Page) => void
  user: { email: string }; logout: () => void; close?: () => void
}) {
  return (
    <>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '4px 8px', marginBottom: 28 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Twitter size={16} color="#fff" fill="#fff" />
        </div>
        <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 16, color: 'var(--slate)' }}>
          TweetBot<span style={{ color: 'var(--blue)' }}>AI</span>
        </span>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {NAV.map(n => (
          <div
            key={n.id}
            className={`nav-link${page === n.id ? ' active' : ''}`}
            onClick={() => { setPage(n.id); close?.() }}
          >
            {n.icon} {n.label}
          </div>
        ))}
      </nav>

      {/* User */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 10px', marginBottom: 6 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#1d9bf0,#00bcd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
            {user.email[0].toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--slate)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
          </div>
        </div>
        <div className="nav-link" onClick={() => { logout(); close?.() }} style={{ color: '#ef4444' }}>
          <LogOut size={15} /> Log Out
        </div>
      </div>
    </>
  )
}

export function Sidebar({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const { user, logout } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)
  if (!user) return null

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar">
        <NavContent page={page} setPage={setPage} user={user} logout={logout} />
      </aside>

      {/* Mobile header */}
      <header className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Twitter size={14} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 15, color: 'var(--slate)' }}>
            TweetBot<span style={{ color: 'var(--blue)' }}>AI</span>
          </span>
        </div>
        <button onClick={() => setDrawerOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', padding: 4 }}>
          <Menu size={22} />
        </button>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-bg" onClick={() => setDrawerOpen(false)} />
          <div className="mobile-drawer-panel">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>
            <NavContent page={page} setPage={setPage} user={user} logout={logout} close={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
