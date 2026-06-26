import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export interface ContentFile {
  slug: string
  frontmatter: Record<string, unknown>
  body: string
}

const contentDir = path.resolve(process.cwd(), 'content')

function parseFiles(files: string[]): ContentFile[] {
  return files
    .map((fullPath) => {
      const rel = path.relative(contentDir, fullPath)
      const slug = rel.replace(/\.example\.md$/, '').replace(/\.md$/, '').replace(/\\/g, '/')
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

export function getContentForResume(): ContentFile[] {
  if (!fs.existsSync(contentDir)) return []

  const allFiles = fs.readdirSync(contentDir)
  const exampleFiles = allFiles.filter((f) => f.endsWith('.example.md'))
  const realFiles = allFiles.filter((f) => f.endsWith('.md') && !f.endsWith('.example.md'))

  const exampleBasenames = new Set(exampleFiles.map((f) => f.replace('.example.md', '')))
  const fallbackFiles = realFiles.filter((f) => !exampleBasenames.has(f.replace('.md', '')))

  return parseFiles(
    [...exampleFiles, ...fallbackFiles].map((f) => path.join(contentDir, f)),
  )
}

export function getContentForChat(): ContentFile[] {
  if (!fs.existsSync(contentDir)) return []
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.md') && !f.endsWith('.example.md'))
  return parseFiles(files.map((f) => path.join(contentDir, f)))
}

export function getAllContent(): ContentFile[] {
  return getContentForChat()
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
