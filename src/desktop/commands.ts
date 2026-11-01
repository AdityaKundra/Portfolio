import { education, experience, profile, skills } from '../content/profile'
import { caseStudies, funWork, seriousWork } from '../content/work'
import type { AppId } from './windows'

export type CommandResult =
  | { kind: 'text'; text: string }
  | { kind: 'clear' }
  | { kind: 'open'; id: AppId; text: string }
  | { kind: 'exit' }
  | { kind: 'desktop' }
  | { kind: 'hire' }
  | { kind: 'play' }
  | { kind: 'shelf' }

const HELP = `about       Who I am
work        Serious work and fun stuff
open <n>    Open a project by number or name
experience  Work history
skills      Skills by area
education   Degrees
contact     How to reach me
ask         Ask a question about my work
play        Games about me
dsa         My algorithm practice
shelf       My writing and recommendations
hire        Hire me (sudo also works)
desktop     Open desktop mode
clear       Clear the screen
exit        Leave desktop mode`

export const COMMAND_NAMES = ['about', 'ask', 'clear', 'contact', 'desktop', 'dsa', 'education', 'exit', 'experience', 'help', 'hire', 'open', 'play', 'shelf', 'skills', 'work']

const findStudy = (query: string) => {
  const number = Number(query)
  if (Number.isInteger(number) && number >= 1) return caseStudies[number - 1]
  const needle = query.toLowerCase()
  return caseStudies.find((study) => study.slug.includes(needle) || study.title.toLowerCase().includes(needle))
}

export const runCommand = (raw: string): CommandResult => {
  const [command = '', ...args] = raw.trim().split(/\s+/)
  switch (command.toLowerCase()) {
    case '':
      return { kind: 'text', text: '' }
    case 'help':
      return { kind: 'text', text: HELP }
    case 'about':
    case 'whoami':
      return { kind: 'text', text: `${profile.name}, ${profile.role} at ${profile.employer}, ${profile.location}.\n${profile.headline}` }
    case 'work':
      return {
        kind: 'text',
        text: [
          'Serious work:',
          ...seriousWork.map((study) => `  ${caseStudies.indexOf(study) + 1}. ${study.title}`),
          '',
          'Fun stuff:',
          ...funWork.map((study) => `  ${caseStudies.indexOf(study) + 1}. ${study.title}`),
          '',
          'Try: open 3',
        ].join('\n'),
      }
    case 'open': {
      if (!args.length) return { kind: 'text', text: 'Usage: open <number or name>. Run "work" to see the list.' }
      const study = findStudy(args.join(' '))
      return study
        ? { kind: 'open', id: `project:${study.slug}`, text: `Opening ${study.title}` }
        : { kind: 'text', text: `No project matches "${args.join(' ')}". Run "work" to see the list.` }
    }
    case 'experience':
      return { kind: 'text', text: experience.map((job) => `${job.period}  ${job.title}, ${job.company}`).join('\n') }
    case 'skills':
      return { kind: 'text', text: skills.map((group) => `${group.label}: ${group.items.join(', ')}`).join('\n') }
    case 'education':
      return { kind: 'text', text: education.map((item) => `${item.period}  ${item.degree}, ${item.school}`).join('\n') }
    case 'contact':
      return {
        kind: 'text',
        text: `Email     ${profile.email}\nGitHub    ${profile.links.github}\nLinkedIn  ${profile.links.linkedin}\nResume    ${profile.resumeUrl}`,
      }
    case 'ask':
      return { kind: 'open', id: 'ask', text: 'Opening Ask' }
    case 'desktop':
      return { kind: 'desktop' }
    case 'clear':
      return { kind: 'clear' }
    case 'exit':
      return { kind: 'exit' }
    case 'sudo':
      if (/^hire\b/i.test(args.join(' '))) return { kind: 'hire' }
      return { kind: 'text', text: 'Permission denied. Try "sudo hire aditya" instead.' }
    case 'hire':
      return { kind: 'hire' }
    case 'play':
      return { kind: 'play' }
    case 'shelf':
      return { kind: 'shelf' }
    case 'dsa':
      return {
        kind: 'text',
        text: 'Sorting    quickSort.cpp  mergeSort.cpp  heapSort.cpp\nGraphs     dijkstra.cpp  warshall.cpp  bsf.js\nHard ones  nQueen.cpp  travelingSalespersonproblem.cpp\nStructures binaryTree.js  linkeList.js  queue.js\n\nCode: https://github.com/AdityaKundra/DSA-Pratice\nRun "play" and pick Sort Race to bet on the sorts.',
      }
    default:
      return { kind: 'text', text: `${command}: command not found. Run "help" to see what works.` }
  }
}

export const completeCommand = (partial: string) => {
  const matches = COMMAND_NAMES.filter((name) => name.startsWith(partial.toLowerCase()))
  return matches.length === 1 ? matches[0] : null
}
