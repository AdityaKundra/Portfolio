// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { corpus } from '../src/content/corpus'
import { handleAsk, type AskDeps } from './ask'
import { MemoryStore } from './limits'

const events = [
  { type: 'content_block_delta', delta: { type: 'text_delta', text: 'Reduced fetch times ' } },
  { type: 'content_block_delta', delta: { type: 'citations_delta', citation: { type: 'char_location', document_index: 0 } } },
  { type: 'content_block_delta', delta: { type: 'citations_delta', citation: { type: 'char_location', document_index: 0 } } },
  { type: 'content_block_delta', delta: { type: 'text_delta', text: 'by 40%.' } },
]

const fakeClient = (stopReason = 'end_turn') => {
  const stream = vi.fn(() => ({
    async *[Symbol.asyncIterator]() {
      yield* events
    },
    finalMessage: async () => ({ stop_reason: stopReason, usage: { input_tokens: 100, output_tokens: 50, cache_read_input_tokens: 10, cache_creation_input_tokens: 0 } }),
  }))
  return { stream } as unknown as NonNullable<AskDeps['client']> & { stream: typeof stream }
}

const deps = (overrides: Partial<AskDeps> = {}): AskDeps => ({
  client: fakeClient(),
  store: new MemoryStore(),
  model: 'claude-opus-5-5',
  dailyTokenBudget: 1000,
  ...overrides,
})

const post = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('http://site.test/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', host: 'site.test', 'x-forwarded-for': '1.1.1.1', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })

const readEvents = async (response: Response) =>
  (await response.text())
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line) as { type: string; text?: string; title?: string; truncated?: boolean; code?: string })

describe('POST /api/ask', () => {
  it('streams text and de-duplicated sources', async () => {
    const response = await handleAsk(post({ question: 'What did he do at LEAD?' }), deps())
    expect(response.headers.get('content-type')).toContain('ndjson')
    const output = await readEvents(response)
    expect(output.filter((event) => event.type === 'text').map((event) => event.text).join('')).toBe('Reduced fetch times by 40%.')
    expect(output.filter((event) => event.type === 'source')).toEqual([{ type: 'source', title: corpus[0].title, href: corpus[0].href }])
    expect(output.at(-1)).toEqual({ type: 'done', truncated: false })
  })

  it('sends the corpus as cited documents, with history before the question', async () => {
    const client = fakeClient()
    await handleAsk(
      post({ question: 'And then?', history: [{ role: 'user', text: 'First?' }, { role: 'assistant', text: 'Answer.' }] }),
      deps({ client }),
    ).then((response) => response.text())
    const params = (client.stream.mock.calls[0] as unknown[])[0] as {
      model: string
      fallbacks: string
      output_config: { effort: string }
      messages: { role: string; content: { type: string; citations?: { enabled: boolean } }[] | string }[]
    }
    expect(params.model).toBe('claude-opus-5-5')
    expect(params.fallbacks).toBe('default')
    expect(params.output_config.effort).toBe('low')
    expect(params.messages.map((message) => message.role)).toEqual(['user', 'assistant', 'user'])
    const first = params.messages[0].content as { type: string; citations?: { enabled: boolean } }[]
    expect(first.filter((block) => block.type === 'document')).toHaveLength(corpus.length)
    expect(first.every((block) => block.type !== 'document' || block.citations?.enabled)).toBe(true)
    expect(params.messages[2].content).toBe('And then?')
  })

  it('omits the fallback parameter on Haiku', async () => {
    const client = fakeClient()
    await handleAsk(post({ question: 'Hi?' }), deps({ client, model: 'claude-haiku-5-5' })).then((response) => response.text())
    expect((client.stream.mock.calls[0] as unknown[])[0]).not.toHaveProperty('fallbacks')
  })

  it.each([
    ['empty question', { question: '   ' }],
    ['long question', { question: 'x'.repeat(501) }],
    ['wrong type', { question: 7 }],
    ['history not alternating', { question: 'q', history: [{ role: 'assistant', text: 'a' }, { role: 'user', text: 'b' }] }],
    ['history with odd length', { question: 'q', history: [{ role: 'user', text: 'a' }] }],
    ['invalid JSON', '{nope'],
  ])('rejects %s', async (_name, body) => {
    const client = fakeClient()
    const response = await handleAsk(post(body), deps({ client }))
    expect(response.status).toBe(400)
    expect(client.stream).not.toHaveBeenCalled()
  })

  it('rejects other methods and origins, and reports no key as unavailable', async () => {
    expect((await handleAsk(new Request('http://site.test/api/ask'), deps())).status).toBe(405)
    expect((await handleAsk(post({ question: 'q' }, { origin: 'https://evil.test' }), deps())).status).toBe(403)
    expect((await handleAsk(post({ question: 'q' }), deps({ client: null }))).status).toBe(503)
  })

  it('rate limits per IP, without affecting other visitors', async () => {
    const shared = deps({ dailyTokenBudget: 1_000_000 })
    for (let i = 0; i < 10; i++) expect((await handleAsk(post({ question: 'q' }), shared)).status).toBe(200)
    expect((await handleAsk(post({ question: 'q' }), shared)).status).toBe(429)
    expect((await handleAsk(post({ question: 'q' }, { 'x-forwarded-for': '2.2.2.2' }), shared)).status).toBe(200)
  })

  it('stops calling the model once the daily token budget is spent', async () => {
    const client = fakeClient()
    const shared = deps({ client, dailyTokenBudget: 200 })
    await handleAsk(post({ question: 'q' }), shared).then((response) => response.text())
    await handleAsk(post({ question: 'q' }), shared).then((response) => response.text())
    const blocked = await handleAsk(post({ question: 'q' }), shared)
    expect(blocked.status).toBe(429)
    expect(client.stream).toHaveBeenCalledTimes(2)
  })

  it('fails closed when the limit store is down', async () => {
    const client = fakeClient()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const response = await handleAsk(post({ question: 'q' }), deps({ client, store: { add: () => Promise.reject(new Error('down')) } }))
    expect(response.status).toBe(503)
    expect(client.stream).not.toHaveBeenCalled()
  })

  it('reports refusals, truncation and upstream failures in the stream', async () => {
    const refused = await readEvents(await handleAsk(post({ question: 'q' }), deps({ client: fakeClient('refusal') })))
    expect(refused.at(-1)).toEqual({ type: 'error', code: 'refused' })
    const truncated = await readEvents(await handleAsk(post({ question: 'q' }), deps({ client: fakeClient('max_tokens') })))
    expect(truncated.at(-1)).toEqual({ type: 'done', truncated: true })

    vi.spyOn(console, 'error').mockImplementation(() => {})
    const failing = { stream: () => ({ async *[Symbol.asyncIterator]() { yield* []; throw new Error('boom') }, finalMessage: async () => ({}) }) } as unknown as NonNullable<AskDeps['client']>
    const failed = await readEvents(await handleAsk(post({ question: 'q' }), deps({ client: failing })))
    expect(failed).toEqual([{ type: 'error', code: 'upstream' }])
  })
})

describe('MemoryStore', () => {
  it('resets a counter after its TTL', async () => {
    let now = 0
    const store = new MemoryStore(() => now)
    expect(await store.add('k', 2, 10)).toBe(2)
    expect(await store.add('k', 1, 10)).toBe(3)
    now = 11_000
    expect(await store.add('k', 1, 10)).toBe(1)
  })
})
