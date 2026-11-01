import type { ReactNode, SVGProps } from 'react'

const Icon = ({ children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    {children}
  </svg>
)

export const SunIcon = () => <Icon><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></Icon>
export const MoonIcon = () => <Icon><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" /></Icon>
export const ArrowUpRight = () => <Icon><path d="M7 17 17 7M8 7h9v9" /></Icon>
export const CopyIcon = () => <Icon><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15H4V4h11v1" /></Icon>
export const FolderGlyph = () => <Icon><path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /></Icon>
export const ChatGlyph = () => <Icon><path d="M4 5h16v11H9l-5 4Z" /></Icon>
export const NoteGlyph = () => <Icon><path d="M6 3h9l4 4v14H6ZM9 11h7M9 15h7" /></Icon>
export const TerminalGlyph = () => <Icon><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m7 9 3 3-3 3M13 15h4" /></Icon>
export const ContactGlyph = () => <Icon><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Icon>
export const SettingsGlyph = () => <Icon><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></Icon>
export const InfoGlyph = () => <Icon><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></Icon>
export const SearchGlyph = () => <Icon><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4-4" /></Icon>
export const DocGlyph = () => <Icon><path d="M6 3h9l4 4v14H6ZM15 3v4h4" /></Icon>
