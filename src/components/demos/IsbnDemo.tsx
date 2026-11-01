import { useRef, useState, type FormEvent } from 'react'
import { normalizeIsbn } from '../../lib/isbn'

const SAMPLES = [
  { isbn: '9781449373320', label: 'Designing Data-Intensive Applications' },
  { isbn: '9780132350884', label: 'Clean Code' },
]

interface Book {
  title: string
  authors: string
  published?: string
  cover?: string
}

type State = { status: 'idle' } | { status: 'loading' } | { status: 'found'; book: Book; repeat: boolean } | { status: 'error'; message: string }

export const IsbnDemo = () => {
  const [value, setValue] = useState(SAMPLES[0].isbn)
  const [state, setState] = useState<State>({ status: 'idle' })
  const shelf = useRef(new Map<string, Book>())
  const controller = useRef<AbortController | null>(null)

  const lookUp = async (raw: string) => {
    const isbn = normalizeIsbn(raw)
    if (!isbn) return setState({ status: 'error', message: 'An ISBN has 10 or 13 digits.' })
    // Same order as the real API: check the shelf before calling Open Library.
    const existing = shelf.current.get(isbn)
    if (existing) return setState({ status: 'found', book: existing, repeat: true })
    controller.current?.abort()
    controller.current = new AbortController()
    setState({ status: 'loading' })
    try {
      const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`, { signal: controller.current.signal })
      if (!response.ok) throw new Error(String(response.status))
      const data = (await response.json()) as Record<string, { title?: string; authors?: { name: string }[]; publish_date?: string; cover?: { medium?: string } }>
      const match = data[`ISBN:${isbn}`]
      if (!match) return setState({ status: 'error', message: 'Open Library does not have that book.' })
      const book: Book = { title: match.title ?? 'Untitled', authors: match.authors?.map((author) => author.name).join(', ') ?? 'Unknown author', published: match.publish_date, cover: match.cover?.medium }
      shelf.current.set(isbn, book)
      setState({ status: 'found', book, repeat: false })
    } catch (error) {
      if ((error as Error).name !== 'AbortError') setState({ status: 'error', message: 'Could not reach Open Library. Try again in a moment.' })
    }
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    void lookUp(value)
  }

  return (
    <div>
      <form onSubmit={submit} className="flex flex-wrap gap-2">
        <label htmlFor="isbn-input" className="sr-only">ISBN</label>
        <input id="isbn-input" value={value} inputMode="numeric" autoComplete="off" onChange={(event) => setValue(event.target.value)} className="min-w-0 flex-1 rounded-md border border-line bg-paper px-3 py-2 font-mono text-sm" />
        <button type="submit" className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:opacity-90">Look up</button>
      </form>
      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
        Try:
        {SAMPLES.map((sample) => (
          <button key={sample.isbn} type="button" className="link" onClick={() => { setValue(sample.isbn); void lookUp(sample.isbn) }}>{sample.label}</button>
        ))}
      </p>
      <div aria-live="polite" className="mt-4 min-h-24">
        {state.status === 'loading' && <p className="font-mono text-sm text-muted">GET openlibrary.org …</p>}
        {state.status === 'error' && <p className="text-sm">{state.message}</p>}
        {state.status === 'found' && (
          <div className="flex gap-4">
            {state.book.cover && <img src={state.book.cover} alt="" width={72} height={108} className="h-27 w-18 shrink-0 border border-line object-cover" />}
            <div className="min-w-0">
              <p className={`font-mono text-xs ${state.repeat ? 'text-[#b45309]' : 'text-accent'}`}>{state.repeat ? '409 Already on the shelf, no external request' : '201 Saved to the shelf'}</p>
              <p className="mt-1 font-semibold">{state.book.title}</p>
              <p className="text-sm text-muted">{state.book.authors}{state.book.published ? `, ${state.book.published}` : ''}</p>
            </div>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-muted">The lookup is a live request from your browser to Open Library. The shelf only lasts until you reload. Look up the same book twice to see the duplicate check.</p>
    </div>
  )
}
