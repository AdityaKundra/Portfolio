import { useState } from 'react'
import { useDraggableWindow } from '../hooks/useDraggableWindow'

const Safari = ({ isOpen, isClose, onMinimize, position = { x: 0, y: 0 }, onPositionChange }) => {
  if (!isOpen) return null
  const { handleMouseDown } = useDraggableWindow(position, onPositionChange || (() => {}))
  const [address, setAddress] = useState('https://github.com/adityaKundra')

  const links = [
    ['Portfolio GitHub', 'https://github.com/adityaKundra'],
    ['LinkedIn', 'https://www.linkedin.com/in/adi-kundra/'],
    ['LeetCode', 'https://leetcode.com/u/PracticeAdi/'],
  ]

  return (
    <div
      className="absolute h-[80vh] max-h-[620px] w-[95vw] max-w-[900px] md:h-[560px] md:w-[860px] bg-white dark:bg-[#2d2d2d] rounded-xl z-20 flex flex-col overflow-hidden shadow-2xl animate-scale-in"
      style={{ left: position.x, top: position.y }}
    >
      <div className="shrink-0 h-10 flex items-center pl-3 pr-4 cursor-grab active:cursor-grabbing bg-[#f5f5f7] dark:bg-[#1f1f21] border-b border-[#d1d1d6] dark:border-[#3a3a3c]" onMouseDown={handleMouseDown}>
        <div className="flex items-center gap-2" data-no-drag>
          <span className="cursor-pointer h-3 w-3 rounded-full bg-[#ff5f57]" onClick={isClose} />
          <span className="cursor-pointer h-3 w-3 rounded-full bg-[#febc2e]" onClick={onMinimize} />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <p className="text-xs font-semibold text-[#272727] dark:text-[#f5f5f7] mx-auto pr-12">Safari</p>
      </div>
      <div className="px-4 py-2 bg-[#fafafc] dark:bg-[#262629] border-b border-[#ececf0] dark:border-[#3a3a3c]">
        <div className="flex gap-2" data-no-drag>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') window.open(address, '_blank')
            }}
            className="flex-1 rounded-md px-3 py-1.5 text-xs bg-white dark:bg-[#1f1f21] text-[#1d1d1f] dark:text-[#f5f5f7] outline-none"
          />
          <button
            className="rounded-md px-3 py-1.5 text-xs font-medium bg-[#1d1d1f] text-white dark:bg-[#f5f5f7] dark:text-[#1d1d1f]"
            onClick={() => window.open(address, '_blank')}
          >
            Open
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-[#f7f7f9] dark:bg-[#262629] space-y-3">
        {links.map(([label, href]) => (
          <button key={label} className="w-full text-left rounded-lg px-4 py-3 bg-white dark:bg-[#1f1f21] hover:opacity-90 transition" onClick={() => window.open(href, '_blank')}>
            <p className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{label}</p>
            <p className="text-xs text-[#6c6c70] dark:text-[#a0a0a5] mt-0.5 truncate">{href}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Safari
