export const GRID_SIZE = 12
export const ROUND_MS = 20_000
export const BUG_LIFETIME_MS = 1600
export const MAX_MISSES = 5

export interface Bug {
  id: number
  name: string
  cell: number
  expires: number
}

export interface BugHuntState {
  status: 'ready' | 'playing' | 'over'
  bugs: Bug[]
  score: number
  misses: number
  endsAt: number
  nextId: number
  outcome?: 'time' | 'incident'
}

export const initialBugHunt: BugHuntState = { status: 'ready', bugs: [], score: 0, misses: 0, endsAt: 0, nextId: 1 }

export type BugHuntAction =
  | { type: 'start'; now: number }
  | { type: 'spawn'; now: number; name: string; cell: number }
  | { type: 'squash'; id: number }
  | { type: 'tick'; now: number }

export const bugHuntReducer = (state: BugHuntState, action: BugHuntAction): BugHuntState => {
  if (action.type === 'start') return { ...initialBugHunt, status: 'playing', endsAt: action.now + ROUND_MS }
  if (state.status !== 'playing') return state
  switch (action.type) {
    case 'spawn':
      if (state.bugs.some((bug) => bug.cell === action.cell)) return state
      return { ...state, nextId: state.nextId + 1, bugs: [...state.bugs, { id: state.nextId, name: action.name, cell: action.cell, expires: action.now + BUG_LIFETIME_MS }] }
    case 'squash':
      if (!state.bugs.some((bug) => bug.id === action.id)) return state
      return { ...state, score: state.score + 1, bugs: state.bugs.filter((bug) => bug.id !== action.id) }
    case 'tick': {
      const alive = state.bugs.filter((bug) => bug.expires > action.now)
      const misses = state.misses + state.bugs.length - alive.length
      if (misses >= MAX_MISSES) return { ...state, bugs: [], misses, status: 'over', outcome: 'incident' }
      if (action.now >= state.endsAt) return { ...state, bugs: [], misses, status: 'over', outcome: 'time' }
      return alive.length === state.bugs.length ? state : { ...state, bugs: alive, misses }
    }
  }
}

/** Bugs arrive faster as the round goes on. */
export const spawnDelay = (msLeft: number) => 340 + Math.round((msLeft / ROUND_MS) * 460)
