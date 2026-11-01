export const ATS_FACTORS = [
  { id: 'keyword', label: 'Keyword match', weight: 0.4 },
  { id: 'semantic', label: 'Semantic similarity', weight: 0.25 },
  { id: 'skills', label: 'Skills coverage', weight: 0.2 },
  { id: 'sections', label: 'Section completeness', weight: 0.1 },
  { id: 'formatting', label: 'Formatting', weight: 0.05 },
] as const

export type AtsFactor = (typeof ATS_FACTORS)[number]['id']
export type AtsInputs = Record<AtsFactor, number>

/** Mirrors the weighted sum in Resume Studio's lib/ats-score.ts. */
export const atsScore = (inputs: AtsInputs) => Math.round(ATS_FACTORS.reduce((sum, factor) => sum + factor.weight * inputs[factor.id], 0))
