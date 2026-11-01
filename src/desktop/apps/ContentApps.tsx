import { useState } from 'react'
import { Link } from 'react-router'
import { Demo } from '../../components/demos'
import { DEMO_TITLES } from '../../components/demos/titles'
import { FlowDiagram } from '../../components/FlowDiagram'
import { HireButton } from '../../components/HireDialog'
import { LanguageBar } from '../../components/LanguageBar'
import { ExternalLink } from '../../components/SiteChrome'
import { posts } from '../../content/posts.generated'
import { profile } from '../../content/profile'
import { findCaseStudy, funWork, seriousWork, type CaseStudy } from '../../content/work'
import { setDark, setTextSize, useIsDark, useTextSize, type TextSize } from '../../lib/theme'
import type { AppId } from '../windows'

const Scroll = ({ children }: { children: React.ReactNode }) => <div className="h-full overflow-y-auto p-5 text-[0.95rem] leading-relaxed">{children}</div>

export const ReadMe = ({ open }: { open: (id: AppId) => void }) => (
  <Scroll>
    <h3 className="text-xl font-semibold tracking-tight">{profile.name}</h3>
    <p className="text-sm text-muted">{profile.role} at {profile.employer}, {profile.location}</p>
    <p className="mt-4">{profile.headline}</p>
    <p className="mt-3 text-muted">This is a working desktop. Drag windows, double-click a title bar to maximize, or press <kbd className="rounded border border-line px-1 font-mono text-xs">⌘K</kbd> to search.</p>
    <div className="mt-5 flex flex-wrap gap-2">
      <button type="button" onClick={() => open('projects')} className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-ink hover:opacity-90">See the work</button>
      <button type="button" onClick={() => open('ask')} className="rounded-md border border-line px-3 py-2 text-sm font-medium hover:border-accent">Ask a question</button>
      <Link to="/" className="rounded-md border border-line px-3 py-2 text-sm font-medium hover:border-accent">Standard site</Link>
    </div>
  </Scroll>
)

const ProjectList = ({ title, items, open }: { title: string; items: CaseStudy[]; open: (id: AppId) => void }) => (
  <>
    <h3 className="eyebrow mb-2">{title}</h3>
    <ul className="mb-6 divide-y divide-line border-y border-line">
      {items.map((study) => (
        <li key={study.slug}>
          <button type="button" onClick={() => open(`project:${study.slug}`)} className="block w-full py-3 text-left transition-colors hover:text-accent">
            <span className="font-medium">{study.title}</span>
            <span className="mt-0.5 block text-sm text-muted">{study.stack.slice(0, 4).join(', ')}</span>
          </button>
        </li>
      ))}
    </ul>
  </>
)

export const Projects = ({ open }: { open: (id: AppId) => void }) => (
  <Scroll>
    <ProjectList title="Serious work" items={seriousWork} open={open} />
    <ProjectList title="Fun stuff" items={funWork} open={open} />
  </Scroll>
)

export const ProjectWindow = ({ slug }: { slug: string }) => {
  const study = findCaseStudy(slug)
  if (!study) return <Scroll>This project could not be found.</Scroll>
  return (
    <Scroll>
      <p className="eyebrow">{study.track === 'serious' ? 'Serious work' : 'Fun stuff'}</p>
      <p className="mt-2">{study.summary}</p>
      <div className="mt-4 space-y-4">{study.flows.map((flow) => <FlowDiagram key={flow.title ?? flow.steps[0].label} flow={flow} />)}</div>
      {study.demo && (
        <>
          <h3 className="mt-5 mb-2 font-semibold">{DEMO_TITLES[study.demo]}</h3>
          <Demo id={study.demo} />
        </>
      )}
      <h3 className="mt-5 font-semibold">Results</h3>
      <ul className="mt-1 list-disc space-y-1 pl-4 marker:text-accent">{study.results.map((result) => <li key={result}>{result}</li>)}</ul>
      {study.repo && <div className="mt-5"><LanguageBar repo={study.repo} /></div>}
      <p className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <Link to={`/work/${study.slug}`} className="link font-medium">Read the full case study</Link>
        {study.repo && <ExternalLink href={study.repo}>Source on GitHub</ExternalLink>}
      </p>
    </Scroll>
  )
}

const notes = posts.filter((post) => post.kind === 'note')

export const Notes = () => {
  const [active, setActive] = useState(0)
  return (
    <div className="grid h-full grid-cols-[minmax(7rem,38%)_minmax(0,1fr)]">
      <ul className="overflow-y-auto border-r border-line bg-paper" aria-label="Notes">
        {notes.map((note, index) => (
          <li key={note.title}>
            <button type="button" aria-current={index === active} onClick={() => setActive(index)} className={`block w-full border-b border-line px-3 py-2.5 text-left text-sm transition-colors ${index === active ? 'bg-accent-soft font-medium' : 'hover:bg-accent-soft'}`}>
              {note.title}
            </button>
          </li>
        ))}
      </ul>
      <article className="overflow-y-auto p-5">
        <h3 className="text-lg font-semibold tracking-tight">{notes[active].title}</h3>
        <div className="post mt-3 !text-[0.95rem]" dangerouslySetInnerHTML={{ __html: notes[active].html }} />
      </article>
    </div>
  )
}

export const Contact = () => (
  <Scroll>
    <h3 className="text-lg font-semibold tracking-tight">Get in touch</h3>
    <p className="mt-1 text-muted">Email is the fastest way to reach me.</p>
    <HireButton className="mt-4 px-4 py-2 text-sm" />
    <p className="mt-3"><a href={`mailto:${profile.email}`} className="link">{profile.email}</a></p>
    <ul className="mt-5 space-y-2">
      <li><ExternalLink href={profile.resumeUrl}>Resume</ExternalLink></li>
      <li><ExternalLink href={profile.links.github}>GitHub</ExternalLink></li>
      <li><ExternalLink href={profile.links.linkedin}>LinkedIn</ExternalLink></li>
      <li><ExternalLink href={profile.links.leetcode}>LeetCode</ExternalLink></li>
    </ul>
  </Scroll>
)

const SIZES: TextSize[] = ['small', 'medium', 'large']
const optionClass = (selected: boolean) => `rounded-md border px-3 py-2 text-sm capitalize transition-colors ${selected ? 'border-accent bg-accent-soft font-medium' : 'border-line hover:border-accent'}`

export const Settings = () => {
  const dark = useIsDark()
  const size = useTextSize()
  return (
    <Scroll>
      <fieldset>
        <legend className="font-semibold">Theme</legend>
        <div className="mt-2 flex gap-2">
          <button type="button" aria-pressed={!dark} className={optionClass(!dark)} onClick={() => setDark(false)}>Light</button>
          <button type="button" aria-pressed={dark} className={optionClass(dark)} onClick={() => setDark(true)}>Dark</button>
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="font-semibold">Text size</legend>
        <div className="mt-2 flex gap-2">
          {SIZES.map((option) => <button key={option} type="button" aria-pressed={size === option} className={optionClass(size === option)} onClick={() => setTextSize(option)}>{option}</button>)}
        </div>
      </fieldset>
      <p className="mt-6 text-sm text-muted">Saved in this browser, and applied across the whole site.</p>
    </Scroll>
  )
}
