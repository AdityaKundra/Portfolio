export interface FlowStep {
  label: string
  detail: string
}

export interface Flow {
  title?: string
  steps: FlowStep[]
}

export type DemoId = 'voice' | 'ats' | 'rate-limit' | 'isbn' | 'fetch-time'

export interface CaseStudy {
  slug: string
  title: string
  track: 'serious' | 'fun'
  kind: 'Client work' | 'Personal project'
  role?: string
  stack: string[]
  summary: string
  problem: string
  highlights: { value: string; label: string }[]
  flows: Flow[]
  approach: string[]
  tradeoffs: { title: string; body: string }[]
  setback?: { title: string; body: string }
  results: string[]
  limits: string[]
  repo?: string
  demo?: DemoId
  snippet?: { path: string; branch?: string; language: string; note: string; code: string }
}

const step = (label: string, detail: string): FlowStep => ({ label, detail })

export const caseStudies: CaseStudy[] = [
  {
    slug: 'lead-school',
    title: 'LEAD School: GENIE',
    track: 'serious',
    kind: 'Client work',
    role: 'Backend engineer',
    stack: ['React', 'REST APIs', 'WordPress'],
    summary: 'Backend APIs for GENIE, a personalized learning module for students, with data fetch times reduced by 40%.',
    problem: 'GENIE needed to deliver personalized learning content to students quickly, through APIs the frontend teams could integrate with reliably.',
    highlights: [
      { value: '40%', label: 'lower data fetch times' },
      { value: 'GENIE', label: 'personalized learning module' },
    ],
    flows: [
      {
        steps: [
          step('Student', 'A student opens the GENIE learning module.'),
          step('React frontend', 'The frontend requests the content for that student.'),
          step('REST APIs', 'The APIs I designed and built serve the data. This is where fetch times came down by 40%.'),
          step('Learning content', 'Content comes back in the shape the frontend teams agreed with me.'),
        ],
      },
    ],
    approach: [
      'Developed the backend APIs for GENIE to improve content delivery speed.',
      'Designed and implemented REST APIs, reducing data fetch times by 40%.',
      'Worked closely with the frontend teams on API integration and data consistency, for a smoother user journey.',
    ],
    tradeoffs: [],
    results: ['Reduced data fetch times by 40%.', 'Improved content delivery speed for students.'],
    limits: [],
    demo: 'fetch-time',
  },
  {
    slug: 'redefine',
    title: 'Redefine',
    track: 'serious',
    kind: 'Client work',
    role: 'Full-stack engineer',
    stack: ['React', 'Next.js', 'MongoDB'],
    summary: 'A headless e-commerce platform supporting both B2B and B2C sales, with custom CMS modules and scalable storefront templates.',
    problem: 'The platform had to support both B2B and B2C sales, and content updates needed to take less time.',
    highlights: [
      { value: 'B2B + B2C', label: 'on one platform' },
      { value: 'Headless', label: 'commerce architecture' },
      { value: 'Custom', label: 'CMS modules' },
    ],
    flows: [
      {
        steps: [
          step('CMS modules', 'Custom modules that reduce content update time and streamline backend processes.'),
          step('MongoDB', 'Stores the platform data.'),
          step('Next.js templates', 'Scalable front-end templates that render the storefront and cut page load times.'),
          step('B2B and B2C', 'Both sales models run on the same platform.'),
        ],
      },
    ],
    approach: [
      'Created a headless e-commerce platform using React, Next.js and MongoDB, supporting B2B and B2C models.',
      'Built custom CMS modules, reducing content update time and streamlining backend processes.',
      'Developed scalable front-end templates, enhancing user engagement and reducing page load times.',
    ],
    tradeoffs: [],
    results: ['Reduced content update time.', 'Reduced page load times and improved user engagement.'],
    limits: [],
  },
  {
    slug: 'voice-assistant-lab',
    title: 'Voice Assistant Lab',
    track: 'fun',
    kind: 'Personal project',
    role: 'Sole developer',
    stack: ['Node.js', 'LiveKit', 'Python', 'faster-whisper', 'Ollama', 'OpenAI', 'AssemblyAI', 'Sarvam'],
    summary: 'The same voice assistant built on two architectures, to compare a local pipeline with an agent worker running in a LiveKit room.',
    problem:
      'A voice assistant has to capture speech, transcribe it, generate a reply and speak it back while the conversation is still moving. I wanted to see how the structure of that pipeline changes what you have to run and operate, so I built it twice.',
    highlights: [
      { value: '2', label: 'voice architectures' },
      { value: '3', label: 'stages: STT, LLM, TTS' },
      { value: 'TTFT', label: 'LLM timing in worker logs' },
    ],
    flows: [
      {
        title: 'Local stack',
        steps: [
          step('Browser mic', 'The browser joins a LiveKit room and publishes mic audio.'),
          step('Rolling chunks', 'Small rolling audio chunks go to the Node server.'),
          step('faster-whisper', 'A Flask service transcribes each chunk with the faster-whisper base model.'),
          step('Ollama', 'Node asks a local llama3 model for a short reply.'),
          step('Sarvam TTS', 'Sarvam turns the reply into an MP3.'),
          step('Data packet', 'A LiveKit data packet tells the browser to play the MP3.'),
        ],
      },
      {
        title: 'Agent worker stack',
        steps: [
          step('Browser mic', 'The browser sends mic audio to the room over WebRTC.'),
          step('LiveKit room', 'Express only issues the token. All speech logic runs in the worker.'),
          step('Silero VAD', 'Detects where each utterance ends.'),
          step('AssemblyAI', 'Transcribes each finished utterance in batch.'),
          step('OpenAI or Ollama', 'One environment variable selects the LLM.'),
          step('Sarvam TTS', 'Audio is published straight back into the room.'),
        ],
      },
    ],
    approach: [
      'The local stack publishes mic audio to a LiveKit room and sends small rolling chunks to an Express server. A Flask service transcribes them with faster-whisper, Ollama writes a short reply, Sarvam generates an MP3, and a LiveKit data packet tells the browser to play it.',
      'The agent stack moves all speech logic into a LiveKit Agents worker. Express only serves health checks, access tokens and the client page. The worker detects utterances with Silero VAD, transcribes with AssemblyAI, calls the LLM, and publishes audio back into the room.',
      'The worker logs each pipeline stage, including STT wall time and LLM time to first token, warns at startup if Ollama is unreachable, and forwards worker errors to the page.',
    ],
    tradeoffs: [
      {
        title: 'Local control or hosted speech',
        body: 'The local stack keeps transcription and the LLM on my machine, but needs a Python sidecar and several processes. The agent stack runs fewer local processes, and depends on hosted speech APIs.',
      },
      {
        title: 'Files over HTTP or audio in the room',
        body: 'Generating an MP3 and signalling it over a data packet is easy to debug, because every stage has an inspectable output. Publishing audio directly from a worker is closer to how a live call behaves.',
      },
      {
        title: 'One LLM setting',
        body: 'The agent stack selects OpenAI or Ollama with an environment variable, using the same OpenAI-compatible client, so the pipeline does not change when the model does.',
      },
    ],
    setback: {
      title: 'The first version was not a conversation',
      body: 'My first proof of concept recorded about three seconds of audio and uploaded it to a POST endpoint. A fixed recording window cannot behave like a conversation, so I retired it to a legacy folder and made LiveKit the supported transport.',
    },
    results: ['Two runnable prototypes in one repository, each with its own setup guide and environment template.'],
    limits: ['These are proofs of concept, not production services.', 'I have not published end-to-end latency measurements comparing the two stacks.'],
    repo: 'https://github.com/AdityaKundra/Voice-prototypes-two-stacks-',
    demo: 'voice',
    snippet: {
      path: 'voice-agent-api/agent/agent.mjs',
      language: 'js',
      note: 'The whole realtime pipeline is composed in one place, so each stage can be replaced on its own.',
      code: `const vad = ctx.proc.userData.vad;
const batchStt = new AssemblyAIBatchSTT();
const sttPipeline = new stt.StreamAdapter(batchStt, vad);

const session = new voice.AgentSession({
  stt: sttPipeline,
  vad,
  llm: createAgentLLM(),
  tts: new SarvamTTS(),
  turnHandling: {
    turnDetection: "vad"
  }
});`,
    },
  },
  {
    slug: 'resume-studio',
    title: 'Resume Studio',
    track: 'fun',
    kind: 'Personal project',
    role: 'Sole developer',
    stack: ['Next.js', 'TypeScript', 'Ollama', 'OpenAI', 'Gemini', 'Puppeteer', 'Docker', 'GitHub Actions'],
    summary: 'A local-first Next.js app that tailors a resume to a job description, scores it with an ATS-style engine, exports a PDF and prepares you for the interview.',
    problem:
      'Tailoring a resume for every application is slow, and LLM output is unreliable when it has to fill a strict document format. The app had to produce consistent, printable resumes, and be able to run with no external API at all.',
    highlights: [
      { value: '3', label: 'LLM providers' },
      { value: '5', label: 'weighted scoring factors' },
      { value: '19', label: 'automated test cases' },
    ],
    flows: [
      {
        steps: [
          step('Profile + JD', 'Your structured profile plus the job description, pasted or fetched from a URL.'),
          step('JD analysis', 'A fast heuristic pass extracts skills, seniority and responsibilities with no LLM.'),
          step('LLM to JSON', 'Ollama, OpenAI or Gemini writes the resume as structured JSON.'),
          step('Validate + repair', 'Validation issues go back to the model, up to three attempts by default.'),
          step('A4 PDF', 'JSON becomes an HTML template, then a print-ready PDF through Puppeteer.'),
          step('ATS-style score', 'Five weighted factors produce a score and a list of gaps.'),
        ],
      },
    ],
    approach: [
      'The LLM writes to a structured JSON contract instead of free text. Each attempt is parsed, given deterministic fixes and validated. Any issues go back to the model with a repair prompt, three attempts by default, and the last attempt is returned if issues remain.',
      'A provider layer lets the same flow run on Ollama, OpenAI or Gemini.',
      'The scorer combines keyword match, semantic similarity, skills coverage, section completeness and formatting, then reports the gaps. A second pass can improve the resume using the missing keywords.',
      'The repository has a Dockerfile and automated tests, and CI runs ESLint, a type check and a production build.',
    ],
    tradeoffs: [
      { title: 'JSON contract over free text', body: 'A strict schema costs validation code and retries, but the template and PDF pipeline never have to interpret prose.' },
      { title: 'Embeddings with a TF-IDF fallback', body: 'Embeddings give a better semantic score but take time and need a model available. Falling back to TF-IDF keeps scoring working, and a setting skips embeddings when speed matters more.' },
      { title: 'Local-first storage', body: 'Saving to the browser needs no mandatory backend and keeps personal data on the device. The cost is that it is not a multi-user product.' },
    ],
    results: ['A complete workflow from job description to resume PDF, ATS-style score and role-specific interview preparation.'],
    limits: ['The ATS score is a heuristic and does not reproduce any real ATS.', 'Job URL extraction can fail on protected sites such as LinkedIn.', 'It is not hardened for multi-user SaaS use.'],
    repo: 'https://github.com/AdityaKundra/Resume-Studio-AI-resume-app-',
    demo: 'ats',
    snippet: {
      path: 'lib/ai-provider.ts',
      language: 'ts',
      note: 'The repair loop: the first attempt writes the resume, and later attempts get the numbered validation issues.',
      code: `const maxAttempts = maxResumeValidationAttempts();
for (let attempt = 0; attempt < maxAttempts; attempt++) {
  const system = attempt === 0 ? SYSTEM_RESUME : SYSTEM_RESUME_FIX;
  // ...
  const raw = await completeJson(system, user);
  let resume = parseResumeJson(raw);
  resume = applyDeterministicResumeFixes(resume);
  resume = compressResumeIfNeeded(resume);

  const v = validateOptimizedResume(resume, {
    lexicon: lexCtx,
    jobDescription,
  });
  if (v.ok) return resume;
  lastIssues = v.issues;
  lastResume = resume;
}`,
    },
  },
  {
    slug: 'mini-feed',
    title: 'Mini Feed',
    track: 'fun',
    kind: 'Personal project',
    stack: ['React Native', 'Expo', 'TypeScript', 'Express', 'MongoDB'],
    summary: 'A React Native social feed with posts, likes and comments, on a TypeScript Express and MongoDB API with JWT auth.',
    problem: 'I wanted a complete mobile product loop on one TypeScript stack: sign in, post, like, comment and scroll, with an API that protects itself.',
    highlights: [
      { value: 'iOS + Android', label: 'from one Expo codebase' },
      { value: '10/hour', label: 'post upload limit per IP' },
      { value: 'Swagger', label: 'API docs at /api-docs' },
    ],
    flows: [
      {
        steps: [
          step('Expo app', 'React Native screens using Expo Router, with the JWT kept in Expo Secure Store.'),
          step('Express API', 'TypeScript controllers for auth, posts, likes and comments.'),
          step('Middleware', 'JWT auth, Helmet security headers, rate limits and central error handling.'),
          step('MongoDB', 'Users, posts and comments, with likes stored as user references on each post.'),
        ],
      },
    ],
    approach: [
      'The feed uses a FlatList with infinite scrolling and pull to refresh, and forms use React Hook Form.',
      'A like is a toggle: the API checks whether the user already liked the post, then adds or removes their ID and returns the new count.',
      'Creating and updating posts pass through an upload rate limit of 10 requests an hour per IP, and the API documents itself with Swagger.',
    ],
    tradeoffs: [
      { title: 'Likes on the post document', body: 'Keeping liker IDs on each post makes counts and "did I like this" simple to read. The array grows with every like, which a separate collection would avoid at scale.' },
    ],
    results: ['A working full-stack mobile app with auth, posting, likes and comments, plus documented APIs.'],
    limits: [],
    repo: 'https://github.com/AdityaKundra/Mini-Feed-App',
    demo: 'rate-limit',
    snippet: {
      path: 'backend/src/middleware/security.middleware.ts',
      language: 'ts',
      note: 'A small factory gives every limiter the same error shape.',
      code: `export const createRateLimit = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests',
        details: message
      }
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export const uploadLimiter = createRateLimit(
  60 * 60 * 1000,
  10,
  'Upload limit exceeded. Please try again later.'
);`,
    },
  },
  {
    slug: 'isbn-scanner',
    title: 'ISBN Scanner',
    track: 'fun',
    kind: 'Personal project',
    role: 'Sole developer',
    stack: ['React', 'ZXing', 'Express', 'MongoDB', 'Open Library'],
    summary: 'Point your camera at a book barcode, look it up on Open Library, and save it to your own shelf in MongoDB.',
    problem: 'Typing in book details by hand is tedious, and every book already has a barcode. I wanted scanning a book to be the whole workflow.',
    highlights: [
      { value: 'Camera', label: 'barcode reading with ZXing' },
      { value: '2', label: 'focused API routes' },
      { value: '409', label: 'returned for a duplicate scan' },
    ],
    flows: [
      {
        steps: [
          step('Camera', 'ZXing reads the barcode from the video stream in the browser.'),
          step('Express API', 'The scanned ISBN goes to GET /fetch-book/:isbn.'),
          step('Duplicate check', 'If MongoDB already has that ISBN, the API returns 409 with the existing book.'),
          step('Open Library', 'Otherwise the API fetches title, authors, publish date and cover.'),
          step('MongoDB', 'The book is saved and appears at the top of the list.'),
        ],
      },
    ],
    approach: [
      'The React app decodes the barcode from the camera with ZXing and stops scanning after the first successful read.',
      'The Express API checks MongoDB before calling Open Library, so scanning the same book twice costs no external request.',
      'A 409 tells the frontend the difference between "already on your shelf" and a real failure, so it can show the right message.',
    ],
    tradeoffs: [
      { title: 'Check the database first', body: 'Looking up the ISBN locally before calling Open Library adds a query to every scan, and in return avoids repeat external requests and duplicate records.' },
    ],
    results: ['A working scan-to-shelf flow with duplicate protection.'],
    limits: ['The API URLs and database connection are set up for local development.'],
    repo: 'https://github.com/AdityaKundra/ISBN-Scanner',
    demo: 'isbn',
    snippet: {
      path: 'backend/index.js',
      branch: 'master',
      language: 'js',
      note: 'Check locally first, and only call the external API for a book the shelf has never seen.',
      code: `const existingBook = await Book.findOne({ isbn });
if (existingBook) {
  return res.status(409).json({ message: 'Book already exists', data: existingBook });
}

const response = await fetch(url);
const data = await response.json();

const bookKey = \`ISBN:\${isbn}\`;
const bookData = data[bookKey];

if (!bookData) {
  return res.status(404).json({ error: 'Book not found from OpenLibrary' });
}`,
    },
  },
]

export const seriousWork = caseStudies.filter((study) => study.track === 'serious')
export const funWork = caseStudies.filter((study) => study.track === 'fun')
export const findCaseStudy = (slug: string | undefined) => caseStudies.find((c) => c.slug === slug)
