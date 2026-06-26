import { getContentForResume } from './content'
import type { EnhancedResume } from '../server/enhance-resume'

function splitByH2(body: string): Array<{ heading: string; rest: string }> {
  const parts = body.split(/(?=^## )/m)
  return parts
    .map((p) => {
      const m = p.match(/^## (.+)\n?([\s\S]*)$/)
      return m ? { heading: m[1].trim(), rest: m[2].trim() } : null
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
}

function splitByH3(body: string): Array<{ heading: string; rest: string }> {
  const parts = body.split(/(?=^### )/m)
  return parts
    .map((p) => {
      const m = p.match(/^### (.+)\n?([\s\S]*)$/)
      return m ? { heading: m[1].trim(), rest: m[2].trim() } : null
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
}

function parseItemTitle(line: string): { title: string; subtitle: string; date: string } {
  const parts = line.split('|').map((s) => s.trim())
  return {
    title: parts[0] || line,
    subtitle: parts[1] || '',
    date: parts[2] || '',
  }
}

function parseHighlights(body: string): string[] {
  return body
    .split('\n')
    .filter((l) => l.match(/^-\s+/))
    .map((l) => l.replace(/^-\s+/, '').trim())
}

function parseTags(body: string): string[] {
  const m = body.match(/\*\*Stack\*\*:\s*(.+)/i)
  if (m) return m[1].split(',').map((s) => s.trim())
  const lines = body.split('\n').filter((l) => l.trim() && !l.match(/^-\s+/) && !l.startsWith('#'))
  const tagLines = lines.filter(
    (l) => l.includes(':') && !l.startsWith('[') && !l.startsWith('!'),
  )
  if (tagLines.length > 0) {
    const last = tagLines[tagLines.length - 1]
    const val = last.split(':').slice(1).join(':').trim()
    return val ? val.split(',').map((s) => s.trim()) : []
  }
  return []
}

function parseLinks(body: string): Array<{ label: string; url: string }> {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const links: Array<{ label: string; url: string }> = []
  const m = body.match(/\*\*Links?\*\*:\s*(.+)/i)
  if (m) {
    let match
    const temp = m[1]
    while ((match = linkRegex.exec(temp)) !== null) {
      links.push({ label: match[1], url: match[2] })
    }
  }
  return links
}

function parseDescription(body: string): string {
  return body
    .split('\n')
    .filter((l) => l.trim() && !l.match(/^-\s+/) && !l.match(/^\*\*/) && !l.startsWith('#'))
    .map((l) => l.replace(/^\[([^\]]+)\]\([^)]+\)\s*/, '').trim())
    .filter(Boolean)
    .join(' ')
    .trim()
}

function parseSectionFromContent(heading: string, rest: string) {
  const items = splitByH3(rest)
  if (items.length > 0) {
    return {
      type: heading.toLowerCase().replace(/\s+/g, '-'),
      title: heading,
      items: items.map((item) => {
        const parsed = parseItemTitle(item.heading)
        const highlights = parseHighlights(item.rest)
        const tags = parseTags(item.rest)
        const links = parseLinks(item.rest)
        const description = parseDescription(item.rest) || item.rest.slice(0, 200)
        return {
          title: parsed.title,
          subtitle: parsed.subtitle,
          date: parsed.date,
          description,
          highlights,
          tags,
          links,
        }
      }),
    }
  }

  const highlights = parseHighlights(rest)
  const tags = parseTags(rest)
  const links = parseLinks(rest)
  const description = parseDescription(rest)

  if (highlights.length > 0) {
    return {
      type: heading.toLowerCase().replace(/\s+/g, '-'),
      title: heading,
      items: [
        {
          title: heading,
          subtitle: '',
          date: '',
          description,
          highlights,
          tags,
          links,
        },
      ],
    }
  }

  const tagList = tags.length > 0 ? tags : rest.split(',').map((s) => s.trim()).filter(Boolean)

  return {
    type: heading.toLowerCase().replace(/\s+/g, '-'),
    title: heading,
    items: [
      {
        title: heading,
        subtitle: '',
        date: '',
        description,
        highlights: [],
        tags: tagList,
        links,
      },
    ],
  }
}

export function parseResumeFromMd(): EnhancedResume {
  const files = getContentForResume()

  const sectionSlugs = new Set(['education', 'experience', 'projects'])
  const profileFile = files.find((f) => f.slug === 'profile')
  const sectionFiles = files.filter(
    (f) => f.slug !== 'profile' && f.slug !== 'prompt' && !sectionSlugs.has(f.slug),
  )

  const fm = profileFile?.frontmatter ?? {}

  const resume: EnhancedResume = {
    name: String(fm.name ?? 'Your Name'),
    title: String(fm.title ?? ''),
    headline: '',
    bio: profileFile?.body ?? '',
    contact: {
      email: String(fm.email ?? ''),
      location: String(fm.location ?? ''),
      social: {
        github: String((fm.social as Record<string, string>)?.github ?? ''),
        linkedin: String((fm.social as Record<string, string>)?.linkedin ?? ''),
        website: String((fm.social as Record<string, string>)?.website ?? ''),
      },
    },
    sections: [],
  }

  for (const file of sectionFiles) {
    const h2Blocks = splitByH2(file.body)
    if (h2Blocks.length > 0) {
      for (const block of h2Blocks) {
        const section = parseSectionFromContent(block.heading, block.rest)
        if (section) resume.sections.push(section)
      }
    } else if (file.body.trim()) {
      const highlights = parseHighlights(file.body)
      const tags = parseTags(file.body)
      resume.sections.push({
        type: file.slug,
        title: file.slug.charAt(0).toUpperCase() + file.slug.slice(1),
        items: [
          {
            title: file.slug.charAt(0).toUpperCase() + file.slug.slice(1),
            subtitle: '',
            date: '',
            description: file.body.slice(0, 300),
            highlights,
            tags: tags.length > 0 ? tags : [],
            links: [],
          },
        ],
      })
    }
  }

  return resume
}
