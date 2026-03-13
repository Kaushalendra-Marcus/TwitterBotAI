import { type ReactNode } from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'

/* ── ALERT ──────────────────────────────────────────── */
export function Alert({ type, children, onClose }: {
  type: 'error' | 'success' | 'info' | 'warn'
  children: ReactNode
  onClose?: () => void
}) {
  const cfg = {
    error:   { cls: 'alert-error',   icon: <AlertCircle size={15} /> },
    success: { cls: 'alert-success', icon: <CheckCircle size={15} /> },
    info:    { cls: 'alert-info',    icon: <Info size={15} /> },
    warn:    { cls: 'alert-warn',    icon: <AlertTriangle size={15} /> },
  }[type]

  return (
    <div className={`alert ${cfg.cls}`} style={{ position: 'relative' }}>
      <span style={{ flexShrink: 0, marginTop: 1 }}>{cfg.icon}</span>
      <span style={{ flex: 1 }}>{children}</span>
      {onClose && (
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6, display: 'flex', flexShrink: 0, padding: 2 }}>
          <X size={13} />
        </button>
      )}
    </div>
  )
}

/* ── SKELETON ───────────────────────────────────────── */
export function Skeleton({ h = 20, w = '100%', mb = 0 }: { h?: number; w?: number | string; mb?: number }) {
  return <div className="skeleton" style={{ height: h, width: w, marginBottom: mb }} />
}

export function CardSkeleton() {
  return (
    <div className="card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Skeleton h={14} w="60%" />
      <Skeleton h={10} w="40%" />
      <Skeleton h={10} w="80%" />
    </div>
  )
}

/* ── EMPTY STATE ────────────────────────────────────── */
export function Empty({ icon, title, desc, action }: {
  icon: ReactNode
  title: string
  desc: string
  action?: ReactNode
}) {
  return (
    <div style={{ textAlign: 'center', padding: '56px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--slate)' }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'var(--muted)', maxWidth: 320, lineHeight: 1.6 }}>{desc}</p>
      {action}
    </div>
  )
}

/* ── TOGGLE ─────────────────────────────────────────── */
export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{ width: 44, height: 24, borderRadius: 12, background: value ? 'var(--blue)' : 'var(--border)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
    >
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: value ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
    </div>
  )
}

/* ── MASKED INPUT ───────────────────────────────────── */
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export function MaskedInput({ value, onChange, placeholder, className = '' }: {
  value: string; onChange: (v: string) => void; placeholder: string; className?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <input
        className={`field ${className}`}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ paddingRight: 44, fontFamily: show ? 'DM Sans' : 'monospace', letterSpacing: show ? 'normal' : '2px' }}
        autoComplete="off"
      />
      <button
        type="button"
        onClick={() => setShow(v => !v)}
        style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  )
}

/* ── STAT CARD ──────────────────────────────────────── */
export function StatCard({ label, value, icon, color, bg, sub }: {
  label: string; value: string | number; icon: ReactNode
  color: string; bg: string; sub?: string
}) {
  return (
    <div className="card card-hover" style={{ padding: '20px 22px', cursor: 'default' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Sora', color: 'var(--slate)' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}
