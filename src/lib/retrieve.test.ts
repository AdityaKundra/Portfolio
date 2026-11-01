import { describe, expect, it } from 'vitest'
import { answerLocally, search, tokenize } from './retrieve'

const top = (question: string) => search(question)[0]?.doc.id

describe('local search', () => {
  it.each([
    ['What has he built with LiveKit?', 'work-voice-assistant-lab'],
    ['ATS scoring and PDF export', 'work-resume-studio'],
    ['headless e-commerce B2B', 'work-redefine'],
    ['GENIE fetch times', 'work-lead-school'],
    ['Where did he study for his MCA degree? Chandigarh', 'education'],
    ['barcode scanner', 'work-isbn-scanner'],
    ['Which books does he recommend? Kleppmann', 'recommendations'],
  ])('finds the right source for %s', (question, expected) => {
    expect(top(question)).toBe(expected)
  })

  it('returns nothing for questions the site cannot answer', () => {
    expect(answerLocally('quantum knitting recipes')).toBeNull()
    expect(answerLocally('who are you')).toBeNull()
  })

  it('keeps technical tokens intact', () => {
    expect(tokenize('Node.js, C++ and Next.js.')).toEqual(['node.js', 'c++', 'next.js'])
  })

  it('answers with quoted site text and sources', () => {
    const answer = answerLocally('GENIE fetch times')
    expect(answer?.text).toContain('40%')
    expect(answer?.sources[0]).toEqual({ title: 'LEAD School: GENIE', href: '/work/lead-school' })
  })
})
