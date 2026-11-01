import { useEffect, useReducer, useRef, useState } from 'react'
import { Link } from 'react-router'
import { BUG_NAMES, bugHuntUnlocks } from '../../content/play'
import { bugHuntReducer, GRID_SIZE, initialBugHunt, MAX_MISSES, spawnDelay } from '../../lib/bugHunt'

const BEST_KEY = 'portfolio-bug-hunt-best'
const pick = <T,>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)]

const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0
  } catch {
    return 0
  }
}

export const BugHunt = () => {
  const [state, dispatch] = useReducer(bugHuntReducer, initialBugHunt)
  const [best, setBest] = useState(0)
  const [now, setNow] = useState(0)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => setBest(readBest()), [])

  const playing = state.status === 'playing'

  useEffect(() => {
    if (!playing) return
    const tick = setInterval(() => {
      const time = Date.now()
      setNow(time)
      dispatch({ type: 'tick', now: time })
    }, 100)
    let spawnTimer: ReturnType<typeof setTimeout>
    const spawn = () => {
      const time = Date.now()
      dispatch({ type: 'spawn', now: time, name: pick(BUG_NAMES), cell: Math.floor(Math.random() * GRID_SIZE) })
      spawnTimer = setTimeout(spawn, spawnDelay(stateRef.current.endsAt - time))
    }
    spawn()
    return () => {
      clearInterval(tick)
      clearTimeout(spawnTimer)
    }
  }, [playing])

  useEffect(() => {
    if (state.status !== 'over' || state.score <= best) return
    setBest(state.score)
    try {
      localStorage.setItem(BEST_KEY, String(state.score))
    } catch {
      // The best score just will not survive a reload.
    }
  }, [state.status, state.score, best])

  const secondsLeft = playing ? Math.max(0, Math.ceil((state.endsAt - now) / 1000)) : 20
  const unlocked = bugHuntUnlocks.filter((unlock) => state.score >= unlock.score)
  const nextUnlock = bugHuntUnlocks.find((unlock) => state.score < unlock.score)

  return (
    <div className="overflow-hidden border border-ink/70 bg-[#0e1317] text-[#d7dee4]">
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-1 border-b border-[#2a333c] px-4 py-2.5 font-mono text-xs">
        <span>prod-monitor</span>
        <span className="flex gap-4">
          <span>time <b className="text-white tabular-nums">{secondsLeft}s</b></span>
          <span>fixed <b className="text-[#7ee2a8] tabular-nums">{state.score}</b></span>
          <span>missed <b className={`tabular-nums ${state.misses >= MAX_MISSES - 1 ? 'text-[#ff8a65]' : 'text-white'}`}>{state.misses}/{MAX_MISSES}</b></span>
          <span>best <b className="text-white tabular-nums">{best}</b></span>
        </span>
      </div>

      {state.status === 'playing' ? (
        <ul aria-label="Production bugs" className="grid grid-cols-3 gap-1.5 p-3 sm:grid-cols-4">
          {Array.from({ length: GRID_SIZE }, (_, cell) => {
            const bug = state.bugs.find((item) => item.cell === cell)
            return (
              <li key={cell} className="h-20 rounded-sm bg-[#171d23]">
                {bug && (
                  <button
                    type="button"
                    // Fires on press rather than release, so fast tapping never misses.
                    onPointerDown={() => dispatch({ type: 'squash', id: bug.id })}
                    onClick={() => dispatch({ type: 'squash', id: bug.id })}
                    aria-label={`Squash ${bug.name}`}
                    className="window-in flex size-full touch-manipulation flex-col items-center justify-center gap-1 rounded-sm border border-[#ff8a65]/60 bg-[#ff8a65]/15 transition-colors hover:bg-[#ff8a65]/30"
                  >
                    <span aria-hidden="true" className="text-2xl leading-none">🐞</span>
                    <span className="font-mono text-[0.65rem] leading-tight">{bug.name}</span>
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="p-6">
          {state.status === 'ready' ? (
            <>
              <h3 className="text-xl font-semibold tracking-tight text-white">You are on call. Production is on fire.</h3>
              <p className="mt-2 max-w-lg leading-relaxed text-[#aeb8c2]">Squash bugs for 20 seconds. Miss {MAX_MISSES} and it becomes an incident. Good scores unlock real stories from Aditya’s career.</p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold tracking-tight text-white">{state.outcome === 'incident' ? 'That is an incident. Time to write the postmortem.' : 'Shift over. Production survived.'}</h3>
              <p className="mt-2 text-[#aeb8c2]" aria-live="polite">You fixed {state.score} {state.score === 1 ? 'bug' : 'bugs'}.{nextUnlock ? ` Fix ${nextUnlock.score} to unlock “${nextUnlock.title}”.` : ' You unlocked everything.'}</p>
              {unlocked.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {unlocked.map((unlock) => (
                    <li key={unlock.title} className="border-l-2 border-[#7ee2a8] pl-3 text-sm leading-relaxed">
                      <b className="text-white">{unlock.title}.</b> {unlock.fact} <Link to={unlock.href} className="underline underline-offset-2 hover:text-white">Read more</Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
          <button type="button" onClick={() => { const time = Date.now(); setNow(time); dispatch({ type: 'start', now: time }) }} className="mt-5 rounded-md bg-[#7ee2a8] px-4 py-2.5 text-sm font-semibold text-[#0b1a12] hover:opacity-90">{state.status === 'ready' ? 'Start my shift' : 'Go back on call'}</button>
        </div>
      )}
    </div>
  )
}
