import { useEffect, useState, useCallback } from 'react'
import { Twitter, Search, MessageSquare, Trash2, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { logsAPI, botsAPI } from '../api/client'
import type { TweetLog, Bot } from '../types'
import { timeAgo, formatDate } from '../types'
import { CardSkeleton, Empty } from '../components/UI'
import toast from 'react-hot-toast'

export function LogsPage() {
  const [logs,      setLogs]      = useState<TweetLog[]>([])
  const [bots,      setBots]      = useState<Bot[]>([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [filterBot, setFilterBot] = useState('all')
  const [page,      setPage]      = useState(1)
  const [pages,     setPages]     = useState(1)
  const [total,     setTotal]     = useState(0)
  const LIMIT = 15

  const load = useCallback(async (p = page) => {
    setLoading(true)
    try {
      const params: Record<string, unknown> = { page: p, limit: LIMIT }
      if (filterBot !== 'all') params.botId = filterBot
      const [logsRes, botsRes] = await Promise.all([logsAPI.list(params), botsAPI.list()])
      setLogs(logsRes.data.logs ?? [])
      setTotal(logsRes.data.total ?? 0)
      setPages(logsRes.data.pages || 1)
      setBots(botsRes.data ?? [])
    } catch { toast.error('Failed to load logs') }
    finally { setLoading(false) }
  }, [page, filterBot])

  useEffect(() => { load() }, [filterBot])

  const handleDelete = async (id: string) => {
    try {
      await logsAPI.delete(id)
      setLogs(prev => prev.filter(l => l.id !== id))
      toast.success('Log deleted')
    } catch { toast.error('Failed to delete log') }
  }

  const changePage = (p: number) => { setPage(p); load(p) }

  const displayed = search
    ? logs.filter(l =>
        l.content?.toLowerCase().includes(search.toLowerCase()) ||
        l.bot?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : logs

  return (
    <div style={{ padding:'28px 32px',maxWidth:1100 }} className="main-content">
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:12 }}>
        <div>
          <h2 style={{ fontSize:22,fontWeight:700,color:'var(--slate)',marginBottom:4 }}>Tweet Logs</h2>
          <p style={{ color:'var(--muted)',fontSize:13 }}>{total} total tweets across all bots</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => load()} disabled={loading}><RefreshCw size={13}/> Refresh</button>
      </div>

      {/* Filters */}
      <div style={{ display:'flex',gap:12,marginBottom:20,flexWrap:'wrap' }}>
        <div style={{ position:'relative',flex:1,minWidth:200 }}>
          <Search size={14} style={{ position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:'#94a3b8' }}/>
          <input className="field" placeholder="Search tweets…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft:36 }}/>
        </div>
        <select className="field" value={filterBot} onChange={e => { setFilterBot(e.target.value); setPage(1) }} style={{ width:'auto',minWidth:180,cursor:'pointer' }}>
          <option value="all">All Bots</option>
          {bots.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ display:'flex',flexDirection:'column',gap:12 }}>{Array.from({length:5}).map((_,i)=><CardSkeleton key={i}/>)}</div>
      ) : displayed.length === 0 ? (
        <div className="card"><Empty icon={<MessageSquare size={24}/>} title="No tweets found" desc={total === 0 ? "Your bots haven't posted any tweets yet" : "Try adjusting your search or filters"}/></div>
      ) : (
        <>
          <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
            {displayed.map((log, i) => (
              <div key={log.id} className={`card au d${Math.min(i%4+1,4)}`} style={{ padding:'16px 18px' }}>
                <div style={{ display:'flex',alignItems:'flex-start',gap:13 }}>
                  <div style={{ width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#1d9bf0,#00bcd4)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                    <Twitter size={15} color="#fff" fill="#fff"/>
                  </div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:7,flexWrap:'wrap' }}>
                      <span style={{ fontWeight:700,fontSize:13,color:'var(--slate)' }}>
                        {log.bot?.name ?? 'Bot'}
                      </span>
                      <span style={{ fontSize:11,color:'#94a3b8' }}>·</span>
                      <span style={{ fontSize:11,color:'#94a3b8' }} title={formatDate(log.createdAt)}>{timeAgo(log.createdAt)}</span>
                      {log.status === 'failed'  && <span className="badge badge-red"   style={{ fontSize:10 }}>Failed</span>}
                      {log.status === 'success' && <span className="badge badge-green" style={{ fontSize:10 }}>Posted</span>}
                    </div>

                    {log.status === 'success' ? (
                      <p style={{ fontSize:14,color:'var(--slate)',lineHeight:1.65,marginBottom:8 }}>{log.content}</p>
                    ) : (
                      <p style={{ fontSize:13,color:'var(--red)',lineHeight:1.6,marginBottom:8 }}>⚠ Error: {log.error}</p>
                    )}
                  </div>

                  <button onClick={() => handleDelete(log.id)} style={{ background:'none',border:'none',cursor:'pointer',color:'#94a3b8',display:'flex',padding:4,flexShrink:0,borderRadius:6,transition:'color 0.15s' }}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='var(--red)'}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='#94a3b8'}>
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pages > 1 && (
            <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginTop:24 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => changePage(page-1)} disabled={page<=1}><ChevronLeft size={14}/></button>
              <span style={{ fontSize:13,color:'var(--muted)' }}>Page {page} of {pages}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => changePage(page+1)} disabled={page>=pages}><ChevronRight size={14}/></button>
            </div>
          )}
        </>
      )}
    </div>
  )
}