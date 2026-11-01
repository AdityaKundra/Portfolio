import { useRef, useState, type KeyboardEvent } from 'react'
import { BugHunt } from './BugHunt'
import { HireCheck } from './HireCheck'
import { SortRace } from './SortRace'
import { TwoTruths } from './TwoTruths'

const TABS = [
  { id: 'truths', label: 'Two Truths and a Lie', hint: '1 min', render: () => <TwoTruths /> },
  { id: 'bugs', label: 'Bug Hunt', hint: '20 sec', render: () => <BugHunt /> },
  { id: 'race', label: 'Sort Race', hint: 'From my DSA repo', render: () => <SortRace /> },
  { id: 'check', label: 'Hire Check', hint: 'For recruiters', render: () => <HireCheck /> },
]

export const Playground = () => {
  const [active, setActive] = useState(0)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (event: KeyboardEvent) => {
    const move = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
    if (!move) return
    event.preventDefault()
    const next = (active + move + TABS.length) % TABS.length
    setActive(next)
    buttons.current[next]?.focus()
  }

  return (
    <div>
      <div role="tablist" aria-label="Games" onKeyDown={onKeyDown} className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {TABS.map((tab, index) => (
          <button
            key={tab.id}
            ref={(element) => { buttons.current[index] = element }}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={index === active}
            aria-controls={`panel-${tab.id}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            className={`border p-3 text-left transition-colors ${index === active ? 'border-accent bg-accent text-accent-ink' : 'border-line hover:border-accent'}`}
          >
            <span className="block font-semibold">{tab.label}</span>
            <span className="mt-0.5 block font-mono text-xs opacity-75">{tab.hint}</span>
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${TABS[active].id}`} aria-labelledby={`tab-${TABS[active].id}`} className="mt-4 border border-line bg-panel p-4 sm:p-6">
        {TABS[active].render()}
      </div>
    </div>
  )
}
