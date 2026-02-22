import { useState } from 'react'
import Documents from './Documents'
import DocumentIcon from '../assets/Document.svg'
import { projectList, socialLinks, projects } from './Info'
import { useDraggableWindow } from '../hooks/useDraggableWindow'

const Modal = ({ name, isOpen, isClose, position = { x: 0, y: 0 }, onPositionChange, onSwitchProject }) => {
    if (!isOpen) return null

    const [openDoc, setOpenDoc] = useState(false);
    const { handleMouseDown } = useDraggableWindow(position, onPositionChange || (() => {}));

    return (
        <>
            <div
                className='absolute h-[80vh] max-h-[500px] w-[95vw] max-w-[700px] md:h-[350px] md:w-[700px] bg-white dark:bg-[#2d2d2d] flex rounded-xl z-20 shadow-2xl animate-scale-in'
                style={{ left: position.x, top: position.y, boxShadow: 'rgba(0, 0, 0, 0.15) 0px 10px 30px 0px' }}
            >
                <div className='w-3/12 sidebar bg-[#ebebeb] flex flex-col rounded-bl-xl rounded-tl-xl overflow-hidden'>
                    <div className='sidebarHead shrink-0 h-8 px-3 pt-3 cursor-grab active:cursor-grabbing' onMouseDown={handleMouseDown}>
                        <div className='actionButtons flex gap-2' data-no-drag>
                            <span className='cursor-pointer close h-3 w-3 block rounded-full bg-[#ED6A5E] border border-[#CE5347]' onClick={isClose}></span>
                            <span className='minimize h-3 w-3 block rounded-full bg-[#F6BE4F] border border-[#D6A243]'></span>
                            <span className='expand h-3 w-3 block rounded-full bg-[#62C554] border border-[#58A942]'></span>
                        </div>
                    </div>
                    <div className='flex-1 min-h-0 overflow-y-auto px-3 py-2 space-y-4'>
                        <div>
                            <p className='text-xs font-semibold mb-1.5 text-[#272727] uppercase tracking-wide'>Favourites</p>
                            <ul className='space-y-0.5'>
                                {projectList.map((elm, index) => (
                                    projects[elm.name] && (
                                        <li
                                            className={`text-xs py-1.5 px-2 rounded cursor-pointer font-medium capitalize truncate ${name === elm.name ? 'text-blue-600 font-semibold bg-white/60' : 'text-[#272727] hover:bg-white/40'}`}
                                            key={index}
                                            onClick={() => name !== elm.name && onSwitchProject?.(elm.name)}
                                            title={elm.name.replaceAll('_', ' ')}
                                        >
                                            {elm.name.replaceAll('_', ' ')}
                                        </li>
                                    )
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className='text-xs font-semibold mb-1.5 text-[#272727] uppercase tracking-wide'>Social Links</p>
                            <ul className='space-y-0.5'>
                                {Object.entries(socialLinks).map(([platform, link], index) => (
                                    <li
                                        className='text-xs text-[#272727] py-1.5 px-2 rounded cursor-pointer font-medium capitalize hover:bg-white/40 truncate'
                                        key={index}
                                        onClick={() => window.open(link, '_blank')}
                                    >
                                        {platform}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='w-9/12 contentDiv rounded-br-xl'>
                    <div
                        className='contentHead rounded-tr-xl h-12 flex justify-start items-center px-4 gap-4 bg-[#fdfdfd] cursor-grab active:cursor-grabbing'
                        style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 0px 0px, rgba(0, 0, 0, 0.1) 0px 0.5px 0px 0px' }}
                        onMouseDown={handleMouseDown}
                    >
                        <span className='text-sm font-semibold text-[#000000b3]'>{name.replaceAll('_',' ')}</span>
                    </div>
                    <div className='py-4 px-4 fileContent dark:text-[#272727]'>
                        <div className='w-[60px] cursor-pointer' onClick={() => setOpenDoc(true)}>
                            <img src={DocumentIcon} alt={name.replaceAll('_',' ')} loading='lazy'/>
                            <span className='text-xs'>{name.replaceAll('_',' ')}</span>
                        </div>
                        {
                            projects[name].description && (
                                <Documents data={projects[name].description}  isOpen={openDoc} isClose={()=>setOpenDoc(false)} />
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )

}

export default Modal
