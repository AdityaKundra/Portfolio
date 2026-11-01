import { highlight } from '../lib/highlight'
import { ExternalLink } from './SiteChrome'

export const CodeBlock = ({ code, path, repo, branch = 'main', note }: { code: string; path: string; repo: string; branch?: string; note: string }) => (
  <figure>
    <figcaption className="mb-3 text-muted">{note}</figcaption>
    <div className="overflow-hidden border border-ink/70">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-[#171d23] px-3 py-2 font-mono text-xs text-[#aeb8c2]">
        <span className="break-all">{path}</span>
        <ExternalLink href={`${repo}/blob/${branch}/${path}`} className="shrink-0 underline underline-offset-2 hover:text-white">View on GitHub</ExternalLink>
      </div>
      <pre tabIndex={0} className="overflow-x-auto bg-[#0e1317] p-4 font-mono text-[0.78rem] leading-relaxed text-[#d7dee4]"><code>{highlight(code)}</code></pre>
    </div>
  </figure>
)
