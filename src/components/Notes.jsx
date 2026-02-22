import { useState } from 'react'
import { notes } from './Info'
import { useDraggableWindow } from '../hooks/useDraggableWindow'

const getPreview = (content, maxLen = 80) => {
  const text = (content || '').replace(/\n/g, ' ').trim()
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text
}

const Notes = ({ isOpen, isClose, onMinimize, position = { x: 0, y: 0 }, onPositionChange }) => {
  if (!isOpen) return null

  const { handleMouseDown } = useDraggableWindow(position, onPositionChange || (() => {}))
  const [activeNoteIndex, setActiveNoteIndex] = useState(0)
  const activeNote = notes[activeNoteIndex]

  return (
    <div
      className='absolute h-[80vh] max-h-[550px] w-[95vw] max-w-[720px] md:h-[480px] md:w-[720px] bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-xl z-20 flex flex-col overflow-hidden animate-scale-in'
      style={{ left: position.x, top: position.y, boxShadow: 'rgba(0, 0, 0, 0.12) 0px 8px 32px 0px' }}
    >
      {/* Title bar - macOS style, minimal */}
      <div
        className='shrink-0 h-9 flex items-center pl-3 pr-2 cursor-grab active:cursor-grabbing'
        style={{ background: 'linear-gradient(180deg, #f6f6f6 0%, #ededed 100%)', borderBottom: '1px solid #d1d1d6' }}
        onMouseDown={handleMouseDown}
      >
        <div className='flex items-center gap-2' data-no-drag>
          <span className='cursor-pointer h-3 w-3 rounded-full bg-[#ED6A5E] border border-[#CE5347]' onClick={isClose} />
          <span className='cursor-pointer h-3 w-3 rounded-full bg-[#F5BD4F] border border-[#D6A243]' onClick={onMinimize} />
          <span className='h-3 w-3 rounded-full bg-[#61C554] border border-[#58A942]' />
        </div>
      </div>

      <div className='flex flex-1 min-h-0'>
        {/* Left sidebar - folder list + notes list */}
        <div
          className='w-[220px] shrink-0 flex flex-col overflow-hidden'
          style={{ backgroundColor: '#e8e8ed', borderRight: '1px solid #d1d1d6' }}
        >
          {/* Folders section */}
          <div className='shrink-0 pt-2 pb-1 px-2'>
            <div className='flex items-center gap-2 py-2 px-2 rounded-md hover:bg-black/5 cursor-default'>
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' className='text-amber-500'>
                <path d='M4 4h7l2 2h9a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' fill='currentColor' fillOpacity='0.3' />
              </svg>
              <span className='text-[13px] font-medium text-[#1d1d1f]'>All Notes</span>
            </div>
            <div className='text-[11px] text-[#86868b] font-medium uppercase tracking-wider px-2 py-1.5 mt-1'>
              iCloud
            </div>
          </div>

          {/* Notes list */}
          <div className='flex-1 min-h-0 overflow-y-auto'>
            {notes.map((note, index) => (
              <div
                key={index}
                className={`px-3 py-2.5 cursor-pointer border-b border-[#d1d1d6]/50 transition-colors ${
                  activeNoteIndex === index
                    ? 'bg-[#d1d1d6]/40'
                    : 'hover:bg-black/5'
                }`}
                onClick={() => setActiveNoteIndex(index)}
              >
                <p className={`text-[13px] font-medium truncate ${activeNoteIndex === index ? 'text-[#1d1d1f]' : 'text-[#1d1d1f]'}`}>
                  {note.title}
                </p>
                <p className='text-[11px] text-[#86868b] truncate mt-0.5'>
                  {getPreview(note.content)}
                </p>
                <p className='text-[10px] text-[#86868b] mt-1'>{note.modified}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right content area */}
        <div className='flex-1 flex flex-col min-h-0 bg-white overflow-hidden'>
          {activeNote ? (
            <>
              {/* Note title - macOS Notes style, large */}
              <div className='shrink-0 px-8 pt-6 pb-2'>
                <h1 className='text-2xl font-semibold text-[#1d1d1f] border-none outline-none w-full bg-transparent'>
                  {activeNote.title}
                </h1>
                <p className='text-xs text-[#86868b] mt-1'>{activeNote.modified}</p>
              </div>
              {/* Note body */}
              <div className='flex-1 overflow-y-auto px-8 pb-8'>
                <div
                  className='text-[15px] text-[#1d1d1f] leading-[1.5] whitespace-pre-wrap'
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                >
                  {activeNote.content}
                </div>
              </div>
            </>
          ) : (
            <div className='flex-1 flex flex-col items-center justify-center text-[#86868b]'>
              <svg width='64' height='64' viewBox='0 0 24 24' fill='none' className='opacity-40 mb-4'>
                <path d='M4 4h7l2 2h9a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' fill='currentColor' fillOpacity='0.2' />
              </svg>
              <p className='text-sm font-medium'>No Note Selected</p>
              <p className='text-xs mt-1'>Select a note from the list</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notes
