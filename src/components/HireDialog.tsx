import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react'
import { profile } from '../content/profile'
import { closeHire, hireMailto, openHire, useHire } from '../lib/hire'
import { ExternalLink } from './SiteChrome'

const field = 'mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-[0.95rem] placeholder:text-muted focus-visible:border-accent'

export const HireButton = ({ className = '', label = 'Hire me' }: { className?: string; label?: string }) => (
  // A real mailto link, so it still works before JavaScript loads.
  <a
    href={`mailto:${profile.email}?subject=${encodeURIComponent('Opportunity')}`}
    onClick={(event: MouseEvent) => {
      event.preventDefault()
      openHire()
    }}
    className={`inline-block rounded-md bg-accent font-medium whitespace-nowrap text-accent-ink transition-opacity hover:opacity-90 ${className}`}
  >
    {label}
  </a>
)

export const HireDialog = () => {
  const { open, note } = useHire()
  const dialog = useRef<HTMLDialogElement>(null)
  const [form, setForm] = useState({ name: '', company: '', role: '' })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (open && !element.open) element.showModal()
    if (!open && element.open) element.close()
  }, [open])

  const update = (key: keyof typeof form) => (event: { target: { value: string } }) => setForm((current) => ({ ...current, [key]: event.target.value }))

  const submit = (event: FormEvent) => {
    event.preventDefault()
    window.location.href = hireMailto({ ...form, note })
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby="hire-title"
      onClose={closeHire}
      onClick={(event) => {
        if (event.target === dialog.current) closeHire()
      }}
      className="window-in m-auto w-[calc(100%-2rem)] max-w-lg border border-ink/70 bg-panel p-0 text-ink shadow-[8px_8px_0_rgb(0_0_0/0.18)] backdrop:bg-ink/40"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Let’s talk</p>
            <h2 id="hire-title" className="mt-1 text-2xl font-semibold tracking-tight">Hire Aditya</h2>
          </div>
          <button type="button" onClick={closeHire} aria-label="Close" className="grid size-8 place-items-center rounded font-mono text-lg text-muted hover:bg-accent-soft hover:text-ink">×</button>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">Fill this in and your email app opens with a draft. This site does not send or store anything.</p>
        <form onSubmit={submit} className="mt-5 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-medium">Your name
              <input value={form.name} onChange={update('name')} autoComplete="name" className={field} />
            </label>
            <label className="block text-sm font-medium">Company
              <input value={form.company} onChange={update('company')} autoComplete="organization" className={field} />
            </label>
          </div>
          <label className="block text-sm font-medium">Role
            <input value={form.role} onChange={update('role')} placeholder="Full-stack engineer" className={field} />
          </label>
          {note && <p className="border-l-2 border-accent pl-3 text-sm text-muted">Your Hire Check results will be included in the draft.</p>}
          <button type="submit" className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink hover:opacity-90">Open email draft</button>
        </form>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4 text-sm">
          <button type="button" onClick={() => void copy()} className="link" aria-live="polite">{copied ? 'Copied' : `Copy ${profile.email}`}</button>
          <ExternalLink href={profile.resumeUrl}>Resume</ExternalLink>
          <ExternalLink href={profile.links.linkedin}>LinkedIn</ExternalLink>
        </div>
      </div>
    </dialog>
  )
}
