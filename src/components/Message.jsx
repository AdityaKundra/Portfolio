import { useState, useEffect, useRef, useCallback } from 'react'
import Cellular from '../assets/Cellular.svg'
import Wifi from '../assets/Wifi.svg'
import Battery from '../assets/Battery.svg'
import Back from '../assets/Chevron.svg'
import FaceTime from '../assets/FacetimeIcon.svg'
import avatar from '../assets/avatar/avatar_3_BG.png'
import { useDraggableWindow } from '../hooks/useDraggableWindow'

const Message = ({ isOpen, isClose, onMinimize, position = { x: 0, y: 0 }, onPositionChange }) => {

    if (!isOpen) return null;

    const { handleMouseDown } = useDraggableWindow(position, onPositionChange || (() => {}));
    const [isClosing, setIsClosing] = useState(false);
    const handleClose = useCallback(() => setIsClosing(true), []);
    const handleAnimationEnd = useCallback(() => { if (isClosing) isClose(); }, [isClosing, isClose]);
    const [clock, setClock] = useState(new Date())
    const [openIndexes, setOpenIndexes] = useState([])
    const modalRef = useRef()


    useEffect(() => {
        const time = setInterval(() => setClock(new Date()), 1000);
        return () => clearInterval(time);
    })
    const formatClockTime = (date) => {
        const time = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: false,
        });

        return time;

    }

    const question = [
        {
            "question": "Can you walk me through one of your recent projects?",
            "answer": "I built a school management app using the MERN stack with features like student records, attendance, fees, and document handling."
        },
        {
            "question": "How do you decide the architecture of your applications?",
            "answer": "I follow modular design, separate frontend and backend, and use REST APIs for communication."
        },
        {
            "question": "What challenges have you faced with React?",
            "answer": "Managing state in large apps, which I solved using Redux and React Query for server state."
        },
        {
            "question": "How do you ensure your code is scalable?",
            "answer": "By writing reusable components, following best practices, and using environment-specific configs."
        },
        {
            "question": "Have you worked with databases apart from MongoDB?",
            "answer": "Yes, I've worked with SQL databases in academic projects, but MongoDB is my primary choice for flexibility."
        },
        {
            "question": "What's your experience with Docker?",
            "answer": "I've containerized MERN apps to simplify deployment and ensure consistency across environments."
        },
        {
            "question": "How do you handle authentication and security?",
            "answer": "Using JWTs, password hashing with bcrypt, and setting up role-based access."
        },
        {
            "question": "How do you test your applications?",
            "answer": "I rely on manual testing for UI and use tools like Postman for backend API validation."
        },
        {
            "question": "How do you keep your applications optimized?",
            "answer": "By using lazy loading, pagination, query optimization, and caching where needed."
        },
        {
            "question": "Where do you see yourself growing in the next few years?",
            "answer": "I want to deepen my expertise in backend systems and cloud deployment while contributing to scalable products."
        }
    ]

    const toggleAccordion = (index) => {
        if (openIndexes.includes(index)) {
            setOpenIndexes(openIndexes.filter(i => i !== index));
        } else {
            setOpenIndexes([...openIndexes, index + 'typing']);
            setTimeout(() => {
                setOpenIndexes(prev =>
                    prev
                        .filter(i => i !== index + 'typing')
                        .concat(index)
                );
            }, 800);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                isClose()
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);



    return (
        <div
            ref={modalRef}
            className={`h-[80vh] max-h-[600px] w-[95vw] max-w-[340px] md:h-[550px] md:w-[300px] absolute bg-white dark:bg-[#2d2d2d] shadow-xl text-sm flex flex-col z-20 ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`}
            style={{ left: position.x, top: position.y, boxShadow: 'rgba(0, 0, 0, 0.15) 0px 10px 30px 0px' }}
            onAnimationEnd={handleAnimationEnd}
        >
            <div
                className='header pt-2 px-4 bg-[#ebebeb] cursor-grab active:cursor-grabbing'
                onMouseDown={handleMouseDown}
            >
                <div className='flex gap-2 mb-2' data-no-drag>
                    <span className='h-2.5 w-2.5 rounded-full bg-[#ED6A5E] cursor-pointer' onClick={handleClose} />
                    <span className='h-2.5 w-2.5 rounded-full bg-[#F6BE4F] cursor-pointer' onClick={onMinimize} />
                    <span className='h-2.5 w-2.5 rounded-full bg-[#62C554]' />
                </div>
                <div className='headerIcons flex justify-between items-center'>
                    <span className='time text-xs font-bold dark:text-[#272727]'>
                        {formatClockTime(clock)}
                    </span>
                    <span className='flex gap-2 items-center'>
                        <img src={Cellular} className='h-[10px]' loading='lazy' alt='Celluar Network' />
                        <img src={Wifi} className='h-[10px]' loading='lazy' alt='Wifi' />
                        <img src={Battery} className='h-[10px]' loading='lazy' alt='Battery' />
                    </span>
                </div>
                <div className='userInfo flex justify-between items-center mt-4'>
                    <img src={Back} alt="Back" loading='lazy' />
                    <img src={avatar} className='rounded-full h-10' alt="Avatar" loading='lazy' />
                    <img src={FaceTime} alt="FaceTime" loading='lazy' />
                </div>
                <p className='text-center text-xs pt-2 pb-1 dark:text-[#272727]'>Aditya </p>
            </div>

            <div className='messagesBox flex-1 overflow-y-auto px-2 py-4 space-y-3'>
                {question.map((acc, i) => (
                    <div key={i} className='mesasgeAccordian my-2'>
                        <div className='question text-end cursor-pointer mb-2' onClick={() => toggleAccordion(i)}>
                            <span className='inline-block py-2 px-3 max-w-[85%] rounded-2xl bg-blue-500 text-white text-xs rounded-br-none'>
                                {acc.question}
                            </span>
                        </div>

                        {openIndexes.includes(i + 'typing') && (
                            <div className='answer text-start'>
                                <div className='inline-block py-2 px-3 rounded-2xl bg-[#E9E9EB] text-black text-xs rounded-bl-none'>
                                    <div className="flex gap-1 items-center">
                                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {openIndexes.includes(i) && (
                            <div className='answer text-start'>
                                <span className='inline-block py-2 px-3 max-w-[85%] rounded-2xl bg-[#E9E9EB] text-black text-xs rounded-bl-none'>
                                    {acc.answer}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className='messageInput flex gap-2 px-4 pt-2 pb-4 items-center justify-between relative'>
                <div>
                    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </span>
                </div>
                <div className='w-full'>
                    <input type='text' name='message' id="message" autoComplete='off' className='w-full rounded-2xl border text-sm border-[#C5C5C7] px-2 py-1 text placeholder-[#C5C5C7] dark:text-[#272727]' placeholder='iMessage' />
                </div>
                <span className='absolute right-[30px]'>
                    {/* Microphone icon */}
                    <svg width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 11.4062C4.4375 11.4062 3.39062 10.2422 3.39062 8.57812V3.35156C3.39062 1.67969 4.4375 0.523438 6 0.523438C7.55469 0.523438 8.60156 1.67969 8.60156 3.35156V8.57812C8.60156 10.2422 7.55469 11.4062 6 11.4062ZM0.40625 8.70312V7.11719C0.40625 6.78906 0.664062 6.53125 0.992188 6.53125C1.32812 6.53125 1.58594 6.78906 1.58594 7.11719V8.65625C1.58594 11.3203 3.32031 13.0859 6 13.0859C8.67188 13.0859 10.4062 11.3203 10.4062 8.65625V7.11719C10.4062 6.78906 10.6719 6.53125 11 6.53125C11.3281 6.53125 11.5859 6.78906 11.5859 7.11719V8.70312C11.5859 11.7656 9.57031 13.9141 6.58594 14.1641V15.9844H9.48438C9.8125 15.9844 10.0781 16.25 10.0781 16.5781C10.0781 16.9062 9.8125 17.1641 9.48438 17.1641H2.50781C2.17969 17.1641 1.91406 16.9062 1.91406 16.5781C1.91406 16.25 2.17969 15.9844 2.50781 15.9844H5.40625V14.1641C2.42969 13.9141 0.40625 11.7656 0.40625 8.70312Z" fill="#B4B8BF" />
                    </svg>
                </span>
            </div>
        </div>

    )
}

export default Message