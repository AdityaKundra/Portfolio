import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { AskPanel } from '../components/AskPanel'
import { HireButton } from '../components/HireDialog'
import { Playground } from '../components/play/Playground'
import { FlowStrip } from '../components/FlowDiagram'
import { ArrowUpRight, CopyIcon } from '../components/Icons'
import { LanguageBar } from '../components/LanguageBar'
import { ExternalLink } from '../components/SiteChrome'
import { Vignette } from '../components/Vignette'
import { education, experience, profile, skills } from '../content/profile'
import { posts } from '../content/posts.generated'
import { picks } from '../content/shelf'
import { caseStudies, funWork, seriousWork } from '../content/work'
import { Terminal } from '../desktop/apps/Terminal'
import { PickCard, PostRow } from './Shelf'
import type { AppId } from '../desktop/windows'
import { evidenceEntries, usesOf } from '../lib/evidence'

const CopyEmail = () => {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }
  return (
    <button type="button" onClick={() => void copy()} className="inline-flex items-center gap-1.5 rounded-md border border-line bg-panel px-3 py-2.5 text-sm font-medium transition-colors hover:border-accent">
      <CopyIcon /> <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
    </button>
  )
}

const Section = ({ id, label, intro, children }: { id: string; label: string; intro?: string; children: React.ReactNode }) => (
  <section id={id} aria-labelledby={`${id}-heading`} className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
    <h2 id={`${id}-heading`} className="text-3xl font-semibold tracking-tight sm:text-4xl">{label}</h2>
    {intro && <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>}
    <div className="mt-9">{children}</div>
  </section>
)

const PROOF = [
  { value: '3', label: 'engineering roles' },
  { value: '40%', label: 'lower data fetch times at LEAD School' },
  { value: 'B2B + B2C', label: 'headless commerce at Redefine' },
  { value: '4', label: 'side projects you can read and try' },
]

const HeroTerminal = () => {
  const navigate = useNavigate()
  const open = useCallback(
    (id: AppId) => {
      if (id.startsWith('project:')) void navigate(`/work/${id.slice('project:'.length)}`)
      else if (id === 'ask') void navigate('/#ask')
    },
    [navigate],
  )
  return (
    <div className="overflow-hidden border border-ink/70 shadow-[6px_6px_0_rgb(0_0_0/0.1)]">
      <div className="flex items-center justify-between bg-[#171d23] px-3 py-2 font-mono text-xs text-[#aeb8c2]">
        <span>this terminal works</span>
        <span aria-hidden="true">try it</span>
      </div>
      <Terminal
        open={open}
        desktop={() => void navigate('/desktop')}
        autoFocus={false}
        className="h-64"
        intro={[{ command: 'whoami', output: `${profile.name}, ${profile.role} at ${profile.employer}, ${profile.location}.` }]}
        suggestions={['work', 'open 3', 'play', 'sudo hire aditya', 'desktop']}
      />
    </div>
  )
}

const SeriousRow = ({ slug, index }: { slug: string; index: number }) => {
  const study = caseStudies.find((item) => item.slug === slug)!
  const lead = study.highlights[0]
  return (
    <li className="reveal group relative grid gap-5 border-b border-line py-8 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-8">
      <div>
        <p aria-hidden="true" className="font-mono text-xs text-muted">{String(index + 1).padStart(2, '0')}</p>
        <p className="mt-2 text-4xl font-semibold tracking-tight text-accent">{lead.value}</p>
        <p className="mt-1 text-sm text-muted">{lead.label}</p>
      </div>
      <div className="min-w-0">
        <h3 className="text-2xl font-semibold tracking-tight">
          <Link to={`/work/${study.slug}`} className="transition-colors after:absolute after:inset-0 group-hover:text-accent">{study.title}</Link>
        </h3>
        <p className="mt-2 max-w-3xl leading-relaxed text-muted">{study.summary}</p>
        <div className="mt-4 hidden sm:block"><FlowStrip flow={study.flows[0]} /></div>
        <p className="mt-4 font-mono text-xs text-muted">{study.stack.join(' / ')}</p>
      </div>
    </li>
  )
}

const Toolbox = () => {
  const evidence = useMemo(() => {
    const names = [...new Set(evidenceEntries.flatMap((entry) => entry.stack))]
    return names
      .map((name) => ({ name, uses: usesOf(name) }))
      .sort((a, b) => b.uses.length - a.uses.length || a.name.localeCompare(b.name))
  }, [])
  const [selected, setSelected] = useState('MongoDB')
  const active = evidence.find((item) => item.name === selected) ?? evidence[0]

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div>
        <p className="eyebrow mb-3">Select a skill to see where I used it</p>
        <ul className="flex flex-wrap gap-1.5">
          {evidence.map((item) => (
            <li key={item.name}>
              <button type="button" aria-pressed={item.name === active.name} onClick={() => setSelected(item.name)} className={`rounded-full border px-3 py-1 text-sm transition-colors ${item.name === active.name ? 'border-accent bg-accent text-accent-ink' : 'border-line hover:border-accent'}`}>
                {item.name} <span className="font-mono text-xs opacity-70">{item.uses.length}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div aria-live="polite" className="border border-ink/70 bg-panel p-5">
        <h3 className="text-lg font-semibold">{active.name}</h3>
        <ul className="mt-3 divide-y divide-line">
          {active.uses.map((use) => (
            <li key={use.title} className="flex items-baseline justify-between gap-3 py-2 text-sm">
              <Link to={use.href} className="link">{use.title}</Link>
              <span className="eyebrow shrink-0">{use.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export const Home = () => (
  <>
    <div id="top" className="graph border-b border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-center lg:gap-14">
        <div>
          <p className="eyebrow">{profile.name} / {profile.role}</p>
          <h1 className="mt-4 text-4xl leading-[1.06] font-semibold tracking-tight text-balance sm:text-6xl">{profile.headline}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{profile.intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            <HireButton className="px-5 py-2.5 text-sm" />
            <CopyEmail />
            <ExternalLink href={profile.resumeUrl} className="rounded-md border border-line bg-panel px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent">Resume</ExternalLink>
          </div>
          <p className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
            <span>{profile.location}</span>
            <ExternalLink href={profile.links.github}>GitHub</ExternalLink>
            <ExternalLink href={profile.links.linkedin}>LinkedIn</ExternalLink>
          </p>
        </div>
        <HeroTerminal />
      </div>
      <div className="border-t border-line bg-panel/80">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 px-5 sm:px-8 lg:grid-cols-4">
          {PROOF.map((item) => (
            <li key={item.label} className="py-5 pr-4">
              <p className="text-2xl font-semibold tracking-tight sm:text-3xl">{item.value}</p>
              <p className="mt-1 text-sm leading-snug text-muted">{item.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <Section id="serious" label="Serious work" intro="Production work from my jobs and client projects: the systems, what I owned, and the results.">
      <ol className="border-t border-line">
        {seriousWork.map((study, index) => <SeriousRow key={study.slug} slug={study.slug} index={index} />)}
      </ol>
      <h3 id="career" className="mt-14 mb-5 text-xl font-semibold tracking-tight">Where I have worked</h3>
      <ol className="grid gap-px overflow-hidden border border-line bg-line lg:grid-cols-3">
        {experience.map((job) => (
          <li key={job.id} className="reveal flex flex-col bg-paper p-6">
            <p className="font-mono text-xs text-muted">{job.period}</p>
            <h4 className="mt-3 text-xl font-semibold tracking-tight">{job.company}</h4>
            <p className="text-sm text-muted">{job.title}</p>
            <ul className="mt-4 mb-5 list-disc space-y-1.5 pl-4 text-[0.95rem] leading-relaxed marker:text-accent">
              {job.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
            <p className="mt-auto font-mono text-xs text-muted">{job.stack.join(' / ')}</p>
          </li>
        ))}
      </ol>
    </Section>

    <div className="border-y border-line bg-panel">
      <Section id="fun" label="Fun stuff" intro="Things I build on my own time, with the code on GitHub. Each one has something you can try.">
        <ul className="grid gap-5 md:grid-cols-2">
          {funWork.map((study) => (
            <li key={study.slug} className="reveal group relative flex flex-col overflow-hidden border border-ink/70 bg-paper transition-transform motion-safe:hover:-translate-y-1">
              <Vignette slug={study.slug} />
              <div className="flex flex-1 flex-col border-t border-ink/70 p-5">
                <h3 className="text-xl font-semibold tracking-tight">
                  <Link to={`/work/${study.slug}`} className="transition-colors after:absolute after:inset-0 group-hover:text-accent">{study.title}</Link>
                </h3>
                <p className="mt-2 mb-5 leading-relaxed text-muted">{study.summary}</p>
                <div className="mt-auto"><LanguageBar repo={study.repo} /></div>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">
          More on <ExternalLink href={profile.links.github}>my GitHub</ExternalLink>, and my DSA practice is racing in <Link to="/#play" className="link">Play</Link>. Prefer to poke around? <Link to="/desktop" className="link inline-flex items-center gap-1 font-medium text-ink">Open desktop mode <ArrowUpRight /></Link>
        </p>
      </Section>
    </div>

    <Section id="play" label="Play" intro="The fun way to get to know me. Spot the lie, survive an on-call shift, bet on my sorting code, or run an ATS on me. Everything you learn is true, except the lies, which are clearly marked.">
      <Playground />
    </Section>

    <div className="border-t border-line">
      <Section id="shelf" label="From the shelf" intro="What I am writing, reading, watching and playing on repeat.">
        <div className="grid gap-8 lg:grid-cols-2">
          <ul className="border-t border-line">{posts.slice(0, 3).map((post) => <PostRow key={post.slug} post={post} />)}</ul>
          <ul className="grid gap-3 sm:grid-cols-2">{picks.slice(0, 2).map((pick) => <PickCard key={pick.url} pick={pick} />)}</ul>
        </div>
        <Link to="/shelf" className="link mt-7 inline-block font-medium">See the whole shelf →</Link>
      </Section>
    </div>

    <div className="border-y border-line bg-panel">
    <Section id="ask" label="Ask about my work" intro="Short on time? Ask a direct question. Answers come only from this site and link to where they came from.">
      <div className="max-w-3xl"><AskPanel /></div>
    </Section>
    </div>

    <div>
      <Section id="toolbox" label="Toolbox" intro="Skills are easy to list, so here is where each one was used.">
        <Toolbox />
        <div className="mt-12 grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Full skill list</h3>
            <dl className="space-y-3">
              {skills.map((group) => (
                <div key={group.label} className="grid gap-1 sm:grid-cols-[9rem_minmax(0,1fr)]">
                  <dt className="eyebrow leading-6">{group.label}</dt>
                  <dd className="leading-6">{group.items.join(', ')}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Education</h3>
            <ul className="space-y-4">
              {education.map((item) => (
                <li key={item.school}>
                  <p className="font-medium">{item.degree}</p>
                  <p className="text-sm text-muted">{item.school}, {item.period}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </div>
  </>
)
