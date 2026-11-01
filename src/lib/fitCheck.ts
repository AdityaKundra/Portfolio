import { skills } from '../content/profile'
import { usesOf, type Evidence } from './evidence'

const CATALOG: { name: string; pattern: RegExp }[] = [
  { name: 'React Native', pattern: /\breact[\s-]native\b/i },
  { name: 'React', pattern: /\b(React(\.?js)?|react\.?js)\b(?![\s-][Nn]ative)/ },
  { name: 'Next.js', pattern: /\bnext(\.?js)\b/i },
  { name: 'Node.js', pattern: /\bnode(\.?js)?\b/i },
  { name: 'Express', pattern: /\bExpress(\.?js)?\b|\bexpress\.?js\b/ },
  { name: 'TypeScript', pattern: /\btypescript\b|(?<![.\w])TS\b/i },
  { name: 'JavaScript', pattern: /\bjavascript\b|(?<![.\w])JS\b/i },
  { name: 'MongoDB', pattern: /\bmongo(db)?\b/i },
  { name: 'SQL', pattern: /\bsql\b/i },
  { name: 'PostgreSQL', pattern: /\bpostgres(ql)?\b/i },
  { name: 'MySQL', pattern: /\bmysql\b/i },
  { name: 'Redis', pattern: /\bredis\b/i },
  { name: 'REST APIs', pattern: /\bREST(ful)?\b|\bRestful\b|\bAPIs?\b/ },
  { name: 'GraphQL', pattern: /\bgraphql\b/i },
  { name: 'WebSockets', pattern: /\bweb\s?sockets?\b/i },
  { name: 'Redux', pattern: /\bredux\b/i },
  { name: 'Tailwind CSS', pattern: /\btailwind\b/i },
  { name: 'Vue', pattern: /\bvue(\.?js)?\b/i },
  { name: 'Angular', pattern: /\bangular\b/i },
  { name: 'Docker', pattern: /\bdocker\b/i },
  { name: 'Kubernetes', pattern: /\b(kubernetes|k8s)\b/i },
  { name: 'AWS (EC2, S3, Lambda)', pattern: /\b(aws|ec2|s3|lambda)\b/i },
  { name: 'GCP', pattern: /\b(gcp|google cloud)\b/i },
  { name: 'Azure', pattern: /\bazure\b/i },
  { name: 'Terraform', pattern: /\bterraform\b/i },
  { name: 'GitHub Actions', pattern: /\b(github actions|ci\/cd)\b/i },
  { name: 'Kafka', pattern: /\bkafka\b/i },
  { name: 'C++', pattern: /(?<![\w+])c\+\+(?!\w)/i },
  { name: 'Python', pattern: /\bpython\b/i },
  { name: 'Java', pattern: /\bjava\b/i },
  { name: 'Go', pattern: /\b(golang|go developer)\b/i },
  { name: 'PHP', pattern: /\bphp\b/i },
  { name: 'Laravel', pattern: /\blaravel\b/i },
  { name: 'WordPress', pattern: /\bwordpress\b/i },
  { name: 'Shopify', pattern: /\bshopify\b/i },
  { name: 'Drupal', pattern: /\bdrupal\b/i },
  { name: 'Firebase', pattern: /\bfirebase\b/i },
  { name: 'LiveKit', pattern: /\blivekit\b/i },
  { name: 'OpenAI', pattern: /\bopenai\b/i },
  { name: 'Ollama', pattern: /\bollama\b/i },
]

/** Named on the resume, without a project on this site to point at. */
const RESUME_ONLY = ['Shopify', 'Drupal', 'Firebase']

const listed = new Set([...skills.flatMap((group) => group.items), ...RESUME_ONLY])

export interface FitResult {
  proven: { name: string; uses: Evidence[] }[]
  listed: string[]
  gaps: string[]
  total: number
  /** Share of detected skills he has evidence for or lists, from 0 to 100. */
  score: number
}

export const checkFit = (description: string): FitResult => {
  const found = CATALOG.filter((item) => item.pattern.test(description)).map((item) => item.name)
  const proven: FitResult['proven'] = []
  const named: string[] = []
  const gaps: string[] = []
  for (const name of found) {
    const uses = usesOf(name)
    if (uses.length) proven.push({ name, uses })
    else if (listed.has(name)) named.push(name)
    else gaps.push(name)
  }
  const matched = proven.length + named.length
  return { proven, listed: named, gaps, total: found.length, score: found.length ? Math.round((matched / found.length) * 100) : 0 }
}
