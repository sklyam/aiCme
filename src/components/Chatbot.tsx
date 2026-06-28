import { useState, useRef, useEffect } from 'react'
import { useChat, fetchServerSentEvents } from '@tanstack/ai-react'
import { Send, Bot, User, Square } from 'lucide-react'
import type { UIMessage } from '@tanstack/ai-react'

export function Chatbot({ name }: { name: string }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, isLoading, stop, error } = useChat({
    connection: fetchServerSentEvents('/api/chat'),
    onFinish: (msg) => {
      console.log('[chat] onFinish:', msg)
      setInput('')
    },
    onError: (err) => {
      console.error('[chat] onError:', err)
    },
    onChunk: (chunk) => {
      console.log('[chat] onChunk:', chunk.type)
    },
  })

  console.log('[chat] render messages:', messages.length, 'isLoading:', isLoading, 'error:', error)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return
    sendMessage(input.trim())
    setInput('')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-2xl mx-auto border border-[var(--color-primary)]/10 rounded-xl bg-[var(--color-surface)] shadow-sm">
      <div className="p-4 border-b border-[var(--color-primary)]/10">
        <h2 className="font-semibold text-[var(--color-text)] flex items-center gap-2">
          <Bot size={20} className="text-[var(--color-primary)]" />
          Ask about {name}
        </h2>
        <p className="text-xs text-[var(--color-text)]/50 mt-0.5">
          I can answer questions about experience, projects, skills, and background
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 text-[var(--color-text)]/40">
            <Bot size={40} className="mx-auto mb-3" />
            <p className="text-sm">Ask me anything about my profile!</p>
          </div>
        )}

        {messages.map((message: UIMessage) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-[var(--color-primary)]" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                message.role === 'user'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-primary)]/5 text-[var(--color-text)]'
              }`}
            >
              {message.parts.map((part, i) => {
                if (part.type === 'text') {
                  const isStreaming = isLoading && message.role === 'assistant' && i === message.parts.length - 1
                  return (
                    <p key={i}>
                      {part.content}
                      {isStreaming && <span className="animate-pulse">▊</span>}
                    </p>
                  )
                }
                if (part.type === 'thinking') {
                  return (
                    <details key={i} className="text-xs text-[var(--color-text)]/50">
                      <summary>Thought process</summary>
                      <pre className="mt-1 whitespace-pre-wrap">{part.content}</pre>
                    </details>
                  )
                }
                return null
              })}
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center shrink-0">
                <User size={16} className="text-[var(--color-accent)]" />
              </div>
            )}
          </div>
        ))}

        {error && (
          <div className="mx-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-600 dark:text-red-400">
            <div className="flex items-start gap-2">
              <span className="shrink-0 mt-0.5">⚠️</span>
              <div className="flex-1">
                <p className="font-medium">Connection Error</p>
                <p className="mt-0.5 text-red-500/80 dark:text-red-400/80">
                  {error.message.includes('401') || error.message.includes('unauthorized')
                    ? 'The chat service is not configured yet. Please check your API key.'
                    : error.message.includes('Failed to fetch')
                      ? 'Could not reach the chat server. Is the dev server running?'
                      : error.message}
                </p>
                <p className="mt-1.5 text-xs text-red-400/60">
                  Try sending your message again when the issue is resolved.
                </p>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-[var(--color-primary)]/10">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            placeholder="Ask about my experience, projects..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-primary)]/20 bg-transparent text-[var(--color-text)] placeholder-[var(--color-text)]/30 focus:outline-none focus:border-[var(--color-primary)] transition-colors text-sm"
          />
          {isLoading ? (
            <button
              onClick={stop}
              className="px-3 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
            >
              <Square size={18} fill="currentColor" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="px-3 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity disabled:opacity-30"
            >
              <Send size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
