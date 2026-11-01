import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowUpRight } from '../components/Icons'
import { posts, type Post } from '../content/posts.generated'
import { picks, type Pick, type PickType } from '../content/shelf'
import { formatDate } from '../lib/dates'
import { embedUrl } from '../lib/embed'
import { NotFound } from './NotFound'

type Filter = 'all' | 'writing' | PickType

const LABELS: Record<Filter, string> = { all: 'All', writing: 'Writing', reading: 'Reading', video: 'Videos', song: 'Songs' }
const PICK_LABELS: Record<PickType, string> = { reading: 'Reading', video: 'Video', song: 'Song' }
const PICK_COLORS: Record<PickType, string> = { reading: 'bg-[#0f766e]', video: 'bg-[#be2d4b]', song: 'bg-[#6d3fc4]' }

export const PostRow = ({ post }: { post: Post }) => (
  <li className="group relative border-b border-line py-5">
    <p className="eyebrow">{post.kind === 'blog' ? 'Blog' : 'Note'} / {formatDate(post.date)}</p>
    <h3 className="mt-1.5 text-xl font-semibold tracking-tight">
      <Link to={`/shelf/${post.slug}`} className="transition-colors after:absolute after:inset-0 group-hover:text-accent">{post.title}</Link>
    </h3>
    <p className="mt-1 max-w-[62ch] leading-relaxed text-muted">{post.summary}</p>
  </li>
)

export const PickCard = ({ pick }: { pick: Pick }) => {
  const [playing, setPlaying] = useState(false)
  const embed = embedUrl(pick.url)
  return (
    <li className="flex flex-col border border-line bg-panel p-4">
      <p className="flex items-center gap-2"><span aria-hidden="true" className={`size-2.5 rounded-full ${PICK_COLORS[pick.type]}`} /><span className="eyebrow">{PICK_LABELS[pick.type]}</span></p>
      <h3 className="mt-2 font-semibold tracking-tight">{pick.title}</h3>
      <p className="text-sm text-muted">{pick.by}</p>
      <p className="mt-3 mb-4 leading-relaxed">{pick.why}</p>
      {playing && embed && (
        <iframe
          src={embed}
          title={`${pick.title} player`}
          loading="lazy"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className={`mb-3 w-full border-0 ${pick.type === 'video' ? 'aspect-video' : 'h-20'}`}
        />
      )}
      <p className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium">
        {embed && !playing && <button type="button" onClick={() => setPlaying(true)} className="link">▶ Play here<span className="sr-only">: {pick.title}</span></button>}
        <a href={pick.url} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-1">
          {pick.type === 'reading' ? 'Read' : pick.type === 'video' ? 'Watch' : 'Listen'} <ArrowUpRight /><span className="sr-only">{pick.title} (opens in a new tab)</span>
        </a>
      </p>
    </li>
  )
}

export const ShelfPage = () => {
  const [filter, setFilter] = useState<Filter>('all')
  const available: Filter[] = ['all', ...(['writing', 'reading', 'video', 'song'] as const).filter((type) => (type === 'writing' ? posts.length > 0 : picks.some((pick) => pick.type === type)))]
  const showWriting = filter === 'all' || filter === 'writing'
  const visiblePicks = filter === 'all' ? picks : picks.filter((pick) => pick.type === filter)

  return (
    <>
      <header className="graph border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <p className="eyebrow">Shelf</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">What I am writing, reading, watching and playing on repeat.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">My own blogs and notes, plus the things I recommend and why.</p>
          <p className="mt-4 text-sm"><a href="/rss.xml" className="link text-muted">Follow the writing with RSS</a></p>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div role="group" aria-label="Filter the shelf" className="flex flex-wrap gap-1.5">
          {available.map((option) => (
            <button key={option} type="button" aria-pressed={filter === option} onClick={() => setFilter(option)} className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${filter === option ? 'border-accent bg-accent text-accent-ink' : 'border-line hover:border-accent'}`}>{LABELS[option]}</button>
          ))}
        </div>
        {showWriting && posts.length > 0 && (
          <section aria-labelledby="writing-heading" className="mt-10">
            <h2 id="writing-heading" className="text-2xl font-semibold tracking-tight">Writing</h2>
            <ul className="mt-3 border-t border-line">{posts.map((post) => <PostRow key={post.slug} post={post} />)}</ul>
          </section>
        )}
        {visiblePicks.length > 0 && (
          <section aria-labelledby="picks-heading" className="mt-12">
            <h2 id="picks-heading" className="text-2xl font-semibold tracking-tight">Recommendations</h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visiblePicks.map((pick) => <PickCard key={pick.url} pick={pick} />)}</ul>
          </section>
        )}
      </div>
    </>
  )
}

export const PostPage = () => {
  const { slug } = useParams()
  const index = posts.findIndex((post) => post.slug === slug)
  if (index < 0) return <NotFound />
  const post = posts[index]
  const next = posts[(index + 1) % posts.length]
  return (
    <article>
      <header className="graph border-b border-line">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
          <Link to="/shelf" className="link text-sm text-muted">← Shelf</Link>
          <p className="eyebrow mt-8">{post.kind === 'blog' ? 'Blog' : 'Note'} / <time dateTime={post.date}>{formatDate(post.date)}</time></p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{post.summary}</p>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <div className="post" dangerouslySetInnerHTML={{ __html: post.html }} />
        {next.slug !== post.slug && (
          <nav aria-label="Next post" className="mt-12 border-t border-line pt-8">
            <p className="eyebrow mb-2">Next</p>
            <Link to={`/shelf/${next.slug}`} className="link text-xl font-semibold tracking-tight">{next.title} →</Link>
          </nav>
        )}
      </div>
    </article>
  )
}
