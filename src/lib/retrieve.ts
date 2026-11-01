import { corpus, type CorpusDoc } from '../content/corpus.js'

const STOPWORDS = new Set(
  'a an and are as at be but by can did do does for from has have he her his how i in is it its me my of on or our she so tell that the their them they this to us was we were what when where which who why will with work you your aditya kundra about'.split(' '),
)

export const tokenize = (text: string) =>
  (text.toLowerCase().match(/[a-z0-9][a-z0-9.+#-]*/g) ?? [])
    .map((token) => token.replace(/[.-]+$/, ''))
    .filter((token) => token && !STOPWORDS.has(token))

const sentences = (text: string) => text.match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g)?.map((s) => s.trim()) ?? [text]

const tokenized = corpus.map((doc) => ({ doc, tokens: tokenize(`${doc.title} ${doc.title} ${doc.text}`) }))
const averageLength = tokenized.reduce((sum, entry) => sum + entry.tokens.length, 0) / tokenized.length

/** BM25 over the site's own content. Powers the no-API fallback, and needs no network. */
export const search = (question: string, limit = 3): { doc: CorpusDoc; score: number }[] => {
  const terms = [...new Set(tokenize(question))]
  if (!terms.length) return []
  const k1 = 1.4
  const b = 0.75
  return tokenized
    .map(({ doc, tokens }) => {
      const score = terms.reduce((total, term) => {
        const frequency = tokens.filter((token) => token === term).length
        if (!frequency) return total
        const containing = tokenized.filter((entry) => entry.tokens.includes(term)).length
        const idf = Math.log(1 + (tokenized.length - containing + 0.5) / (containing + 0.5))
        return total + (idf * frequency * (k1 + 1)) / (frequency + k1 * (1 - b + (b * tokens.length) / averageLength))
      }, 0)
      // Case studies are the main source for project questions, so posts rank just behind them.
      return { doc, score: doc.id.startsWith('post-') ? score * 0.75 : score }
    })
    .filter((match) => match.score > 0)
    .sort((a, b2) => b2.score - a.score)
    .slice(0, limit)
}

export interface LocalAnswer {
  text: string
  sources: { title: string; href: string }[]
}

export const answerLocally = (question: string): LocalAnswer | null => {
  const matches = search(question)
  if (!matches.length) return null
  const terms = tokenize(question)
  const lines = matches.slice(0, 2).map(({ doc }) => {
    const ranked = sentences(doc.text)
      .map((sentence, index) => {
        const words = tokenize(sentence)
        return { sentence, index, hits: terms.filter((term) => words.includes(term)).length }
      })
      .sort((a, b) => b.hits - a.hits || a.index - b.index)
    return `${doc.title}: ${ranked[0].sentence}`
  })
  return { text: lines.join('\n\n'), sources: matches.map(({ doc }) => ({ title: doc.title, href: doc.href })) }
}
