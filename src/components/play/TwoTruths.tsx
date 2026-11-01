import { useState } from 'react'
import { Link } from 'react-router'
import { truthRounds } from '../../content/play'
import { HireButton } from '../HireDialog'

const verdicts = (score: number) => {
  if (score === truthRounds.length) return 'Perfect. You clearly read the case studies, or you are extremely good at this.'
  if (score >= 3) return 'Sharp. You now know more about Aditya than most recruiters do after a phone screen.'
  return 'He got you. Good thing the real work is easier to verify than this game.'
}

export const TwoTruths = () => {
  const [round, setRound] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)

  if (round >= truthRounds.length) {
    return (
      <div className="py-6 text-center">
        <p className="text-6xl font-semibold tracking-tight text-accent">{score}/{truthRounds.length}</p>
        <p className="mx-auto mt-3 max-w-md leading-relaxed">{verdicts(score)}</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <HireButton className="px-4 py-2.5 text-sm" />
          <button type="button" onClick={() => { setRound(0); setPicked(null); setScore(0) }} className="rounded-md border border-line px-4 py-2.5 text-sm font-medium hover:border-accent">Play again</button>
        </div>
      </div>
    )
  }

  const current = truthRounds[round]
  const answered = picked !== null

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="eyebrow">Round {round + 1} of {truthRounds.length}: {current.topic}</p>
        <p className="font-mono text-xs text-muted">Score {score}</p>
      </div>
      <h3 className="mt-2 text-xl font-semibold tracking-tight">Which one is the lie?</h3>
      <ul className="mt-4 space-y-2">
        {current.options.map((option, index) => {
          const tone = !answered ? 'border-line hover:border-accent' : option.isLie ? 'border-[#c2410c] bg-[#c2410c]/10' : index === picked ? 'border-line opacity-90' : 'border-line opacity-70'
          return (
            <li key={option.text}>
              <button
                type="button"
                disabled={answered}
                onClick={() => {
                  setPicked(index)
                  if (option.isLie) setScore((value) => value + 1)
                }}
                className={`block w-full border p-3 text-left transition-colors ${tone}`}
              >
                {option.text}
              </button>
              {answered && (
                <p className="mt-1 mb-3 px-3 text-sm text-muted">
                  {option.reveal}{' '}
                  {option.href && <Link to={option.href} className="link">See the proof</Link>}
                </p>
              )}
            </li>
          )
        })}
      </ul>
      <div aria-live="polite" className="mt-4 flex min-h-10 flex-wrap items-center justify-between gap-3">
        {answered && (
          <>
            <p className="font-medium">{current.options[picked].isLie ? 'Correct, you found the lie.' : 'Nope, that one is true.'}</p>
            <button type="button" onClick={() => { setRound((value) => value + 1); setPicked(null) }} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:opacity-90">{round + 1 === truthRounds.length ? 'See my score' : 'Next round'}</button>
          </>
        )}
      </div>
    </div>
  )
}
