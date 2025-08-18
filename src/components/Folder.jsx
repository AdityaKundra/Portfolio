import folderIcon from '../assets/Folder.svg'

const Folder = ({name, openModal, position}) => {
  return (
    <div className='absolute cursor-pointer' style={position} onClick={openModal}>
      <img src={folderIcon} alt="Folder" className='w-[60px] m-auto' loading='lazy'/>
      <p className='text-xs font-bold text-gray-800'>{name.replaceAll('_',' ')}</p>
    </div>
  )
}
// {top:position.top,left:position.left ? position.right : '', right:position.right ? position.right : ''}
export default Folder
