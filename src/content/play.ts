export interface TruthOption {
  text: string
  isLie?: boolean
  reveal: string
  href?: string
}

/** Every truth comes from this site, or from Aditya's own notes. Lies are revealed as lies straight away. */
export const truthRounds: { topic: string; options: TruthOption[] }[] = [
  {
    topic: 'The day job',
    options: [
      { text: 'He cut data fetch times by 40% on a learning module for students.', reveal: 'True. That was GENIE at LEAD School.', href: '/work/lead-school' },
      { text: 'He rewrote a bank’s mainframe in COBOL.', isLie: true, reveal: 'The lie. There is no COBOL anywhere in this career.' },
      { text: 'He built a headless e-commerce platform serving both B2B and B2C.', reveal: 'True. That was Redefine.', href: '/work/redefine' },
    ],
  },
  {
    topic: 'Voice experiments',
    options: [
      { text: 'He trained his own speech recognition model from scratch.', isLie: true, reveal: 'The lie. He uses faster-whisper and AssemblyAI, and spent his time on the pipeline instead.' },
      { text: 'He built the same voice assistant twice, just to compare the architectures.', reveal: 'True. One stack is local, and the other is a LiveKit worker.', href: '/work/voice-assistant-lab' },
      { text: 'His first voice prototype recorded about three seconds and uploaded it.', reveal: 'True, and he retired it, because that is not a conversation.', href: '/work/voice-assistant-lab' },
    ],
  },
  {
    topic: 'Resume Studio',
    options: [
      { text: 'When the LLM returns an invalid resume, the numbered issues go back to it for repair.', reveal: 'True. That is the repair loop, shown in the case study.', href: '/work/resume-studio' },
      { text: 'Its ATS-style score gives keyword match the biggest weight, at 40%.', reveal: 'True. You can try the formula yourself.', href: '/work/resume-studio' },
      { text: 'It only works with a paid OpenAI key.', isLie: true, reveal: 'The lie. Ollama is the default, so it can run on your own machine.' },
    ],
  },
  {
    topic: 'Weekend builds',
    options: [
      { text: 'His ISBN scanner automatically orders the book from Amazon.', isLie: true, reveal: 'The lie. It only saves the book to your shelf, which is safer for everyone’s wallet.' },
      { text: 'Scan the same book twice and his API answers with a 409.', reveal: 'True. The duplicate check runs before any external request.', href: '/work/isbn-scanner' },
      { text: 'His Mini Feed API limits post uploads to 10 an hour per IP.', reveal: 'True. You can go and hit that limit.', href: '/work/mini-feed' },
    ],
  },
  {
    topic: 'The person',
    options: [
      { text: 'He keeps Hindi rap lyrics saved in his notes.', reveal: 'True. Lines from “Kaam Bhaari” and “DIY” were in there.' },
      { text: 'He has never mentored anyone.', isLie: true, reveal: 'The lie. He mentored junior developers and led code reviews at Bonami.', href: '/#career' },
      { text: 'One of his notes just says “Keep showing up (something will click).”', reveal: 'True, and probably the most honest engineering advice on this site.' },
    ],
  },
]

export const BUG_NAMES = ['N+1 query', 'Memory leak', 'CORS error', 'Race condition', 'Off by one', 'Stale cache', 'Null pointer', 'Flaky test', 'Missed await', 'Timezone bug']

export const bugHuntUnlocks = [
  { score: 5, title: 'Legacy tamer', fact: 'At Bonami, Aditya refactored legacy code to modern practices, improving maintainability and test coverage.', href: '/#career' },
  { score: 12, title: 'Query whisperer', fact: 'At LEAD School, his REST APIs cut data fetch times by 40%.', href: '/work/lead-school' },
  { score: 20, title: 'Team lead energy', fact: 'He has also mentored junior developers and led code reviews.', href: '/#career' },
]

export const SAMPLE_JD = `Full-stack engineer. You will build APIs in Node.js and TypeScript, ship React and Next.js frontends, and work with MongoDB and Redis. Experience with Docker, AWS and Kubernetes is a plus.`
