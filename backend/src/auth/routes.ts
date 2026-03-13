import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import rateLimit from 'express-rate-limit'
import { prisma } from '../database/client.js'

const router = Router()

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 })

router.post('/register',
  authLimiter,
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return }

    const { email, password } = req.body
    try {
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) { res.status(409).json({ error: 'Email already registered' }); return }

      const passwordHash = await bcrypt.hash(password, 12)
      const user = await prisma.user.create({ data: { email, passwordHash } })

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
      res.status(201).json({ token, user: { id: user.id, email: user.email } })
    } catch (err) {
      console.error('Register error:', err)
      res.status(500).json({ error: 'Registration failed' })
    }
  }
)

router.post('/login',
  authLimiter,
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return }

    const { email, password } = req.body
    try {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) { res.status(401).json({ error: 'Invalid credentials' }); return }

      const valid = await bcrypt.compare(password, user.passwordHash)
      if (!valid) { res.status(401).json({ error: 'Invalid credentials' }); return }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
      res.json({ token, user: { id: user.id, email: user.email } })
    } catch (err) {
      console.error('Login error:', err)
      res.status(500).json({ error: 'Login failed' })
    }
  }
)

export default router