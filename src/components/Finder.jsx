import { useState, useCallback } from 'react'
import { projectList } from './Info'
import { useDraggableWindow } from '../hooks/useDraggableWindow'

const Finder = ({
  isOpen,
  isClose,
  onMinimize,
  position = { x: 0, y: 0 },
  onPositionChange,
  onOpenProject,
}) => {
  const { handleMouseDown } = useDraggableWindow(position, onPositionChange || (() => {}))
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = useCallback(() => setIsClosing(true), [])
  const handleAnimationEnd = useCallback(() => {
    if (isClosing) isClose()
  }, [isClosing, isClose])

  if (!isOpen) return null

  const openRow = (name) => {
    onOpenProject?.(name)
  }

  return (
    <div
      className={`absolute h-[80vh] max-h-[480px] w-[95vw] max-w-[640px] md:h-[420px] md:w-[640px] bg-white dark:bg-[#2d2d2d] rounded-xl z-20 flex overflow-hidden shadow-2xl ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`}
      style={{ left: position.x, top: position.y }}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="w-[140px] shrink-0 bg-[#ececec] dark:bg-[#3a3a3c] border-r border-[#d0d0d0] dark:border-[#52525b] py-3 px-2">
        <div className="flex gap-2 mb-3 px-1" data-no-drag>
          <span className="cursor-pointer h-3 w-3 rounded-full bg-[#ff5f57]" onClick={handleClose} />
          <span className="cursor-pointer h-3 w-3 rounded-full bg-[#febc2e]" onClick={onMinimize} />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <p className="text-[11px] font-semibold text-[#6b6b6b] dark:text-[#a1a1a6] uppercase px-2 mb-1">Favorites</p>
        <div className="rounded-md bg-white/80 dark:bg-[#2d2d2d] px-2 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400">
          Projects
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div
          className="shrink-0 h-9 flex items-center px-3 border-b border-[#e5e5ea] dark:border-[#3a3a3c] bg-[#fafafa] dark:bg-[#2d2d2d] cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <span className="text-xs font-semibold text-[#272727] dark:text-[#f5f5f7]">Finder — Projects</span>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-[#f5f5f7] dark:bg-[#1f1f21] border-b border-[#e5e5ea] dark:border-[#3a3a3c]">
              <tr>
                <th className="px-3 py-2 font-medium text-[#6c6c70] dark:text-[#a0a0a5]">Name</th>
                <th className="px-3 py-2 font-medium text-[#6c6c70] dark:text-[#a0a0a5] w-24">Type</th>
              </tr>
            </thead>
            <tbody>
              {projectList.map((p) => (
                <tr
                  key={p.name}
                  className="border-b border-[#ececf0] dark:border-[#3a3a3c] hover:bg-[#e8f4fc] dark:hover:bg-[#3a3a3c]/60 cursor-pointer"
                  onClick={() => openRow(p.name)}
                >
                  <td className="px-3 py-2 text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {p.name.replaceAll('_', ' ')}
                  </td>
                  <td className="px-3 py-2 text-[#6c6c70] dark:text-[#a0a0a5]">{p.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="shrink-0 text-[11px] text-[#8e8e93] px-3 py-2 border-t border-[#e5e5ea] dark:border-[#3a3a3c]">
          Click a row to open the project window
        </p>
      </div>
    </div>
  )
}

export default Finder
