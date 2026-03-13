import axios from 'axios'
import { JSDOM } from 'jsdom'

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

async function fetchUrl(url: string, xml = false): Promise<string> {
  const res = await axios.get(url, {
    headers: { 'User-Agent': UA },
    timeout: 10000,
    responseType: 'text',
  })
  return res.data
}

function extractParagraphs(html: string, count = 5): string {
  const dom = new JSDOM(html)
  const ps = Array.from(dom.window.document.querySelectorAll('p'))
    .map(p => p.textContent?.trim() ?? '')
    .filter(t => t.length > 40)
    .slice(0, count)
  return ps.join(' ')
}

export async function fetchGoogleNews(topic: string): Promise<string> {
  try {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=en-US&gl=US&ceid=US:en`
    const xml = await fetchUrl(url, true)
    const dom = new JSDOM(xml, { contentType: 'text/xml' })
    const items = dom.window.document.querySelectorAll('item')
    const headlines = Array.from(items)
      .slice(0, 5)
      .map(item => item.querySelector('title')?.textContent?.trim() ?? '')
      .filter(Boolean)
    return `Latest news about "${topic}": ${headlines.join('. ')}`
  } catch (err) {
    console.error('fetchGoogleNews error', err)
    return topic
  }
}

export async function fetchRss(feedUrl: string): Promise<string> {
  try {
    const xml = await fetchUrl(feedUrl, true)
    const dom = new JSDOM(xml, { contentType: 'text/xml' })
    const items = dom.window.document.querySelectorAll('item')
    if (items.length === 0) return feedUrl
    const first = items[0]
    const title = first.querySelector('title')?.textContent?.trim() ?? ''
    const desc  = first.querySelector('description')?.textContent?.trim() ?? ''
    return `${title}. ${desc}`.slice(0, 800)
  } catch (err) {
    console.error('fetchRss error', err)
    return feedUrl
  }
}

export async function fetchWebsite(url: string): Promise<string> {
  try {
    const html = await fetchUrl(url)
    return extractParagraphs(html, 5)
  } catch (err) {
    console.error('fetchWebsite error', err)
    return url
  }
}

export async function resolveContent(contentSource: string, topic: string): Promise<string> {
  switch (contentSource) {
    case 'google_news':     return await fetchGoogleNews(topic)
    case 'rss_feed':        return await fetchRss(topic)
    case 'website_scraper': return await fetchWebsite(topic)
    case 'custom_prompt':
    default:                return topic
  }
}
