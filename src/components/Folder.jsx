import folderIcon from '../assets/Folder.svg'

const Folder = ({name,isOpen}) => {
  return (
    <div className='absolute top-2/4 left-3/4 cursor-pointer' onClick={isOpen}>
      <img src={folderIcon} alt="Folder" className='w-[60px] m-auto' loading='lazy'/>
      <p className='text-xs font-bold text-gray-800'>{name}</p>
    </div>
  )
}

export default Folder
