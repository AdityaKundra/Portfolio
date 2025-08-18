import { projectList, socialLinks } from './Info'

const Modal = ({ isOpen, isClose }) => {
    if (!isOpen) return null
    return (
        <>
            {/* <div className='absolute top-0 left-0 modal min-h-screen min-w-screen z-10 flex justify-center items-center shadow-2xl ' style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 10px 30px 0px' }} onClick={isClose}>bg-[#00000012] */}
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[700px] bg-white flex rounded-xl z-20 shadow-2xl ' style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 10px 30px 0px' }}>
                    <div className='w-3/12 sidebar bg-[#ebebeb] py-4 px-4 rounded-bl-xl rounded-tl-xl'>
                        <div className='sidebarHead h-8'>
                            <div className='actionButtons flex gap-2'>
                                <span className='cursor-pointer close h-3 w-3 block rounded-full bg-[#ED6A5E] border border-[#CE5347]' onClick={isClose}></span>
                                <span className='minimize h-3 w-3 block rounded-full bg-[#F6BE4F] border border-[#D6A243]'></span>
                                <span className='expand  h-3 w-3 block rounded-full bg-[#62C554] border border-[#58A942]'></span>
                            </div>
                        </div>
                        <p className='text-sm mb-2 text-start font-medium dark:text-[#272727]'>Favourites</p>
                        <ul className='text-start'>
                            {
                                projectList.map((elm, index) => (
                                    elm.type !== 'Build' && (
                                        <li className='text-xs text-[#272727] py-1 cursor-pointer font-medium capitalize' key={index}>{elm.name.replaceAll('_', ' ')}</li>
                                    )
                                ))
                            }

                        </ul>
                        <p className='text-sm my-2 text-start font-medium dark:text-[#272727]'>Usefull Links</p>
                        <ul className='text-start'>
                            {
                                Object.entries(socialLinks).map(([platform, link], index) => (
                                    <li className='text-xs text-[#272727] py-1 cursor-pointer font-medium capitalize' key={index}>{platform}</li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className='w-9/12 contentDiv rounded-br-xl'>
                        <div className='contentHead rounded-tr-xl h-12 flex justify-start items-center px-4 gap-4 bg-[#fdfdfd]' style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 0px 0px, rgba(0, 0, 0, 0.1) 0px 0.5px 0px 0px' }}>
                            <span className='text-sm font-semibold text-[#000000b3]'>Folder Name</span>
                        </div>
                        <div className='py-4 px-4 fileContent dark:text-[#272727]'>
                        Work in progress
                        </div>
                    </div>
                </div>
            {/* </div> */}
        </>
    )

}

export default Modal
