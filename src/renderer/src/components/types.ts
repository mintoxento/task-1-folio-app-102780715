export type Tag = 'idea' | 'task' | 'memory' | 'urgent' | 'misc'

export type Note = {
  id: string
  title: string
  body: string
  tag: Tag
  createdAt: Date
  updatedAt: Date
  color: string
  pinned: boolean
}

export type NotesAction =
  | { type: 'ADD'; note: Note }
  | { type: 'DELETE'; id: string }
  | { type: 'UPDATE'; id: string; title: string; body: string }
  | { type: 'PIN'; id: string }
  | { type: 'UNPIN'; id: string }

export const TAGS: Tag[] = ['idea', 'task', 'memory', 'urgent', 'misc']

export const TAG_COLORS: Record<Tag, string> = {
  idea:   '#f0eafa',
  task:   '#e8f0fb',
  memory: '#e8f8f0',
  urgent: '#faeaea',
  misc:   '#f5f0e8',
}

export const TAG_INK: Record<Tag, string> = {
  idea:   '#6b4f9e',
  task:   '#1d4ed8',
  memory: '#047857',
  urgent: '#c0392b',
  misc:   '#78716c',
}