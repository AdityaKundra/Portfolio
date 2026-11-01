import { setDark, useIsDark } from '../lib/theme'
import { MoonIcon, SunIcon } from './Icons'

export const ThemeToggle = () => {
  const dark = useIsDark()
  return (
    <button
      type="button"
      onClick={() => setDark(!dark)}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="inline-grid size-9 place-items-center rounded-md text-base text-muted transition-colors hover:bg-accent-soft hover:text-ink"
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
