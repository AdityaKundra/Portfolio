const TOKEN = /(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(const|let|new|for|if|return|await|export|async|function)\b|\b(\d[\d_]*)\b/g

export const highlight = (code: string) => {
  const parts: React.ReactNode[] = []
  let last = 0
  for (const match of code.matchAll(TOKEN)) {
    if (match.index > last) parts.push(code.slice(last, match.index))
    const color = match[1] ? 'text-[#7f8c98]' : match[2] ? 'text-[#a5d6a7]' : match[3] ? 'text-[#8fabff]' : 'text-[#f0b37e]'
    parts.push(<span key={match.index} className={color}>{match[0]}</span>)
    last = match.index + match[0].length
  }
  parts.push(code.slice(last))
  return parts
}
