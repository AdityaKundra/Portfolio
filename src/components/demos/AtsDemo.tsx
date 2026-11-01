import { useState } from 'react'
import { ATS_FACTORS, atsScore, type AtsInputs } from '../../lib/atsScore'

const START: AtsInputs = { keyword: 72, semantic: 60, skills: 80, sections: 100, formatting: 90 }
const BAR_COLORS = ['bg-accent', 'bg-accent/75', 'bg-accent/55', 'bg-accent/40', 'bg-accent/25']

export const AtsDemo = () => {
  const [inputs, setInputs] = useState(START)
  const score = atsScore(inputs)
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_9rem] md:items-center">
      <div className="space-y-3">
        {ATS_FACTORS.map((factor) => (
          <label key={factor.id} className="grid grid-cols-[minmax(0,1fr)_2.5rem] items-center gap-x-3 text-sm sm:grid-cols-[11rem_minmax(0,1fr)_2.5rem]">
            <span>{factor.label} <span className="font-mono text-xs text-muted">×{factor.weight}</span></span>
            <input
              type="range"
              min={0}
              max={100}
              value={inputs[factor.id]}
              onChange={(event) => setInputs((current) => ({ ...current, [factor.id]: Number(event.target.value) }))}
              className="order-3 col-span-2 w-full accent-[var(--accent)] sm:order-none sm:col-span-1"
            />
            <output className="text-right font-mono text-xs">{inputs[factor.id]}</output>
          </label>
        ))}
      </div>
      <div className="text-center">
        <output aria-live="polite" aria-label={`Score ${score} out of 100`} className="block text-6xl font-semibold tracking-tight tabular-nums text-accent">{score}</output>
        <p className="eyebrow mt-1">out of 100</p>
        <div aria-hidden="true" className="mt-3 flex h-2 overflow-hidden rounded-full bg-line">
          {ATS_FACTORS.map((factor, index) => (
            <span key={factor.id} className={BAR_COLORS[index]} style={{ width: `${factor.weight * inputs[factor.id]}%` }} />
          ))}
        </div>
      </div>
      <p className="text-xs text-muted md:col-span-2">Uses the real weights from the scorer. The app also applies a small adjustment for keyword placement, and the score is a heuristic, not a real ATS result.</p>
    </div>
  )
}
