import { useState, useCallback } from 'react'
import { useDraggableWindow } from '../hooks/useDraggableWindow'
import { useTheme } from '../context/ThemeContext'

const sizes = ['Small', 'Medium', 'Large']

const Settings = ({ isOpen, isClose, onMinimize, position = { x: 0, y: 0 }, onPositionChange }) => {
  const { handleMouseDown } = useDraggableWindow(position, onPositionChange || (() => {}))
  const { isDark, toggleTheme, fontSize, setFontSize } = useTheme()
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = useCallback(() => setIsClosing(true), [])
  const handleAnimationEnd = useCallback(() => {
    if (isClosing) isClose()
  }, [isClosing, isClose])

  if (!isOpen) return null

  return (
    <div
      className={`absolute h-[80vh] max-h-[520px] w-[95vw] max-w-[520px] md:h-[470px] md:w-[500px] bg-white dark:bg-[#2d2d2d] rounded-xl z-20 flex flex-col overflow-hidden shadow-2xl ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`}
      style={{ left: position.x, top: position.y }}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="shrink-0 h-10 flex items-center pl-3 pr-4 cursor-grab active:cursor-grabbing bg-[#f5f5f7] dark:bg-[#1f1f21] border-b border-[#d1d1d6] dark:border-[#3a3a3c]" onMouseDown={handleMouseDown}>
        <div className="flex items-center gap-2" data-no-drag>
          <span className="cursor-pointer h-3 w-3 rounded-full bg-[#ff5f57]" onClick={handleClose} />
          <span className="cursor-pointer h-3 w-3 rounded-full bg-[#febc2e]" onClick={onMinimize} />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <p className="text-xs font-semibold text-[#272727] dark:text-[#f5f5f7] mx-auto pr-12">Settings</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-[#f7f7f9] dark:bg-[#262629]">
        <div className="rounded-xl bg-white dark:bg-[#1f1f21] border border-[#ececf0] dark:border-[#3a3a3c] p-4">
          <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">Appearance</h3>
          <button
            className="w-full flex items-center justify-between rounded-lg px-3 py-2 bg-[#f5f5f7] dark:bg-[#2d2d2d] text-sm text-[#1d1d1f] dark:text-[#f5f5f7]"
            onClick={toggleTheme}
          >
            <span>Theme</span>
            <span>{isDark ? 'Dark' : 'Light'}</span>
          </button>
        </div>

        <div className="rounded-xl bg-white dark:bg-[#1f1f21] border border-[#ececf0] dark:border-[#3a3a3c] p-4 mt-4">
          <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">Text Size</h3>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  fontSize === size
                    ? 'bg-[#1d1d1f] text-white dark:bg-[#f5f5f7] dark:text-[#1d1d1f]'
                    : 'bg-[#f5f5f7] dark:bg-[#2d2d2d] text-[#1d1d1f] dark:text-[#f5f5f7]'
                }`}
                onClick={() => setFontSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#6c6c70] dark:text-[#a0a0a5] mt-3">
            Applies to the whole site via root font size (saved in this browser).
          </p>
        </div>
      </div>
    </div>
  )
}

export default Settings
