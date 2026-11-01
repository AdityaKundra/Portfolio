import { describe, expect, it } from 'vitest'
import { ALGORITHMS, makeArray, traceSort, winners, type Shape } from './sortRace'

const SHAPES: Shape[] = ['random', 'nearly', 'reversed']
const sorted = (arr: number[]) => [...arr].sort((a, b) => a - b)

describe('sort race', () => {
  it.each(SHAPES)('every algorithm sorts %s data without changing the input', (shape) => {
    for (let run = 0; run < 20; run++) {
      const input = makeArray(shape)
      const copy = [...input]
      for (const { id } of ALGORITHMS) {
        const trace = traceSort(id, input)
        expect(trace.frames.at(-1)).toEqual(sorted(input))
        expect(trace.frames).toHaveLength(trace.comparisons + 1)
      }
      expect(input).toEqual(copy)
    }
  })

  it('handles duplicates and tiny arrays', () => {
    for (const input of [[], [1], [2, 1], [5, 5, 5, 1, 5]]) {
      for (const { id } of ALGORITHMS) expect(traceSort(id, input).frames.at(-1)).toEqual(sorted(input))
    }
  })

  it('shows the first-element pivot worst case on sorted data', () => {
    const input = Array.from({ length: 32 }, (_, index) => index + 1)
    expect(traceSort('quick', input).comparisons).toBe((32 * 31) / 2)
    expect(traceSort('merge', input).comparisons).toBeLessThan(100)
  })

  it('lets ties share the win', () => {
    const trace = (comparisons: number) => ({ frames: [], comparisons })
    expect(winners({ quick: trace(5), merge: trace(5), heap: trace(9) })).toEqual(['quick', 'merge'])
  })
})
