export type AskEvent =
  | { type: 'text'; text: string }
  | { type: 'source'; title: string; href: string }
  | { type: 'done'; truncated: boolean }
  | { type: 'error'; code: string }

export interface Turn {
  role: 'user' | 'assistant'
  text: string
}

export class AskUnavailable extends Error {
  constructor(public code: string) {
    super(code)
  }
}

export async function* streamAsk(question: string, history: Turn[], signal: AbortSignal): AsyncGenerator<AskEvent> {
  const response = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, history }),
    signal,
  })
  const contentType = response.headers.get('content-type') ?? ''
  if (!response.ok || !response.body || !contentType.includes('ndjson')) {
    const body = (await response.json().catch(() => ({}))) as { error?: string }
    throw new AskUnavailable(body.error ?? `http_${response.status}`)
  }
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
  let buffer = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) return
    buffer += value
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) if (line.trim()) yield JSON.parse(line) as AskEvent
  }
}
