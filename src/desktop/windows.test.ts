import { describe, expect, it } from 'vitest'
import { dockAction, focusedWindow, windowsReducer, type WindowState } from './windows'

const open = (state: WindowState, id: 'notes' | 'ask' | 'terminal') => windowsReducer(state, { type: 'open', id, x: 0, y: 0 })

describe('window manager', () => {
  it('stacks newly opened windows on top', () => {
    expect(focusedWindow(open(open([], 'notes'), 'ask'))?.id).toBe('ask')
  })

  it('reopening raises and restores instead of duplicating', () => {
    let state = open(open([], 'notes'), 'ask')
    state = windowsReducer(state, { type: 'minimize', id: 'notes' })
    state = open(state, 'notes')
    expect(state).toHaveLength(2)
    expect(focusedWindow(state)).toMatchObject({ id: 'notes', minimized: false })
  })

  it('moves focus to the next visible window on minimize', () => {
    const state = windowsReducer(open(open([], 'notes'), 'ask'), { type: 'minimize', id: 'ask' })
    expect(focusedWindow(state)?.id).toBe('notes')
  })

  it('has no focused window when everything is minimized', () => {
    expect(focusedWindow(windowsReducer(open([], 'notes'), { type: 'minimize', id: 'notes' }))).toBeUndefined()
  })

  it('the dock minimizes only the focused app, and otherwise brings it forward', () => {
    const state = open(open([], 'notes'), 'ask')
    expect(dockAction(state, 'ask')).toBe('minimize')
    expect(dockAction(state, 'notes')).toBe('open')
    expect(dockAction(state, 'terminal')).toBe('open')
  })

  it('maximize toggles without changing the stored position', () => {
    const start = windowsReducer([], { type: 'open', id: 'notes', x: 12, y: 34 })
    const state = windowsReducer(start, { type: 'toggleMaximize', id: 'notes' })
    expect(state[0]).toMatchObject({ maximized: true, x: 12, y: 34 })
  })
})
