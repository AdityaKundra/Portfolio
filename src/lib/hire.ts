import { useSyncExternalStore } from 'react'
import { profile } from '../content/profile'

let state: { open: boolean; note: string } = { open: false, note: '' }
const listeners = new Set<() => void>()
const set = (next: typeof state) => {
  state = next
  listeners.forEach((listener) => listener())
}

export const openHire = (note = '') => set({ open: true, note })
export const closeHire = () => set({ open: false, note: state.note })

const SERVER_STATE = { open: false, note: '' }
export const useHire = () =>
  useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => state,
    () => SERVER_STATE,
  )

export const hireMailto = ({ name, company, role, note }: { name: string; company: string; role: string; note: string }) => {
  const subject = role ? `${role}${company ? ` at ${company}` : ''}` : `Opportunity${company ? ` at ${company}` : ''}`
  const body = [`Hi Aditya,`, '', `I found your portfolio and would like to talk${role ? ` about a ${role} role` : ''}${company ? ` at ${company}` : ''}.`, note ? `\n${note}` : '', '', 'Thanks,', name].join('\n')
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.slice(0, 1200))}`
}
