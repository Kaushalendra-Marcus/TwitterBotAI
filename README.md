# TweetBotAI - AI-Powered Twitter/X Auto Post Platform

![TweetBotAI](./frontend/public/logo.png)

> Automate your Twitter/X account to post tweets every day using AI. No content planning, no scheduling headaches - just set it up once and let it run forever.

**Live Demo:** https://tweetbotai.vercel.app  
**Built by:** [Kaushalendra Singh](https://kaushalendra-portfolio.vercel.app/)

---

## What is TweetBotAI?

TweetBotAI is a full-stack web platform that lets you create AI-powered bots to auto post tweets to your real Twitter/X account. Unlike simple scripts, TweetBotAI gives every user their own secure dashboard to manage multiple bots, view tweet logs, and control posting intervals - all without touching any code.

Whether you want to grow as an influencer, keep your brand active, or just stay consistent on X without the daily effort - TweetBotAI handles it automatically.

---

## Why TweetBotAI beats other Twitter auto post tools

| Feature | TweetBotAI | Basic scripts |
|---------|-----------|---------------|
| Full web dashboard | Yes | No |
| Multiple bots per user | Yes | No |
| Google News as content source | Yes | No |
| RSS feed support | Yes | No |
| AES-256 encrypted API keys | Yes | No |
| Per-user API key management | Yes | No |
| Tweet history and logs | Yes | No |
| Auto post on schedule | Yes | Yes |
| AI-generated content | Yes (Gemini) | Yes (GPT) |
| Free to self-host | Yes | Yes |

---

## How it works

```
Sign Up
  -> Add your Google Gemini API Key
  -> Add your Twitter/X API Keys (OAuth 1.0a)
  -> Create a Bot (topic + source + interval)
  -> Bot auto posts tweets on your schedule
  -> View logs and manage everything from dashboard
```

No coding needed after setup. Just sign in and your X account stays active every day.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Vite + React 18 + TypeScript |
| Backend | Node.js + TypeScript + Express |
| Database | PostgreSQL (Neon) + Prisma ORM |
| AI | Google Gemini 2.0 Flash |
| Twitter/X | twitter-api-v2 (OAuth 1.0a) |
| Security | AES-256-GCM + bcrypt + JWT |
| Scheduler | node-cron (checks every minute) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Quick Start - Self Host in 5 Minutes

### 1. Clone and install

```bash
git clone https://github.com/Kaushalendra-Marcus/TwitterBotAI
cd TwitterBotAI

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure backend `.env`

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
DATABASE_URL=postgresql://<user>:<pass>@<host>.neon.tech/<db>?sslmode=require
JWT_SECRET=<min 32 random chars>
ENCRYPTION_KEY=<exactly 32 chars>
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

Generate secure values:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Run database migrations

```bash
cd backend
npx prisma migrate dev
```

### 4. Start development servers

```bash
# Terminal 1 - Backend (port 5000)
cd backend && npm run dev

# Terminal 2 - Frontend (port 5173)
cd frontend && npm run dev
```

Open http://localhost:5173

---

## Content Sources for Auto Posting

TweetBotAI can generate tweet content from 4 sources:

- **AI Prompt** - Give a topic, Gemini writes original tweets
- **Google News** - Auto post about trending news in your niche
- **RSS Feed** - Pull from any RSS/Atom feed and tweet summaries
- **Web Scraper** - Scrape any webpage and turn it into tweet content

---

## Security

- Passwords hashed with **bcrypt (cost 12)**
- API keys encrypted with **AES-256-GCM** before database storage
- Keys decrypted **in RAM only** at tweet post time - never logged or exposed
- JWT tokens expire in **7 days**
- Rate limiting: **200 req/min** global, **20 req/15min** auth endpoints
- Input validation with **express-validator**
- CORS restricted to frontend origin only

---

## API Endpoints

```
POST   /api/auth/register              -> { token, user }
POST   /api/auth/login                 -> { token, user }

GET    /api/user/profile               -> user profile + key status
POST   /api/user/keys                  -> save encrypted API keys

GET    /api/bots                       -> list user bots
POST   /api/bots                       -> create bot
PUT    /api/bots/:id                   -> update bot
PATCH  /api/bots/:id/status            -> toggle active/paused/stopped
DELETE /api/bots/:id                   -> delete bot and logs

GET    /api/logs?botId&page&limit      -> paginated tweet logs
DELETE /api/logs/:id                   -> delete a log entry

POST   /api/autopost { botId }         -> manually trigger a bot run

GET    /api/health                     -> health check
```

---

## Deploy to Production

### Backend on Render (free)

1. New Web Service -> connect GitHub repo
2. Root Directory: `backend`
3. Build Command: `npm install && npm run build`
4. Start Command: `node dist/index.js`
5. Environment Variables:

```env
DATABASE_URL=
JWT_SECRET=
ENCRYPTION_KEY=
FRONTEND_URL=https://tweetbotai.vercel.app
NODE_ENV=production
PORT=10000
```

### Frontend on Vercel (free)

1. New Project -> connect GitHub repo
2. Root Directory: `frontend`
3. Build Command: `npm run build`
4. Environment Variables:

```env
VITE_API_URL=https://twitterbotai.onrender.com
```

---

## Project Structure

```
TwitterBotAI/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── ai/           # Gemini integration
│       ├── api/          # logs, autopost routes
│       ├── auth/         # JWT auth + user routes
│       ├── bots/         # bot CRUD routes
│       ├── database/     # Prisma client
│       ├── encryption/   # AES-256-GCM
│       ├── scheduler/    # node-cron runner
│       ├── sources/      # news/rss/scraper
│       ├── twitter/      # twitter-api-v2 client
│       └── index.ts      # Express entry point
└── frontend/
    ├── public/
    │   ├── icon.svg
    │   └── logo.png
    └── src/
        ├── api/          # axios client
        ├── components/   # UI + SEO components
        ├── contexts/     # AuthContext
        ├── pages/        # Landing, Dashboard, Bots, Logs...
        └── types/        # TypeScript interfaces
```

---

## Known Limitations

- Twitter/X Free tier does not support `POST /tweets`. Twitter Basic plan ($100/month) minimum required to post tweets via API.
- Free Render instances spin down after 15 min inactivity - first request may take 30-50 seconds to wake up.

---

## Topics

`twitter-automation` `x-automation` `auto-post-twitter` `twitter-bot` `ai-twitter-bot` `tweet-scheduler` `google-gemini` `twitter-api` `social-media-automation` `influencer-tools`

---

## License

MIT - [Kaushalendra Singh](https://kaushalendra-portfolio.vercel.app/)