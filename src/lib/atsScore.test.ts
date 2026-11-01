import { describe, expect, it } from 'vitest'
import { highlight } from './highlight'
import { normalizeIsbn } from './isbn'
import { ATS_FACTORS, atsScore } from './atsScore'

describe('demos', () => {
  it('ATS weights match the scorer and sum to 1', () => {
    expect(ATS_FACTORS.map((factor) => factor.weight)).toEqual([0.4, 0.25, 0.2, 0.1, 0.05])
    expect(atsScore({ keyword: 100, semantic: 100, skills: 100, sections: 100, formatting: 100 })).toBe(100)
    expect(atsScore({ keyword: 50, semantic: 0, skills: 0, sections: 0, formatting: 0 })).toBe(20)
  })

  it('accepts only real ISBN shapes', () => {
    expect(normalizeIsbn('978-1-4493-7332-0')).toBe('9781449373320')
    expect(normalizeIsbn('080442957x')).toBe('080442957X')
    expect(normalizeIsbn('123')).toBeNull()
    expect(normalizeIsbn('abc&format=json')).toBeNull()
  })

  it('highlighting never changes the code text', () => {
    const code = 'const a = `x${1}`; // note\nreturn "y";'
    const text = highlight(code).map((part) => (typeof part === 'string' ? part : (part as { props: { children: string } }).props.children)).join('')
    expect(text).toBe(code)
  })
})
