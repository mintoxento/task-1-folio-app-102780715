import { Note } from './types'
import NoteCard from './NoteCard'

type Props = {
  notes: Note[]
  activeId: string | null
  onActivate: (id: string) => void
  onDelete: (id: string) => void
  onPin: (id: string) => void
  onUnpin: (id: string) => void
  onEdit: (id: string, title: string, body: string) => void
}

export default function NotesGrid({
  notes,
  activeId,
  onActivate,
  onDelete,
  onPin,
  onUnpin,
  onEdit,
}: Props) {
  if (notes.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-deco">∅</div>
        <p>No notes found.</p>
        <p className="empty-sub">Try a different search or tag filter.</p>
      </div>
    )
  }

  return (
    <div className="notes-grid">
      {notes.map((note, i) => (
        <NoteCard
          key={note.id}
          note={note}
          index={i}
          isActive={activeId === note.id}
          onActivate={() => onActivate(note.id)}
          onDelete={() => onDelete(note.id)}
          onPin={() => onPin(note.id)}
          onUnpin={() => onUnpin(note.id)}
          onEdit={(title, body) => onEdit(note.id, title, body)}
        />
      ))}
    </div>
  )
}