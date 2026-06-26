import fs from 'node:fs'
import path from 'node:path'
import type { EnhancedResume } from '../server/enhance-resume'

const contentDir = path.resolve(process.cwd(), 'content')
const cacheDir = path.resolve(process.cwd(), '.cache')
const cacheFile = path.join(cacheDir, 'enhanced-resume.json')

interface CacheEntry {
  contentMtime: number
  generatedAt: string
  resume: EnhancedResume
}

function getMaxContentMtime(): number {
  if (!fs.existsSync(contentDir)) return 0

  const allFiles = fs.readdirSync(contentDir)
  const exampleFiles = allFiles.filter((f) => f.endsWith('.example.md'))
  const realFiles = allFiles.filter((f) => f.endsWith('.md') && !f.endsWith('.example.md'))

  const exampleBasenames = new Set(exampleFiles.map((f) => f.replace('.example.md', '')))
  const trackedFiles = [
    ...exampleFiles,
    ...realFiles.filter((f) => !exampleBasenames.has(f.replace('.md', ''))),
  ]

  if (trackedFiles.length === 0) return 0

  let maxMtime = 0
  for (const file of trackedFiles) {
    const stat = fs.statSync(path.join(contentDir, file))
    if (stat.mtimeMs > maxMtime) {
      maxMtime = stat.mtimeMs
    }
  }
  return maxMtime
}

export function readCache(): CacheEntry | null {
  try {
    if (!fs.existsSync(cacheFile)) return null
    const raw = fs.readFileSync(cacheFile, 'utf-8')
    return JSON.parse(raw) as CacheEntry
  } catch {
    return null
  }
}

export function writeCache(resume: EnhancedResume): void {
  try {
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true })
    }
    const entry: CacheEntry = {
      contentMtime: getMaxContentMtime(),
      generatedAt: new Date().toISOString(),
      resume,
    }
    fs.writeFileSync(cacheFile, JSON.stringify(entry, null, 2), 'utf-8')
  } catch {
    console.warn('Failed to write resume cache')
  }
}

export function isCacheValid(cached: CacheEntry): boolean {
  return cached.contentMtime === getMaxContentMtime()
}

export function getCachedResume(): EnhancedResume | null {
  const cached = readCache()
  if (cached && isCacheValid(cached)) {
    return cached.resume
  }
  return null
}
