import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Zap, Shield, Clock, TrendingUp, Users, BarChart3, Bot, Lock, Key, Eye, CheckCircle, Globe, Rss, Sparkles, Menu, X } from 'lucide-react'
import { SEO } from '../components/SEO'
const XLogo = ({ size = 18, color = '#fff' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const FEATURES = [
  {
    icon: <Bot size={22} />,
    title: 'AI-Powered Content Generation',
    desc: 'Google Gemini 2.0 Flash analyzes your topic, pulls from live sources, and writes tweets that feel natural and on-brand. Every post is unique, contextual, and optimized for engagement.',
    c: '#1d9bf0', bg: '#e8f5fe',
  },
  {
    icon: <Clock size={22} />,
    title: 'Precision Scheduling',
    desc: 'Configure bots to post every hour, every 6 hours, or once a day. The scheduler runs server-side with no browser required. Your account stays active around the clock without any manual effort.',
    c: '#10b981', bg: '#d1fae5',
  },
  {
    icon: <Shield size={22} />,
    title: 'Military-Grade Encryption',
    desc: 'Every API key is encrypted with AES-256-GCM before hitting the database. Keys are decrypted only in server memory at the exact moment a tweet is posted, then immediately discarded.',
    c: '#6366f1', bg: '#eef2ff',
  },
  {
    icon: <TrendingUp size={22} />,
    title: 'Multi-Source Content',
    desc: 'Pull live content from Google News, custom RSS feeds, website scrapers, or your own AI prompts. Mix sources across bots to ensure your feed always stays fresh and diverse.',
    c: '#f59e0b', bg: '#fef3c7',
  },
  {
    icon: <Users size={22} />,
    title: 'Unlimited Bot Accounts',
    desc: 'Run as many bots as you need, each with its own isolated credentials, topic, schedule, and content source. Manage everything from a single unified dashboard.',
    c: '#ec4899', bg: '#fdf2f8',
  },
  {
    icon: <BarChart3 size={22} />,
    title: 'Full Activity Logs',
    desc: 'Every tweet attempt is logged with timestamp, status, and error details. Monitor performance, catch failures instantly, and audit your posting history at any time.',
    c: '#00bcd4', bg: '#e0f9fc',
  },
]

const SECURITY_POINTS = [
  { icon: <Lock size={16} />, title: 'AES-256-GCM Encryption', desc: 'Industry-standard symmetric encryption protects every stored credential.' },
  { icon: <Key size={16} />, title: 'Keys Never Logged', desc: 'Raw API keys are never written to logs, files, or any persistent storage.' },
  { icon: <Eye size={16} />, title: 'Zero Exposure Architecture', desc: 'Decryption happens in RAM only, at the moment of use, then cleared immediately.' },
  { icon: <Shield size={16} />, title: 'Bcrypt Password Hashing', desc: 'Passwords are hashed with bcrypt cost factor 12 before any storage.' },
  { icon: <CheckCircle size={16} />, title: 'JWT Auth Tokens', desc: 'Short-lived signed tokens with 7-day expiry and server-side validation.' },
  { icon: <Globe size={16} />, title: 'Rate Limit Protection', desc: 'Global per-user rate limits prevent abuse and protect your X account.' },
]

const CONTENT_SOURCES = [
  { icon: <Sparkles size={18} />, label: 'AI Prompt', desc: 'Write a custom prompt and let Gemini generate original tweet content on any topic.', color: '#6366f1', bg: '#eef2ff' },
  { icon: <Globe size={18} />, label: 'Google News', desc: 'Pull breaking news from Google News on any keyword and auto-summarize into a tweet.', color: '#0369a1', bg: '#e0f2fe' },
  { icon: <Rss size={18} />, label: 'RSS Feed', desc: 'Point to any RSS feed URL and automatically convert new entries into tweet-ready content.', color: '#065f46', bg: '#d1fae5' },
  { icon: <Globe size={18} />, label: 'Web Scraper', desc: 'Scrape any public webpage for content and use AI to distill it into a sharp, shareable tweet.', color: '#92400e', bg: '#fef3c7' },
]

const DEMO_TWEETS = [
  { handle: '@techbot_ai', time: 'just now', text: 'GPT-5 reasoning scores just dropped and the gap between human experts and AI is narrowing faster than anyone predicted. The next 12 months will redefine what software engineering looks like.' },
  { handle: '@cryptobot_ai', time: '2h ago', text: 'Ethereum gas fees hit a two-year low while L2 total value locked crossed $40 billion. The infrastructure thesis for DeFi is playing out exactly as expected.' },
  { handle: '@financebot_ai', time: '5h ago', text: 'The Fed held rates steady again. Markets had already priced in the pause but the language shift in the statement suggests cuts are closer than the headline number implies.' },
]

export function Landing({ onLogin, onSignup }: { onLogin: () => void; onSignup: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (

    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'DM Sans', sans-serif" }}>
      <SEO
        title="Automate Your X Account with AI"
        description="Create AI-powered bots that post to your real X account automatically. Powered by Google Gemini. AES-256 encrypted. Set up in 2 minutes."
        keywords="twitter automation, X automation, AI tweet bot, auto post twitter, tweet scheduler"
        canonical="/"
      />
      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 64, padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        transition: 'all 0.3s',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--slate)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <XLogo size={17} color="#fff" />
          </div>
          <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 18, color: 'var(--slate)' }}>
            TweetBot<span style={{ color: 'var(--blue)' }}>AI</span>
          </span>
        </div>

        {/* Desktop nav buttons */}
        <div className="nav-cta-desktop" style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={onLogin}>Log In</button>
          <button className="btn btn-primary" onClick={onSignup}>Get Started <ArrowRight size={13} /></button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-cta-mobile"
          onClick={() => setMobileMenu(v => !v)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)', display: 'none', padding: 1 }}
        >
          {mobileMenu ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu dropdown */}
      {mobileMenu && (
        <div style={{ position: 'fixed', top: 64, left: 0, right: 0, zIndex: 49, background: '#fff', borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => { onLogin(); setMobileMenu(false) }} style={{ width: '100%', justifyContent: 'center' }}>Log In</button>
          <button className="btn btn-primary" onClick={() => { onSignup(); setMobileMenu(false) }} style={{ width: '100%', justifyContent: 'center' }}>Get Started <ArrowRight size={13} /></button>
        </div>
      )}

      {/* HERO */}
      <div ref={heroRef} style={{
        paddingTop: 130, paddingBottom: 80,
        background: 'linear-gradient(160deg, #f0f9ff 0%, #e8f5fe 45%, #f0fdf4 100%)',
        textAlign: 'center', overflow: 'hidden', position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: -100, right: -120, width: 500, height: 500, borderRadius: '60% 40% 70% 30% / 60% 30% 70% 40%', background: 'rgba(29,155,240,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -100, width: 400, height: 400, borderRadius: '30% 60% 40% 70% / 50% 60% 30% 60%', background: 'rgba(16,185,129,0.06)', pointerEvents: 'none' }} />

        <div className="au" style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(16,185,129,0.1)', color: '#065f46', padding: '5px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600, marginBottom: 24, border: '1px solid rgba(16,185,129,0.2)' }}>
            <Lock size={11} /> End-to-end encrypted platform
          </div>
          <h1 style={{ fontSize: 'clamp(34px,6vw,62px)', fontWeight: 800, lineHeight: 1.1, color: 'var(--slate)', marginBottom: 20, fontFamily: 'Sora' }}>
            Automate Your X Account<br />
            <span style={{ color: 'var(--blue)' }}>with Intelligence</span>
          </h1>
          <p style={{ fontSize: 17, color: '#475569', lineHeight: 1.8, marginBottom: 36, maxWidth: 540, margin: '0 auto 36px' }}>
            Create AI-powered bots that post to your real X account from Google News, RSS feeds, or custom prompts. Fully automated, fully encrypted, fully hands-free.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ fontSize: 15, padding: '13px 30px' }} onClick={onSignup}>
              Start Free <ArrowRight size={15} />
            </button>
            <button className="btn btn-outline" style={{ fontSize: 15, padding: '13px 30px' }} onClick={onLogin}>
              Sign In
            </button>
          </div>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            {['AES-256 Encrypted', 'No credit card required', 'Setup in 2 minutes'].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>
                <CheckCircle size={13} color="var(--green)" /> {t}
              </div>
            ))}
          </div>
        </div>

        {/* Demo tweet cards */}
        <div style={{ marginTop: 64, maxWidth: 1040, margin: '64px auto 0', padding: '0 24px', display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          {DEMO_TWEETS.map((tw, i) => (
            <div key={i} className={`au d${i + 1}`} style={{ width: 300, borderRadius: 16, padding: '16px 18px', textAlign: 'left', background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.7)', boxShadow: '0 4px 24px rgba(15,23,42,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--slate)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <XLogo size={14} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--slate)' }}>{tw.handle}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>{tw.time}</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: 999, fontSize: 9, fontWeight: 700 }}>
                  <Zap size={8} fill="#065f46" /> AUTO
                </div>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.7, color: '#334155' }}>{tw.text.slice(0, 130)}{tw.text.length > 130 ? '...' : ''}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECURITY SECTION */}
      <div style={{ background: 'var(--slate)', padding: '80px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', padding: '5px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600, marginBottom: 16, border: '1px solid rgba(99,102,241,0.3)' }}>
              <Shield size={11} /> Security Architecture
            </div>
            <h2 style={{ fontSize: 34, fontWeight: 700, color: '#fff', marginBottom: 12, fontFamily: 'Sora' }}>Your credentials are never at risk</h2>
            <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
              TweetBotAI was built with a security-first architecture. Every sensitive value is encrypted before storage and decrypted only at the exact moment it is needed.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
            {SECURITY_POINTS.map((pt, i) => (
              <div key={i} className={`au d${(i % 4) + 1}`} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 22px', display: 'flex', gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a5b4fc', flexShrink: 0 }}>
                  {pt.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{pt.title}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{pt.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Encryption flow */}
          <div style={{ marginTop: 40, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px 28px' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Encryption Flow</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', rowGap: 12 }}>
              {[
                { label: 'You enter API key', color: '#94a3b8' },
                { label: 'AES-256-GCM encrypt', color: '#a5b4fc' },
                { label: 'Store encrypted blob', color: '#6ee7b7' },
                { label: 'Decrypt in RAM only', color: '#fbbf24' },
                { label: 'Post tweet', color: '#34d399' },
                { label: 'Key discarded', color: '#f87171' },
              ].map((step, i, arr) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, color: step.color, whiteSpace: 'nowrap' }}>
                    {step.label}
                  </div>
                  {i < arr.length - 1 && <ArrowRight size={13} color="#475569" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT SOURCES */}
      <div style={{ padding: '80px 32px', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 34, fontWeight: 700, color: 'var(--slate)', marginBottom: 12, fontFamily: 'Sora' }}>Four ways to source content</h2>
            <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              Connect any content source to your bot. Mix and match across multiple bots to keep every account posting fresh, relevant content.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 18 }}>
            {CONTENT_SOURCES.map((src, i) => (
              <div key={i} className={`card card-hover au d${i + 1}`} style={{ padding: '24px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: src.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: src.color, marginBottom: 16 }}>
                  {src.icon}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate)', marginBottom: 8 }}>{src.label}</div>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>{src.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ padding: '80px 32px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 34, fontWeight: 700, color: 'var(--slate)', marginBottom: 12, fontFamily: 'Sora' }}>Everything you need</h2>
            <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              A complete, production-ready platform built for serious X automation at any scale.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className={`card card-hover au d${(i % 4) + 1}`} style={{ padding: '24px' }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.c, marginBottom: 16 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--slate)', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STEPS */}
      <div style={{ padding: '80px 32px', background: 'var(--bg)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 30, fontWeight: 700, color: 'var(--slate)', marginBottom: 12, fontFamily: 'Sora' }}>Up and running in 4 steps</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 48, lineHeight: 1.7 }}>No technical knowledge required. If you have an X developer account, you are ready to go.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 32 }}>
            {[
              { n: '01', t: 'Create Account', d: 'Sign up with your email in under 30 seconds. No credit card required to get started.' },
              { n: '02', t: 'Add API Keys', d: 'Connect your Gemini AI and X credentials. All keys are encrypted immediately on save.' },
              { n: '03', t: 'Configure a Bot', d: 'Choose your topic, content source, hashtags, and how often you want tweets to post.' },
              { n: '04', t: 'Run on Autopilot', d: 'Your bot runs 24 hours a day, 7 days a week, posting to your real X account automatically.' },
            ].map((s, i) => (
              <div key={i} className={`au d${i + 1}`}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontFamily: 'Sora', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 16px rgba(29,155,240,0.3)' }}>
                  {s.n}
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--slate)', marginBottom: 8 }}>{s.t}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: 'var(--slate)', padding: '80px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(29,155,240,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(99,102,241,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <h2 style={{ fontSize: 34, fontWeight: 700, color: '#fff', marginBottom: 14, fontFamily: 'Sora' }}>Ready to automate?</h2>
          <p style={{ color: '#94a3b8', marginBottom: 32, fontSize: 15, lineHeight: 1.7, maxWidth: 460, margin: '0 auto 32px' }}>
            Join creators growing their X presence on full autopilot. Free to start, secure by design.
          </p>
          <button className="btn btn-primary" style={{ fontSize: 15, padding: '14px 36px' }} onClick={onSignup}>
            Create Free Account <ArrowRight size={15} />
          </button>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            {['AES-256 Encrypted', 'Keys never exposed', 'Cancel any time'].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                <CheckCircle size={13} color="#10b981" /> {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '20px 32px', color: '#475569', fontSize: 12, background: 'var(--slate-2)', borderTop: '1px solid #334155' }}>
        2026 TweetBotAI. All rights reserved.
      </div>
    </div>
  )
}