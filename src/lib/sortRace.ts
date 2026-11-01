// JavaScript ports of quickSort.cpp, mergeSort.cpp and heapSort.cpp from Aditya's DSA-Pratice
// repo, with the same pivot and merge choices, instrumented to record every comparison.

export type AlgorithmId = 'quick' | 'merge' | 'heap'
export type Shape = 'random' | 'nearly' | 'reversed'

export interface Trace {
  /** The array as it stood at each comparison, ending with the sorted result. */
  frames: number[][]
  comparisons: number
}

export const ALGORITHMS: { id: AlgorithmId; label: string; file: string }[] = [
  { id: 'quick', label: 'Quicksort', file: 'quickSort.cpp' },
  { id: 'merge', label: 'Mergesort', file: 'mergeSort.cpp' },
  { id: 'heap', label: 'Heapsort', file: 'heapSort.cpp' },
]

const tracer = (input: number[]) => {
  const arr = [...input]
  const frames: number[][] = []
  let comparisons = 0
  return {
    arr,
    compare: (result: boolean) => {
      comparisons++
      frames.push([...arr])
      return result
    },
    finish: (): Trace => ({ frames: [...frames, [...arr]], comparisons }),
  }
}

const swap = (arr: number[], a: number, b: number) => {
  ;[arr[a], arr[b]] = [arr[b], arr[a]]
}

const quick = (input: number[]) => {
  const { arr, compare, finish } = tracer(input)
  const partition = (p: number, q: number) => {
    let i = p
    const pivot = arr[p]
    for (let j = i + 1; j < q + 1; j++) {
      if (compare(arr[j] < pivot)) {
        i++
        swap(arr, i, j)
      }
    }
    swap(arr, i, p)
    return i
  }
  const sort = (p: number, q: number) => {
    if (p < q) {
      const mid = partition(p, q)
      sort(p, mid - 1)
      sort(mid + 1, q)
    }
  }
  sort(0, arr.length - 1)
  return finish()
}

const merge = (input: number[]) => {
  const { arr, compare, finish } = tracer(input)
  const mergeParts = (s: number, e: number) => {
    const mid = Math.floor((s + e) / 2)
    const first = arr.slice(s, mid + 1)
    const second = arr.slice(mid + 1, e + 1)
    let index1 = 0
    let index2 = 0
    let main = s
    while (index1 < first.length && index2 < second.length) {
      if (compare(first[index1] < second[index2])) arr[main++] = first[index1++]
      else arr[main++] = second[index2++]
    }
    while (index1 < first.length) arr[main++] = first[index1++]
    while (index2 < second.length) arr[main++] = second[index2++]
  }
  const sort = (s: number, e: number) => {
    if (s >= e) return
    const mid = Math.floor((s + e) / 2)
    sort(s, mid)
    sort(mid + 1, e)
    mergeParts(s, e)
  }
  sort(0, arr.length - 1)
  return finish()
}

const heap = (input: number[]) => {
  const { arr, compare, finish } = tracer(input)
  const heapify = (n: number, i: number) => {
    let largest = i
    const l = 2 * i + 1
    const r = 2 * i + 2
    if (l < n && compare(arr[l] > arr[largest])) largest = l
    if (r < n && compare(arr[r] > arr[largest])) largest = r
    if (largest !== i) {
      swap(arr, i, largest)
      heapify(n, largest)
    }
  }
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) heapify(arr.length, i)
  for (let i = arr.length - 1; i > 0; i--) {
    swap(arr, 0, i)
    heapify(i, 0)
  }
  return finish()
}

export const traceSort = (id: AlgorithmId, input: number[]): Trace => ({ quick, merge, heap })[id](input)

export const makeArray = (shape: Shape, size = 32, random: () => number = Math.random) => {
  const sorted = Array.from({ length: size }, (_, index) => index + 1)
  if (shape === 'reversed') return sorted.reverse()
  const arr = [...sorted]
  if (shape === 'nearly') {
    for (let swaps = 0; swaps < 2; swaps++) {
      const a = Math.floor(random() * (size - 1))
      swap(arr, a, a + 1)
    }
    return arr
  }
  for (let i = arr.length - 1; i > 0; i--) swap(arr, i, Math.floor(random() * (i + 1)))
  return arr
}

/** The fewest comparisons wins. Ties share the win. */
export const winners = (traces: Record<AlgorithmId, Trace>) => {
  const best = Math.min(...Object.values(traces).map((trace) => trace.comparisons))
  return ALGORITHMS.filter((algorithm) => traces[algorithm.id].comparisons === best).map((algorithm) => algorithm.id)
}
