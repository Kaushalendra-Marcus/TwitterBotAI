import crypto from 'crypto'

const KEY = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex')
if (KEY.length !== 32) throw new Error('ENCRYPTION_KEY must be 64 hex characters (32 bytes)')

const ALGO = 'aes-256-gcm'

export function encrypt(text: string): string {
  const iv         = crypto.randomBytes(12)
  const cipher     = crypto.createCipheriv(ALGO, KEY, iv)
  const encrypted  = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  const authTag    = cipher.getAuthTag()
  return [iv.toString('hex'), authTag.toString('hex'), encrypted.toString('hex')].join(':')
}

export function decrypt(data: string): string {
  const [ivHex, tagHex, encHex] = data.split(':')
  const iv        = Buffer.from(ivHex,  'hex')
  const authTag   = Buffer.from(tagHex, 'hex')
  const encrypted = Buffer.from(encHex, 'hex')
  const decipher  = crypto.createDecipheriv(ALGO, KEY, iv)
  decipher.setAuthTag(authTag)
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8')
}