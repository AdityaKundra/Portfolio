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
- [x] **Minimize to dock** — dock apps minimize and restore (Messages, Contacts, Terminal, Photos, Notes, Safari, Music, Settings)
- [x] **Notes & Photos in dock** — both open from dock (Notes, Gallery)
- [x] **Modal sidebar** — Favourites switch projects; Social Links open in new tab
- [x] **Single source of truth** — Terminal and modal content driven by `Info.js`
- [x] **Spotlight (Cmd+K)** — Search apps, projects, and social links
- [x] **Safari & Music** — Dock-openable app windows
- [x] **Settings** — Theme toggle, text size (applies to root `html`), dock-openable

---

## 📋 Phased plan

### Phase 1 — Quick wins & polish ✅

**Goal:** Ship-ready experience with minimal effort.

- [x] **Loader** — Re-enable in `App.jsx`; tune timing (~1.2s display + 0.5s exit)
- [x] **Keyboard shortcuts** — Escape closes top modal / Spotlight; Cmd+M (Messages), Cmd+T (Terminal), Cmd+K (Spotlight)
- [x] **Modal open/close animations** — scale + fade on open; scale-out on close (close button)
- [x] **Responsive layout** — folder grid on mobile; responsive modals; compact hero
- [x] **Entrance animations** — Hero, folders, dock use `animate-fade-in-up` on load (see [App.jsx](src/App.jsx))

---

### Phase 2 — Content & metaphor ✅

**Goal:** Richer content and more desktop-like behavior.

- [x] **Gallery content** — Replaced random placeholder images in `Info.js` with stable project-themed visuals
- [x] **Build projects** — Surfaced Sports Score App, AI Resume Tailor, Productive App as desktop folders
- [x] **Random folder positions** — Generate random positions for folders on desktop load (per session)
- [x] **Project modals minimize** — Folder windows support minimize; restore by clicking the folder again (not on dock)
- [x] **Resume** — Integrated into desktop-item system with shared folder rendering

---

### Phase 3 — New apps & search ✅

**Goal:** Expand the desktop metaphor.

- [x] **Spotlight (Cmd+K)** — Search launcher for apps, projects, and social links
- [x] **Safari** — Quick-link browser-style app window from dock
- [x] **Music** — Music app window with curated tracks panel

---

### Phase 4 — Technical & UX polish

**Goal:** Performance, accessibility, and quality of life.

- [x] **Lazy-load modals** — `React.lazy` + `Suspense` for Terminal, Message, Contact, Notes, Gallery, Safari, Music, Settings, Spotlight
- [x] **Code splitting** — Vite emits separate chunks per lazy import (route-level splitting optional if you add a router)
- [ ] **Image optimization** — Lazy loading, responsive images, WebP where supported
- [x] **Dark mode** — Theme via `ThemeContext` + Settings; consistent `dark:` across components
- [x] **SEO / meta** — Default description, Open Graph, Twitter tags; share image served from `public/`
- [x] **Settings app** — Dock-openable Settings with theme toggle and global text size

---

### Phase 5 — Nice-to-haves

**Goal:** Extra polish and fun.

- [x] **Entrance animations** — Covered in Phase 1 (hero, folders, dock)
- [ ] **Finder** — File browser of projects (list view)
- [ ] **Settings app (extended)** — Volume/brightness placeholders + extras
- [ ] **Trash** — Empty state or "deleted" items for fun

---

## 🚧 Current status

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1 | Done | Includes entrance animations |
| Phase 2 | Done | |
| Phase 3 | Done | |
| Phase 4 | Mostly done | Image optimization still open |
| Phase 5 | Partial | Finder, extended Settings, Trash |
