export interface User {
  id: string
  email: string
  createdAt: string
  hasGeminiKey: boolean
  hasTwitterKeys: boolean
}

export type BotStatus     = 'active' | 'paused' | 'stopped'
export type ContentSource = 'custom_prompt' | 'google_news' | 'rss_feed' | 'website_scraper'

export interface Bot {
  id: string
  userId: string
  name: string
  topic: string
  contentSource: ContentSource
  interval: number          // 60, 360, 1440 (minutes)
  hashtags: string | null
  status: BotStatus
  lastRunAt?: string | null
  createdAt: string
}

export interface TweetLog {
  id: string
  userId: string
  botId: string
  bot?: { name: string }
  content: string
  status: 'success' | 'failed'
  error?: string | null
  tweetId?: string | null
  createdAt: string
}

export interface ApiError { error: string }

export const SOURCE_META: Record<ContentSource, { label: string; color: string; bg: string; cls: string }> = {
  custom_prompt:   { label: 'AI Prompt',   color: '#4f46e5', bg: '#eef2ff', cls: 'src-prompt'  },
  google_news:     { label: 'Google News', color: '#0369a1', bg: '#e0f2fe', cls: 'src-news'    },
  rss_feed:        { label: 'RSS Feed',    color: '#065f46', bg: '#d1fae5', cls: 'src-rss'     },
  website_scraper: { label: 'Web Scraper', color: '#92400e', bg: '#fef3c7', cls: 'src-scraper' },
}

export const INTERVAL_LABELS: Record<number, string> = {
  60:   'Every Hour',
  360:  'Every 6 Hours',
  1440: 'Daily',
}

export function timeAgo(dateStr?: string | null): string {
  if (!dateStr) return 'Never'
  const diff = Date.now() - new Date(dateStr).getTime()
  if (diff < 60_000)     return 'just now'
  if (diff < 3_600_000)  return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
  return `${Math.floor(diff / 86_400_000)}d ago`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}