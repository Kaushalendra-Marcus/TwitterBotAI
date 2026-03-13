import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { connectDB } from './database/client.js'
import authRoutes from './auth/routes.js'
import userRoutes from './auth/userRoutes.js'
import botRoutes from './bots/routes.js'
import logsRoutes from './api/logs.js'
import autopostRoutes from './api/autopost.js'
import { startScheduler } from './scheduler/index.js'

const app  = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}))

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))
app.use(rateLimit({ windowMs: 60_000, max: 200, standardHeaders: true, legacyHeaders: false }))

app.use('/api/auth',     authRoutes)
app.use('/api/user',     userRoutes)
app.use('/api/bots',     botRoutes)
app.use('/api/logs',     logsRoutes)
app.use('/api/autopost', autopostRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }))
app.use((_, res) => res.status(404).json({ error: 'Not found' }))

async function start() {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
    startScheduler()
  })
}

start().catch(err => {
  console.error('Failed to start:', err)
  process.exit(1)
})