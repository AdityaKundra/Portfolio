import { Link, useParams } from 'react-router'
import { CodeBlock } from '../components/CodeBlock'
import { Demo } from '../components/demos'
import { DEMO_TITLES } from '../components/demos/titles'
import { FlowDiagram } from '../components/FlowDiagram'
import { LanguageBar } from '../components/LanguageBar'
import { ExternalLink } from '../components/SiteChrome'
import { caseStudies, findCaseStudy } from '../content/work'
import { NotFound } from './NotFound'

const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="grid gap-3 border-t border-line py-8 first:border-t-0 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-8">
    <h2 className="text-base font-semibold">{title}</h2>
    <div className="min-w-0 space-y-4 leading-relaxed">{children}</div>
  </section>
)

const Prose = ({ children }: { children: React.ReactNode }) => <div className="max-w-[68ch] space-y-4">{children}</div>

export const CaseStudyPage = () => {
  const { slug } = useParams()
  const study = findCaseStudy(slug)
  if (!study) return <NotFound />
  const next = caseStudies[(caseStudies.indexOf(study) + 1) % caseStudies.length]
  const trackLabel = study.track === 'serious' ? 'Serious work' : 'Fun stuff'

  return (
    <article>
      <header className="graph border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <Link to={`/#${study.track}`} className="link text-sm text-muted">← {trackLabel}</Link>
          <p className="eyebrow mt-8">{trackLabel} / {study.kind}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{study.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">{study.summary}</p>
          <ul className="mt-8 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
            {study.highlights.map((highlight) => (
              <li key={highlight.label} className="bg-panel p-4">
                <p className="text-2xl font-semibold tracking-tight text-accent">{highlight.value}</p>
                <p className="mt-1 text-sm text-muted">{highlight.label}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 text-sm">
            {study.role && <div><dt className="eyebrow mb-1">Role</dt><dd>{study.role}</dd></div>}
            <div className="min-w-0 max-w-2xl"><dt className="eyebrow mb-1">Stack</dt><dd>{study.stack.join(', ')}</dd></div>
            {study.repo && <div><dt className="eyebrow mb-1">Source</dt><dd><ExternalLink href={study.repo}>View on GitHub</ExternalLink></dd></div>}
          </dl>
          {study.repo && <div className="mt-6 max-w-xl"><LanguageBar repo={study.repo} /></div>}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <Block title="The problem"><Prose><p>{study.problem}</p></Prose></Block>
        <Block title="Architecture">
          <p className="text-sm text-muted">Select a stage to see what it does.</p>
          <div className="space-y-7">{study.flows.map((flow) => <FlowDiagram key={flow.title ?? flow.steps[0].label} flow={flow} />)}</div>
        </Block>
        {study.demo && (
          <Block title={DEMO_TITLES[study.demo]}>
            <div className="border border-line bg-panel p-4 sm:p-5"><Demo id={study.demo} /></div>
          </Block>
        )}
        <Block title="How it works"><Prose>{study.approach.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</Prose></Block>
        {study.snippet && study.repo && (
          <Block title="From the code">
            <CodeBlock code={study.snippet.code} path={study.snippet.path} repo={study.repo} branch={study.snippet.branch} note={study.snippet.note} />
          </Block>
        )}
        {study.tradeoffs.length > 0 && (
          <Block title="Trade-offs">
            <Prose>
              {study.tradeoffs.map((tradeoff) => (
                <div key={tradeoff.title}>
                  <h3 className="font-semibold">{tradeoff.title}</h3>
                  <p className="mt-1 text-muted">{tradeoff.body}</p>
                </div>
              ))}
            </Prose>
          </Block>
        )}
        {study.setback && (
          <Block title="What went wrong">
            <Prose>
              <h3 className="font-semibold">{study.setback.title}</h3>
              <p className="text-muted">{study.setback.body}</p>
            </Prose>
          </Block>
        )}
        <Block title="Results">
          <ul className="max-w-[68ch] list-disc space-y-1.5 pl-4 marker:text-accent">{study.results.map((result) => <li key={result}>{result}</li>)}</ul>
        </Block>
        {study.limits.length > 0 && (
          <Block title="Known limits">
            <ul className="max-w-[68ch] list-disc space-y-1.5 pl-4 marker:text-accent">{study.limits.map((limit) => <li key={limit}>{limit}</li>)}</ul>
          </Block>
        )}
        <nav aria-label="Next project" className="border-t border-line py-10">
          <p className="eyebrow mb-2">Next</p>
          <Link to={`/work/${next.slug}`} className="link text-2xl font-semibold tracking-tight">{next.title} →</Link>
        </nav>
      </div>
    </article>
  )
}
