import folderIcon from '../assets/Folder.svg'
import DocumentIcon from '../assets/Document.svg'

const Folder = ({ name, openModal, position, variant = 'folder' }) => {
  const icon = variant === 'resume' ? DocumentIcon : folderIcon
  return (
    <div className='cursor-pointer flex flex-col items-center' style={position} onClick={openModal}>
      <img src={icon} alt={name} className='w-12 sm:w-14 md:w-[60px]' loading='lazy' />
      <p className='text-xs font-bold text-gray-800 dark:text-gray-200 mt-1 truncate max-w-[80px] text-center'>{name.replaceAll('_', ' ')}</p>
    </div>
  )
}
// {top:position.top,left:position.left ? position.right : '', right:position.right ? position.right : ''}
export default Folder
