import { createServerFn } from '@tanstack/react-start'
import { getAllContentAsString, getProfile } from '../lib/content'
import { createEnhancementStream } from './llm'
import {
  RESUME_ENHANCEMENT_SYSTEM_PROMPT,
  RESUME_ENHANCEMENT_USER_PROMPT,
} from './prompts'

async function collectStreamToString(
  streamResult: Awaited<ReturnType<typeof createEnhancementStream>>,
): Promise<string> {
  let result = ''
  for await (const chunk of streamResult) {
    if (chunk.type === 'TEXT_MESSAGE_CONTENT') {
      result += chunk.delta
    }
  }
  return result
}

export interface EnhancedResume {
  name: string
  title: string
  headline: string
  bio: string
  contact: {
    email: string
    location: string
    social: { github: string; linkedin: string; website: string }
  }
  sections: Array<{
    type: string
    title: string
    items: Array<{
      title: string
      subtitle: string
      date: string
      description: string
      highlights: string[]
      tags: string[]
      links: Array<{ label: string; url: string }>
    }>
  }>
}

async function fallbackResume(): Promise<EnhancedResume> {
  const profile = getProfile()
  const fm = profile?.frontmatter ?? {}

  return {
    name: String(fm.name ?? 'Your Name'),
    title: String(fm.title ?? ''),
    headline: '',
    bio: profile?.body ?? '',
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
}

export const enhanceResume = createServerFn({ method: 'GET' }).handler(
  async (): Promise<EnhancedResume> => {
    try {
      const content = getAllContentAsString()
      if (!content) {
        return fallbackResume()
      }

      const stream = createEnhancementStream({
        systemPrompt: RESUME_ENHANCEMENT_SYSTEM_PROMPT,
        userPrompt: RESUME_ENHANCEMENT_USER_PROMPT + content,
      })

      const raw = await collectStreamToString(stream)
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as EnhancedResume
      }

      return fallbackResume()
    } catch {
      return fallbackResume()
    }
  },
)
