import { describe, expect, it } from 'vitest'
import { truthRounds } from '../content/play'
import { bugHuntReducer, BUG_LIFETIME_MS, initialBugHunt, MAX_MISSES, ROUND_MS, spawnDelay } from './bugHunt'
import { checkFit } from './fitCheck'
import { hireMailto } from './hire'
import { runCommand } from '../desktop/commands'

describe('Two Truths and a Lie', () => {
  it('has exactly one lie per round, in varied positions', () => {
    for (const round of truthRounds) expect(round.options.filter((option) => option.isLie), round.topic).toHaveLength(1)
    const positions = truthRounds.map((round) => round.options.findIndex((option) => option.isLie))
    expect(new Set(positions).size).toBeGreaterThan(1)
  })
})

describe('Bug Hunt', () => {
  const start = bugHuntReducer(initialBugHunt, { type: 'start', now: 0 })
  const spawn = (state: typeof start, now: number, cell: number) => bugHuntReducer(state, { type: 'spawn', now, name: 'Bug', cell })

  it('scores a squash once, and ignores a second press on the same bug', () => {
    const one = spawn(start, 0, 0)
    const id = one.bugs[0].id
    const squashed = bugHuntReducer(one, { type: 'squash', id })
    expect(squashed.score).toBe(1)
    expect(bugHuntReducer(squashed, { type: 'squash', id }).score).toBe(1)
  })

  it('never stacks two bugs in a cell', () => {
    expect(spawn(spawn(start, 0, 3), 0, 3).bugs).toHaveLength(1)
  })

  it('ends in an incident after too many misses', () => {
    let state = start
    for (let cell = 0; cell < MAX_MISSES; cell++) state = spawn(state, 0, cell)
    state = bugHuntReducer(state, { type: 'tick', now: BUG_LIFETIME_MS + 1 })
    expect(state).toMatchObject({ status: 'over', outcome: 'incident', misses: MAX_MISSES })
  })

  it('ends when time runs out, and speeds up over the round', () => {
    expect(bugHuntReducer(start, { type: 'tick', now: ROUND_MS })).toMatchObject({ status: 'over', outcome: 'time' })
    expect(spawnDelay(1000)).toBeLessThan(spawnDelay(ROUND_MS))
  })
})

describe('Hire Check', () => {
  it('separates evidence, resume-only skills and honest gaps', () => {
    const result = checkFit('Node.js, React Native, Shopify and Kubernetes required')
    expect(result.proven.map((item) => item.name)).toEqual(['React Native', 'Node.js'])
    expect(result.listed).toEqual(['Shopify'])
    expect(result.gaps).toEqual(['Kubernetes'])
    expect(result.score).toBe(75)
  })

  it('does not confuse similar names', () => {
    const names = (text: string) => { const r = checkFit(text); return [...r.proven.map((i) => i.name), ...r.listed, ...r.gaps] }
    expect(names('React Native only')).toEqual(['React Native'])
    expect(names('JavaScript developer')).toEqual(['JavaScript'])
    expect(names('we love to go fast')).toEqual([])
    expect(names('C++ and C')).toEqual(['C++'])
    expect(names('Next.js and Node.js')).toEqual(['Next.js', 'Node.js'])
    expect(names('express yourself, react quickly, and help the rest of the team')).toEqual([])
    expect(names('Express, React and REST')).toEqual(['React', 'Express', 'REST APIs'])
  })

  it('reports nothing for text with no technologies', () => {
    expect(checkFit('hello there')).toMatchObject({ total: 0, score: 0 })
  })
})

describe('Hire me', () => {
  it('builds an encoded mailto draft', () => {
    const url = hireMailto({ name: 'Sam & Co', company: 'Acme', role: 'Engineer', note: '' })
    expect(url.startsWith('mailto:adityadef@gmail.com?subject=Engineer%20at%20Acme')).toBe(true)
    expect(decodeURIComponent(url)).toContain('Sam & Co')
    expect(url).not.toContain('Sam & Co')
  })

  it('works from the terminal', () => {
    expect(runCommand('sudo hire aditya')).toEqual({ kind: 'hire' })
    expect(runCommand('hire')).toEqual({ kind: 'hire' })
    expect(runCommand('sudo rm -rf /')).toMatchObject({ kind: 'text' })
  })
})
