// Writes real HTML for every route, so previews, crawlers and no-JS visitors get the content.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const DIST = 'dist'
const { render, getMeta, prerenderRoutes, profile, posts } = await import(pathToFileURL(join('dist-ssr', 'entry-server.js')).href)
const template = await readFile(join(DIST, 'index.html'), 'utf8')

const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

const head = (meta) => {
  const url = `${profile.siteUrl}${meta.path === '/' ? '' : meta.path}`
  const title = escapeHtml(meta.title)
  const description = escapeHtml(meta.description)
  const image = `${profile.siteUrl}/og-image.png`
  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    url: profile.siteUrl,
    email: `mailto:${profile.email}`,
    worksFor: { '@type': 'Organization', name: profile.employer },
    sameAs: Object.values(profile.links),
  }
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    meta.noindex ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<link rel="alternate" type="application/rss+xml" title="${escapeHtml(profile.name)}: Writing" href="/rss.xml" />`,
    meta.path === '/' ? `<script type="application/ld+json">${JSON.stringify(personLd).replaceAll('<', '\\u003c')}</script>` : '',
  ]
    .filter(Boolean)
    .join('\n    ')
}

const page = (url) =>
  template
    .replace(/<!--meta:start-->[\s\S]*<!--meta:end-->/, () => head(getMeta(url)))
    .replace('<!--app-->', () => render(url))

for (const route of prerenderRoutes) {
  const file = route === '/' ? join(DIST, 'index.html') : join(DIST, route.slice(1), 'index.html')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, page(route))
}
await writeFile(join(DIST, '404.html'), page('/404'))

const urls = prerenderRoutes.map((route) => `  <url><loc>${profile.siteUrl}${route === '/' ? '' : route}</loc></url>`).join('\n')
await writeFile(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)

const items = posts
  .map(
    (post) => `    <item>
      <title>${escapeHtml(post.title)}</title>
      <link>${profile.siteUrl}/shelf/${post.slug}</link>
      <guid>${profile.siteUrl}/shelf/${post.slug}</guid>
      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeHtml(post.summary)}</description>
    </item>`,
  )
  .join('\n')
await writeFile(
  join(DIST, 'rss.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeHtml(profile.name)}: Writing</title>
    <link>${profile.siteUrl}/shelf</link>
    <description>Blogs and notes by ${escapeHtml(profile.name)}</description>
${items}
  </channel>
</rss>
`,
)

await rm('dist-ssr', { recursive: true, force: true })
console.log(`Prerendered ${prerenderRoutes.length} routes and 404.html`)
