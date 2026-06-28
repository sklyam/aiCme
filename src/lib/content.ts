import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export interface ContentFile {
  slug: string
  frontmatter: Record<string, unknown>
  body: string
  source: 'example' | 'real'
}

const contentDir = path.resolve(process.cwd(), 'content')

function listMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return listMarkdownFiles(fullPath)
    return entry.isFile() && entry.name.endsWith('.md') ? [fullPath] : []
  })
}

function parseFiles(files: string[]): ContentFile[] {
  return files
    .map((fullPath) => {
      const rel = path.relative(contentDir, fullPath)
      const slug = rel.replace(/\.example\.md$/, '').replace(/\.md$/, '').replace(/\\/g, '/')
      const raw = fs.readFileSync(fullPath, 'utf-8')
      const parsed = matter(raw)
      return {
        slug,
        frontmatter: parsed.data as Record<string, unknown>,
        body: parsed.content,
        source: fullPath.endsWith('.example.md') ? 'example' : 'real',
      }
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

  const allFiles = fs.readdirSync(contentDir).map((file) => path.join(contentDir, file))
  const exampleFiles = allFiles.filter((f) => f.endsWith('.example.md'))
  const realFiles = allFiles.filter((f) => f.endsWith('.md') && !f.endsWith('.example.md'))

  const exampleBasenames = new Set(
    exampleFiles.map((f) => path.basename(f).replace('.example.md', '')),
  )
  const fallbackFiles = realFiles.filter(
    (f) => !exampleBasenames.has(path.basename(f).replace('.md', '')),
  )

  return parseFiles([...exampleFiles, ...fallbackFiles])
}

export function getContentForChat(): ContentFile[] {
  if (!fs.existsSync(contentDir)) return []
  const files = listMarkdownFiles(contentDir).filter((f) => !f.endsWith('.example.md'))
  return parseFiles(files)
}

export function getContentStatus() {
  const files = listMarkdownFiles(contentDir)
  const exampleFiles = files.filter((file) => file.endsWith('.example.md'))
  const realFiles = files.filter((file) => !file.endsWith('.example.md'))
  const selectedResumeFiles = getContentForResume()
  const selectedExampleSlugs = selectedResumeFiles
    .filter((file) => file.source === 'example')
    .map((file) => file.slug)
  const realSlugs = realFiles.map((file) =>
    path.relative(contentDir, file).replace(/\.md$/, '').replace(/\\/g, '/'),
  )

  return {
    mode: realFiles.length === 0 && exampleFiles.length > 0 ? 'demo' : 'custom',
    hasRealProfile: realSlugs.includes('profile'),
    hasExampleFiles: exampleFiles.length > 0,
    realSlugs,
    selectedExampleSlugs,
    warnings: [
      ...(realFiles.length === 0 && exampleFiles.length > 0
        ? ['Using example content only. This is demo mode, not production content.']
        : []),
      ...(!realSlugs.includes('profile')
        ? ['Missing content/profile.md. Chatbot profile identity will fall back to "the user".']
        : []),
      ...(selectedExampleSlugs.length > 0 && realFiles.length > 0
        ? [
            `Resume display still uses example content for: ${selectedExampleSlugs.join(', ')}.`,
          ]
        : []),
    ],
  }
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

export function getProfileName(): string {
  const profile = getProfile()
  if (profile?.frontmatter?.name) {
    return String(profile.frontmatter.name)
  }
  return 'the user'
}
