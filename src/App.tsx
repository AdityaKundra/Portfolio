import { lazy, Suspense, useSyncExternalStore } from 'react'
import { Outlet, Route, Routes } from 'react-router'
import { HireDialog } from './components/HireDialog'
import { ScrollManager } from './components/ScrollManager'
import { SiteFooter, SiteHeader } from './components/SiteChrome'
import { CaseStudyPage } from './pages/CaseStudy'
import { Home } from './pages/Home'
import { PostPage, ShelfPage } from './pages/Shelf'
import { NotFound } from './pages/NotFound'

const Desktop = lazy(() => import('./desktop/Desktop'))

const DESKTOP_FALLBACK = <div className="graph grid h-dvh place-items-center font-mono text-sm text-muted">Starting desktop…</div>
const subscribeNever = () => () => {}

/** The desktop needs a viewport, so the prerendered page is just the loading state. */
const DesktopRoute = () => {
  const isClient = useSyncExternalStore(subscribeNever, () => true, () => false)
  return isClient ? <Suspense fallback={DESKTOP_FALLBACK}><Desktop /></Suspense> : DESKTOP_FALLBACK
}

const SiteLayout = () => (
  <>
    <SiteHeader />
    <main id="main"><Outlet /></main>
    <SiteFooter />
  </>
)

export const App = () => (
  <>
    <ScrollManager />
    <HireDialog />
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="work/:slug" element={<CaseStudyPage />} />
        <Route path="shelf" element={<ShelfPage />} />
        <Route path="shelf/:slug" element={<PostPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="desktop" element={<DesktopRoute />} />
    </Routes>
  </>
)
