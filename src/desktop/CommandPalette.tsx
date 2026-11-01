import { useEffect, useMemo, useRef, useState } from 'react'
import { caseStudies } from '../content/work'
import { profile } from '../content/profile'
import { openHire } from '../lib/hire'
import { APPS } from './apps'
import type { AppId } from './windows'

type Item = { id: string; label: string; hint: string; run: () => void }

export const CommandPalette = ({ onClose, open, exit }: { onClose: () => void; open: (id: AppId) => void; exit: () => void }) => {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const previousFocus = useRef(document.activeElement as HTMLElement | null)

  useEffect(() => {
    const target = previousFocus.current
    return () => target?.focus?.({ preventScroll: true })
  }, [])

  const items = useMemo<Item[]>(() => {
    const external = (url: string) => () => window.open(url, '_blank', 'noopener')
    const all: Item[] = [
      ...caseStudies.map((study) => ({ id: study.slug, label: study.title, hint: 'Case study', run: () => open(`project:${study.slug}`) })),
      ...APPS.map((app) => ({ id: app.id, label: app.title, hint: 'App', run: () => open(app.id) })),
      { id: 'shelf', label: 'Shelf: writing and recommendations', hint: 'Page', run: () => { window.location.href = '/shelf' } },
      { id: 'hire', label: 'Hire me', hint: 'Action', run: () => openHire() },
      { id: 'resume', label: 'Resume', hint: 'Link', run: external(profile.resumeUrl) },
      { id: 'github', label: 'GitHub', hint: 'Link', run: external(profile.links.github) },
      { id: 'linkedin', label: 'LinkedIn', hint: 'Link', run: external(profile.links.linkedin) },
      { id: 'email', label: `Email ${profile.email}`, hint: 'Link', run: () => { window.location.href = `mailto:${profile.email}` } },
      { id: 'exit', label: 'Exit desktop mode', hint: 'Action', run: exit },
    ]
    const needle = query.trim().toLowerCase()
    return needle ? all.filter((item) => item.label.toLowerCase().includes(needle)) : all
  }, [query, open, exit])

  const choose = (item?: Item) => {
    if (!item) return
    onClose()
    item.run()
  }

  return (
    <div className="absolute inset-0 z-[1000] flex items-start justify-center bg-ink/25 px-4 pt-[12vh]" onPointerDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div role="dialog" aria-modal="true" aria-label="Search" className="window-in w-full max-w-xl overflow-hidden border border-ink/70 bg-panel shadow-[6px_6px_0_rgb(0_0_0/0.14)]">
        <input
          autoFocus
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-results"
          aria-activedescendant={items[selected] ? `palette-${items[selected].id}` : undefined}
          aria-label="Search projects, apps and links"
          placeholder="Search projects, apps and links"
          value={query}
          onChange={(event) => { setQuery(event.target.value); setSelected(0) }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') { event.stopPropagation(); onClose() }
            else if (event.key === 'ArrowDown') { event.preventDefault(); setSelected((value) => (items.length ? (value + 1) % items.length : 0)) }
            else if (event.key === 'ArrowUp') { event.preventDefault(); setSelected((value) => (items.length ? (value - 1 + items.length) % items.length : 0)) }
            else if (event.key === 'Enter') { event.preventDefault(); choose(items[selected]) }
          }}
          className="w-full border-b border-line bg-transparent px-4 py-3 outline-none placeholder:text-muted"
        />
        <ul id="palette-results" role="listbox" aria-label="Results" className="max-h-[50vh] overflow-y-auto p-1.5">
          {items.map((item, index) => (
            <li key={item.id} id={`palette-${item.id}`} role="option" aria-selected={index === selected} onPointerMove={() => setSelected(index)} onClick={() => choose(item)} className={`flex cursor-pointer items-center justify-between gap-4 rounded px-3 py-2 text-sm ${index === selected ? 'bg-accent-soft' : ''}`}>
              <span>{item.label}</span>
              <span className="eyebrow shrink-0">{item.hint}</span>
            </li>
          ))}
          {items.length === 0 && <li className="px-3 py-2 text-sm text-muted">No results</li>}
        </ul>
      </div>
    </div>
  )
}
