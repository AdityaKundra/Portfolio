export type AppId = 'readme' | 'projects' | 'ask' | 'notes' | 'terminal' | 'contact' | 'settings' | `project:${string}`

export interface Win {
  id: AppId
  x: number
  y: number
  minimized: boolean
  maximized: boolean
}

/** Array order is stacking order: the last window is on top. */
export type WindowState = Win[]

export type WindowAction =
  | { type: 'open'; id: AppId; x: number; y: number }
  | { type: 'close'; id: AppId }
  | { type: 'focus'; id: AppId }
  | { type: 'minimize'; id: AppId }
  | { type: 'toggleMaximize'; id: AppId }
  | { type: 'move'; id: AppId; x: number; y: number }

const raise = (state: WindowState, id: AppId, change: Partial<Win> = {}) => {
  const target = state.find((win) => win.id === id)
  if (!target) return state
  return [...state.filter((win) => win.id !== id), { ...target, ...change }]
}

export const windowsReducer = (state: WindowState, action: WindowAction): WindowState => {
  switch (action.type) {
    case 'open':
      if (state.some((win) => win.id === action.id)) return raise(state, action.id, { minimized: false })
      return [...state, { id: action.id, x: action.x, y: action.y, minimized: false, maximized: false }]
    case 'close':
      return state.filter((win) => win.id !== action.id)
    case 'focus':
      return state.at(-1)?.id === action.id ? state : raise(state, action.id)
    case 'minimize':
      // Minimized windows drop to the bottom, so the next open window takes focus.
      return (() => {
        const target = state.find((win) => win.id === action.id)
        return target ? [{ ...target, minimized: true }, ...state.filter((win) => win.id !== action.id)] : state
      })()
    case 'toggleMaximize':
      return state.map((win) => (win.id === action.id ? { ...win, maximized: !win.maximized } : win))
    case 'move':
      return state.map((win) => (win.id === action.id ? { ...win, x: action.x, y: action.y } : win))
  }
}

export const focusedWindow = (state: WindowState) => state.findLast((win) => !win.minimized)

/** What clicking an app in the dock does, given the current state. */
export const dockAction = (state: WindowState, id: AppId): 'open' | 'minimize' => (focusedWindow(state)?.id === id ? 'minimize' : 'open')
