# Portfolio — Aditya Kundra

A personal portfolio built as a **macOS-style desktop**: React + Vite + Tailwind. Visitors use a virtual desktop with a menu bar, dock, folders, and app windows to explore projects and contact info.

---

## ✅ Completed

- [x] Notes App UI
- [x] Document UI
- [x] Contacts UI
- [x] Terminal (help, contact, about, skills, etc.)
- [x] Links (data in `Info.js`)
- [x] Messages UI (iMessage-style FAQ with interview Q&A)

---

## 🚧 Remaining

- [ ] **Gallery UI** — `Gallery.jsx` is a stub; `gallery` in `Info.js` is empty
- [ ] **Multiple folders (random positions)** — positions are fixed in `Info.js`; random placement logic not implemented
- [ ] **Animations** — entrance/exit and micro-interactions (modals, dock, folders)
- [ ] **Optimization** — code splitting, lazy-loaded modals, image optimization

### Additional gaps (from current code)

- **Modal sidebar** — "Favourites" and "Social Links" list items don’t switch project or open links
- **Notes in dock** — Notes app exists but isn’t opened from the dock (only Mail, Messages, Contacts, Terminal are wired)
- **Terminal** — uses placeholder text; not driven by `Info.js` (contact, socialLinks, projects)
- **Resume** — fixed position; could be part of the same desktop-item system as folders
- **Loader** — implemented but commented out in `App.jsx`

---

## 💡 What else we can add

### Desktop metaphor

- **Draggable windows** — move modals by dragging the title bar
- **Minimize to dock** — minimize button minimizes to dock icon and restore on click
- **Safari / Photos / Music** — Safari → link list or iframe; Photos → Gallery; Music → e.g. Spotify embed or link
- **Spotlight (Cmd+K)** — search that opens projects, notes, contact, or external links

### Content & data

- **Gallery** — populate `gallery` in `Info.js` and build a Photos-style grid/lightbox in `Gallery.jsx`
- **Build projects** — show "Build" type projects (Sports Score App, AI Resume Tailor, etc.) as folders or a Projects window
- **Single source of truth** — drive Terminal output and modal content from `Info.js` everywhere

### Polish & UX

- **Entrance animations** — hero text, folders, dock on load
- **Modal open/close** — scale + fade; optional backdrop blur
- **Loader** — re-enable and tune (e.g. until first paint)
- **Keyboard** — Escape closes top modal; Cmd+M (Messages), Cmd+T (Terminal)
- **Responsive** — simplified layout for small screens (dock strip, folder grid, full-screen modals)
- **Dark mode** — theme toggle (e.g. in Headbar) and consistent `dark:` usage

### Technical

- **Lazy-load modals** — `React.lazy` for Terminal, Message, Contact, Notes, Gallery
- **SEO / meta** — solid default title and description; per-project meta if you add routes
- **Settings** — theme (light/dark), optional font size

### Nice-to-haves

- **Finder** — opens a “file browser” of projects (list view)
- **Settings app** — volume/brightness placeholders + real theme control
- **Trash** — empty state or “deleted” items for fun

---

## Suggested priority

1. **Quick wins** — Wire Modal sidebar (Favourites + Social Links); connect Terminal to `Info.js`; add Notes to dock.
2. **Content** — Implement Gallery (data + `Gallery.jsx`); optionally surface Build projects.
3. **Metaphor** — Draggable windows, then minimize-to-dock.
4. **Polish** — Animations, re-enable Loader, responsive, dark mode.
