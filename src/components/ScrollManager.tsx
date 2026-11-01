import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { getMeta } from '../content/meta'

/** Keeps the title, description and scroll position right across client-side navigation. */
export const ScrollManager = () => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const meta = getMeta(pathname)
    document.title = meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
  }, [pathname])

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
