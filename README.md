# Portfolio — Aditya Kundra

A personal portfolio built as a **macOS-style desktop**: React + Vite + Tailwind. Visitors use a virtual desktop with a menu bar, dock, draggable folders, and app windows to explore projects and contact info.

---

## Scripts


| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite dev server                |
| `npm run build`   | Production build to `dist/`          |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |


---

## ✅ Completed

- Notes App UI
- Document UI
- Contacts UI (driven by `Info.js`)
- Terminal (help, contact, about, skills, experience, projects, etc.) — driven by `Info.js`
- Links (data in `Info.js`)
- Messages UI (iMessage-style FAQ with interview Q&A)
- **Gallery UI** — Albums sidebar, grid, lightbox; responsive `srcSet` for Unsplash; data in `Info.js`
- **Draggable windows** — `useDraggableWindow` hook; title-bar drag on modals
- **Draggable desktop folders** — Random initial layout; drag to reposition on desktop (`md+`); click opens project or Resume
- **Minimize to dock** — Finder, Messages, Contacts, Terminal, Photos, Notes, Safari, Music, Settings, Trash
- **Notes & Photos** — Dock opens Notes and Gallery (Photos)
- **Modal sidebar** — Favourites switch projects; Social Links open in new tab
- **Single source of truth** — Portfolio copy in `Info.js` (including terminal `about` / `skills` text)
- **Spotlight (Cmd+K)** — Search apps, projects, social links
- **Safari & Music** — Dock apps with quick links / curated panel
- **Finder** — List view of projects; row click opens project modal
- **Trash** — Empty-state window (dock + Spotlight)
- **Settings** — Theme (persisted), root text size, volume & brightness sliders (UI-only)

---

## 📋 Phased plan (all phases done)

### Phase 1 — Quick wins & polish

- Loader (~1.2s + 0.5s exit) in `App.jsx`
- Keyboard: Escape (modal / Spotlight), Cmd+M / Cmd+T / Cmd+K
- Modal scale in; scale-out on close (red button)
- Responsive layout: folder grid on mobile; responsive modals; compact hero
- Entrance animations (`animate-fade-in-up` on hero, folders, dock)

### Phase 2 — Content & metaphor

- Gallery imagery in `Info.js` (Unsplash-backed)
- Build projects as desktop folders
- Random folder positions per load (pixels within desktop area)
- Project modals: minimize; restore via folder click (not on dock)
- Resume as a folder (opens Drive link)

### Phase 3 — New apps & search

- Spotlight (Cmd+K)
- Safari — browser-style window + bookmarks
- Music — tracks + external playlist links

### Phase 4 — Technical & UX polish

- Lazy-loaded modals (`React.lazy` + `Suspense`) including Finder, Trash, Spotlight
- Code splitting via Vite chunks per lazy import
- Image optimization — gallery `srcSet`/`sizes`, `decoding`/`fetchPriority`, hero AVIF
- Dark mode — `ThemeContext` + Settings; `dark:` across UI
- SEO — meta, Open Graph, Twitter; share image `public/og-image.png`

### Phase 5 — Nice-to-haves

- Entrance animations (tracked with Phase 1)
- Finder — project list view (`Finder.jsx`)
- Settings extended — volume & brightness placeholders (`Settings.jsx`)
- Trash — empty state (`Trash.jsx`)

---

## 🚧 Current status


| Phase   | Status |
| ------- | ------ |
| Phase 1 | Done   |
| Phase 2 | Done   |
| Phase 3 | Done   |
| Phase 4 | Done   |
| Phase 5 | Done   |


---

## Project layout (reference)


| Area                    | Location                                                             |
| ----------------------- | -------------------------------------------------------------------- |
| Portfolio data          | `[src/components/Info.js](src/components/Info.js)`                   |
| Desktop / dock / modals | `[src/App.jsx](src/App.jsx)`                                         |
| Theme & font size       | `[src/context/ThemeContext.jsx](src/context/ThemeContext.jsx)`       |
| Drag behavior           | `[src/hooks/useDraggableWindow.js](src/hooks/useDraggableWindow.js)` |


