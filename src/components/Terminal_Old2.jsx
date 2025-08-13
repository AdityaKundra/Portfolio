import { useState, useEffect, useRef } from 'react'
import Folder from '../assets/Folder.svg'

const Terminal = () => {

    const [input, setInput] = useState('')
      const [history, setHistory] = useState([])
      const [commandHistory, setCommandHistory] = useState([])
      const [historyIndex, setHistoryIndex] = useState(null)
      const terminalRef = useRef(null)
    
      const commands = {
        // commands I Want: Help, Contact, About, Skills, Experience, Education, Projects, Echo 
        help: () => 'list all the commands',
        echo: (arg) => arg.join(''),
        contact: () => 'yeh hai output contact cmd ka',
        about: () => 'yeh hai output about cmd ka',
        skills: () => 'yeh hai output skills cmd ka',
        experince: () => 'yeh hai output experience cmd ka',
        education: () => 'yeh hai output education cmd ka',
        projects: () => 'yeh hai output projects cmd ka',
        clear: () => {
          setHistory([])
          return null
        }
      }
    
      const handleCommand = (rawInput) => {
        const rawCmd = rawInput.split(' ')
        const cmd = rawCmd[0].toLowerCase()
        const output = commands[cmd] ? commands[cmd](rawCmd.slice(1)) : `${rawInput}: Command Not Found`
    
        if (cmd !== 'clear') {
          setHistory(prev => [...prev, `$ ${rawInput} `, output])
        }
        setCommandHistory(prev => [...prev, cmd])
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
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }, [history]);
    

    return (
        <div className='terminal h-[300px] w-[500px] absolute top-2/4 left-1/4 -translate-y-2/4 -translate-x-1/4 bg-white rounded-xl'>
            <div className='headbar px-2 py-2 bg-[#ebebeb] flex rounded-tr-xl rounded-tl-xl'>
                <div className='w-5/12 actionButtons flex items-center gap-2'>
                    <span className='cursor-pointer close h-3 w-3 block rounded-full bg-[#ED6A5E] border border-[#CE5347]'></span>
                    <span className='minimize h-3 w-3 block rounded-full bg-[#F6BE4F] border border-[#D6A243]'></span>
                    <span className='expand  h-3 w-3 block rounded-full bg-[#62C554] border border-[#58A942]'></span>
                </div>
                <div className='w-7/12 flex items-center justify-start'>
                    <img src={Folder} className='w-[20px] m-left' />
                    <span className='ml-1 text-xs font-bold text-[#272727]'>adi — -zsh</span>
                </div>
            </div>
            <div className='terminal' ref={terminalRef}>
                <div className='terminalHistory'>
                    {
                        history && history.map((elm, i) => (
                            <div key={i}>{elm}</div>
                        ))
                    }
                    {/* history will be here */}
                    <p className='font-bolder'>
                    </p>
                </div>
                <div className='relative'>
                    user@terminal:~$ 
                    {/* <span className={`absolute inline-block w-[2ch] bg-white blinkingCursor`}>|</span> */}
                    <input className='border-0 bg-transparent focus:outline-none custom-caret' name='treminalCommand' type='text' value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} autoFocus />
                </div>
            </div>
        </div>
    )
}

export default Terminal
