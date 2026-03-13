import { Router, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { prisma } from '../database/client.js'
import { requireAuth, AuthRequest } from '../auth/middleware.js'
import { decrypt } from '../encryption/aes.js'
import { generateTweet } from '../lib/geminiai.js'
import { postToX } from '../lib/posttox.js'

const router = Router()
router.use(requireAuth)

router.post('/',
  body('botId').isString().notEmpty(),
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return }

    const { botId } = req.body
    try {
      const bot = await prisma.bot.findFirst({
        where: { id: botId, userId: req.userId! },
        include: { user: true }
      })
      if (!bot) { res.status(404).json({ error: 'Bot not found' }); return }

      const user = bot.user

      // Debug — check what keys are stored
      console.log('📦 Raw geminiApiKey from DB:', user.geminiApiKey?.slice(0, 30))

      if (!user.geminiApiKey || !user.twitterApiKey) {
        res.status(400).json({ error: 'API keys not configured' }); return
      }

      // Rate limit check
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      const recentCount = await prisma.tweetLog.count({
        where: { userId: req.userId!, status: 'success', createdAt: { gte: oneHourAgo } }
      })
      if (recentCount >= 5) {
        res.status(429).json({ error: 'Rate limit: max 5 tweets per hour' }); return
      }

      // Decrypt keys
      let geminiKey: string
      let twitterApiKey: string
      let twitterApiSecret: string
      let twitterAccToken: string
      let twitterAccSecret: string

      try {
        geminiKey        = decrypt(user.geminiApiKey)
        twitterApiKey    = decrypt(user.twitterApiKey!)
        twitterApiSecret = decrypt(user.twitterApiSecret!)
        twitterAccToken  = decrypt(user.twitterAccessToken!)
        twitterAccSecret = decrypt(user.twitterAccessSecret!)
      } catch (decryptErr: any) {
        console.error('❌ Decryption failed:', decryptErr.message)
        res.status(500).json({ error: 'Failed to decrypt API keys', details: decryptErr.message }); return
      }

      console.log('🔑 Gemini key starts with:', geminiKey.slice(0, 15))
      console.log('🐦 Twitter key starts with:', twitterApiKey.slice(0, 10))

      // Generate tweet with retry
      let content: string
      let attempts = 0
      while (attempts < 3) {
        try {
          content = await generateTweet(bot.topic, geminiKey)
          console.log('✅ Tweet generated:', content.slice(0, 50))
          break
        } catch (aiErr: any) {
          attempts++
          console.error(`❌ AI attempt ${attempts} failed:`, aiErr.message)
          if (attempts >= 3) throw aiErr
          await new Promise(r => setTimeout(r, 2000 * attempts))
        }
      }

      // Post to Twitter
      let tweetId: string
      try {
        tweetId = await postToX(content!, {
          apiKey: twitterApiKey, apiSecret: twitterApiSecret,
          accessToken: twitterAccToken, accessSecret: twitterAccSecret
        })
        console.log('🐦 Tweet posted! ID:', tweetId)
      } catch (twitterErr: any) {
        console.error('❌ Twitter post failed:', twitterErr.message)
        await prisma.tweetLog.create({
          data: { userId: req.userId!, botId, content: content!, status: 'failed', error: twitterErr.message }
        }).catch(() => {})
        res.status(500).json({ error: 'Twitter post failed', details: twitterErr.message }); return
      }

      // Log success
      await prisma.tweetLog.create({
        data: { userId: req.userId!, botId, content: content!, status: 'success', tweetId }
      })
      await prisma.bot.update({ where: { id: botId }, data: { lastRunAt: new Date() } })

      res.json({ success: true, tweetId, content: content! })

    } catch (err: any) {
      console.error('Autopost error:', err)
      await prisma.tweetLog.create({
        data: { userId: req.userId!, botId, content: '', status: 'failed', error: err.message }
      }).catch(() => {})
      res.status(500).json({ error: 'Failed to post tweet', details: err.message })
    }
  }
)

export default router