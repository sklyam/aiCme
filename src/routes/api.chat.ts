import { createFileRoute } from '@tanstack/react-router'
import { EventType, toServerSentEventsResponse, type StreamChunk } from '@tanstack/ai'
import { createChatStream } from '../server/llm'
import { buildChatSystemPrompt } from '../server/prompts'
import { getProfileName } from '../lib/content'
import { getProfileOnlyReply, isClearlyOffTopicProfileQuestion } from '../server/topic-gate'

async function* staticChatStream(text: string): AsyncIterable<StreamChunk> {
  const runId = crypto.randomUUID()
  const msgId = crypto.randomUUID()

  yield { type: EventType.RUN_STARTED, threadId: runId, runId, timestamp: Date.now() }
  yield { type: EventType.TEXT_MESSAGE_START, messageId: msgId, role: 'assistant', timestamp: Date.now() }
  yield { type: EventType.TEXT_MESSAGE_CONTENT, messageId: msgId, delta: text, timestamp: Date.now() }
  yield { type: EventType.TEXT_MESSAGE_END, messageId: msgId, timestamp: Date.now() }
  yield {
    type: EventType.RUN_FINISHED,
    threadId: runId,
    runId,
    finishReason: 'stop',
    timestamp: Date.now(),
  }
}

function convertMessages(msgs: unknown[]): Array<{ role: 'user' | 'assistant'; content: string }> {
  return msgs.flatMap((msg: any) => {
    const role = msg.role === 'user' ? 'user' : 'assistant'
    if (msg.parts) {
      const text = msg.parts
        .filter((p: any) => p.type === 'text')
        .map((p: any) => p.content)
        .join('')
      return text.trim() ? [{ role, content: text }] : []
    }
    const content = typeof msg.content === 'string' ? msg.content : ''
    return content.trim() ? [{ role, content }] : []
  })
}

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const abortController = new AbortController()

        try {
          const body = await request.json().catch(() => ({} as Record<string, unknown>))
          const modelMessages = convertMessages((body as any).messages ?? [])

          if (modelMessages.length === 0 || !modelMessages[modelMessages.length - 1]?.content?.trim()) {
            return toServerSentEventsResponse(staticChatStream('Please ask a question about my profile.'), {
              abortController,
            })
          }

          const latestQuestion = modelMessages[modelMessages.length - 1].content
          if (isClearlyOffTopicProfileQuestion(latestQuestion)) {
            return toServerSentEventsResponse(staticChatStream(getProfileOnlyReply(getProfileName())), {
              abortController,
            })
          }

          const systemPrompt = buildChatSystemPrompt()
          const chatStream = createChatStream({
            messages: modelMessages,
            systemPrompt,
            abortController,
          })

          return toServerSentEventsResponse(chatStream, { abortController })
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          return toServerSentEventsResponse(staticChatStream(`Error: ${message}`), {
            abortController,
          })
        }
      },
    },
  },
})
