import { useCallback } from 'react'
import folderIcon from '../assets/Folder.svg'
import DocumentIcon from '../assets/Document.svg'
import { useDraggableWindow } from '../hooks/useDraggableWindow'

const noopPos = () => {}

const Folder = ({
  name,
  openModal,
  position,
  variant = 'folder',
  draggable = false,
  dragPosition = { x: 0, y: 0 },
  onDragPositionChange = noopPos,
}) => {
  const icon = variant === 'resume' ? DocumentIcon : folderIcon

  const onChange = draggable ? onDragPositionChange : noopPos
  const { handleMouseDown, shouldSuppressClick } = useDraggableWindow(dragPosition, onChange, {
    dragThresholdPx: draggable ? 6 : 0,
  })

  const handleClick = useCallback(() => {
    if (draggable && shouldSuppressClick()) return
    openModal()
  }, [draggable, shouldSuppressClick, openModal])

  return (
    <div
      className={`flex flex-col items-center select-none ${draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
      style={position}
      onMouseDown={draggable ? handleMouseDown : undefined}
      onClick={handleClick}
      role={draggable ? 'button' : undefined}
      tabIndex={draggable ? 0 : undefined}
      onKeyDown={
        draggable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openModal()
              }
            }
          : undefined
      }
    >
      <img src={icon} alt={name} className='w-12 sm:w-14 md:w-[60px] pointer-events-none' loading='lazy' />
      <p className='text-xs font-bold text-gray-800 dark:text-gray-200 mt-1 truncate max-w-[80px] text-center pointer-events-none'>
        {name.replaceAll('_', ' ')}
      </p>
    </div>
  )
}
// {top:position.top,left:position.left ? position.right : '', right:position.right ? position.right : ''}
export default Folder
