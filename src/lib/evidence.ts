import { experience } from '../content/profile'
import { caseStudies } from '../content/work'

export interface Evidence {
  title: string
  href: string
  note: string
  stack: string[]
}

export const evidenceEntries: Evidence[] = [
  ...caseStudies.map((study) => ({ title: study.title, href: `/work/${study.slug}`, note: study.track === 'serious' ? 'Serious work' : 'Fun stuff', stack: study.stack })),
  ...experience.map((job) => ({ title: job.company, href: '/#career', note: 'Job', stack: job.stack })),
  { title: 'DSA practice', href: '/#play', note: 'Fun stuff', stack: ['C++', 'JavaScript'] },
]

export const usesOf = (skill: string) => evidenceEntries.filter((entry) => entry.stack.includes(skill))
