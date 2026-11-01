import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { App } from '../App'
import { caseStudies } from '../content/work'

window.scrollTo = vi.fn()
Element.prototype.scrollIntoView = vi.fn()

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )

describe('homepage', () => {
  it('says who this is and how to reach them, with one h1', () => {
    renderAt('/')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getAllByRole('link', { name: 'Hire me' })[0]).toHaveAttribute('href', expect.stringContaining('mailto:adityadef@gmail.com'))
  })

  it('links every case study', () => {
    renderAt('/')
    for (const study of caseStudies) {
      expect(screen.getAllByRole('link', { name: study.title })[0]).toHaveAttribute('href', `/work/${study.slug}`)
    }
  })

  it('searches the site without calling the API while AI is off', async () => {
    const request = vi.fn()
    vi.stubGlobal('fetch', request)
    renderAt('/')
    const user = userEvent.setup()
    await user.type(screen.getByRole('textbox', { name: /ask about/i }), 'GENIE fetch times')
    await user.click(screen.getByRole('button', { name: 'Ask' }))
    const log = screen.getByRole('log', { name: 'Answers' })
    expect(await within(log).findByText(/40%/)).toBeInTheDocument()
    expect(within(log).queryByText(/unavailable/)).toBeNull()
    expect(request).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })

  it('falls back to a labelled site search when AI answers are unavailable', async () => {
    vi.stubEnv('VITE_ASK_AI', 'true')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: 'unavailable' }), { status: 503, headers: { 'Content-Type': 'application/json' } })))
    renderAt('/')
    const user = userEvent.setup()
    await user.type(screen.getByRole('textbox', { name: /ask about/i }), 'GENIE fetch times')
    await user.click(screen.getByRole('button', { name: 'Ask' }))
    const log = screen.getByRole('log', { name: 'Answers' })
    expect(await within(log).findByText(/comes from a search of the site/)).toBeInTheDocument()
    expect(within(log).getByText(/40%/)).toBeInTheDocument()
    expect(within(log).getByRole('link', { name: 'LEAD School: GENIE' })).toHaveAttribute('href', '/work/lead-school')
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })
})

describe('work sections', () => {
  it('separates serious work from fun stuff', () => {
    renderAt('/')
    const serious = screen.getByRole('region', { name: 'Serious work' })
    const fun = screen.getByRole('region', { name: 'Fun stuff' })
    expect(within(serious).getByRole('link', { name: 'Redefine' })).toBeInTheDocument()
    expect(within(serious).getByRole('heading', { name: 'AVH Commerce' })).toBeInTheDocument()
    expect(within(serious).queryByRole('link', { name: 'Resume Studio' })).toBeNull()
    expect(within(fun).getByRole('link', { name: 'Voice Assistant Lab' })).toBeInTheDocument()
    expect(within(fun).queryByRole('link', { name: 'Redefine' })).toBeNull()
  })

  it('shows where a selected skill was used', async () => {
    renderAt('/')
    const toolbox = screen.getByRole('region', { name: 'Toolbox' })
    await userEvent.setup().click(within(toolbox).getByRole('button', { name: /^LiveKit/ }))
    expect(within(toolbox).getByRole('link', { name: 'Voice Assistant Lab' })).toBeInTheDocument()
    expect(within(toolbox).queryByRole('link', { name: 'Redefine' })).toBeNull()
  })
})

describe('case study page', () => {
  it('renders the pipeline as an ordered list', () => {
    renderAt('/work/resume-studio')
    expect(screen.getByRole('heading', { level: 1, name: 'Resume Studio' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Validate + repair' }).closest('ol')).toBeInTheDocument()
  })

  it('shows a 404 for an unknown project', () => {
    renderAt('/work/nope')
    expect(screen.getByRole('heading', { name: /does not exist/ })).toBeInTheDocument()
  })
})

describe('shelf', () => {
  it('filters writing and recommendations', async () => {
    renderAt('/shelf')
    const user = userEvent.setup()
    expect(screen.getByRole('heading', { name: 'Writing' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Songs' }))
    expect(screen.queryByRole('heading', { name: 'Writing' })).toBeNull()
    expect(screen.getByRole('heading', { name: 'Kaam Bhaari' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'VisuAlgo' })).toBeNull()
  })

  it('renders a post from Markdown', () => {
    renderAt('/shelf/why-i-built-a-voice-assistant-twice')
    expect(screen.getByRole('heading', { level: 1, name: /built the same voice assistant twice/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'What I would measure next' })).toBeInTheDocument()
  })

  it('loads a player only after a click', async () => {
    const { PickCard } = await import('./Shelf')
    render(<MemoryRouter><ul><PickCard pick={{ type: 'video', title: 'Talk', by: 'Someone', url: 'https://youtu.be/abc123XYZ', why: 'A very good talk.', added: '2026-11-02' }} /></ul></MemoryRouter>)
    expect(screen.queryByTitle('Talk player')).toBeNull()
    await userEvent.setup().click(screen.getByRole('button', { name: /Play here/ }))
    expect(screen.getByTitle('Talk player')).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/abc123XYZ')
  })
})
