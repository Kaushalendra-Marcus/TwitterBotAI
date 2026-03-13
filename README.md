# TweetBotAI — Full-Stack AI Twitter Automation Platform

A production-ready, fully connected platform where users sign up, add their own API keys, create bots, and tweets post automatically from their real Twitter accounts.

---

## Stack

| Layer | Tech |
|-------|------|
| Backend | Node.js · TypeScript · Express · MongoDB (Mongoose) |
| AI | Google Gemini 2.0 Flash |
| Twitter | twitter-api-v2 (OAuth 1.0a) |
| Security | AES-256-GCM encryption · bcrypt · JWT |
| Scheduler | node-cron (checks every minute) |
| Frontend | Vite · React 18 · TypeScript · TailwindCSS v4 |

---

## Quick Start

### 1. Clone & install

```bash
# Install backend
cd backend && npm install

# Install frontend
cd ../frontend && npm install
```

### 2. Configure backend `.env`

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/tweetbotai
JWT_SECRET=<generate: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))">
ENCRYPTION_KEY=<generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
FRONTEND_URL=http://localhost:5173
PORT=5000
```

> **ENCRYPTION_KEY** must be exactly 64 hex characters (32 bytes).
> **JWT_SECRET** should be at least 32 random characters.

### 3. Run in development

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

Open http://localhost:5173

---

## API Endpoints

```
POST   /api/auth/register         → { token, user }
POST   /api/auth/login            → { token, user }
GET    /api/user/profile          → user profile
POST   /api/user/keys             → save encrypted API keys

GET    /api/bots                  → list user's bots
POST   /api/bots                  → create bot
PUT    /api/bots/:id              → update bot
PATCH  /api/bots/:id/status       → toggle active/paused/stopped
DELETE /api/bots/:id              → delete bot + logs

GET    /api/logs?botId&page&limit → paginated tweet logs
DELETE /api/logs/:id              → delete a log entry

POST   /api/autopost { botId }    → manually trigger a bot run

GET    /api/health                → health check
```

---

## User Flow

```
Sign Up → Add Gemini API key → Add Twitter API keys
       → Create Bot (topic, source, interval) → Bot runs automatically
       → View tweet logs → Manage bots
```

## Security

- Passwords hashed with **bcrypt (cost 12)**
- API keys encrypted with **AES-256-GCM** before DB storage
- JWT tokens expire in **7 days**
- Rate limiting: **200 req/min** global, **20 req/15min** auth endpoints
- Max **5 tweets/user/hour** to prevent spam
- Input validation with **express-validator**
- CORS restricted to frontend origin

## Deployment (Vercel)

**Backend:** Add `vercel.json` to `backend/`:
```json
{ "builds": [{ "src": "src/index.ts", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "src/index.ts" }] }
```

**Frontend:** Build with `npm run build`, deploy `dist/` or connect Vercel to the repo.

Set `VITE_API_URL` in frontend env to your backend URL, and update `vite.config.ts` proxy accordingly.
