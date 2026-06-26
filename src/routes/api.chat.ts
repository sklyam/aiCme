import { createFileRoute } from '@tanstack/react-router'
import { toServerSentEventsResponse } from '@tanstack/ai'
import type { StreamChunk } from '@tanstack/ai'
import { createChatStream } from '../server/llm'
import { buildChatSystemPrompt } from '../server/prompts'
import { getProfileName, isQuestionInScope } from '../lib/content'

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json()
        const { messages } = body
        const lastMessage = messages[messages.length - 1]?.content ?? ''
        const name = getProfileName()

        if (!isQuestionInScope(lastMessage)) {
          const text = `I can only answer questions about ${name}'s profile.`
          const id = crypto.randomUUID()
          const fakeStream = (async function* (): AsyncGenerator<StreamChunk> {
            yield { type: 'run_started', threadId: id, runId: id } as StreamChunk
            yield { type: 'text_message_start', messageId: id } as StreamChunk
            yield { type: 'text_message_content', messageId: id, delta: text } as StreamChunk
            yield { type: 'text_message_end', messageId: id } as StreamChunk
            yield { type: 'run_finished', threadId: id, runId: id } as StreamChunk
          })()
          return toServerSentEventsResponse(fakeStream)
        }

        const abortController = new AbortController()
        const systemPrompt = buildChatSystemPrompt()
        const stream = createChatStream({
          messages,
          systemPrompt,
        })

        return toServerSentEventsResponse(stream, { abortController })
      },
    },
  },
})
