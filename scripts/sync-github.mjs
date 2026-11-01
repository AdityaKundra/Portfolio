// Refreshes src/content/github.json from GitHub's public API. Run with: npm run sync:github
import { writeFile } from 'node:fs/promises'

const OWNER = 'AdityaKundra'
const REPOS = ['Voice-prototypes-two-stacks-', 'Resume-Studio-AI-resume-app-', 'Mini-Feed-App', 'ISBN-Scanner']

const get = async (path) => {
  const response = await fetch(`https://api.github.com/repos/${OWNER}/${path}`, { headers: { Accept: 'application/vnd.github+json' } })
  if (!response.ok) throw new Error(`${path}: GitHub responded ${response.status}`)
  return response.json()
}

const stats = {}
for (const repo of REPOS) {
  const [info, languages] = await Promise.all([get(repo), get(`${repo}/languages`)])
  stats[repo] = { pushedAt: info.pushed_at.slice(0, 10), languages }
}
await writeFile('src/content/github.json', `${JSON.stringify(stats, null, 2)}\n`)
console.log(`Updated ${REPOS.length} repos`)
