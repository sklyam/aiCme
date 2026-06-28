import { useState, useRef, useEffect } from 'react'
import { useChat, fetchServerSentEvents } from '@tanstack/ai-react'
import { Send, Square, Bot } from 'lucide-react'
import type { UIMessage } from '@tanstack/ai-react'

export function Chatbot({ name }: { name: string }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, isLoading, stop, error } = useChat({
    connection: fetchServerSentEvents('/api/chat'),
    onFinish: () => setInput(''),
    onError: () => {},
  })

  const hasMessages = messages.length > 0

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return
    sendMessage(input.trim())
    setInput('')
  }

  const inputBar = (
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
        placeholder={hasMessages ? 'Ask a follow-up...' : 'Ask about my experience, projects...'}
        disabled={isLoading}
        className="flex-1 px-4 py-2.5 rounded-full border border-[var(--color-hairline)] bg-transparent text-[var(--color-text)] placeholder-[var(--color-muted)]/50 focus:outline-none focus:border-[var(--color-primary)] transition-colors text-sm"
      />
      {isLoading ? (
        <button
          onClick={stop}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <Square size={14} fill="currentColor" />
        </button>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-primary)] text-white hover:opacity-80 transition-opacity disabled:opacity-20 shrink-0"
        >
          <Send size={14} />
        </button>
      )}
    </div>
  )

  // Pre-chat: centered welcome, no container
  if (!hasMessages) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] max-w-md mx-auto text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--color-surface)] flex items-center justify-center mb-6">
          <Bot size={24} className="text-[var(--color-primary)]" />
        </div>
        <h2 className="text-xl font-light text-[var(--color-text)] mb-2">
          Ask about {name}
        </h2>
        <p className="text-sm text-[var(--color-muted)] mb-8">
          Experience, projects, skills, and background
        </p>
        <div className="w-full max-w-sm">
          {inputBar}
        </div>
      </div>
    )
  }

  // Chat: bordered container for clear boundaries
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-2xl mx-auto border border-[var(--color-hairline)] rounded-lg">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-hairline)]">
        <Bot size={16} className="text-[var(--color-primary)]" />
        <span className="text-sm text-[var(--color-muted)]">{name}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
        {messages.map((message: UIMessage) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm leading-relaxed ${
                message.role === 'user'
                  ? 'border border-[var(--color-hairline)] text-[var(--color-text)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-text)]'
              }`}
            >
              {message.parts.map((part, i) => {
                if (part.type === 'text') {
                  const isStreaming = isLoading && message.role === 'assistant' && i === message.parts.length - 1
                  return (
                    <p key={i}>
                      {part.content}
                      {isStreaming && <span className="animate-pulse text-[var(--color-primary)]">▊</span>}
                    </p>
                  )
                }
                if (part.type === 'thinking') {
                  return (
                    <details key={i} className="text-xs text-[var(--color-muted)]">
                      <summary>Thought process</summary>
                      <pre className="mt-1 whitespace-pre-wrap">{part.content}</pre>
                    </details>
                  )
                }
                return null
              })}
            </div>
          </div>
        ))}

        {error && (
          <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-sm text-red-500/80">
            <p className="font-medium">Connection Error</p>
            <p className="mt-0.5">
              {error.message.includes('401') || error.message.includes('unauthorized')
                ? 'API key not configured.'
                : error.message.includes('Failed to fetch')
                  ? 'Could not reach the chat server.'
                  : error.message}
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 border-t border-[var(--color-hairline)]">
        {inputBar}
      </div>
    </div>
  )
}
