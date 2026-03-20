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
- [x] **Modal open/close animations** — scale + fade on open; scale-out on close (close button)
- [x] **Responsive layout** — folder grid on mobile; responsive modals; compact hero

---

### Phase 2 — Content & metaphor

**Goal:** Richer content and more desktop-like behavior.

- [x] **Gallery content** — Replaced random placeholder images in `Info.js` with stable project-themed visuals
- [x] **Build projects** — Surfaced Sports Score App, AI Resume Tailor, Productive App as desktop folders
- [x] **Random folder positions** — Generate random positions for folders on desktop load (per session)
- [x] **Project modals minimize** — Folder windows now support minimize behavior
- [x] **Resume** — Integrated into desktop-item system with shared folder rendering

---

### Phase 3 — New apps & search

**Goal:** Expand the desktop metaphor.

- [x] **Spotlight (Cmd+K)** — Search launcher for apps, projects, and social links
- [x] **Safari** — Quick-link browser-style app window from dock
- [x] **Music** — Music app window with curated tracks panel

---

### Phase 4 — Technical & UX polish

**Goal:** Performance, accessibility, and quality of life.

- [ ] **Lazy-load modals** — `React.lazy` for Terminal, Message, Contact, Notes, Gallery
- [ ] **Code splitting** — Route-level or feature-level splits
- [ ] **Image optimization** — Lazy loading, responsive images, WebP where supported
- [ ] **Dark mode** — Theme toggle (e.g. in Headbar); consistent `dark:` usage
- [x] **SEO / meta** — Added default description, Open Graph, and Twitter meta tags
- [x] **Settings app** — Dock-openable Settings window with theme toggle and text-size options

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
| Phase 2 | ✅ Done | 5 |
| Phase 3 | ✅ Done | 3 |
| Phase 4 | 🟨 In progress | 6 |
| Phase 5 | 🟨 In progress | 4 |
