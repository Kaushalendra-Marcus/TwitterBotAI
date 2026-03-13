import cron from 'node-cron'
import { prisma } from '../database/client.js'
import { decrypt } from '../encryption/aes.js'
import { generateTweet } from '../lib/geminiai.js'
import { postToX } from '../lib/posttox.js'

export function startScheduler() {
  // Runs every minute- checks which bots are due
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date()

      const activeBots = await prisma.bot.findMany({
        where: { status: 'active' },
        include: { user: true }
      })

      for (const bot of activeBots) {
        try {
          const intervalMs = bot.interval * 60 * 1000
          const lastRun    = bot.lastRunAt?.getTime() ?? 0

          // Not due yet
          if (now.getTime() - lastRun < intervalMs) continue

          const user = bot.user
          if (!user.geminiApiKey || !user.twitterApiKey) continue

          // Rate limit check - max 5 tweets/hour per user
          const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
          const recentCount = await prisma.tweetLog.count({
            where: { userId: user.id, status: 'success', createdAt: { gte: oneHourAgo } }
          })
          if (recentCount >= 5) {
            console.log(`Rate limit hit for user ${user.email}`)
            continue
          }

          // Decrypt keys
          const geminiKey        = decrypt(user.geminiApiKey)
          const twitterApiKey    = decrypt(user.twitterApiKey!)
          const twitterApiSecret = decrypt(user.twitterApiSecret!)
          const twitterAccToken  = decrypt(user.twitterAccessToken!)
          const twitterAccSecret = decrypt(user.twitterAccessSecret!)

          // Generate + post
          const content = await generateTweet(bot.topic, geminiKey)
          const tweetId = await postToX(content, {
            apiKey: twitterApiKey, apiSecret: twitterApiSecret,
            accessToken: twitterAccToken, accessSecret: twitterAccSecret
          })

          // Log + update lastRunAt
          await prisma.tweetLog.create({
            data: { userId: user.id, botId: bot.id, content, status: 'success', tweetId }
          })
          await prisma.bot.update({ where: { id: bot.id }, data: { lastRunAt: now } })

          console.log(`Tweet posted for bot "${bot.name}" (${user.email})`)
        } catch (err: any) {
          console.error(`Bot "${bot.name}" failed:`, err.message)

          // Update lastRunAt even on failure so it doesn't retry every minute
          await prisma.bot.update({
            where: { id: bot.id },
            data: { lastRunAt: new Date() }
          }).catch(() => {})

          await prisma.tweetLog.create({
            data: { userId: bot.userId, botId: bot.id, content: '', status: 'failed', error: err.message }
          }).catch(() => {})
        }
      }
    } catch (err) {
      console.error('Scheduler error:', err)
    }
  })

  console.log('Scheduler started')
}