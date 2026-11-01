import { ATS_FACTORS } from '../lib/atsScore'

const shell = 'relative h-44 overflow-hidden'

const VoiceArt = () => (
  <div className={`${shell} grid place-items-center bg-[#1a1140]`}>
    <div className="flex h-24 items-center gap-1">
      {Array.from({ length: 34 }, (_, index) => (
        <span key={index} className="wave w-1.5 rounded-full bg-[#b9a5ff]" style={{ animationDelay: `${index * -71}ms`, opacity: 0.45 + ((index * 7) % 10) / 18 }} />
      ))}
    </div>
    <div className="absolute inset-x-4 bottom-3 flex justify-between font-mono text-[0.65rem] text-[#cfc4ff]"><span>VAD</span><span>STT</span><span>LLM</span><span>TTS</span></div>
  </div>
)

const ResumeArt = () => (
  <div className={`${shell} bg-[#d9efe6] px-6 pt-6`}>
    <div className="mx-auto h-full max-w-64 rounded-t bg-white p-4 text-[#12322a] shadow-[0_6px_24px_rgb(15_60_50/0.2)]">
      <div className="flex items-center justify-between">
        <div className="h-2 w-20 rounded-full bg-[#12322a]" />
        <span className="font-mono text-sm font-medium">ATS</span>
      </div>
      <div className="mt-3 flex h-3 overflow-hidden rounded-sm">
        {ATS_FACTORS.map((factor, index) => <span key={factor.id} style={{ width: `${factor.weight * 100}%`, background: ['#0f766e', '#2a9d8f', '#58b8a8', '#93d2c5', '#c4e6df'][index] }} />)}
      </div>
      <div className="mt-1 flex font-mono text-[0.6rem] text-[#3f6d62]">{ATS_FACTORS.map((factor) => <span key={factor.id} style={{ width: `${factor.weight * 100}%` }}>{factor.weight * 100}</span>)}</div>
      <div className="mt-3 space-y-1.5">
        {[100, 92, 96, 70].map((width, index) => <div key={index} className="h-1.5 rounded-full bg-[#d6e5e0]" style={{ width: `${width}%` }} />)}
      </div>
    </div>
  </div>
)

const FeedArt = () => (
  <div className={`${shell} bg-[#ffe3d8] pt-5`}>
    <div className="mx-auto h-full w-40 rounded-t-[1.4rem] border-[5px] border-b-0 border-[#2b1a14] bg-white p-2">
      {[0, 1].map((post) => (
        <div key={post} className="mb-2 rounded-lg bg-[#fff1ea] p-2">
          <div className="flex items-center gap-1.5"><span className="size-3.5 rounded-full bg-[#e8603c]" /><span className="h-1.5 w-12 rounded-full bg-[#2b1a14]/70" /></div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-[#2b1a14]/20" />
          <div className="mt-1 h-1.5 w-3/4 rounded-full bg-[#2b1a14]/20" />
          <span className={`mt-1.5 block text-xs leading-none text-[#e8603c] ${post === 0 ? 'pulse-like' : ''}`}>♥</span>
        </div>
      ))}
    </div>
  </div>
)

const BAR_WIDTHS = [2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2]

const ScanArt = () => (
  <div className={`${shell} grid place-items-center bg-[#fdf0c7]`}>
    <div className="relative rounded bg-white px-5 pt-4 pb-2 shadow-[0_6px_24px_rgb(90_70_10/0.18)]">
      <div className="flex h-20 items-stretch gap-[3px]">
        {BAR_WIDTHS.map((width, index) => <span key={index} className="bg-[#231c05]" style={{ width }} />)}
      </div>
      <p className="mt-1 text-center font-mono text-[0.65rem] tracking-[0.2em] text-[#231c05]">9 781449 373320</p>
      <span className="scan-line absolute inset-x-1 top-4 h-0.5 bg-[#e5312b] shadow-[0_0_8px_#e5312b]" />
    </div>
  </div>
)

const ART: Record<string, () => React.ReactNode> = {
  'voice-assistant-lab': VoiceArt,
  'resume-studio': ResumeArt,
  'mini-feed': FeedArt,
  'isbn-scanner': ScanArt,
}

export const Vignette = ({ slug }: { slug: string }) => {
  const Art = ART[slug]
  return Art ? <div aria-hidden="true"><Art /></div> : null
}
