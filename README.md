# Aditya Kundra's portfolio

Source for [portfolio-tau-bice-23.vercel.app](https://portfolio-tau-bice-23.vercel.app): a fast, prerendered site with serious work, fun projects with live demos, games, a grounded "Ask about my work" assistant, and an optional desktop mode at `/desktop`.

## Stack

React 19, TypeScript, Vite, Tailwind CSS 4 and React Router, deployed on Vercel. The Ask endpoint is a Vercel function that uses the Anthropic SDK.

## Decisions

**Prerender every route.** `scripts/prerender.mjs` writes real HTML for each page after the build. Link previews, crawlers and visitors without JavaScript all get the content. I chose this over a framework because the site has a handful of static routes and needs no server rendering at request time.

**One source of truth for content.** Everything factual lives in `src/content`. The pages, the terminal and the Ask corpus all read from it, so they cannot disagree. A test fails if a phone number ever appears there.

**Ask answers only from the site, and AI is opt-in.** By default it is a BM25 search that runs in the browser. With AI on, `server/ask.ts` sends the corpus as cited documents, streams the reply as NDJSON, and shows visitors the sources it used.

| Risk | Control |
| --- | --- |
| Abuse | Per-IP limit of 10 requests an hour, plus input length and history limits |
| Runaway cost | Daily token budget, checked before each call and updated after it |
| Limit store outage | Fails closed, so no model call happens without a working limit |
| No API key, or an API failure | The browser falls back to BM25 search over the same content, labelled as search |

**Games teach real facts.** Two Truths and a Lie, Bug Hunt, Sort Race and Hire Check live in `src/components/play`. Their copy is in `src/content/play.ts`, and Hire Check derives its evidence from the same data as the case studies, so it reports gaps honestly.

**Shelf content lives in files.** A post is a Markdown file in `src/content/posts`, compiled at build time so Markdown adds nothing to the browser bundle. Recommendations are entries in `src/content/shelf.ts`, and each needs a `why`. YouTube and Spotify links load their player only when clicked.

**Desktop mode is optional and lazy-loaded.** It is a separate chunk that the main site never downloads. Window behavior is a pure reducer in `src/desktop/windows.ts`, which keeps it easy to test.

**No Apple assets.** The icons are drawn for this project and the fonts are open source (Instrument Sans and IBM Plex Mono).

## Run it

```bash
npm install
cp .env.example .env.local   # optional: set VITE_ASK_AI=true and ANTHROPIC_API_KEY for AI answers
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server, including `/api/ask` |
| `npm run build` | Production build and prerender to `dist/` |
| `npm run preview` | Serve the build with production-style URLs (Ask uses its search fallback here) |
| `npm run check` | Lint, type check, tests and build. CI runs the same steps |
| `npm run posts` | Recompile Markdown posts (dev and build do this automatically) |
| `npm run sync:github` | Refresh repo languages and dates in `src/content/github.json` |
| `npm run eval:ask` | Live answer-quality checks against the real API. This costs money |

## Environment

| Variable | Purpose |
| --- | --- |
| `VITE_ASK_AI` | Set to `true` to turn on AI answers. Off by default, so Ask searches the site |
| `ANTHROPIC_API_KEY` | Required for AI answers |
| `ASK_MODEL` | Model ID. Defaults to `claude-opus-5-5` |
| `ASK_DAILY_TOKEN_BUDGET` | Tokens per UTC day before Ask pauses. Defaults to 300000 |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Shared counters. Without them, limits apply per serverless instance |

## Layout

```text
api/ask.ts          Vercel function entry point
server/             Ask handler and rate limiting
src/content/        Profile, case studies, notes, Ask corpus, page metadata
src/pages/          Homepage and case study pages
src/components/     Shared UI, the Ask panel, demos and games
src/desktop/        Desktop mode: window manager, terminal, search
scripts/            Prerender step
evals/              Live checks for Ask
```

Code imported by `api/` uses `.js` import extensions because Vercel runs those files as plain Node ESM.
