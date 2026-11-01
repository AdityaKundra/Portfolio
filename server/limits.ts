export interface CounterStore {
  /** Adds `by` to the counter, starting a TTL window when it is new, and returns the new total. */
  add(key: string, by: number, ttlSeconds: number): Promise<number>
}

/** Per-instance only. On serverless this is best effort, so production should configure Upstash. */
export class MemoryStore implements CounterStore {
  private counters = new Map<string, { value: number; expires: number }>()

  constructor(private now: () => number = Date.now) {}

  async add(key: string, by: number, ttlSeconds: number) {
    const time = this.now()
    const current = this.counters.get(key)
    const live = current && current.expires > time ? current : { value: 0, expires: time + ttlSeconds * 1000 }
    live.value += by
    this.counters.set(key, live)
    return live.value
  }
}

export class UpstashStore implements CounterStore {
  constructor(
    private url: string,
    private token: string,
  ) {}

  async add(key: string, by: number, ttlSeconds: number) {
    const response = await fetch(`${this.url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['INCRBY', key, by],
        ['EXPIRE', key, ttlSeconds, 'NX'],
      ]),
    })
    if (!response.ok) throw new Error(`Upstash responded ${response.status}`)
    const [first] = (await response.json()) as { result: number }[]
    return first.result
  }
}

export const HOUR = 3600
export const DAY = 86400
