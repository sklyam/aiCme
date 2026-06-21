import { createFileRoute } from '@tanstack/react-router'
import { toServerSentEventsResponse } from '@tanstack/ai'
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
          return new Response(
            `I can only answer questions about ${name}'s profile.`,
            {
              headers: { 'Content-Type': 'text/plain' },
            },
          )
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
