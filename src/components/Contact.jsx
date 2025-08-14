import avatar from '../assets/avatar/avatar_1_BG.png'
import { socialLinks, contact } from './Info'

const Contact = () => {
    return (
        <>
            
            {/* <div className="modal min-h-screen min-w-screen z-10 flex justify-center items-center shadow-2xl" > */}
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] bg-[white] rounded-xl z-20 animate-[fadeInScale_0.3s_ease-out] shadow-2xl' style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 10px 30px 0px' }}>
                    <div className="flex items-center px-4 pt-3 pb-1">
                        <div className="flex space-x-2">
                            <span className='cursor-pointer close h-3 w-3 block rounded-full bg-[#ED6A5E] border border-[#CE5347]'></span>
                            <span className='minimize h-3 w-3 block rounded-full bg-[#F6BE4F] border border-[#D6A243]'></span>
                            <span className='expand  h-3 w-3 block rounded-full bg-[#62C554] border border-[#58A942]'></span>
                        </div>
                    </div>
                    <div className="p-8 flex flex-col items-center">
                        {/* Avatar */}
                        <div className="w-28 h-28 rounded-full overflow-hidden shadow-sm border border-gray-300">
                            <img
                                src={avatar}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
    
                        {/* Name & Role */}
                        <h2 className="text-xl font-semibold text-gray-900 mt-4">Aditya Kundra</h2>
                        <p className="text-gray-500 text-sm">Full-Stack Developer</p>
    
                        {/* Bio */}
                        <p className="text-gray-700 text-center text-sm mt-3 max-w-sm leading-relaxed">
                            Crafting seamless user experiences with React, Node.js, and modern backend technologies.
                        </p>
    
                        {/* Social Links */}
                        <div className="flex justify-center gap-6 mt-6 text-gray-600">
                            <a href={`${socialLinks.linkedin}`} target='_blank'>
                                Linkedin
                            </a>
                            <a href={`${socialLinks.gitHub}`} target='_blank'>
                                Github
                            </a>
                            <a href={`${contact.email}`} target='_blank'>
                                Mail
                            </a>
                             <a href={`${socialLinks.instagram}`} target='_blank'>
                                Insta
                            </a>
                        </div>
    
                        {/* Action Button */}
                        <button className="mt-6 px-5 py-2 bg-black text-white text-sm rounded-lg cursor-pointer transition" onClick={() => window.location.href =`mailto:${contact.email}`}>
                            Get in Touch
                        </button>
                    </div>
                </div>
                <style>{`
            @keyframes fadeInScale {
              from { opacity: 0; transform: scale(0.7); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
            {/* </div> */}
        </>
    )
}

export default Contact


