import { useEffect, useState } from 'react'
import { Bot, Zap, MessageSquare, TrendingUp, Twitter, RefreshCw } from 'lucide-react'
import { botsAPI, logsAPI } from '../api/client'
import type { Bot as BotType, TweetLog } from '../types'
import { SOURCE_META, INTERVAL_LABELS, timeAgo } from '../types'
import { StatCard, CardSkeleton } from '../components/UI'
import toast from 'react-hot-toast'

export function Overview() {
  const [bots,    setBots]    = useState<BotType[]>([])
  const [logs,    setLogs]    = useState<TweetLog[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const [botsRes, logsRes] = await Promise.all([botsAPI.list(), logsAPI.list({ limit: 5 })])
      setBots(botsRes.data ?? [])
      setLogs(logsRes.data.logs ?? [])
    } catch { toast.error('Failed to load dashboard data') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const activeBots  = bots.filter(b => b.status === 'active')
  const todayLogs   = logs.filter(l => Date.now() - new Date(l.createdAt).getTime() < 86_400_000)
  const successLogs = logs.filter(l => l.status === 'success')

  return (
    <div style={{ padding:'28px 32px', maxWidth:1100 }} className="main-content">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:12 }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:700, color:'var(--slate)', marginBottom:4 }}>Overview</h2>
          <p style={{ color:'var(--muted)', fontSize:13 }}>Your automation at a glance</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={load} disabled={loading}>
          <RefreshCw size={13}/> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="overview-stats" style={{ marginBottom:28 }}>
        {loading ? (
          Array.from({length:4}).map((_,i) => <CardSkeleton key={i}/>)
        ) : (
          <>
            <div className="au d1"><StatCard label="Total Bots"   value={bots.length}        icon={<Bot size={20}/>}           color="#1d9bf0" bg="#e8f5fe" /></div>
            <div className="au d2"><StatCard label="Active Bots"  value={activeBots.length}   icon={<Zap size={20}/>}           color="#10b981" bg="#d1fae5" sub={`${bots.length - activeBots.length} paused/stopped`}/></div>
            <div className="au d3"><StatCard label="Today Tweets" value={todayLogs.length}    icon={<MessageSquare size={20}/>}  color="#6366f1" bg="#eef2ff" /></div>
            <div className="au d4"><StatCard label="All-Time"     value={successLogs.length}  icon={<TrendingUp size={20}/>}    color="#f59e0b" bg="#fef3c7" /></div>
          </>
        )}
      </div>

      {/* Bottom grid */}
      <div className="overview-grid">
        {/* Active bots */}
        <div className="card au d2" style={{ padding:'20px 22px' }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:'var(--slate)', marginBottom:16 }}>
            Active Bots
            <span style={{ background:'var(--blue-light)', color:'var(--blue)', fontSize:11, padding:'2px 8px', borderRadius:999, marginLeft:6, fontWeight:600 }}>{activeBots.length}</span>
          </h3>
          {loading ? <CardSkeleton/> : activeBots.length === 0 ? (
            <p style={{ color:'var(--muted)', fontSize:13, padding:'20px 0', textAlign:'center' }}>No active bots yet</p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {activeBots.slice(0,4).map(bot => {
                const src = SOURCE_META[bot.contentSource]
                return (
                  <div key={bot.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'var(--bg)', borderRadius:10 }}>
                    <span className="dot-active"/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:'var(--slate)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{bot.name}</div>
                      <div style={{ fontSize:11, color:'#94a3b8' }}>{INTERVAL_LABELS[bot.interval] ?? `${bot.interval}m`} · {timeAgo(bot.lastRunAt)}</div>
                    </div>
                    <span className={`badge ${src.cls}`} style={{ fontSize:10 }}>{src.label.split(' ')[0]}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent tweets */}
        <div className="card au d3" style={{ padding:'20px 22px' }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:'var(--slate)', marginBottom:16 }}>Recent Posts</h3>
          {loading ? <CardSkeleton/> : logs.length === 0 ? (
            <p style={{ color:'var(--muted)', fontSize:13, padding:'20px 0', textAlign:'center' }}>No tweets posted yet</p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {logs.map(log => (
                <div key={log.id} style={{ padding:'10px 12px', background:'var(--bg)', borderRadius:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                    <div style={{ width:20, height:20, borderRadius:'50%', background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Twitter size={10} color="#fff" fill="#fff"/>
                    </div>
                    <span style={{ fontSize:10, color:'#94a3b8' }}>{timeAgo(log.createdAt)}</span>
                    {log.status === 'failed'  && <span className="badge badge-red"   style={{ fontSize:9 }}>failed</span>}
                    {log.status === 'success' && <span className="badge badge-green" style={{ fontSize:9 }}>posted</span>}
                  </div>
                  {log.status === 'success' ? (
                    <p style={{ fontSize:12, color:'#334155', lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{log.content}</p>
                  ) : (
                    <p style={{ fontSize:12, color:'var(--red)', lineHeight:1.6 }}>⚠ {log.error}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}