import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export interface ContentFile {
  slug: string
  frontmatter: Record<string, unknown>
  body: string
}

const contentDir = path.resolve(process.cwd(), 'content')

function collectMdFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectMdFiles(full))
    } else if (entry.name.endsWith('.md') && !entry.name.endsWith('.example.md')) {
      files.push(full)
    }
  }
  return files
}

export function getAllContent(): ContentFile[] {
  if (!fs.existsSync(contentDir)) {
    return []
  }

  return collectMdFiles(contentDir)
    .map((fullPath) => {
      const rel = path.relative(contentDir, fullPath)
      const slug = rel.replace(/\.md$/, '').replace(/\\/g, '/')
      const raw = fs.readFileSync(fullPath, 'utf-8')
      const parsed = matter(raw)
      return { slug, frontmatter: parsed.data as Record<string, unknown>, body: parsed.content }
    })
    .sort((a, b) => {
      if (a.slug === 'profile' || a.slug.endsWith('/profile')) return -1
      if (b.slug === 'profile' || b.slug.endsWith('/profile')) return 1
      if (a.slug === 'prompt' || a.slug.endsWith('/prompt')) return 1
      if (b.slug === 'prompt' || b.slug.endsWith('/prompt')) return -1
      return 0
    })
}

export function getContentBySlug(slug: string): ContentFile | undefined {
  return getAllContent().find((c) => c.slug === slug)
}

export function getProfile(): ContentFile | undefined {
  return getContentBySlug('profile')
}

export function getCustomPrompt(): string | undefined {
  const file = getContentBySlug('prompt')
  return file?.body.trim()
}

export function getAllContentAsString(): string {
  return getAllContent()
    .filter((c) => c.slug !== 'prompt')
    .map((c) => `=== ${c.slug} ===\n${c.body}`)
    .join('\n\n')
}

export function getAllowedTopics(): string[] {
  return ['About Me', 'Projects', 'Skills', 'Experience']
}

const allowedKeywords = [
  'you',
  'your',
  'work',
  'project',
  'skill',
  'experience',
  'background',
  'resume',
  'about',
  'built',
  'tech',
  'company',
  'role',
  'education',
  'school',
  'degree',
  'bio',
  'career',
  'job',
  'team',
  'technology',
  'stack',
  'tool',
  'framework',
  'language',
  'hobby',
  'interest',
  'goal',
  'achievement',
  'accomplishment',
]

export function isQuestionInScope(question: string): boolean {
  const lower = question.toLowerCase()
  return allowedKeywords.some((keyword) => lower.includes(keyword))
}

export function getProfileName(): string {
  const profile = getProfile()
  if (profile?.frontmatter?.name) {
    return String(profile.frontmatter.name)
  }
  return 'the user'
}
