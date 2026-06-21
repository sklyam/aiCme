import { chat } from '@tanstack/ai'
import { openaiText } from '@tanstack/ai-openai'
import { anthropicText } from '@tanstack/ai-anthropic'
import { geminiText } from '@tanstack/ai-gemini'
import { ollamaText } from '@tanstack/ai-ollama'
import type { TextAdapter, TextStreamResult } from '@tanstack/ai/adapters'
import { config } from '../lib/config'

type Provider = 'openai' | 'anthropic' | 'gemini' | 'ollama'

function getAdapter(provider?: Provider): TextAdapter {
  const p = provider ?? config.provider
  switch (p) {
    case 'openai':
      return openaiText(config.model.openai)
    case 'anthropic':
      return anthropicText(config.model.anthropic)
    case 'gemini':
      return geminiText(config.model.gemini)
    case 'ollama':
      return ollamaText(config.model.ollama)
  }
}

export function createChatStream({
  messages,
  systemPrompt,
  provider,
}: {
  messages: Array<{ role: string; content: string }>
  systemPrompt?: string
  provider?: Provider
}): TextStreamResult {
  const adapter = getAdapter(provider)
  const systemPrompts = systemPrompt ? [systemPrompt] : []

  return chat({
    adapter,
    messages: messages as Array<{ role: 'user' | 'assistant'; content: string }>,
    systemPrompts,
    modelOptions: { temperature: 0.7 },
  })
}

export function createEnhancementStream({
  systemPrompt,
  userPrompt,
}: {
  systemPrompt: string
  userPrompt: string
}): TextStreamResult {
  return createChatStream({
    messages: [{ role: 'user', content: userPrompt }],
    systemPrompt,
    provider: 'openai',
  })
}
