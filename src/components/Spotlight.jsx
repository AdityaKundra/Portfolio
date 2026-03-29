import { useEffect, useMemo, useState } from 'react'
import { projectList, socialLinks } from './Info'

const appTargets = ['Terminal', 'Messages', 'Contacts', 'Photos', 'Notes', 'Safari', 'Music', 'Settings']

const Spotlight = ({ isOpen, onClose, onLaunch }) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const items = useMemo(() => {
    const base = [
      ...appTargets.map((name) => ({ id: `app-${name}`, label: name, type: 'app', value: name })),
      ...projectList.map((p) => ({ id: `project-${p.name}`, label: p.name.replaceAll('_', ' '), type: 'project', value: p.name })),
      ...Object.entries(socialLinks).map(([name, url]) => ({ id: `link-${name}`, label: name, type: 'link', value: url })),
    ]
    const q = query.trim().toLowerCase()
    if (!q) return base.slice(0, 9)
    return base.filter((item) => item.label.toLowerCase().includes(q)).slice(0, 9)
  }, [query])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query, isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 bg-black/25 flex items-start justify-center pt-[14vh]" onClick={onClose}>
      <div className="w-[92vw] max-w-[620px] rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-[#2d2d2d] animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-[#e5e5ea] dark:border-[#3a3a3c]">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSelectedIndex((prev) => (items.length ? (prev + 1) % items.length : 0))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSelectedIndex((prev) => (items.length ? (prev - 1 + items.length) % items.length : 0))
              } else if (e.key === 'Enter') {
                e.preventDefault()
                if (!items.length) return
                onLaunch(items[selectedIndex] ?? items[0])
                onClose()
              }
            }}
            placeholder="Search apps, projects, links..."
            className="w-full bg-transparent text-sm outline-none text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#8e8e93]"
          />
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2 space-y-1 bg-[#f7f7f9] dark:bg-[#262629]">
          {items.map((item, index) => (
            <button
              key={item.id}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm text-[#1d1d1f] dark:text-[#f5f5f7] ${
                index === selectedIndex
                  ? 'bg-[#e5e5ea] dark:bg-[#3a3a3c]'
                  : 'hover:bg-[#e5e5ea] dark:hover:bg-[#3a3a3c]'
              }`}
              onClick={() => {
                onLaunch(item)
                onClose()
              }}
            >
              <span>{item.label}</span>
              <span className="ml-2 text-[11px] text-[#8e8e93] uppercase">{item.type}</span>
            </button>
          ))}
          {items.length === 0 && (
            <div className="px-3 py-2 text-sm text-[#8e8e93]">No results</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Spotlight
