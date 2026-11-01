import { useEffect, useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'

interface WindowProps {
  title: string
  x: number
  y: number
  width: number
  height: number
  maximized: boolean
  z: number
  onFocus: () => void
  onClose: () => void
  onMinimize: () => void
  onToggleMaximize: () => void
  onMove: (x: number, y: number) => void
  children: ReactNode
}

const controlClass = 'grid size-7 place-items-center rounded font-mono text-sm leading-none text-muted transition-colors hover:bg-accent-soft hover:text-ink max-md:size-9'

const NUDGE = 24

export const Window = ({ title, x, y, width, height, maximized, z, onFocus, onClose, onMinimize, onToggleMaximize, onMove, children }: WindowProps) => {
  const root = useRef<HTMLElement>(null)
  const drag = useRef<{ dx: number; dy: number } | null>(null)

  useEffect(() => {
    // Children such as the terminal focus their own input. Otherwise take focus for keyboard users.
    if (root.current && !root.current.contains(document.activeElement)) root.current.focus({ preventScroll: true })
  }, [])

  const clamp = (nextX: number, nextY: number) => {
    const parent = root.current?.parentElement
    if (!parent) return { x: nextX, y: nextY }
    return {
      x: Math.min(Math.max(nextX, 80 - width), parent.clientWidth - 80),
      y: Math.min(Math.max(nextY, 0), parent.clientHeight - 44),
    }
  }

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (maximized || event.button !== 0 || (event.target as HTMLElement).closest('button')) return
    drag.current = { dx: event.clientX - x, dy: event.clientY - y }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    const next = clamp(event.clientX - drag.current.dx, event.clientY - drag.current.dy)
    onMove(next.x, next.y)
  }

  const nudge = (event: KeyboardEvent<HTMLDivElement>) => {
    const delta = { ArrowLeft: [-NUDGE, 0], ArrowRight: [NUDGE, 0], ArrowUp: [0, -NUDGE], ArrowDown: [0, NUDGE] }[event.key]
    if (!delta || maximized || event.target !== event.currentTarget) return
    event.preventDefault()
    const next = clamp(x + delta[0], y + delta[1])
    onMove(next.x, next.y)
  }

  return (
    <section
      ref={root}
      role="dialog"
      aria-label={title}
      tabIndex={-1}
      onPointerDownCapture={onFocus}
      onFocusCapture={onFocus}
      className={`window-in absolute flex flex-col overflow-hidden border border-ink/70 bg-panel shadow-[6px_6px_0_rgb(0_0_0/0.1)] outline-none max-md:!top-0 max-md:!left-0 max-md:!h-full max-md:!w-full max-md:border-0 max-md:shadow-none ${maximized ? '!top-0 !left-0 !h-full !w-full shadow-none' : ''}`}
      style={{ left: x, top: y, width, height, zIndex: z }}
    >
      <div
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        onDoubleClick={(event) => {
          if (!(event.target as HTMLElement).closest('button')) onToggleMaximize()
        }}
        onKeyDown={nudge}
        tabIndex={0}
        role="group"
        aria-label={`${title} title bar. Use arrow keys to move the window.`}
        className={`flex shrink-0 touch-none items-center justify-between border-b border-ink/70 bg-paper pl-3 pr-1 select-none max-md:border-line ${maximized ? '' : 'md:cursor-grab md:active:cursor-grabbing'}`}
      >
        <h2 className="truncate py-1.5 font-mono text-xs font-medium">{title}</h2>
        <div className="flex shrink-0 items-center">
          <button type="button" className={controlClass} onClick={onMinimize} aria-label={`Minimize ${title}`}>–</button>
          <button type="button" className={`${controlClass} max-md:hidden`} onClick={onToggleMaximize} aria-label={maximized ? `Restore ${title}` : `Maximize ${title}`}>{maximized ? '❐' : '□'}</button>
          <button type="button" className={controlClass} onClick={onClose} aria-label={`Close ${title}`}>×</button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </section>
  )
}
