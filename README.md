# Portfolio — Aditya Kundra

A personal portfolio built as a **macOS-style desktop**: React + Vite + Tailwind. Visitors use a virtual desktop with a menu bar, dock, folders, and app windows to explore projects and contact info.

---

## ✅ Completed

- [x] Notes App UI
- [x] Document UI
- [x] Contacts UI (driven by `Info.js`)
- [x] Terminal (help, contact, about, skills, experience, projects, etc.) — driven by `Info.js`
- [x] Links (data in `Info.js`)
- [x] Messages UI (iMessage-style FAQ with interview Q&A)
- [x] **Gallery UI** — Photos-style app with albums sidebar, grid view, and lightbox; data in `Info.js`
- [x] **Draggable windows** — `useDraggableWindow` hook; all modals support title-bar drag
- [x] **Minimize to dock** — dock apps (Messages, Contacts, Terminal, Photos, Notes) minimize and restore
- [x] **Notes & Photos in dock** — both open from dock (Notes, Gallery)
- [x] **Modal sidebar** — Favourites switch projects; Social Links open in new tab
- [x] **Single source of truth** — Terminal and modal content driven by `Info.js`

---

## 📋 Phased plan

### Phase 1 — Quick wins & polish ✅

**Goal:** Ship-ready experience with minimal effort.

- [x] **Loader** — Re-enable in `App.jsx`; tune timing (~1.2s display + 0.5s exit)
- [x] **Keyboard shortcuts** — Escape closes top modal; Cmd+M (Messages), Cmd+T (Terminal)
- [x] **Modal open/close animations** — scale + fade; backdrop blur when modals open
- [x] **Responsive layout** — folder grid on mobile; responsive modals; compact hero

---

### Phase 2 — Content & metaphor

**Goal:** Richer content and more desktop-like behavior.

- [ ] **Gallery content** — Replace placeholder images in `Info.js` with real project screenshots
- [ ] **Build projects** — Surface Sports Score App, AI Resume Tailor, Productive App as folders or a Projects window
- [ ] **Random folder positions** — Generate random positions for folders on load (or per session)
- [ ] **Project modals minimize** — Allow folder windows to minimize to dock (or close only for now)
- [ ] **Resume** — Integrate into desktop-item system as a draggable/movable item

---

### Phase 3 — New apps & search

**Goal:** Expand the desktop metaphor.

- [ ] **Spotlight (Cmd+K)** — Search that opens projects, notes, contact, or external links
- [ ] **Safari** — Link list or iframe for external sites
- [ ] **Music** — e.g. Spotify embed or link

---

### Phase 4 — Technical & UX polish

**Goal:** Performance, accessibility, and quality of life.

- [ ] **Lazy-load modals** — `React.lazy` for Terminal, Message, Contact, Notes, Gallery
- [ ] **Code splitting** — Route-level or feature-level splits
- [ ] **Image optimization** — Lazy loading, responsive images, WebP where supported
- [ ] **Dark mode** — Theme toggle (e.g. in Headbar); consistent `dark:` usage
- [ ] **SEO / meta** — Default title and description; per-project meta if routes are added
- [ ] **Settings app** — Theme (light/dark), optional font size

---

### Phase 5 — Nice-to-haves

**Goal:** Extra polish and fun.

- [ ] **Entrance animations** — Hero text, folders, dock on load
- [ ] **Finder** — File browser of projects (list view)
- [ ] **Settings app (extended)** — Volume/brightness placeholders + real theme control
- [ ] **Trash** — Empty state or "deleted" items for fun

---

## 🚧 Current status

| Phase | Status | Items |
|-------|--------|-------|
| Phase 1 | ✅ Done | 4 |
| Phase 2 | 🔲 Not started | 5 |
| Phase 3 | 🔲 Not started | 3 |
| Phase 4 | 🔲 Not started | 6 |
| Phase 5 | 🔲 Not started | 4 |
