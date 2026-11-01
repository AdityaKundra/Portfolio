import { ChatGlyph, ContactGlyph, FolderGlyph, InfoGlyph, NoteGlyph, SettingsGlyph, TerminalGlyph } from '../components/Icons'
import type { AppId } from './windows'

export const APPS: { id: AppId; title: string; tile: string; icon: () => React.ReactNode; width: number; height: number }[] = [
  { id: 'readme', title: 'Read me', tile: 'bg-[#1f49c7]', icon: InfoGlyph, width: 420, height: 320 },
  { id: 'projects', title: 'Projects', tile: 'bg-[#0f766e]', icon: FolderGlyph, width: 520, height: 500 },
  { id: 'ask', title: 'Ask', tile: 'bg-[#6d3fc4]', icon: ChatGlyph, width: 480, height: 500 },
  { id: 'notes', title: 'Notes', tile: 'bg-[#b45309]', icon: NoteGlyph, width: 600, height: 380 },
  { id: 'terminal', title: 'Terminal', tile: 'bg-[#1b2229]', icon: TerminalGlyph, width: 600, height: 380 },
  { id: 'contact', title: 'Contact', tile: 'bg-[#be2d4b]', icon: ContactGlyph, width: 380, height: 360 },
  { id: 'settings', title: 'Settings', tile: 'bg-[#4b5563]', icon: SettingsGlyph, width: 400, height: 340 },
]
