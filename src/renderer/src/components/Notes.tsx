import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Note, Tag } from './types'
import { useNotes } from './useNotes'
import Masthead from './Masthead'
import Toolbar from './Toolbar'
import Composer from './Composer'
import NotesGrid from './NotesGrid'
import './Notes.css'

export default function Notes() {
  const { notes, dispatch } = useNotes()
  const [search, setSearch]           = useState('')
  const [filterTag, setFilterTag]     = useState<Tag | null>(null)
  const [composerOpen, setComposerOpen] = useState(false)
  const [activeId, setActiveId]       = useState<string | null>(null)

  /* ── Derived filtered list ── */
  const filtered = notes.filter((n) => {
    const matchTag    = filterTag ? n.tag === filterTag : true
    const q           = search.toLowerCase()
    const matchSearch = n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
    return matchTag && matchSearch
  })

  /* ── Handlers ── */
  function handlePublish(partial: Omit<Note, 'id'>) {
    const note: Note = { ...partial, id: Date.now().toString() }
    dispatch({ type: 'ADD', note })
    setComposerOpen(false)
    toast.success('Note published', { icon: '📝' })
  }

  function handleDelete(id: string) {
    dispatch({ type: 'DELETE', id })
    if (activeId === id) setActiveId(null)
    toast('Note deleted', { icon: '🗑️' })
  }

  function handlePin(id: string) {
    dispatch({ type: 'PIN', id })
    toast('Pinned to top', { icon: '📌' })
  }

  function handleUnpin(id: string) {
    dispatch({ type: 'UNPIN', id })
    toast('Unpinned', { icon: '↓' })
  }

  function handleEdit(id: string, title: string, body: string) {
    dispatch({ type: 'UPDATE', id, title, body })
  }

  function handleActivate(id: string) {
    setActiveId(activeId === id ? null : id)
  }

  return (
    <div className="folio">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.72rem',
            letterSpacing: '0.08em',
            background: '#1a1410',
            color: '#faf8f4',
            borderRadius: '0',
            border: '1px solid #4a3f35',
          },
        }}
      />

      <Masthead notes={notes} />

      <div className="rule-triple">
        <span /><span /><span />
      </div>

      <Toolbar
        search={search}
        onSearch={setSearch}
        filterTag={filterTag}
        onFilterTag={setFilterTag}
        composerOpen={composerOpen}
        onToggleComposer={() => setComposerOpen((v) => !v)}
      />

      {composerOpen && <Composer onPublish={handlePublish} />}

      <NotesGrid
        notes={filtered}
        activeId={activeId}
        onActivate={handleActivate}
        onDelete={handleDelete}
        onPin={handlePin}
        onUnpin={handleUnpin}
        onEdit={handleEdit}
      />

      <footer className="folio-footer">
        <span>FOLIO</span>
        <span>·</span>
        <span>YOUR PRIVATE PRESS</span>
        <span>·</span>
        <span>{notes.length} ENTRIES</span>
      </footer>
    </div>
  )
}