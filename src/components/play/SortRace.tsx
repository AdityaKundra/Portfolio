import { useEffect, useRef, useState } from 'react'
import { ALGORITHMS, makeArray, traceSort, winners, type AlgorithmId, type Shape, type Trace } from '../../lib/sortRace'
import { ExternalLink } from '../SiteChrome'

const REPO = 'https://github.com/AdityaKundra/DSA-Pratice'
const SHAPES: { id: Shape; label: string }[] = [
  { id: 'random', label: 'Random' },
  { id: 'nearly', label: 'Nearly sorted' },
  { id: 'reversed', label: 'Reversed' },
]
const TOTAL_TICKS = 180

const Bars = ({ values, size, done }: { values: number[]; size: number; done: boolean }) => (
  <div aria-hidden="true" className="flex h-24 items-end gap-px">
    {values.map((value, index) => (
      <span key={index} className={`flex-1 ${done ? 'bg-[#16a34a]' : 'bg-accent'}`} style={{ height: `${(value / size) * 100}%` }} />
    ))}
  </div>
)

export const SortRace = () => {
  const [shape, setShape] = useState<Shape>('random')
  const [bet, setBet] = useState<AlgorithmId | null>(null)
  const [preview] = useState(() => Array.from({ length: 32 }, (_, index) => ((index * 13) % 32) + 1))
  const [traces, setTraces] = useState<Record<AlgorithmId, Trace> | null>(null)
  const [step, setStep] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = () => {
    if (timer.current) clearInterval(timer.current)
    timer.current = null
  }
  useEffect(() => stop, [])

  const race = (choice: AlgorithmId) => {
    stop()
    const input = makeArray(shape)
    const next = { quick: traceSort('quick', input), merge: traceSort('merge', input), heap: traceSort('heap', input) }
    const longest = Math.max(...Object.values(next).map((trace) => trace.comparisons))
    setBet(choice)
    setTraces(next)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setStep(longest)
    setStep(0)
    const perTick = Math.max(1, Math.ceil(longest / TOTAL_TICKS))
    let current = 0
    timer.current = setInterval(() => {
      current = Math.min(current + perTick, longest)
      setStep(current)
      if (current >= longest) stop()
    }, 30)
  }

  const reset = (next?: Shape) => {
    stop()
    if (next) setShape(next)
    setTraces(null)
    setBet(null)
    setStep(0)
  }

  const longest = traces ? Math.max(...Object.values(traces).map((trace) => trace.comparisons)) : 0
  const finished = traces !== null && step >= longest
  const won = traces ? winners(traces) : []

  return (
    <div>
      <h3 className="text-xl font-semibold tracking-tight">Bet on a sort from my DSA practice</h3>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">Three sorts from my practice repo race on the same data. Fewest comparisons wins. Watch the data shape: my quicksort pivots on the first element, and that matters.</p>

      <div role="group" aria-label="Data shape" className="mt-4 flex flex-wrap items-center gap-1.5">
        <span className="eyebrow mr-1">Data</span>
        {SHAPES.map((option) => (
          <button key={option.id} type="button" aria-pressed={shape === option.id} onClick={() => reset(option.id)} className={`rounded-full border px-3 py-1 text-sm transition-colors ${shape === option.id ? 'border-accent bg-accent text-accent-ink' : 'border-line hover:border-accent'}`}>{option.label}</button>
        ))}
      </div>

      <ul className="mt-4 grid gap-3 md:grid-cols-3">
        {ALGORITHMS.map((algorithm) => {
          const trace = traces?.[algorithm.id]
          const done = trace ? step >= trace.comparisons : false
          const frame = trace ? trace.frames[Math.min(step, trace.frames.length - 1)] : preview
          const isWinner = finished && won.includes(algorithm.id)
          return (
            <li key={algorithm.id} className={`border p-3 ${isWinner ? 'border-[#16a34a]' : 'border-line'}`}>
              <Bars values={frame} size={32} done={done} />
              <div className="mt-2 flex items-baseline justify-between gap-2">
                <p className="font-semibold">{algorithm.label}{isWinner && <span aria-hidden="true"> 🏆</span>}{bet === algorithm.id && <span className="ml-1.5 font-mono text-xs font-normal text-muted">your bet</span>}</p>
                <p className="font-mono text-xs text-muted tabular-nums">{trace ? `${Math.min(step, trace.comparisons)} cmp` : ''}</p>
              </div>
              <div className="mt-2 flex items-center justify-between gap-2 text-sm">
                {traces ? <span /> : <button type="button" onClick={() => race(algorithm.id)} className="rounded-md bg-accent px-3 py-1.5 font-medium text-accent-ink hover:opacity-90">Bet on {algorithm.label}</button>}
                <ExternalLink href={`${REPO}/blob/main/${algorithm.file}`} className="link font-mono text-xs text-muted">{algorithm.file}</ExternalLink>
              </div>
            </li>
          )
        })}
      </ul>

      <div aria-live="polite" className="mt-4 flex min-h-10 flex-wrap items-center justify-between gap-3">
        {finished && bet && traces && (
          <>
            <p className="font-medium">
              {won.includes(bet) ? 'You called it.' : 'Unlucky.'} {won.map((id) => ALGORITHMS.find((algorithm) => algorithm.id === id)?.label).join(' and ')} won with {traces[won[0]].comparisons} comparisons{traces.quick.comparisons > traces.merge.comparisons * 2 ? '. That is the first-element pivot hitting its worst case.' : '.'}
            </p>
            <button type="button" onClick={() => reset()} className="rounded-md border border-line px-4 py-2 text-sm font-medium hover:border-accent">Race again</button>
          </>
        )}
        {traces && !finished && <p className="font-mono text-sm text-muted">Racing…</p>}
      </div>

      <p className="mt-3 border-t border-line pt-3 text-xs leading-relaxed text-muted">
        JavaScript ports of the C++ in my <ExternalLink href={REPO}>DSA practice repo</ExternalLink>, which also has Dijkstra, Floyd-Warshall, N-Queens and travelling salesperson. More practice on <ExternalLink href="https://leetcode.com/u/PracticeAdi/">LeetCode</ExternalLink>.
      </p>
    </div>
  )
}
