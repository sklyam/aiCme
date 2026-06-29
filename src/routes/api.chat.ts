import { createFileRoute } from '@tanstack/react-router'
import { EventType, toServerSentEventsResponse, type StreamChunk } from '@tanstack/ai'
import { createChatStream } from '../server/llm'
import { buildChatSystemPrompt } from '../server/prompts'
import { getProfileName } from '../lib/content'
import { getProfileOnlyReply, isClearlyOffTopicProfileQuestion } from '../server/topic-gate'

async function* chunkWords(text: string, messageId: string, timestamp: number): AsyncIterable<StreamChunk> {
  const words = text.split(/(?<=\s)/)
  if (words.length <= 3) {
    yield { type: EventType.TEXT_MESSAGE_CONTENT, messageId, delta: text, timestamp }
    return
  }
  for (let i = 0; i < words.length; i += 2) {
    const group = words.slice(i, i + 2).join('')
    yield { type: EventType.TEXT_MESSAGE_CONTENT, messageId, delta: group, timestamp }
    await new Promise(r => setTimeout(r, 12))
  }
}

async function* smoothStream(stream: AsyncIterable<StreamChunk>): AsyncIterable<StreamChunk> {
  for await (const chunk of stream) {
    if (chunk.type !== EventType.TEXT_MESSAGE_CONTENT || !chunk.delta || chunk.delta.length <= 20) {
      yield chunk
      continue
    }
    yield* chunkWords(chunk.delta, chunk.messageId, chunk.timestamp)
  }
}

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
          const chatStream = smoothStream(createChatStream({
            messages: modelMessages,
            systemPrompt,
            abortController,
          }))

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
