import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import type { IncomingMessage } from 'node:http'
import { join } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { loadEnv, type Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

const readBody = async (req: IncomingMessage) => {
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(chunk as Buffer)
  return Buffer.concat(chunks)
}

/** Serves api/ask.ts during `npm run dev`, so Ask can be tested without the Vercel CLI. */
const askDevApi = (): Plugin => ({
  name: 'ask-dev-api',
  configureServer(server) {
    Object.assign(process.env, loadEnv('development', process.cwd(), ''))
    server.middlewares.use('/api/ask', async (req, res) => {
      const abort = new AbortController()
      res.on('close', () => abort.abort())
      const { POST } = (await server.ssrLoadModule('/api/ask.ts')) as { POST: (request: Request) => Promise<Response> }
      const response = await POST(
        new Request(`http://${req.headers.host}/api/ask`, {
          method: req.method,
          headers: req.headers as Record<string, string>,
          body: req.method === 'POST' ? await readBody(req) : undefined,
          signal: abort.signal,
        }),
      )
      res.statusCode = response.status
      response.headers.forEach((value, key) => res.setHeader(key, value))
      if (response.body) for await (const chunk of response.body) res.write(chunk)
      res.end()
    })
  },
})

/** Makes `npm run preview` resolve prerendered pages the way Vercel's clean URLs do. */
const cleanUrlPreview = (): Plugin => ({
  name: 'clean-url-preview',
  configurePreviewServer(server) {
    server.middlewares.use((req, _res, next) => {
      const path = (req.url ?? '/').split('?')[0].replace(/\/$/, '')
      if (path && existsSync(join('dist', path, 'index.html'))) req.url = `${path}/index.html`
      next()
    })
  },
})

/** Recompiles posts when a Markdown file changes during `npm run dev`. */
const watchPosts = (): Plugin => ({
  name: 'watch-posts',
  configureServer(server) {
    const rebuild = (file: string) => {
      if (/src[\\/]content[\\/]posts[\\/].*\.md$/.test(file)) execFileSync(process.execPath, ['scripts/build-posts.mjs'], { stdio: 'inherit' })
    }
    for (const event of ['add', 'change', 'unlink']) server.watcher.on(event, rebuild)
  },
})

export default defineConfig({
  plugins: [react(), tailwindcss(), askDevApi(), cleanUrlPreview(), watchPosts()],
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'server/**/*.test.ts', 'evals/**/*.test.ts'],
    restoreMocks: true,
  },
})
