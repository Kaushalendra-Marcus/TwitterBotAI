import { Router, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { prisma } from '../database/client.js'
import { requireAuth, AuthRequest } from './middleware.js'
import { encrypt } from '../encryption/aes.js'

const router = Router()
router.use(requireAuth)

// GET /api/user/profile
router.get('/profile', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      select: {
        id: true, email: true, createdAt: true,
        geminiApiKey: true,
        twitterApiKey: true, twitterApiSecret: true,
        twitterAccessToken: true, twitterAccessSecret: true,
      }
    })
    if (!user) { res.status(404).json({ error: 'User not found' }); return }

    res.json({
      id:              user.id,
      email:           user.email,
      createdAt:       user.createdAt,
      hasGeminiKey:    !!user.geminiApiKey,
      hasTwitterKeys:  !!(user.twitterApiKey && user.twitterApiSecret &&
                          user.twitterAccessToken && user.twitterAccessSecret),
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

// POST /api/user/keys
router.post('/keys',
  body('geminiApiKey').optional().isString().trim(),
  body('twitterApiKey').optional().isString().trim(),
  body('twitterApiSecret').optional().isString().trim(),
  body('twitterAccessToken').optional().isString().trim(),
  body('twitterAccessSecret').optional().isString().trim(),
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return }

    const { geminiApiKey, twitterApiKey, twitterApiSecret, twitterAccessToken, twitterAccessSecret } = req.body

    try {
      const data: Record<string, string> = {}
      if (geminiApiKey)        data.geminiApiKey        = encrypt(geminiApiKey)
      if (twitterApiKey)       data.twitterApiKey       = encrypt(twitterApiKey)
      if (twitterApiSecret)    data.twitterApiSecret    = encrypt(twitterApiSecret)
      if (twitterAccessToken)  data.twitterAccessToken  = encrypt(twitterAccessToken)
      if (twitterAccessSecret) data.twitterAccessSecret = encrypt(twitterAccessSecret)

      await prisma.user.update({ where: { id: req.userId! }, data })

      // Return updated profile so frontend can refresh immediately
      res.json({
        message: 'API keys saved successfully',
        hasGeminiKey:   !!data.geminiApiKey   || true,
        hasTwitterKeys: !!(data.twitterApiKey && data.twitterApiSecret &&
                           data.twitterAccessToken && data.twitterAccessSecret),
      })
    } catch (err) {
      console.error('Save keys error:', err)
      res.status(500).json({ error: 'Failed to save API keys' })
    }
  }
)

export default router