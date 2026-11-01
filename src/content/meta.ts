import { posts } from './posts.generated.js'
import { profile } from './profile.js'
import { caseStudies, findCaseStudy } from './work.js'

export interface PageMeta {
  title: string
  description: string
  path: string
  noindex?: boolean
}

const home: PageMeta = {
  title: `${profile.name}, ${profile.role}`,
  description: `${profile.role} at ${profile.employer} in ${profile.location}. Case studies on commerce platforms, APIs and realtime voice prototypes.`,
  path: '/',
}

export const getMeta = (pathname: string): PageMeta => {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/') return home
  if (path === '/desktop') {
    return {
      title: `Desktop mode | ${profile.name}`,
      description: `Explore ${profile.name}'s work through a small working desktop with windows, a terminal and search.`,
      path,
    }
  }
  if (path === '/shelf') {
    return { title: `Shelf | ${profile.name}`, description: `${profile.name}'s blogs and notes, plus recommended articles, videos and songs.`, path }
  }
  const post = posts.find((item) => `/shelf/${item.slug}` === path)
  if (post) return { title: `${post.title} | ${profile.name}`, description: post.summary, path }
  const study = findCaseStudy(path.match(/^\/work\/([^/]+)$/)?.[1])
  if (study) return { title: `${study.title} | ${profile.name}`, description: study.summary, path }
  return { title: `Page not found | ${profile.name}`, description: 'This page does not exist.', path, noindex: true }
}

export const prerenderRoutes = ['/', '/desktop', '/shelf', ...caseStudies.map((c) => `/work/${c.slug}`), ...posts.map((post) => `/shelf/${post.slug}`)]
