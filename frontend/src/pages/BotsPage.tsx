import { useEffect, useState } from 'react'
import { Plus, Play, Pause, Trash2, X, Sparkles, Globe, Rss, Activity, Bot, Zap, RefreshCw } from 'lucide-react'
import { botsAPI, autopostAPI } from '../api/client'
import type { Bot as BotType, ContentSource } from '../types'
import { SOURCE_META, INTERVAL_LABELS, timeAgo } from '../types'
import { Alert, CardSkeleton, Empty } from '../components/UI'
import toast from 'react-hot-toast'
import axios from 'axios'
import { SEO } from '../components/SEO'
const INTERVALS = [
  { value: 60, label: 'Every Hour' },
  { value: 360, label: 'Every 6 Hours' },
  { value: 1440, label: 'Daily' },
]

const SRC_OPTS: { value: ContentSource; label: string; icon: JSX.Element; hint: string }[] = [
  { value: 'custom_prompt', label: 'AI Custom Prompt', icon: <Sparkles size={14} />, hint: 'Gemini generates tweets directly from your topic' },
  { value: 'google_news', label: 'Google News', icon: <Globe size={14} />, hint: 'Fetches latest news headlines on your topic' },
  { value: 'rss_feed', label: 'RSS Feed', icon: <Rss size={14} />, hint: 'Paste an RSS feed URL as the topic' },
  { value: 'website_scraper', label: 'Web Scraper', icon: <Activity size={14} />, hint: 'Paste a website URL — content scraped automatically' },
]

/* ── Create/Edit Bot Modal ── */
function BotModal({ bot, onClose, onSave }: {
  bot?: BotType | null; onClose: () => void; onSave: (b: BotType) => void
}) {
  const editing = !!bot
  const [name, setName] = useState(bot?.name ?? '')
  const [topic, setTopic] = useState(bot?.topic ?? '')
  const [source, setSource] = useState<ContentSource>(bot?.contentSource ?? 'custom_prompt')
  const [interval, setInterval] = useState<number>(bot?.interval ?? 60)
  const [hashtags, setHashtags] = useState(bot?.hashtags ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setError('')
    if (!name.trim()) { setError('Bot name is required'); return }
    if (!topic.trim()) { setError('Topic is required'); return }

    setLoading(true)
    try {
      const payload = {
        name: name.trim(),
        topic: topic.trim(),
        contentSource: source,
        interval,
        hashtags: hashtags.trim(),
      }
      const res = editing
        ? await botsAPI.update(bot!.id, payload)
        : await botsAPI.create(payload)
      onSave(res.data)
      onClose()
      toast.success(editing ? 'Bot updated!' : 'Bot created!')
    } catch (e) {
      if (axios.isAxiosError(e)) setError(e.response?.data?.error || 'Failed to save bot')
      else setError('Something went wrong')
    } finally { setLoading(false) }
  }

  const srcMeta = SOURCE_META[source]

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <SEO
        title="My Bots"
        description="Manage your AI-powered X bots — create, edit, enable or disable bots that auto-post tweets on your schedule."
        canonical="/dashboard/bots"
        noIndex={true}
      />
      <div className="modal" style={{ padding: '30px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--slate)' }}>{editing ? 'Edit Bot' : 'Create New Bot'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}><X size={18} /></button>
        </div>

        {error && <div style={{ marginBottom: 16 }}><Alert type="error">{error}</Alert></div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="field-label">Bot Name</label>
            <input className="field" placeholder="e.g. AI News Bot" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div>
            <label className="field-label">Topic / URL</label>
            <input className="field" placeholder="e.g. Latest AI breakthroughs" value={topic} onChange={e => setTopic(e.target.value)} />
          </div>

          <div>
            <label className="field-label">Content Source</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {SRC_OPTS.map(s => {
                const m = SOURCE_META[s.value]
                const active = source === s.value
                return (
                  <div key={s.value} onClick={() => setSource(s.value)} style={{ padding: '10px 12px', borderRadius: 10, cursor: 'pointer', border: `1.5px solid ${active ? m.color : 'var(--border)'}`, background: active ? m.bg : '#fff', display: 'flex', alignItems: 'flex-start', gap: 8, transition: 'all 0.15s' }}>
                    <span style={{ color: m.color, marginTop: 1, flexShrink: 0 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: active ? m.color : 'var(--muted)' }}>{s.label}</div>
                      <div style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.4, marginTop: 2 }}>{s.hint}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <label className="field-label">Posting Interval</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {INTERVALS.map(v => (
                <div key={v.value} onClick={() => setInterval(v.value)} style={{ padding: '10px', borderRadius: 10, cursor: 'pointer', border: `1.5px solid ${interval === v.value ? 'var(--blue)' : 'var(--border)'}`, background: interval === v.value ? 'var(--blue-light)' : '#fff', textAlign: 'center', transition: 'all 0.15s' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: interval === v.value ? 'var(--blue)' : 'var(--muted)' }}>{v.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label">Hashtags <span style={{ fontWeight: 400, textTransform: 'none' }}>(comma-separated)</span></label>
            <input className="field" placeholder="#AI, #Tech, #Innovation" value={hashtags} onChange={e => setHashtags(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button className="btn btn-outline" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading || !name.trim() || !topic.trim()} style={{ flex: 2, justifyContent: 'center' }}>
            {loading ? <span className="spin" /> : <>{editing ? 'Save Changes' : <><Plus size={14} /> Create Bot</>}</>}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Delete Confirm Modal ── */
function DeleteModal({ bot, onConfirm, onClose }: { bot: BotType; onConfirm: () => void; onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const go = async () => { setLoading(true); await onConfirm(); setLoading(false) }
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ padding: '28px 30px', maxWidth: 380 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)', marginBottom: 16 }}><Trash2 size={22} /></div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--slate)', marginBottom: 8 }}>Delete "{bot.name}"?</h3>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 22 }}>This bot and all its tweet logs will be permanently deleted.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
          <button className="btn btn-danger" onClick={go} disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
            {loading ? <span className="spin" /> : 'Delete Bot'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main Bots Page ── */
export function BotsPage() {
  const [bots, setBots] = useState<BotType[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editBot, setEditBot] = useState<BotType | null>(null)
  const [deleteBot, setDeleteBot] = useState<BotType | null>(null)
  const [running, setRunning] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try { const r = await botsAPI.list(); setBots(r.data ?? []) }
    catch { toast.error('Failed to load bots'); setBots([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleSave = (bot: BotType) => {
    setBots(prev => {
      const idx = prev.findIndex(b => b.id === bot.id)
      if (idx >= 0) { const n = [...prev]; n[idx] = bot; return n }
      return [bot, ...prev]
    })
  }

  const handleToggle = async (bot: BotType) => {
    const next = bot.status === 'active' ? 'paused' : 'active'
    try {
      const r = await botsAPI.updateStatus(bot.id, next)
      setBots(prev => prev.map(b => b.id === bot.id ? r.data : b))
      toast.success(`Bot ${next === 'active' ? 'resumed' : 'paused'}`)
    } catch { toast.error('Failed to update bot status') }
  }

  const handleDelete = async () => {
    if (!deleteBot) return
    try {
      await botsAPI.delete(deleteBot.id)
      setBots(prev => prev.filter(b => b.id !== deleteBot.id))
      toast.success(`"${deleteBot.name}" deleted`)
    } catch { toast.error('Failed to delete bot') }
    finally { setDeleteBot(null) }
  }

  const handleRun = async (bot: BotType) => {
    setRunning(bot.id)
    try {
      const r = await autopostAPI.run(bot.id)
      toast.success('Tweet posted: ' + (r.data.content ?? '').slice(0, 60) + '…')
      await load()
    } catch (e) {
      if (axios.isAxiosError(e)) toast.error(e.response?.data?.error || 'Failed to post tweet')
      else toast.error('Failed to post tweet')
    } finally { setRunning(null) }
  }

  const intervalLabel = (v: number) => INTERVALS.find(i => i.value === v)?.label ?? `${v}m`

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100 }} className="main-content">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--slate)', marginBottom: 4 }}>My Bots</h2>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>{bots.length} bot{bots.length !== 1 ? 's' : ''} configured</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost btn-sm" onClick={load} disabled={loading}><RefreshCw size={13} /> Refresh</button>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={15} /> New Bot</button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : bots.length === 0 ? (
        <div className="card"><Empty icon={<Bot size={26} />} title="No bots yet" desc="Create your first bot to start automating your Twitter presence"
          action={<button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={14} /> Create Your First Bot</button>} /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {bots.map((bot, i) => {
            const src = SOURCE_META[bot.contentSource] ?? SOURCE_META['custom_prompt']
            const dotCls = bot.status === 'active' ? 'dot-active' : bot.status === 'paused' ? 'dot-paused' : 'dot-stopped'
            const isRunning = running === bot.id
            const hashtagList = bot.hashtags ? bot.hashtags.split(',').map(h => h.trim()).filter(Boolean) : []

            return (
              <div key={bot.id} className="card card-hover" style={{ padding: '18px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: src.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: src.color, flexShrink: 0 }}>
                    {bot.contentSource === 'custom_prompt' ? <Sparkles size={18} /> : bot.contentSource === 'google_news' ? <Globe size={18} /> : bot.contentSource === 'rss_feed' ? <Rss size={18} /> : <Activity size={18} />}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--slate)' }}>{bot.name}</h4>
                      <span className={dotCls} />
                      <span style={{ fontSize: 11, color: bot.status === 'active' ? '#059669' : bot.status === 'paused' ? '#d97706' : '#94a3b8', fontWeight: 600, textTransform: 'capitalize' }}>{bot.status}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 420 }}>{bot.topic}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span className={`badge ${src.cls}`}>{src.label}</span>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>⏱ {intervalLabel(bot.interval)}</span>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>Last: {timeAgo(bot.lastRunAt)}</span>
                    </div>
                    {hashtagList.length > 0 && (
                      <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
                        {hashtagList.map(h => <span key={h} style={{ background: 'var(--blue-light)', color: 'var(--blue-dark)', fontSize: 10, padding: '2px 8px', borderRadius: 999, fontWeight: 600 }}>{h}</span>)}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleRun(bot)} disabled={isRunning} title="Post now">
                      {isRunning ? <span className="spin" /> : <><Zap size={12} /> Run Now</>}
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditBot(bot)}>Edit</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleToggle(bot)}>
                      {bot.status === 'active' ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Resume</>}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => setDeleteBot(bot)}><Trash2 size={12} /></button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showCreate && <BotModal onClose={() => setShowCreate(false)} onSave={handleSave} />}
      {editBot && <BotModal bot={editBot} onClose={() => setEditBot(null)} onSave={handleSave} />}
      {deleteBot && <DeleteModal bot={deleteBot} onConfirm={handleDelete} onClose={() => setDeleteBot(null)} />}
    </div>
  )
}