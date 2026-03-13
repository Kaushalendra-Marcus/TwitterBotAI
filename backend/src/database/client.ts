import { PrismaClient } from '@prisma/client'

declare global {
  var __prisma: PrismaClient | undefined
}

export const prisma = global.__prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma
}

export async function connectDB() {
  try {
    await prisma.$connect()
    console.log('Neon PostgreSQL connected')
  } catch (err) {
    console.error('Database connection failed:', err)
    process.exit(1)
  }
}

export async function disconnectDB() {
  await prisma.$disconnect()
}