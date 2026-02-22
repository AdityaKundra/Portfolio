import folderIcon from '../assets/Folder.svg'

const Folder = ({ name, openModal, position }) => {
  return (
    <div className='cursor-pointer' style={position} onClick={openModal}>
      <img src={folderIcon} alt="Folder" className='w-12 sm:w-14 md:w-[60px] m-auto' loading='lazy' />
      <p className='text-xs font-bold text-gray-800 dark:text-gray-200 mt-1'>{name.replaceAll('_', ' ')}</p>
    </div>
  )
}
// {top:position.top,left:position.left ? position.right : '', right:position.right ? position.right : ''}
export default Folder
