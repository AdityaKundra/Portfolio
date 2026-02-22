import { useState } from 'react'
import { notes } from './Info'
import { useDraggableWindow } from '../hooks/useDraggableWindow'

const getPreview = (content, maxLen = 60) => {
  const text = (content || '').replace(/\n/g, ' ').trim()
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text || 'No additional text'
}

const formatDateShort = (modified) => {
  if (!modified) return ''
  try {
    const d = new Date(modified.replace(/ at /, ' '))
    if (isNaN(d.getTime())) return modified
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = String(d.getFullYear()).slice(-2)
    return `${day}/${month}/${year}`
  } catch {
    return modified
  }
}

const formatTime = (modified) => {
  if (!modified) return ''
  const m = modified.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (m) return `${m[1]}:${m[2]} ${m[3].toUpperCase()}`
  return ''
}

const formatDateLong = (modified) => {
  if (!modified) return modified
  try {
    const d = new Date(modified.replace(/ at /, ' '))
    if (isNaN(d.getTime())) return modified
    return `${d.getDate()} ${d.toLocaleString('en', { month: 'long' })} ${d.getFullYear()} at ${d.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit', hour12: true })}`
  } catch {
    return modified
  }
}

const Notes = ({ isOpen, isClose, onMinimize, position = { x: 0, y: 0 }, onPositionChange }) => {
  if (!isOpen) return null

  const { handleMouseDown } = useDraggableWindow(position, onPositionChange || (() => {}))
  const [activeNoteIndex, setActiveNoteIndex] = useState(0)
  const activeNote = notes[activeNoteIndex]

  const pinnedNotes = notes.slice(0, Math.min(5, notes.length))
  const todayNotes = notes.length > 5 ? notes.slice(5, 8) : notes.slice(0, 2)

  const NoteEntry = ({ note, index, isSelected }) => (
    <div
      className={`px-3 py-2.5 cursor-pointer rounded-lg mx-2 mb-1 transition-colors ${
        isSelected ? 'bg-[#e5e5ea] dark:bg-[#3a3a3c]' : 'hover:bg-[#e5e5ea]/80 dark:hover:bg-[#3a3a3c]/60'
      }`}
      onClick={() => setActiveNoteIndex(index)}
    >
      <p className="text-[13px] font-semibold text-[#1d1d1f] dark:text-white truncate">{note.title}</p>
      <p className="text-[11px] text-[#6c6c70] dark:text-[#8e8e93] mt-0.5">
        {formatDateShort(note.modified)} {formatTime(note.modified) && `• ${formatTime(note.modified)}`}
      </p>
      <p className="text-[11px] text-[#6c6c70] dark:text-[#8e8e93] mt-1 line-clamp-2">{getPreview(note.content)}</p>
      <div className="flex items-center gap-1 mt-2 text-[10px] text-[#6c6c70] dark:text-[#8e8e93]">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path d="M4 4h7l2 2h9a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.3" />
        </svg>
        <span>Notes</span>
      </div>
    </div>
  )

  return (
    <div
      className="absolute h-[80vh] max-h-[600px] w-[95vw] max-w-[800px] md:h-[560px] md:w-[800px] bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-xl z-20 flex flex-col overflow-hidden shadow-2xl animate-scale-in"
      style={{ left: position.x, top: position.y }}
    >
      {/* Title bar */}
      <div
        className="shrink-0 h-10 flex items-center pl-3 pr-4 cursor-grab active:cursor-grabbing bg-[#f5f5f7] dark:bg-[#1c1c1e] border-b border-[#d1d1d6] dark:border-[#38383a]"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2" data-no-drag>
          <span className="cursor-pointer h-3 w-3 rounded-full bg-[#ff5f57]" onClick={isClose} />
          <span className="cursor-pointer h-3 w-3 rounded-full bg-[#febc2e]" onClick={onMinimize} />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
      </div>

      {/* Top toolbar */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 bg-[#f5f5f7] dark:bg-[#1c1c1e] border-b border-[#d1d1d6] dark:border-[#38383a]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#6c6c70] dark:text-[#8e8e93]">
              <path d="M4 4h7l2 2h9a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
            </svg>
            <span className="text-[15px] font-semibold text-[#1d1d1f] dark:text-white">All iCloud</span>
          </div>
          <span className="text-[13px] text-[#6c6c70] dark:text-[#8e8e93]">{notes.length} notes</span>
          <div className="flex items-center gap-1 ml-2">
            <button className="p-1.5 rounded hover:bg-[#e5e5ea] dark:hover:bg-[#3a3a3c] text-[#6c6c70] dark:text-[#8e8e93]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            </button>
            <button className="p-1.5 rounded bg-[#e5e5ea] dark:bg-[#3a3a3c] text-[#6c6c70] dark:text-[#8e8e93]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
            <button className="p-1.5 rounded hover:bg-[#e5e5ea] dark:hover:bg-[#3a3a3c] text-[#6c6c70] dark:text-[#8e8e93]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </button>
            <button className="p-1.5 rounded hover:bg-[#e5e5ea] dark:hover:bg-[#3a3a3c] text-[#6c6c70] dark:text-[#8e8e93]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded hover:bg-[#e5e5ea] dark:hover:bg-[#3a3a3c] text-[#6c6c70] dark:text-[#8e8e93]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </button>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#e5e5ea] dark:bg-[#2c2c2e] w-40">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#6c6c70] dark:text-[#8e8e93] shrink-0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span className="text-[13px] text-[#6c6c70] dark:text-[#8e8e93]">Search</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left sidebar */}
        <div className="w-[280px] shrink-0 flex flex-col overflow-hidden bg-[#ebebf0] dark:bg-[#2c2c2e]">
          <div className="flex-1 min-h-0 overflow-y-auto py-2">
            <div className="mb-2">
              <button className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-[#e5e5ea]/60 dark:hover:bg-[#3a3a3c]/50">
                <span className="text-[13px] font-semibold text-[#1d1d1f] dark:text-white">Pinned</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#6c6c70] dark:text-[#8e8e93]"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {pinnedNotes.map((note) => {
                const index = notes.indexOf(note)
                return <NoteEntry key={index} note={note} index={index} isSelected={activeNoteIndex === index} />
              })}
            </div>
            <div>
              <button className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-[#e5e5ea]/60 dark:hover:bg-[#3a3a3c]/50">
                <span className="text-[13px] font-semibold text-[#1d1d1f] dark:text-white">Today</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#6c6c70] dark:text-[#8e8e93]"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {todayNotes.map((note) => {
                const index = notes.indexOf(note)
                return <NoteEntry key={index} note={note} index={index} isSelected={activeNoteIndex === index} />
              })}
            </div>
          </div>
        </div>

        {/* Right content area */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#f5f5f7] dark:bg-[#1c1c1e] overflow-hidden">
          {activeNote ? (
            <>
              <div className="shrink-0 flex justify-end px-6 pt-4">
                <p className="text-[12px] text-[#6c6c70] dark:text-[#8e8e93]">{formatDateLong(activeNote.modified)}</p>
              </div>
              <div className="flex-1 overflow-y-auto px-6 pb-8 text-start">
                <div className="text-[15px] text-[#1d1d1f] dark:text-[#e5e5ea] leading-[1.6] whitespace-pre-wrap min-h-[200px]">
                  {activeNote.content || ''}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#6c6c70] dark:text-[#8e8e93]">
              <p className="text-sm">Select a note</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notes
