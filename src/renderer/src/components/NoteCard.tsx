import { useState, useEffect } from 'react'
import { formatDistanceToNow, format } from 'date-fns'
import { Note, TAG_INK } from './types'

type Props = {
  note: Note
  isActive: boolean
  index: number
  onActivate: () => void
  onDelete: () => void
  onPin: () => void
  onUnpin: () => void
  onEdit: (title: string, body: string) => void
}

export default function NoteCard({
  note,
  isActive,
  index,
  onActivate,
  onDelete,
  onPin,
  onUnpin,
  onEdit,
}: Props) {
  const [editTitle, setEditTitle] = useState(note.title)
  const [editBody, setEditBody]   = useState(note.body)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    setEditTitle(note.title)
    setEditBody(note.body)
  }, [note.title, note.body])

  function saveEdit() {
    if (editTitle !== note.title || editBody !== note.body) {
      onEdit(editTitle || 'Untitled', editBody)
    }
  }

  const relativeTime = formatDistanceToNow(note.updatedAt, { addSuffix: true })
  const absoluteTime = format(note.updatedAt, 'MMM d, yyyy · h:mm a')
  const wasEdited = note.updatedAt.getTime() !== note.createdAt.getTime()

  return (
    <article
      className={`note-card ${isActive ? 'expanded' : ''} ${note.pinned ? 'pinned' : ''}`}
      style={{
        backgroundColor: note.color,
        animationDelay: `${index * 55}ms`,
      }}
    >
      {/* Card Header */}
      <div className="note-header" onClick={!isActive ? onActivate : undefined}>
        <div className="note-header-left">
          {note.pinned && <span className="pin-badge">📌</span>}
          <span
            className={`note-tag`}
            style={{ color: TAG_INK[note.tag], borderColor: TAG_INK[note.tag] + '55' }}
          >
            {note.tag.toUpperCase()}
          </span>
        </div>
        <div className="note-actions">
          <button
            className="note-action-btn"
            title={note.pinned ? 'Unpin' : 'Pin to top'}
            onClick={(e) => { e.stopPropagation(); note.pinned ? onUnpin() : onPin() }}
          >
            {note.pinned ? '⬇' : '⬆'}
          </button>
          <button
            className="note-action-btn danger"
            title="Delete note"
            onClick={(e) => { e.stopPropagation(); onDelete() }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Card Body */}
      {isActive ? (
        <div className="note-edit" onClick={(e) => e.stopPropagation()}>
          <input
            className="note-edit-title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={saveEdit}
            placeholder="Title"
            autoFocus
          />
          <textarea
            className="note-edit-body"
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            onBlur={saveEdit}
            rows={6}
            placeholder="Write something…"
          />
          <button className="collapse-btn" onClick={onActivate}>
            ↑ COLLAPSE
          </button>
        </div>
      ) : (
        <div className="note-content" onClick={onActivate}>
          <h3 className="note-title">{note.title}</h3>
          <p className="note-body">{note.body || <em>Empty note</em>}</p>
        </div>
      )}

      {/* Card Footer */}
      <div
        className="note-foot"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span className="note-timestamp">
          {wasEdited ? 'edited ' : ''}{relativeTime}
        </span>
        {showTooltip && (
          <span className="timestamp-tooltip">{absoluteTime}</span>
        )}
      </div>
    </article>
  )
}