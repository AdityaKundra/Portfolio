import { useEffect, useRef, useState } from 'react'

const STAGES = [
  { label: 'Listening', detail: 'Silero VAD watches the mic audio for the end of the utterance.', output: 'User: "What did you build at Redefine?"' },
  { label: 'STT', detail: 'AssemblyAI transcribes the finished utterance.', output: 'transcript → "what did you build at redefine"' },
  { label: 'LLM', detail: 'OpenAI or Ollama writes a short reply.', output: 'reply → "A headless e-commerce platform."' },
  { label: 'TTS', detail: 'Sarvam generates speech from the reply.', output: 'audio → synthesized' },
  { label: 'Speaking', detail: 'The worker publishes the audio back into the LiveKit room.', output: 'room ← audio track playing' },
]

export const VoiceDemo = () => {
  const [stage, setStage] = useState(-1)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = () => {
    if (timer.current) clearInterval(timer.current)
    timer.current = null
  }
  useEffect(() => stop, [])

  const play = () => {
    stop()
    setStage(0)
    let current = 0
    timer.current = setInterval(() => {
      current += 1
      if (current >= STAGES.length) stop()
      else setStage(current)
    }, 1100)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={play} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:opacity-90">{stage < 0 ? 'Play one turn' : 'Replay'}</button>
        <div aria-hidden="true" className="flex h-9 items-center gap-0.5">
          {Array.from({ length: 22 }, (_, index) => (
            <span key={index} className={`w-1 rounded-full bg-accent ${stage === 0 || stage === 4 ? 'wave' : ''}`} style={{ height: stage === 0 || stage === 4 ? undefined : 4, animationDelay: `${index * -83}ms` }} />
          ))}
        </div>
      </div>
      <ol className="mt-4 grid gap-1.5 sm:grid-cols-5">
        {STAGES.map((item, index) => (
          <li key={item.label} aria-current={index === stage ? 'step' : undefined} className={`border px-2 py-2 font-mono text-xs transition-colors ${index === stage ? 'border-accent bg-accent text-accent-ink' : index < stage ? 'border-accent/50 bg-accent-soft' : 'border-line text-muted'}`}>{item.label}</li>
        ))}
      </ol>
      <div aria-live="polite" className="mt-3 min-h-16 text-sm">
        {stage >= 0 ? (
          <>
            <p>{STAGES[stage].detail}</p>
            <p className="mt-1 font-mono text-xs text-muted">{STAGES[stage].output}</p>
          </>
        ) : (
          <p className="text-muted">Walk through what the agent worker does in one conversational turn.</p>
        )}
      </div>
      <p className="mt-2 text-xs text-muted">A scripted walkthrough with made-up dialogue. It plays no audio, and its timing is not a measurement.</p>
    </div>
  )
}
