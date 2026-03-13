import { Router, Response } from "express"
import { prisma } from "../database/client.js"
import { requireAuth, AuthRequest } from "../auth/middleware.js"

const router = Router()
router.use(requireAuth)

router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page  = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20)
    const botId = req.query.botId as string | undefined
    const skip  = (page - 1) * limit
    const where = { userId: req.userId!, ...(botId && { botId }) }
    const [logs, total] = await Promise.all([
      prisma.tweetLog.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit, include: { bot: { select: { name: true } } } }),
      prisma.tweetLog.count({ where })
    ])
    res.json({ logs, total, page, pages: Math.ceil(total / limit) })
  } catch { res.status(500).json({ error: "Failed to fetch logs" }) }
})

router.delete("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const log = await prisma.tweetLog.findFirst({ where: { id: req.params.id, userId: req.userId! } })
    if (!log) { res.status(404).json({ error: "Log not found" }); return }
    await prisma.tweetLog.delete({ where: { id: req.params.id } })
    res.json({ message: "Log deleted" })
  } catch { res.status(500).json({ error: "Failed to delete log" }) }
})

export default router