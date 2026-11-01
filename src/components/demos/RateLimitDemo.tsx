import { useRef, useState } from 'react'

const LIMIT = 10

export const RateLimitDemo = () => {
  const [count, setCount] = useState(0)
  const [log, setLog] = useState<{ id: number; status: number }[]>([])
  const nextId = useRef(1)
  const remaining = Math.max(LIMIT - count, 0)

  const send = () => {
    const attempt = count + 1
    setCount(attempt)
    setLog((current) => [{ id: nextId.current++, status: attempt > LIMIT ? 429 : 201 }, ...current].slice(0, 5))
  }

  return (
    <div className="grid gap-5 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
      <div>
        <button type="button" onClick={send} className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:opacity-90">Create a post</button>
        <button type="button" onClick={() => { setCount(0); setLog([]) }} className="link mt-2 text-sm text-muted">Reset</button>
        <p className="mt-3 font-mono text-xs text-muted" aria-live="polite">RateLimit-Remaining: {remaining}</p>
        <div aria-hidden="true" className="mt-2 grid grid-cols-10 gap-0.5">
          {Array.from({ length: LIMIT }, (_, index) => <span key={index} className={`h-2 ${index < remaining ? 'bg-accent' : 'bg-line'}`} />)}
        </div>
      </div>
      <ol className="min-h-32 space-y-1 font-mono text-xs" aria-label="Responses, newest first">
        {log.length === 0 && <li className="text-muted">No requests yet. Keep clicking until the limiter answers.</li>}
        {log.map((entry) => (
          <li key={entry.id} className={entry.status === 429 ? 'text-[#c2410c]' : ''}>
            POST /posts → {entry.status} {entry.status === 429 ? 'RATE_LIMIT_EXCEEDED' : 'Created'}
          </li>
        ))}
      </ol>
      <p className="text-xs text-muted sm:col-span-2">A simulation in your browser, using the limit configured in the real API: 10 requests per hour, per IP.</p>
    </div>
  )
}
