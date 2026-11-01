import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { AskUnavailable, streamAsk, type Turn } from '../lib/askClient'
import { answerLocally } from '../lib/retrieve'
import { profile } from '../content/profile'

const SUGGESTIONS = [
  'What has Aditya built with LiveKit?',
  'How does Resume Studio keep LLM output reliable?',
  'What has Aditya done in e-commerce?',
]

interface Message {
  id: number
  question: string
  answer: string
  sources: { title: string; href: string }[]
  status: 'streaming' | 'done' | 'stopped'
  note?: string
  mode: 'ai' | 'search'
}

const MAX_QUESTION = 500

/** AI answers are opt-in. Until this is set at build time, Ask is a plain search of the site. */
const aiEnabled = () => import.meta.env.VITE_ASK_AI === 'true'

const SourceLink = ({ source }: { source: Message['sources'][number] }) =>
  source.href.startsWith('http') ? (
    <a href={source.href} target="_blank" rel="noreferrer" className="link">{source.title}</a>
  ) : (
    <Link to={source.href} className="link">{source.title}</Link>
  )

export const AskPanel = ({ compact = false }: { compact?: boolean }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(1)
  const inputId = useId()

  useEffect(() => () => abortRef.current?.abort(), [])

  useEffect(() => {
    const log = logRef.current
    if (log && compact) log.scrollTop = log.scrollHeight
  }, [messages, compact])

  const update = (id: number, change: (message: Message) => Message) =>
    setMessages((current) => current.map((message) => (message.id === id ? change(message) : message)))

  const fallback = (id: number, question: string, reason?: string) => {
    const local = answerLocally(question)
    update(id, (message) => ({
      ...message,
      mode: 'search',
      status: 'done',
      answer: local?.text ?? `I could not find that on this site. You can email ${profile.email}.`,
      sources: local?.sources ?? [],
      note: reason,
    }))
  }

  const ask = async (raw: string) => {
    const question = raw.trim()
    if (!question || busy) return
    const id = nextId.current++
    const history: Turn[] = messages
      .filter((m) => m.status === 'done' && m.mode === 'ai' && m.answer)
      .slice(-3)
      .flatMap((m) => [
        { role: 'user' as const, text: m.question.slice(0, 1500) },
        { role: 'assistant' as const, text: m.answer.slice(0, 1500) },
      ])
    setMessages((current) => [...current, { id, question, answer: '', sources: [], status: 'streaming', mode: 'ai' }])
    setDraft('')
    if (!aiEnabled()) {
      fallback(id, question)
      return
    }
    setBusy(true)
    const controller = new AbortController()
    abortRef.current = controller
    try {
      for await (const event of streamAsk(question, history, controller.signal)) {
        if (event.type === 'text') {
          update(id, (m) => ({ ...m, answer: m.answer + event.text }))
        } else if (event.type === 'source') {
          update(id, (m) => ({ ...m, sources: [...m.sources, { title: event.title, href: event.href }] }))
        } else if (event.type === 'done') {
          update(id, (m) => ({ ...m, status: 'done', note: event.truncated ? 'This answer was cut off at the length limit.' : undefined }))
        } else if (event.type === 'error') {
          fallback(id, question, 'The AI answer failed, so this comes from a search of the site.')
        }
      }
    } catch (error) {
      if (controller.signal.aborted) {
        update(id, (m) => ({ ...m, status: 'stopped', note: 'Stopped.' }))
      } else if (error instanceof AskUnavailable && error.code === 'rate_limited') {
        fallback(id, question, 'You have reached the hourly limit for AI answers, so this comes from a search of the site.')
      } else {
        fallback(id, question, 'AI answers are unavailable right now, so this comes from a search of the site.')
      }
    } finally {
      setBusy(false)
      abortRef.current = null
    }
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    void ask(draft)
  }

  return (
    <div className={compact ? 'flex h-full min-h-0 flex-col' : ''}>
      <div ref={logRef} role="log" aria-live="polite" aria-label="Answers" className={compact ? 'min-h-0 flex-1 overflow-y-auto p-4' : ''}>
        {messages.length === 0 && (
          <div className={compact ? '' : 'mb-5'}>
            <p className="eyebrow mb-2">Try asking</p>
            <ul className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <li key={suggestion}>
                  <button
                    type="button"
                    onClick={() => void ask(suggestion)}
                    className="rounded-full border border-line px-3 py-1.5 text-left text-sm transition-colors hover:border-accent hover:text-accent"
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="space-y-6">
          {messages.map((message) => (
            <article key={message.id} className={compact ? '' : 'last:mb-6'} aria-busy={message.status === 'streaming'}>
              <p className="font-medium">{message.question}</p>
              <div className="mt-2 border-l-2 border-accent pl-3 text-[0.95rem] leading-relaxed">
                <p className="whitespace-pre-line">
                  {message.answer}
                  {message.status === 'streaming' && <span aria-hidden="true" className="caret ml-0.5 inline-block h-[1em] w-[0.5ch] translate-y-[0.15em] bg-accent" />}
                  {message.status === 'streaming' && !message.answer && <span className="sr-only">Finding an answer</span>}
                </p>
                {message.sources.length > 0 && (
                  <p className="mt-2 text-sm text-muted">
                    Sources:{' '}
                    {message.sources.map((source, index) => (
                      <span key={source.title}>
                        {index > 0 && ', '}
                        <SourceLink source={source} />
                      </span>
                    ))}
                  </p>
                )}
                {message.note && <p className="mt-2 text-sm text-muted">{message.note}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
      <form onSubmit={submit} className={compact ? 'shrink-0 border-t border-line p-3' : ''}>
        <label htmlFor={inputId} className="sr-only">Ask about Aditya's work</label>
        <div className="flex gap-2">
          <input
            id={inputId}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={MAX_QUESTION}
            autoComplete="off"
            placeholder="Ask about a project, skill or role"
            className="min-w-0 flex-1 rounded-md border border-line bg-paper px-3 py-2 text-[0.95rem] placeholder:text-muted focus-visible:border-accent"
          />
          {busy ? (
            <button type="button" onClick={() => abortRef.current?.abort()} className="rounded-md border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-accent">Stop</button>
          ) : (
            <button type="submit" disabled={!draft.trim()} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:opacity-40">Ask</button>
          )}
        </div>
        <p className="mt-2 text-xs text-muted">{aiEnabled() ? "AI answers use only this site's content and can be wrong, so check the linked sources." : 'Answers are matched from this site’s content, with links to the sources.'}</p>
      </form>
    </div>
  )
}
