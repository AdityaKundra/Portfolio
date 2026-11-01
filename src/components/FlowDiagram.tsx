import { useId, useState } from 'react'
import type { Flow } from '../content/work'

const Arrow = () => (
  <span aria-hidden="true" className="pl-3 font-mono text-xs leading-none text-accent sm:pl-0">
    <span className="sm:hidden">↓</span>
    <span className="hidden sm:inline">→</span>
  </span>
)

const chip = 'rounded-[3px] border px-2 py-1 font-mono text-xs leading-4'

/** A compact, static pipeline for overview rows. */
export const FlowStrip = ({ flow }: { flow: Flow }) => (
  <ol className="flex flex-wrap items-center gap-1.5">
    {flow.steps.map((step, index) => (
      <li key={step.label} className="flex items-center gap-1.5">
        <span className={`${chip} border-accent/45 bg-accent-soft`}>{step.label}</span>
        {index < flow.steps.length - 1 && <span aria-hidden="true" className="font-mono text-xs text-accent">→</span>}
      </li>
    ))}
  </ol>
)

/** Click a stage to see what it does. Stages are real buttons in an ordered list. */
export const FlowDiagram = ({ flow }: { flow: Flow }) => {
  const [active, setActive] = useState(0)
  const detailId = useId()
  return (
    <figure className="min-w-0">
      {flow.title && <figcaption className="eyebrow mb-2">{flow.title}</figcaption>}
      <ol className="flex flex-col items-start gap-1.5 sm:flex-row sm:flex-wrap sm:items-center">
        {flow.steps.map((step, index) => (
          <li key={step.label} className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center">
            <button
              type="button"
              aria-pressed={index === active}
              aria-controls={detailId}
              onClick={() => setActive(index)}
              className={`${chip} text-left transition-colors ${index === active ? 'border-accent bg-accent text-accent-ink' : 'border-accent/45 bg-accent-soft hover:border-accent'}`}
            >
              {step.label}
            </button>
            {index < flow.steps.length - 1 && <Arrow />}
          </li>
        ))}
      </ol>
      <p id={detailId} aria-live="polite" className="mt-3 border-l-2 border-accent pl-3 text-sm leading-relaxed">{flow.steps[active].detail}</p>
    </figure>
  )
}
