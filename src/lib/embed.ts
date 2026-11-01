/** Returns a privacy-friendly player URL, or null when the link should just open normally. */
export const embedUrl = (url: string): string | null => {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  const host = parsed.hostname.replace(/^www\.|^m\./, '')
  if (host === 'youtu.be') {
    const id = parsed.pathname.slice(1)
    return /^[\w-]{6,}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null
  }
  if (host === 'youtube.com' && parsed.pathname === '/watch') {
    const id = parsed.searchParams.get('v')
    return id && /^[\w-]{6,}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null
  }
  if (host === 'open.spotify.com') {
    const match = parsed.pathname.match(/^\/(?:intl-\w+\/)?(track|album|playlist|episode)\/(\w+)/)
    return match ? `https://open.spotify.com/embed/${match[1]}/${match[2]}` : null
  }
  return null
}
