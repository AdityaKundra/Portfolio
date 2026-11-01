import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'
import { openHire } from '../../lib/hire'
import { completeCommand, runCommand } from '../commands'
import type { AppId } from '../windows'

interface Entry {
  id: number
  command: string
  output: string
}

const PROMPT = 'visitor@aditya:~$'

interface TerminalProps {
  open: (id: AppId) => void
  /** Omit where there is nothing to leave, such as on the homepage. */
  exit?: () => void
  /** Omit when already in desktop mode. */
  desktop?: () => void
  /** The homepage terminal must not steal focus or scroll on load. */
  autoFocus?: boolean
  intro?: { command: string; output: string }[]
  suggestions?: string[]
  className?: string
}

const DEFAULT_INTRO = [{ command: '', output: 'Type "help" to see what works. Tab completes commands.' }]

export const Terminal = ({ open, exit, desktop, autoFocus = true, intro = DEFAULT_INTRO, suggestions, className = 'h-full' }: TerminalProps) => {
  const [entries, setEntries] = useState<Entry[]>(() => intro.map((entry, index) => ({ id: index, ...entry })))
  const [input, setInput] = useState('')
  const [cursor, setCursor] = useState<number | null>(null)
  const history = useRef<string[]>([])
  const nextId = useRef(intro.length)
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus({ preventScroll: true })
  }, [autoFocus])
  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight
  }, [entries])

  const submit = (command = input) => {
    setInput('')
    setCursor(null)
    if (command.trim()) history.current.push(command)
    const result = runCommand(command)
    if (result.kind === 'clear') return setEntries([])
    if (result.kind === 'hire') {
      setEntries((current) => [...current, { id: nextId.current++, command, output: 'Permission granted. Opening the offer letter…' }])
      return openHire()
    }
    if (result.kind === 'play') return void navigate('/#play')
    if (result.kind === 'shelf') return void navigate('/shelf')
    if (result.kind === 'exit' && exit) return exit()
    if (result.kind === 'desktop' && desktop) return desktop()
    if (result.kind === 'exit' || result.kind === 'desktop') {
      const message = result.kind === 'exit' ? 'Nothing to exit here. Try "desktop".' : 'You are already in desktop mode.'
      return setEntries((current) => [...current, { id: nextId.current++, command, output: message }])
    }
    setEntries((current) => [...current, { id: nextId.current++, command, output: result.text }])
    if (result.kind === 'open') open(result.id)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      submit()
    } else if (event.key === 'Tab') {
      const completion = completeCommand(input.trim())
      if (input.trim() && completion) {
        event.preventDefault()
        setInput(`${completion} `)
      }
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      const { length } = history.current
      if (!length) return
      const up = event.key === 'ArrowUp'
      const next = cursor === null ? (up ? length - 1 : null) : cursor + (up ? -1 : 1)
      if (next === null || next >= length) {
        setCursor(null)
        setInput('')
      } else {
        const clamped = Math.max(next, 0)
        setCursor(clamped)
        setInput(history.current[clamped])
      }
    }
  }

  return (
    <div ref={scroller} onClick={() => { if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true }) }} className={`${className} overflow-y-auto bg-[#0e1317] p-3 font-mono text-[0.8rem] leading-relaxed text-[#d7dee4]`}>
      <div role="log" aria-live="polite" aria-label="Terminal output">
        {entries.map((entry) => (
          <div key={entry.id} className="mb-2">
            {entry.command && <p><span className="text-[#8fabff]">{PROMPT}</span> {entry.command}</p>}
            {entry.output && <pre className="font-[inherit] break-words whitespace-pre-wrap">{entry.output}</pre>}
          </div>
        ))}
      </div>
      <div className="flex items-baseline gap-2">
        <label htmlFor={inputId} className="shrink-0 text-[#8fabff]">{PROMPT}</label>
        <input id={inputId} ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={onKeyDown} autoComplete="off" autoCapitalize="off" spellCheck={false} className="min-w-0 flex-1 bg-transparent caret-[#8fabff] outline-none" />
      </div>
      {suggestions && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {suggestions.map((suggestion) => (
            <button key={suggestion} type="button" onClick={(event) => { event.stopPropagation(); submit(suggestion) }} className="rounded border border-[#39444f] px-2 py-0.5 text-xs text-[#aeb8c2] transition-colors hover:border-[#8fabff] hover:text-white">{suggestion}</button>
          ))}
        </div>
      )}
    </div>
  )
}
