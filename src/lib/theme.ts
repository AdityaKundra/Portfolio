import { useSyncExternalStore } from 'react'

const THEME_KEY = 'portfolio-theme'
const TEXT_KEY = 'portfolio-text-size'

export type TextSize = 'small' | 'medium' | 'large'

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((listener) => listener())
const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const persist = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Private browsing can block storage. The setting still applies to this page view.
  }
}

export const useIsDark = () =>
  useSyncExternalStore(subscribe, () => document.documentElement.classList.contains('dark'), () => false)

export const setDark = (dark: boolean) => {
  document.documentElement.classList.toggle('dark', dark)
  persist(THEME_KEY, dark ? 'dark' : 'light')
  emit()
}

export const useTextSize = () =>
  useSyncExternalStore(
    subscribe,
    () => (document.documentElement.dataset.textSize as TextSize | undefined) ?? 'medium',
    () => 'medium' as TextSize,
  )

export const setTextSize = (size: TextSize) => {
  document.documentElement.dataset.textSize = size
  persist(TEXT_KEY, size)
  emit()
}
