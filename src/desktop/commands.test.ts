import { describe, expect, it } from 'vitest'
import { completeCommand, runCommand } from './commands'

describe('terminal commands', () => {
  it('opens a case study by number and by name', () => {
    expect(runCommand('open 3')).toMatchObject({ kind: 'open', id: 'project:voice-assistant-lab' })
    expect(runCommand('OPEN redefine')).toMatchObject({ kind: 'open', id: 'project:redefine' })
  })

  it('explains what to do on bad input', () => {
    expect(runCommand('open 99')).toMatchObject({ kind: 'text', text: expect.stringContaining('No project') })
    expect(runCommand('open')).toMatchObject({ kind: 'text', text: expect.stringContaining('Usage') })
    expect(runCommand('rm -rf /')).toMatchObject({ kind: 'text', text: expect.stringContaining('command not found') })
  })

  it('every command listed in help runs', () => {
    const result = runCommand('help')
    if (result.kind !== 'text') throw new Error('help should return text')
    for (const line of result.text.split('\n')) {
      const output = runCommand(line.split(/\s+/)[0])
      expect(JSON.stringify(output)).not.toContain('command not found')
    }
  })

  it('completes only unambiguous prefixes', () => {
    expect(completeCommand('ski')).toBe('skills')
    expect(completeCommand('e')).toBeNull()
  })
})
