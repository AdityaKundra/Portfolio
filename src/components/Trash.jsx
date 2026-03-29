import { useState, useCallback } from 'react'
import { useDraggableWindow } from '../hooks/useDraggableWindow'

const Trash = ({ isOpen, isClose, onMinimize, position = { x: 0, y: 0 }, onPositionChange }) => {
  const { handleMouseDown } = useDraggableWindow(position, onPositionChange || (() => {}))
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = useCallback(() => setIsClosing(true), [])
  const handleAnimationEnd = useCallback(() => {
    if (isClosing) isClose()
  }, [isClosing, isClose])

  if (!isOpen) return null

  return (
    <div
      className={`absolute h-[80vh] max-h-[340px] w-[95vw] max-w-[420px] md:h-[280px] md:w-[400px] bg-white dark:bg-[#2d2d2d] rounded-xl z-20 flex flex-col overflow-hidden shadow-2xl ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`}
      style={{ left: position.x, top: position.y }}
      onAnimationEnd={handleAnimationEnd}
    >
      <div
        className="shrink-0 h-10 flex items-center pl-3 pr-4 cursor-grab active:cursor-grabbing bg-[#f5f5f7] dark:bg-[#1f1f21] border-b border-[#d1d1d6] dark:border-[#3a3a3c]"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2" data-no-drag>
          <span className="cursor-pointer h-3 w-3 rounded-full bg-[#ff5f57]" onClick={handleClose} />
          <span className="cursor-pointer h-3 w-3 rounded-full bg-[#febc2e]" onClick={onMinimize} />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <p className="text-xs font-semibold text-[#272727] dark:text-[#f5f5f7] mx-auto pr-12">Trash</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#f7f7f9] dark:bg-[#262629]">
        <p className="text-4xl mb-3" aria-hidden>
          🗑️
        </p>
        <p className="text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">Trash is empty</p>
        <p className="text-xs text-[#6c6c70] dark:text-[#a0a0a5] mt-2 max-w-[280px]">
          Nothing to delete here—your portfolio code is safe. This is just for the desktop vibe.
        </p>
      </div>
    </div>
  )
}

export default Trash
