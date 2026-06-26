import { createFileRoute } from '@tanstack/react-router'
import { toServerSentEventsResponse } from '@tanstack/ai'
import type { StreamChunk } from '@tanstack/ai'
import { createChatStream } from '../server/llm'
import { buildChatSystemPrompt } from '../server/prompts'
import { getProfileName, isQuestionInScope } from '../lib/content'

function makeStream(text: string): AsyncGenerator<StreamChunk> {
  const id = crypto.randomUUID()
  return (async function* () {
    yield { type: 'run_started', threadId: id, runId: id } as StreamChunk
    yield { type: 'text_message_start', messageId: id } as StreamChunk
    yield { type: 'text_message_content', messageId: id, delta: text } as StreamChunk
    yield { type: 'text_message_end', messageId: id } as StreamChunk
    yield { type: 'run_finished', threadId: id, runId: id } as StreamChunk
  })()
}

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const { messages } = body
          const lastMessage = messages[messages.length - 1]?.content ?? ''
          const name = getProfileName()

          if (!isQuestionInScope(lastMessage)) {
            return toServerSentEventsResponse(
              makeStream(`I can only answer questions about ${name}'s profile.`),
            )
          }

          const abortController = new AbortController()
          const systemPrompt = buildChatSystemPrompt()
          const stream = createChatStream({
            messages,
            systemPrompt,
          })

          return toServerSentEventsResponse(stream, { abortController })
        } catch (err) {
          console.error('[chat error]', err)
          const msg =
            err instanceof Error
              ? `Chat unavailable: ${err.message}. Please check your API key and provider configuration.`
              : 'Chat unavailable due to an internal error.'
          return toServerSentEventsResponse(makeStream(msg))
        }
      },
    },
  },
})
