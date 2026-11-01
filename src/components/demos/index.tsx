import type { DemoId } from '../../content/work'
import { AtsDemo } from './AtsDemo'
import { FetchTimeDemo } from './FetchTimeDemo'
import { IsbnDemo } from './IsbnDemo'
import { RateLimitDemo } from './RateLimitDemo'
import { VoiceDemo } from './VoiceDemo'

const DEMOS: Record<DemoId, () => React.ReactNode> = {
  voice: VoiceDemo,
  ats: AtsDemo,
  'rate-limit': RateLimitDemo,
  isbn: IsbnDemo,
  'fetch-time': FetchTimeDemo,
}

export const Demo = ({ id }: { id: DemoId }) => {
  const Component = DEMOS[id]
  return <Component />
}
