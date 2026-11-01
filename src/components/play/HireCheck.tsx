import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { SAMPLE_JD } from '../../content/play'
import { checkFit } from '../../lib/fitCheck'
import { openHire } from '../../lib/hire'

export const HireCheck = () => {
  const [text, setText] = useState('')
  const result = useMemo(() => checkFit(text), [text])
  const hasText = text.trim().length > 0

  const contact = () => {
    const parts = [
      result.proven.length ? `Your matching experience: ${result.proven.map((item) => item.name).join(', ')}.` : '',
      result.gaps.length ? `I would also like to ask about: ${result.gaps.join(', ')}.` : '',
    ].filter(Boolean)
    openHire(parts.join('\n'))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h3 className="text-xl font-semibold tracking-tight">Run the ATS on me</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">I built an ATS-style scorer, so it seems fair to be scored too. Paste a job description and see the evidence, including what is missing. It runs in your browser and nothing is sent anywhere.</p>
        <label htmlFor="jd-input" className="sr-only">Job description</label>
        <textarea id="jd-input" rows={8} value={text} onChange={(event) => setText(event.target.value)} placeholder="Paste a job description" className="mt-3 w-full resize-y rounded-md border border-line bg-paper p-3 text-sm leading-relaxed placeholder:text-muted focus-visible:border-accent" />
        <button type="button" onClick={() => setText(SAMPLE_JD)} className="link mt-1 text-sm text-muted">Use a sample job description</button>
      </div>
      <div aria-live="polite" className="min-w-0">
        {!hasText && <p className="grid h-full min-h-40 place-items-center border border-dashed border-line p-6 text-center text-sm text-muted">Your match report appears here as you type.</p>}
        {hasText && result.total === 0 && <p className="border border-line p-6 text-sm text-muted">I could not spot any technologies in that yet. Try pasting the requirements section.</p>}
        {result.total > 0 && (
          <div className="border border-ink/70 bg-paper p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-5xl font-semibold tracking-tight text-accent tabular-nums">{result.score}%</p>
                <p className="eyebrow mt-1">{result.proven.length + result.listed.length} of {result.total} skills matched</p>
              </div>
              <button type="button" onClick={contact} className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-ink hover:opacity-90">Email about this role</button>
            </div>
            {result.proven.length > 0 && (
              <>
                <h4 className="mt-5 text-sm font-semibold">With evidence</h4>
                <ul className="mt-1 divide-y divide-line text-sm">
                  {result.proven.map((item) => (
                    <li key={item.name} className="flex flex-wrap items-baseline justify-between gap-x-3 py-1.5">
                      <span>✓ {item.name}</span>
                      <span className="text-muted">{item.uses.slice(0, 2).map((use, index) => <span key={use.title}>{index > 0 && ', '}<Link to={use.href} className="link">{use.title}</Link></span>)}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {result.listed.length > 0 && <p className="mt-4 text-sm"><b className="font-semibold">On the resume, no project here yet:</b> <span className="text-muted">{result.listed.join(', ')}</span></p>}
            {result.gaps.length > 0 && <p className="mt-4 text-sm"><b className="font-semibold">No evidence on this site:</b> <span className="text-muted">{result.gaps.join(', ')}. Worth asking him directly.</span></p>}
            <p className="mt-4 text-xs text-muted">A keyword match, built for fun. Like any ATS score, it is no substitute for an interview.</p>
          </div>
        )}
      </div>
    </div>
  )
}
