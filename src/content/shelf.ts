export type PickType = 'reading' | 'video' | 'song'

export interface Pick {
  type: PickType
  title: string
  by: string
  url: string
  /** Your own take. This is what makes the shelf yours, so it is required. */
  why: string
  added: string
}

/**
 * To recommend something, add an entry at the top. A YouTube video or a Spotify
 * track, album or playlist URL gets a click-to-play player automatically.
 */
export const picks: Pick[] = [
  {
    type: 'song',
    title: 'Kaam Bhaari',
    by: 'Kaam Bhaari, from the Gully Boy soundtrack',
    url: 'https://open.spotify.com/search/Kaam%20Bhaari%20Gully%20Boy',
    why: 'I liked this one enough to save the lyrics in my notes.',
    added: '2026-11-02',
  },
  {
    type: 'reading',
    title: 'Designing Data-Intensive Applications',
    by: 'Martin Kleppmann',
    url: 'https://dataintensive.net/',
    why: 'On my list for learning how to scale a system from 1,000 users to 10 million.',
    added: '2026-11-02',
  },
  {
    type: 'reading',
    title: 'Site Reliability Engineering',
    by: 'Google',
    url: 'https://sre.google/sre-book/table-of-contents/',
    why: 'On my list for distributed systems and cloud architecture.',
    added: '2026-11-02',
  },
  {
    type: 'reading',
    title: 'The System Design Primer',
    by: 'Donne Martin',
    url: 'https://github.com/donnemartin/system-design-primer',
    why: 'A free resource on my list for learning to explain scalable systems with confidence.',
    added: '2026-11-02',
  },
  {
    type: 'reading',
    title: 'Full Stack Open',
    by: 'University of Helsinki',
    url: 'https://fullstackopen.com/en/',
    why: 'On my list for React and Node.js.',
    added: '2026-11-02',
  },
  {
    type: 'reading',
    title: 'VisuAlgo',
    by: 'Steven Halim and team',
    url: 'https://visualgo.net/en',
    why: 'Visualizations of sorting algorithms, graph traversals and more.',
    added: '2026-11-02',
  },
  {
    type: 'reading',
    title: 'CP-Algorithms',
    by: 'CP-Algorithms contributors',
    url: 'https://cp-algorithms.com/',
    why: 'For deeper dives into complex algorithm implementations.',
    added: '2026-11-02',
  },
  {
    type: 'video',
    title: 'Abdul Bari',
    by: 'YouTube channel',
    url: 'https://www.youtube.com/@abdul_bari',
    why: 'Excellent explanations of sorting, dynamic programming and graph algorithms.',
    added: '2026-11-02',
  },
  {
    type: 'video',
    title: 'mycodeschool',
    by: 'YouTube channel',
    url: 'https://www.youtube.com/@mycodeschool',
    why: 'Great for BFS, DFS and basic data structures.',
    added: '2026-11-02',
  },
  {
    type: 'video',
    title: 'Tushar Roy: Coding Made Simple',
    by: 'YouTube channel',
    url: 'https://www.youtube.com/@tusharroy2525',
    why: 'Focuses on advanced algorithms and problem-solving techniques.',
    added: '2026-11-02',
  },
]
