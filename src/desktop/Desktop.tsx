import { useCallback, useEffect, useReducer, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { AskPanel } from '../components/AskPanel'
import { HireButton } from '../components/HireDialog'
import { DocGlyph, FolderGlyph, SearchGlyph } from '../components/Icons'
import { ThemeToggle } from '../components/ThemeToggle'
import { profile } from '../content/profile'
import { caseStudies, findCaseStudy } from '../content/work'
import { APPS } from './apps'
import { Contact, Notes, ProjectWindow, Projects, ReadMe, Settings } from './apps/ContentApps'
import { Terminal } from './apps/Terminal'
import { CommandPalette } from './CommandPalette'
import { Window } from './Window'
import { dockAction, focusedWindow, windowsReducer, type AppId } from './windows'

const PROJECT_SIZE = { width: 620, height: 540 }

const sizeOf = (id: AppId) => {
  const app = APPS.find((entry) => entry.id === id)
  return app ? { width: app.width, height: app.height } : PROJECT_SIZE
}

const titleOf = (id: AppId) => {
  if (id.startsWith('project:')) return findCaseStudy(id.slice('project:'.length))?.title ?? 'Project'
  return APPS.find((entry) => entry.id === id)?.title ?? id
}

/** A desktop icon: a real button that can also be dragged, with no overlap at rest. */
const DesktopItem = ({ label, icon, onOpen }: { label: string; icon: React.ReactNode; onOpen: () => void }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const drag = useRef<{ startX: number; startY: number; originX: number; originY: number; moved: boolean } | null>(null)
  const suppressClick = useRef(false)

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    drag.current = { startX: event.clientX, startY: event.clientY, originX: offset.x, originY: offset.y, moved: false }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const state = drag.current
    if (!state) return
    const dx = event.clientX - state.startX
    const dy = event.clientY - state.startY
    if (!state.moved && Math.hypot(dx, dy) < 5) return
    state.moved = true
    setOffset({ x: state.originX + dx, y: state.originY + dy })
  }
  const onPointerUp = () => {
    suppressClick.current = drag.current?.moved ?? false
    drag.current = null
  }

  return (
    <button
      type="button"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={() => {
        if (suppressClick.current) suppressClick.current = false
        else onOpen()
      }}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      className="group flex w-28 flex-col items-center gap-1.5 rounded-md p-2 text-center select-none hover:bg-accent-soft md:touch-none"
    >
      <span className="text-[2.6rem] leading-none text-accent">{icon}</span>
      <span className="text-[0.8rem] leading-tight font-medium">{label}</span>
    </button>
  )
}

const Clock = () => {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(timer)
  }, [])
  return <time className="hidden font-mono text-xs text-muted sm:block">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
}

const Desktop = () => {
  const [windows, dispatch] = useReducer(windowsReducer, [])
  const [paletteOpen, setPaletteOpen] = useState(false)
  const workspace = useRef<HTMLDivElement>(null)
  const opened = useRef(0)
  const navigate = useNavigate()
  const exit = useCallback(() => void navigate('/'), [navigate])

  const open = useCallback((id: AppId) => {
    const area = workspace.current
    const { width, height } = sizeOf(id)
    const step = (opened.current++ % 6) * 28
    const x = area ? Math.max(16, Math.min((area.clientWidth - width) / 2 - 140 + step, area.clientWidth - width - 16)) : 40
    const y = area ? Math.max(12, Math.min((area.clientHeight - height) / 2 - 30 + step, area.clientHeight - height - 12)) : 40
    dispatch({ type: 'open', id, x, y })
  }, [])

  useEffect(() => {
    if (window.matchMedia('(min-width: 768px)').matches) open('readme')
  }, [open])

  const focused = focusedWindow(windows)?.id

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((value) => !value)
      } else if (event.key === 'Escape' && !paletteOpen && focused) {
        dispatch({ type: 'close', id: focused })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [paletteOpen, focused])

  const renderApp = (id: AppId) => {
    if (id.startsWith('project:')) return <ProjectWindow slug={id.slice('project:'.length)} />
    switch (id) {
      case 'readme': return <ReadMe open={open} />
      case 'projects': return <Projects open={open} />
      case 'ask': return <AskPanel compact />
      case 'notes': return <Notes />
      case 'terminal': return <Terminal open={open} exit={exit} />
      case 'contact': return <Contact />
      case 'settings': return <Settings />
    }
  }

  return (
    <div className="graph relative flex h-dvh flex-col overflow-hidden">
      <header className="z-[900] flex h-11 shrink-0 items-center justify-between gap-3 border-b border-line bg-panel px-3">
        <Link to="/" className="rounded px-1.5 py-1 text-sm text-muted transition-colors hover:text-ink">← <span className="max-sm:sr-only">Standard site</span><span className="sm:hidden">Back</span></Link>
        <div className="flex items-center gap-1 sm:gap-3">
          <button type="button" onClick={() => setPaletteOpen(true)} className="inline-flex items-center gap-2 rounded border border-line px-2.5 py-1 text-sm text-muted transition-colors hover:border-accent hover:text-ink">
            <SearchGlyph /> <span className="max-sm:sr-only">Search</span> <kbd className="hidden font-mono text-xs sm:inline">⌘K</kbd>
          </button>
          <Clock />
          <HireButton className="px-2.5 py-1 text-sm" />
          <ThemeToggle />
        </div>
      </header>

      <main ref={workspace} className="relative min-h-0 flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-5 md:overflow-hidden md:p-8">
          <div className="max-md:mb-6">
            <h1 className="text-3xl font-semibold tracking-tight lg:text-5xl">{profile.name}</h1>
            <p className="mt-1 text-muted">{profile.role}, {profile.employer}</p>
          </div>
          <nav aria-label="Desktop items" className="grid grid-cols-[repeat(auto-fill,7rem)] justify-center gap-1 md:absolute md:top-5 md:right-6 md:grid-cols-[7rem_7rem] md:justify-end">
            {caseStudies.map((study) => (
              <DesktopItem key={study.slug} label={study.title} icon={<FolderGlyph />} onOpen={() => open(`project:${study.slug}`)} />
            ))}
            <DesktopItem label="All projects" icon={<FolderGlyph />} onOpen={() => open('projects')} />
            <DesktopItem label="Resume" icon={<DocGlyph />} onOpen={() => window.open(profile.resumeUrl, '_blank', 'noopener')} />
          </nav>
        </div>

        {windows.map((win, index) =>
          win.minimized ? null : (
            <Window
              key={win.id}
              title={titleOf(win.id)}
              x={win.x}
              y={win.y}
              {...sizeOf(win.id)}
              maximized={win.maximized}
              z={10 + index}
              onFocus={() => dispatch({ type: 'focus', id: win.id })}
              onClose={() => dispatch({ type: 'close', id: win.id })}
              onMinimize={() => dispatch({ type: 'minimize', id: win.id })}
              onToggleMaximize={() => dispatch({ type: 'toggleMaximize', id: win.id })}
              onMove={(x, y) => dispatch({ type: 'move', id: win.id, x, y })}
            >
              {renderApp(win.id)}
            </Window>
          ),
        )}
      </main>

      <nav aria-label="Dock" className="z-[900] flex shrink-0 justify-center border-t border-line bg-panel px-2 py-1.5">
        <ul className="flex gap-1 sm:gap-2">
          {APPS.map((app) => {
            const running = windows.some((win) => win.id === app.id)
            const Glyph = app.icon
            return (
              <li key={app.id} className="relative">
                <button
                  type="button"
                  title={app.title}
                  aria-label={`${app.title}${running ? ' (open)' : ''}`}
                  aria-pressed={focused === app.id}
                  onClick={() => (dockAction(windows, app.id) === 'minimize' ? dispatch({ type: 'minimize', id: app.id }) : open(app.id))}
                  className={`grid size-10 place-items-center rounded-lg text-xl text-white transition-transform motion-safe:hover:-translate-y-0.5 sm:size-11 ${app.tile}`}
                >
                  <Glyph />
                </button>
                {running && <span aria-hidden="true" className="absolute -bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-ink" />}
              </li>
            )
          })}
        </ul>
      </nav>

      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} open={open} exit={exit} />}
    </div>
  )
}

export default Desktop
