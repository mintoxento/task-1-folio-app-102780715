import { useReducer } from 'react'
import { Note, NotesAction, TAG_COLORS } from './types'

function notesReducer(state: Note[], action: NotesAction): Note[] {
  switch (action.type) {
    case 'ADD':
      return [action.note, ...state]

    case 'DELETE':
      return state.filter((n) => n.id !== action.id)

    case 'UPDATE':
      return state.map((n) =>
        n.id === action.id
          ? { ...n, title: action.title, body: action.body, updatedAt: new Date() }
          : n
      )

    case 'PIN':
      return state
        .map((n) => (n.id === action.id ? { ...n, pinned: true } : n))
        .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))

    case 'UNPIN':
      return state.map((n) => (n.id === action.id ? { ...n, pinned: false } : n))

    default:
      return state
  }
}

const SEED_NOTES: Note[] = [
  {
    id: '1',
    title: 'Welcome to Folio',
    body: 'Your thoughts, captured beautifully. Click any note to edit it inline. Use the composer to draft new ones.',
    tag: 'misc',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    color: TAG_COLORS['misc'],
    pinned: true,
  },
  {
    id: '2',
    title: 'Refactor the auth module',
    body: 'Break out the JWT logic into its own service. Add refresh token rotation and make sure errors surface properly to the UI layer.',
    tag: 'task',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
    color: TAG_COLORS['task'],
    pinned: false,
  },
  {
    id: '3',
    title: 'Build with constraints',
    body: 'The best ideas come when you restrict the palette. One font. Three colours. No gradients. See what emerges.',
    tag: 'idea',
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5),
    color: TAG_COLORS['idea'],
    pinned: false,
  },
]

export function useNotes() {
  const [notes, dispatch] = useReducer(notesReducer, SEED_NOTES)
  return { notes, dispatch }
}