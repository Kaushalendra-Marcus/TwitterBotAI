import { useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Overview } from './Overview'
import { BotsPage } from './BotsPage'
import { LogsPage } from './LogsPage'
import { KeysPage } from './KeysPage'
import { SettingsPage } from './SettingsPage'

export type Page = 'overview' | 'bots' | 'logs' | 'keys' | 'settings'

export function Dashboard() {
  const [page, setPage] = useState<Page>('overview')

  const pages: Record<Page, JSX.Element> = {
    overview: <Overview />,
    bots:     <BotsPage />,
    logs:     <LogsPage />,
    keys:     <KeysPage />,
    settings: <SettingsPage />,
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)' }}>
      <Sidebar page={page} setPage={setPage}/>
      <main style={{ flex:1, overflowY:'auto', minWidth:0 }} className="dashboard-main">
        {pages[page]}
      </main>
    </div>
  )
}