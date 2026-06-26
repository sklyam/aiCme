import { chat } from '@tanstack/ai'
import { openaiText } from '@tanstack/ai-openai'
import { anthropicText } from '@tanstack/ai-anthropic'
import { geminiText } from '@tanstack/ai-gemini'
import { ollamaText } from '@tanstack/ai-ollama'
import { config } from '../lib/config'

type Provider = 'openai' | 'anthropic' | 'gemini' | 'ollama'

function getAdapter(provider?: Provider) {
  const p = provider ?? config.provider
  switch (p) {
    case 'openai':
      return openaiText(config.model.openai as Parameters<typeof openaiText>[0])
    case 'anthropic':
      return anthropicText(config.model.anthropic as Parameters<typeof anthropicText>[0])
    case 'gemini':
      return geminiText(config.model.gemini as Parameters<typeof geminiText>[0])
    case 'ollama':
      return ollamaText(config.model.ollama as Parameters<typeof ollamaText>[0])
  }
}

export function createChatStream({
  messages,
  systemPrompt,
  provider,
  abortController,
}: {
  messages: Array<{ role: string; content: string }>
  systemPrompt?: string
  provider?: Provider
  abortController?: AbortController
}) {
  const adapter = getAdapter(provider)
  const systemPrompts = systemPrompt ? [systemPrompt] : []

  return chat({
    adapter,
    messages: messages as Array<{ role: 'user' | 'assistant'; content: string }>,
    systemPrompts,
    abortController,
    modelOptions: { temperature: 0.7 },
  })
}

export function createEnhancementStream({
  systemPrompt,
  userPrompt,
}: {
  systemPrompt: string
  userPrompt: string
}) {
  return createChatStream({
    messages: [{ role: 'user', content: userPrompt }],
    systemPrompt,
  })
}
