import stats from '../content/github.json'

const COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#e0b400',
  Python: '#3572a5',
  HTML: '#e34c26',
  CSS: '#7c4dcc',
  Dockerfile: '#4b6c7a',
}

export const languageColor = (language: string) => COLORS[language] ?? '#7b8794'

export interface RepoStats {
  pushedAt: string
  languages: { name: string; share: number }[]
}

export const repoStats = (repoUrl: string | undefined): RepoStats | null => {
  const entry = (stats as Record<string, { pushedAt: string; languages: Record<string, number> }>)[repoUrl?.split('/').pop() ?? '']
  if (!entry) return null
  const total = Object.values(entry.languages).reduce((sum, bytes) => sum + bytes, 0)
  const languages = Object.entries(entry.languages)
    .map(([name, bytes]) => ({ name, share: bytes / total }))
    .sort((a, b) => b.share - a.share)
  return { pushedAt: entry.pushedAt, languages }
}

export const formatMonth = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' })
