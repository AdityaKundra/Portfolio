import { Link } from 'react-router'
import { profile } from '../content/profile'
import { HireButton } from './HireDialog'
import { ArrowUpRight } from './Icons'
import { ThemeToggle } from './ThemeToggle'

export const ExternalLink = ({ href, children, className = 'link' }: { href: string; children: React.ReactNode; className?: string }) => (
  <a href={href} target="_blank" rel="noreferrer" className={className}>
    {children}
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
)

const navItem = 'rounded-md px-2 py-1.5 text-sm text-muted sm:px-2.5 transition-colors hover:bg-accent-soft hover:text-ink'

export const SiteHeader = () => (
  <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
    <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-30 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-ink">Skip to content</a>
    <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:px-8">
      <Link to="/" aria-label={profile.name} className="font-mono text-sm font-medium whitespace-nowrap"><span className="sm:hidden">AK</span><span className="hidden sm:inline">{profile.name}</span></Link>
      <nav aria-label="Main" className="flex items-center gap-0.5">
        <Link to="/#serious" className={navItem}>Serious</Link>
        <Link to="/#fun" className={navItem}>Fun</Link>
        <Link to="/#play" className={navItem}>Play</Link>
        <Link to="/shelf" className={`${navItem} hidden sm:block`}>Shelf</Link>
        <Link to="/#ask" className={`${navItem} hidden md:block`}>Ask</Link>
        <Link to="/#toolbox" className={`${navItem} hidden lg:block`}>Toolbox</Link>
        <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className={`${navItem} hidden items-center gap-1 md:inline-flex`}>
          Resume <ArrowUpRight /><span className="sr-only"> (opens in a new tab)</span>
        </a>
        <HireButton className="mx-1 px-3 py-1.5 text-sm" />
        <ThemeToggle />
      </nav>
    </div>
  </header>
)

export const SiteFooter = () => (
  <footer className="border-t border-line">
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <p>
        <a href={`mailto:${profile.email}`} className="link">{profile.email}</a>
      </p>
      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        <li><ExternalLink href={profile.links.github}>GitHub</ExternalLink></li>
        <li><ExternalLink href={profile.links.linkedin}>LinkedIn</ExternalLink></li>
        <li><ExternalLink href={profile.links.leetcode}>LeetCode</ExternalLink></li>
        <li><ExternalLink href={profile.sourceUrl}>Site source</ExternalLink></li>
        <li><Link to="/shelf" className="link">Shelf</Link></li>
        <li><Link to="/desktop" className="link">Desktop mode</Link></li>
      </ul>
    </div>
  </footer>
)
