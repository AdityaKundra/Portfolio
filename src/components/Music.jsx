import { useDraggableWindow } from '../hooks/useDraggableWindow'

const tracks = [
  'Lofi coding session',
  'Deep work mix',
  'Focus instrumentals',
  'Night debugging vibes',
]

const playlists = [
  ['Spotify: Deep Focus', 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ'],
  ['YouTube: Coding Music', 'https://www.youtube.com/watch?v=jfKfPfyJRdk'],
]

const Music = ({ isOpen, isClose, onMinimize, position = { x: 0, y: 0 }, onPositionChange }) => {
  if (!isOpen) return null
  const { handleMouseDown } = useDraggableWindow(position, onPositionChange || (() => {}))

  return (
    <div
      className="absolute h-[80vh] max-h-[520px] w-[95vw] max-w-[430px] md:h-[460px] md:w-[400px] bg-white dark:bg-[#2d2d2d] rounded-xl z-20 flex flex-col overflow-hidden shadow-2xl animate-scale-in"
      style={{ left: position.x, top: position.y }}
    >
      <div className="shrink-0 h-10 flex items-center pl-3 pr-4 cursor-grab active:cursor-grabbing bg-[#f5f5f7] dark:bg-[#1f1f21] border-b border-[#d1d1d6] dark:border-[#3a3a3c]" onMouseDown={handleMouseDown}>
        <div className="flex items-center gap-2" data-no-drag>
          <span className="cursor-pointer h-3 w-3 rounded-full bg-[#ff5f57]" onClick={isClose} />
          <span className="cursor-pointer h-3 w-3 rounded-full bg-[#febc2e]" onClick={onMinimize} />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <p className="text-xs font-semibold text-[#272727] dark:text-[#f5f5f7] mx-auto pr-12">Music</p>
      </div>
      <div className="p-4 bg-[#fafafc] dark:bg-[#262629] border-b border-[#ececf0] dark:border-[#3a3a3c]">
        <div className="h-28 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 flex items-end p-3">
          <p className="text-white text-sm font-semibold">Now Playing: Coding Flow</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 bg-[#f7f7f9] dark:bg-[#2d2d2d] space-y-2">
        {tracks.map((track) => (
          <div key={track} className="rounded-lg px-3 py-2 bg-white dark:bg-[#1f1f21] text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">
            {track}
          </div>
        ))}
        <div className="pt-2">
          {playlists.map(([label, href]) => (
            <button
              key={label}
              onClick={() => window.open(href, '_blank')}
              className="w-full mt-2 rounded-lg px-3 py-2 text-left bg-white dark:bg-[#1f1f21] text-sm text-[#1d1d1f] dark:text-[#f5f5f7] hover:opacity-90 transition"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Music
