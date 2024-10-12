import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import fs from 'node:fs'

import 'dotenv/config'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteWithRetries(filePath: string, retries = 5, delay = 100) {
  for (let i = 0; i < retries; i++) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
      break
    } catch (err) {
      if (i === retries - 1) throw err
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

function generateUniqueDataBaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not provider')
  }
  const url = new URL(process.env.DATABASE_URL)

  if (url.href.startsWith('file:///')) {
    const dbDir = path.join(__dirname, `${schemaId}.db`)
    return `file:${dbDir}`
  }

  url.searchParams.set('schema', schemaId)
  return url.toString()
}

let schemaId: string

beforeAll(() => {
  schemaId = randomUUID()
  const url = generateUniqueDataBaseUrl(schemaId)
  process.env.DATABASE_URL = url
  execSync('npx prisma migrate deploy')
})

afterAll(async () => {
  if (process.env.DATABASE_URL?.startsWith('file:')) {
    await prisma.$disconnect()

    const dbPath = path.join(__dirname, `${schemaId}.db`)
    const dbPathJournal = path.join(__dirname, `${schemaId}.db-journal`)

    await deleteWithRetries(dbPath)
    await deleteWithRetries(dbPathJournal)
  } else {
    await prisma.$executeRawUnsafe(`DROP SCHEMA IS EXISTS ${schemaId} CASCADE`)
    await prisma.$disconnect()
  }
})
