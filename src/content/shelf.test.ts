import { describe, expect, it } from 'vitest'
import { embedUrl } from '../lib/embed'
import { posts } from './posts.generated'
import { picks } from './shelf'

describe('shelf content', () => {
  it('gives every pick a reason and a safe link', () => {
    for (const pick of picks) {
      expect(pick.why.length, pick.title).toBeGreaterThan(10)
      expect(pick.url, pick.title).toMatch(/^https:\/\//)
    }
    expect(new Set(picks.map((pick) => pick.url)).size).toBe(picks.length)
  })

  it('keeps posts newest first, with compiled HTML', () => {
    const dates = posts.map((post) => post.date)
    expect([...dates].sort().reverse()).toEqual(dates)
    for (const post of posts) {
      expect(post.html, post.slug).toContain('<')
      expect(post.text, post.slug).not.toMatch(/<\/?[a-z]+>/)
    }
  })
})

describe('embedUrl', () => {
  it.each([
    ['https://www.youtube.com/watch?v=abc123XYZ', 'https://www.youtube-nocookie.com/embed/abc123XYZ'],
    ['https://youtu.be/abc123XYZ', 'https://www.youtube-nocookie.com/embed/abc123XYZ'],
    ['https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC', 'https://open.spotify.com/embed/track/4uLU6hMCjMI75M1A2tKUQC'],
    ['https://open.spotify.com/intl-de/album/abc', 'https://open.spotify.com/embed/album/abc'],
  ])('plays %s', (url, expected) => {
    expect(embedUrl(url)).toBe(expected)
  })

  it.each(['https://www.youtube.com/@abdul_bari', 'https://open.spotify.com/search/x', 'https://evil.test/watch?v=abc123XYZ', 'not a url', 'https://www.youtube.com/watch?v=a"><script'])(
    'does not embed %s',
    (url) => {
      expect(embedUrl(url)).toBeNull()
    },
  )
})
