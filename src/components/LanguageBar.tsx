import { formatMonth, languageColor, repoStats } from '../lib/github'

export const LanguageBar = ({ repo, showDate = true }: { repo?: string; showDate?: boolean }) => {
  const stats = repoStats(repo)
  if (!stats) return null
  const visible = stats.languages.filter((language) => language.share >= 0.02)
  return (
    <div>
      <div aria-hidden="true" className="flex h-1.5 overflow-hidden rounded-full bg-line">
        {stats.languages.map((language) => <span key={language.name} style={{ width: `${language.share * 100}%`, background: languageColor(language.name) }} />)}
      </div>
      <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted">
        {visible.map((language) => (
          <span key={language.name} className="inline-flex items-center gap-1">
            <span aria-hidden="true" className="size-2 rounded-full" style={{ background: languageColor(language.name) }} />
            {language.name} {Math.round(language.share * 100)}%
          </span>
        ))}
        {showDate && <span>Updated {formatMonth(stats.pushedAt)}</span>}
      </p>
    </div>
  )
}
