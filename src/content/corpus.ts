import { posts } from './posts.generated.js'
import { education, experience, profile, skills } from './profile.js'
import { picks } from './shelf.js'
import { caseStudies } from './work.js'

/** Everything the Ask feature may use. If it is not on the site, it is not in here. */
export interface CorpusDoc {
  id: string
  title: string
  href: string
  text: string
}

const flowsText = (flows: (typeof caseStudies)[number]['flows']) =>
  flows.map((f) => `${f.title ? `${f.title}: ` : 'Pipeline: '}${f.steps.map((step) => `${step.label} (${step.detail})`).join(' -> ')}.`).join(' ')

export const corpus: CorpusDoc[] = [
  {
    id: 'about',
    title: 'About and contact',
    href: '/#top',
    text: `${profile.name} is a ${profile.role} at ${profile.employer}, based in ${profile.location}. ${profile.headline} Email: ${profile.email}. GitHub: ${profile.links.github}. LinkedIn: ${profile.links.linkedin}. Resume: ${profile.resumeUrl}.`,
  },
  ...experience.map((job) => ({
    id: `job-${job.id}`,
    title: `${job.company}: ${job.title}`,
    href: '/#serious',
    text: `${job.title} at ${job.company}, ${job.period}. Stack: ${job.stack.join(', ')}. ${job.points.join(' ')}`,
  })),
  {
    id: 'skills',
    title: 'Skills',
    href: '/#toolbox',
    text: skills.map((s) => `${s.label}: ${s.items.join(', ')}.`).join(' '),
  },
  {
    id: 'education',
    title: 'Education',
    href: '/#toolbox',
    text: education.map((e) => `${e.degree}, ${e.school}, ${e.period}.`).join(' '),
  },
  ...caseStudies.map((c) => ({
    id: `work-${c.slug}`,
    title: c.title,
    href: `/work/${c.slug}`,
    text: [
      `${c.title} (${c.kind}). ${c.role ? `Role: ${c.role}. ` : ''}Stack: ${c.stack.join(', ')}.`,
      c.summary,
      c.problem,
      flowsText(c.flows),
      ...c.approach,
      ...c.tradeoffs.map((t) => `Trade-off, ${t.title}: ${t.body}`),
      c.setback ? `Setback, ${c.setback.title}: ${c.setback.body}` : '',
      c.results.length ? `Results: ${c.results.join(' ')}` : '',
      c.limits.length ? `Limitations: ${c.limits.join(' ')}` : '',
    ]
      .filter(Boolean)
      .join(' '),
  })),
  {
    id: 'dsa',
    title: 'DSA practice',
    href: '/#play',
    text: `${profile.name}'s data structures and algorithms practice is on GitHub at https://github.com/AdityaKundra/DSA-Pratice, mostly in C++ with some JavaScript. It includes quicksort, mergesort, heapsort, Dijkstra, Floyd-Warshall, N-Queens, sum of subsets, travelling salesperson, a binary tree, a linked list and BFS. The Sort Race game on this site runs ports of the three sorts. He also practises on LeetCode: ${profile.links.leetcode}.`,
  },
  ...posts.map((post) => ({
    id: `post-${post.slug}`,
    title: post.title,
    href: `/shelf/${post.slug}`,
    text: `${post.kind === 'blog' ? 'Blog post' : 'Note'} by ${profile.name}: ${post.title}. ${post.summary} ${post.text}`,
  })),
  {
    id: 'recommendations',
    title: 'Recommendations',
    href: '/shelf',
    text: `Things ${profile.name} recommends. ${picks.map((pick) => `${pick.type}: ${pick.title} by ${pick.by}. ${pick.why}`).join(' ')}`,
  },
]
