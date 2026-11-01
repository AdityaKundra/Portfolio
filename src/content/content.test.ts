import { describe, expect, it } from 'vitest'
import { corpus } from './corpus'
import { getMeta, prerenderRoutes } from './meta'
import { caseStudies } from './work'

const everything = JSON.stringify({ corpus, caseStudies })

describe('site content', () => {
  it('never publishes a phone number', () => {
    expect(everything).not.toMatch(/\+?91[\s-]?\d{10}|\b[6-9]\d{9}\b/)
  })

  it('gives every case study the sections its page needs', () => {
    for (const study of caseStudies) {
      expect(study.summary, study.slug).toBeTruthy()
      expect(study.problem, study.slug).toBeTruthy()
      expect(study.results.length, study.slug).toBeGreaterThan(0)
      for (const flow of study.flows) {
        expect(flow.steps.length, study.slug).toBeGreaterThan(1)
        expect(new Set(flow.steps.map((step) => step.label)).size, `${study.slug} has duplicate steps`).toBe(flow.steps.length)
        for (const step of flow.steps) expect(step.detail, step.label).toBeTruthy()
      }
    }
  })

  it('links fun projects to their source and shows real code', () => {
    for (const study of caseStudies.filter((item) => item.track === 'fun')) {
      expect(study.repo, study.slug).toMatch(/^https:\/\/github\.com\//)
      expect(study.snippet?.code, study.slug).toBeTruthy()
    }
  })

  it('takes serious work from the resume, with no repo links', () => {
    expect(caseStudies.filter((item) => item.track === 'serious').map((item) => item.slug)).toEqual(['lead-school', 'redefine'])
  })

  it('has unique corpus ids, and every internal source points at a real route', () => {
    expect(new Set(corpus.map((doc) => doc.id)).size).toBe(corpus.length)
    for (const doc of corpus.filter((item) => item.href.startsWith('/'))) {
      const path = doc.href.split('#')[0] || '/'
      expect(prerenderRoutes, doc.id).toContain(path)
    }
  })

  it('marks unknown pages noindex and gives real pages their own metadata', () => {
    expect(getMeta('/nope').noindex).toBe(true)
    const titles = prerenderRoutes.map((route) => getMeta(route).title)
    expect(new Set(titles).size).toBe(titles.length)
  })
})
