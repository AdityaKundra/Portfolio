import { useState, useEffect, useRef, useMemo } from 'react'
import Folder from '../assets/Folder.svg'
import { useDraggableWindow } from '../hooks/useDraggableWindow'
import { contact, socialLinks, projects, projectList } from './Info'

const Terminal = ({ isOpen, isClose, onMinimize, position = { x: 0, y: 0 }, onPositionChange }) => {

    if (!isOpen) return null;

    const { handleMouseDown } = useDraggableWindow(position, onPositionChange || (() => {}));

    const [input, setInput] = useState('')
    const [history, setHistory] = useState([])
    const [commandHistory, setCommandHistory] = useState([])
    const [historyIndex, setHistoryIndex] = useState(null)
    const terminalRef = useRef(null)
    const inputRef = useRef(null)

    const commands = useMemo(() => ({
        help: () =>
            `Available commands:
- help       : Show all available commands
- contact    : Show contact details
- about      : About me
- skills     : List of skills
- experience : Work experience
- education  : Education details
- projects   : List of projects
- echo       : Repeat your text
- clear      : Clear terminal`,

        echo: (arg) => arg.join(' '),

        contact: () =>
            `📧 Email: ${contact.email}
📱 Phone: ${contact.phone}
📍 Location: ${contact.location}
📄 Resume: ${contact.resume}
🔗 LinkedIn: ${socialLinks.linkedin}
💻 GitHub: ${socialLinks.gitHub}
📓 LeetCode: ${socialLinks.leetCode}
📷 Instagram: ${socialLinks.instagram}`,

        about: () =>
            `Full-Stack Developer • Designer • Builder
Crafting seamless user experiences with React, Node.js, and modern backend technologies.`,

        skills: () =>
            `Frontend: React, Next.js, Tailwind CSS, Redux, React Query
Backend: Node.js, Express, REST APIs
Databases: MySQL, PostgreSQL, MongoDB
DevOps: Docker, GitHub Actions, Netlify, Vercel
Others: System Design, ADBMS, Agile Development`,

        experience: () =>
            Object.entries(projects)
                .filter(([_, p]) => p.description)
                .map(([name, p]) => `• ${name.replaceAll('_', ' ')}: ${p.description.split('.')[0].trim()}.`)
                .join('\n') || 'See projects for details.',

        education: () =>
            `Master of Computer Applications - Chandigarh University, 2025
Bachelor of Computer Applications - Subharti University, 2022`,

        projects: () =>
            projectList
                .map((p, i) => `${i + 1}. ${p.name.replaceAll('_', ' ')} (${p.type})`)
                .join('\n'),

        clear: () => {
            setHistory([])
            return null
        }
    }), [])

    const handleCommand = (rawInput) => {
        const rawCmd = rawInput.trim().split(' ')
        const cmd = rawCmd[0].toLowerCase()
        const output = commands[cmd] ? commands[cmd](rawCmd.slice(1)) : `${rawInput}: Command Not Found`

        if (cmd !== 'clear') {
            setHistory(prev => [...prev, `adi@Adityas-MacBook-Air:~$ ${rawInput}`, output])
        }
        setCommandHistory(prev => [...prev, rawInput])

        setHistoryIndex(null)
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleCommand(input)
            setInput('')
        } else if (e.key === "ArrowUp") {
            const index = historyIndex === null ? commandHistory.length - 1 : historyIndex - 1
            if (index >= 0) {
                setHistoryIndex(index)
                setInput(commandHistory[index])
            }
        } else if (e.key === "ArrowDown") {
            if (historyIndex !== null) {
                const newIndex = historyIndex + 1
                if (newIndex < commandHistory.length) {
                    setHistoryIndex(newIndex)
                    setInput(commandHistory[newIndex])
                } else {
                    setHistoryIndex(null)
                    setInput('')
                }
            }
        }
    }

    useEffect(() => {
        inputRef.current?.focus()
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }, [history])
    return (
        <div
            className='h-[300px] w-[500px] absolute bg-white dark:bg-[#2d2d2d] rounded-lg shadow-lg font-mono text-sm z-20 animate-scale-in'
            style={{ left: position.x, top: position.y, boxShadow: 'rgba(0, 0, 0, 0.15) 0px 10px 30px 0px' }}
            onClick={() => inputRef.current?.focus()}
        >
            <div
                className='bg-[#ebebeb] px-3 py-2 flex items-center justify-between rounded-t-lg cursor-grab active:cursor-grabbing'
                onMouseDown={handleMouseDown}
            >
                <div className='flex items-center space-x-2' data-no-drag>
                    <span className='h-3 w-3 rounded-full bg-[#ED6A5E] border border-[#CE5347] cursor-pointer' onClick={(e) => { e.stopPropagation(); isClose(); }} />
                    <span className='h-3 w-3 rounded-full bg-[#F6BE4F] border border-[#D6A243] cursor-pointer' onClick={(e) => { e.stopPropagation(); onMinimize?.(); }} />
                    <span className='h-3 w-3 rounded-full bg-[#62C554] border border-[#58A942]' />
                </div>
                <div className='flex items-center space-x-1'>
                    <img src={Folder} alt="folder" className='w-4 h-4' />
                    <span className='text-xs text-gray-800 font-semibold'>adi — -zsh</span>
                </div>
                <div className='w-6'></div>
            </div>

            <div className='flex flex-col h-full bg-white px-2 py-2 overflow-y-auto terminalCMD rounded-b-lg' ref={terminalRef}>
                <div className='flex flex-col gap-1 text-black text-start text-xs font-medium mb-1'>
                    {history.map((line, i) => (
                        <div key={i} className='whitespace-pre-wrap'>{line}</div>
                    ))}
                </div>
                <div className='flex items-center'>
                    <span className='text-black mr-2 text-xs font-medium'>adi@Adityas-MacBook-Air:~$</span>
                    <input
                        ref={inputRef}
                        className='bg-transparent border-none outline-none flex-1 text-black caret-black tracking-wide text-xs font-medium'
                        type='text'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                </div>
            </div>
        </div>
    )
}

export default Terminal
