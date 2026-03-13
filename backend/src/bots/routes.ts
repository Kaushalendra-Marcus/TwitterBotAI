import { Router, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { prisma } from '../database/client.js'
import { requireAuth, AuthRequest } from '../auth/middleware.js'

const router = Router()
router.use(requireAuth)

const VALID_SOURCES   = ['custom_prompt', 'google_news', 'rss_feed', 'website_scraper']
const VALID_INTERVALS = [60, 360, 1440] // 1h, 6h, daily in minutes
const VALID_STATUSES  = ['active', 'paused', 'stopped']

// GET /api/bots
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bots = await prisma.bot.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' }
    })
    res.json(bots)
  } catch {
    res.status(500).json({ error: 'Failed to fetch bots' })
  }
})

// POST /api/bots
router.post('/',
  body('name').isString().trim().isLength({ min: 1, max: 100 }),
  body('topic').isString().trim().isLength({ min: 1, max: 500 }),
  body('contentSource').isIn(VALID_SOURCES),
  body('interval').isIn(VALID_INTERVALS),
  body('hashtags').optional().isString().trim(),
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return }

    try {
      // Max 10 bots per user
      const count = await prisma.bot.count({ where: { userId: req.userId! } })
      if (count >= 10) { res.status(400).json({ error: 'Maximum 10 bots allowed' }); return }

      const { name, topic, contentSource, interval, hashtags } = req.body
      const bot = await prisma.bot.create({
        data: { userId: req.userId!, name, topic, contentSource, interval, hashtags }
      })
      res.status(201).json(bot)
    } catch {
      res.status(500).json({ error: 'Failed to create bot' })
    }
  }
)

// PUT /api/bots/:id
router.put('/:id',
  body('name').optional().isString().trim().isLength({ min: 1, max: 100 }),
  body('topic').optional().isString().trim().isLength({ min: 1, max: 500 }),
  body('contentSource').optional().isIn(VALID_SOURCES),
  body('interval').optional().isIn(VALID_INTERVALS),
  body('hashtags').optional().isString().trim(),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const bot = await prisma.bot.findFirst({ where: { id: req.params.id, userId: req.userId! } })
      if (!bot) { res.status(404).json({ error: 'Bot not found' }); return }

      const { name, topic, contentSource, interval, hashtags } = req.body
      const updated = await prisma.bot.update({
        where: { id: req.params.id },
        data: { ...(name && { name }), ...(topic && { topic }),
                ...(contentSource && { contentSource }), ...(interval && { interval }),
                ...(hashtags !== undefined && { hashtags }) }
      })
      res.json(updated)
    } catch {
      res.status(500).json({ error: 'Failed to update bot' })
    }
  }
)

// PATCH /api/bots/:id/status
router.patch('/:id/status',
  body('status').isIn(VALID_STATUSES),
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return }

    try {
      const bot = await prisma.bot.findFirst({ where: { id: req.params.id, userId: req.userId! } })
      if (!bot) { res.status(404).json({ error: 'Bot not found' }); return }

      const updated = await prisma.bot.update({
        where: { id: req.params.id },
        data: { status: req.body.status }
      })
      res.json(updated)
    } catch {
      res.status(500).json({ error: 'Failed to update status' })
    }
  }
)

// DELETE /api/bots/:id
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bot = await prisma.bot.findFirst({ where: { id: req.params.id, userId: req.userId! } })
    if (!bot) { res.status(404).json({ error: 'Bot not found' }); return }

    await prisma.bot.delete({ where: { id: req.params.id } })
    res.json({ message: 'Bot deleted' })
  } catch {
    res.status(500).json({ error: 'Failed to delete bot' })
  }
})

export default router