export const profile = {
  name: 'Aditya Kundra',
  role: 'Software Engineer',
  employer: 'AVH Commerce',
  location: 'Delhi, India',
  headline: 'I build commerce platforms, APIs, and realtime voice prototypes.',
  intro:
    'Software engineer at AVH Commerce, working across Node.js, React, Next.js and MongoDB. Below: the production work from my jobs, then the things I build on my own time, with demos and real code you can try.',
  email: 'adityadef@gmail.com',
  resumeUrl: 'https://drive.google.com/file/d/1Y5SerpDnMvF0BpDn11yJozSNHiyTx1m-/view?usp=sharing',
  siteUrl: 'https://portfolio-tau-bice-23.vercel.app',
  sourceUrl: 'https://github.com/AdityaKundra/Portfolio',
  links: {
    github: 'https://github.com/AdityaKundra',
    linkedin: 'https://www.linkedin.com/in/adi-kundra/',
    leetcode: 'https://leetcode.com/u/PracticeAdi/',
  },
} as const

export interface Job {
  id: string
  company: string
  title: string
  period: string
  stack: string[]
  points: string[]
}

export const experience: Job[] = [
  {
    id: 'avh',
    company: 'AVH Commerce',
    title: 'Software Engineer',
    period: 'Sep 2025 – present',
    stack: ['Node.js', 'Express', 'MongoDB', 'Next.js'],
    points: [
      'Build and scale e-commerce features, with APIs in Node.js, Express and MongoDB.',
      'Implement CMS workflows.',
      'Improve frontend performance in Next.js.',
    ],
  },
  {
    id: 'bonami',
    company: 'Bonami Software',
    title: 'Software Engineer',
    period: 'May 2021 – Aug 2023',
    stack: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
    points: [
      'Built reusable React components and Node.js REST services for full-stack applications.',
      'Optimized APIs and database queries, and built custom CMS tools.',
      'Refactored legacy code to modern practices, improving maintainability and test coverage.',
      'Mentored junior developers, led code reviews and worked directly with product and business stakeholders.',
    ],
  },
  {
    id: 'pstech',
    company: 'PS Tech Global',
    title: 'Back-End Developer',
    period: 'Aug 2019 – Jul 2020',
    stack: ['PHP', 'JavaScript'],
    points: [
      'Supported high-traffic web applications built with PHP, JavaScript, HTML and CSS.',
      'Partnered with senior engineers on core features and application health.',
      'Refactored code to reduce server load and improve response times.',
    ],
  },
]

export const skills: { label: string; items: string[] }[] = [
  { label: 'Languages', items: ['TypeScript', 'JavaScript', 'PHP', 'C++'] },
  { label: 'Frontend', items: ['React', 'Next.js', 'React Native', 'Redux', 'React Query', 'Tailwind CSS'] },
  { label: 'Backend', items: ['Node.js', 'Express', 'REST APIs', 'WebSockets', 'Laravel'] },
  { label: 'Data', items: ['MongoDB', 'SQL'] },
  { label: 'Infrastructure', items: ['Docker', 'GitHub Actions', 'AWS (EC2, S3, Lambda)', 'Vercel', 'Netlify'] },
  { label: 'AI and realtime', items: ['LiveKit', 'Ollama', 'OpenAI', 'Gemini', 'faster-whisper'] },
]

export const education = [
  { school: 'Chandigarh University', degree: 'Master of Computer Applications', period: '2023 – 2025' },
  { school: 'Subharti University', degree: 'Bachelor of Computer Applications', period: '2019 – 2022' },
]
