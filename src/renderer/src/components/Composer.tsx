import { useState, useRef, useEffect } from 'react'
import { Tag, TAGS, TAG_COLORS, Note } from './types'

type Props = {
  onPublish: (note: Omit<Note, 'id'>) => void
}

export default function Composer({ onPublish }: Props) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tag, setTag] = useState<Tag>('idea')
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  function handlePublish() {
    if (!title.trim() && !body.trim()) return
    onPublish({
      title: title.trim() || 'Untitled',
      body,
      tag,
      createdAt: new Date(),
      updatedAt: new Date(),
      color: TAG_COLORS[tag],
      pinned: false,
    })
    setTitle('')
    setBody('')
    setTag('idea')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handlePublish()
    }
  }

  const charCount = body.length

  return (
    <div className="composer" onKeyDown={handleKeyDown}>
      <div className="composer-inner">
        <input
          ref={titleRef}
          className="composer-title"
          placeholder="HEADLINE"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
        />
        <textarea
          className="composer-body"
          placeholder="Begin writing… (⌘↵ to publish)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
        />
        <div className="composer-footer">
          <div className="tag-select-row">
            {TAGS.map((t) => (
              <button
                key={t}
                className={`tag-choose tag-choose--${t} ${tag === t ? 'chosen' : ''}`}
                onClick={() => setTag(t)}
                type="button"
              >
                {t}
              </button>
            ))}
          </div>
          <div className="composer-actions">
            <span className="char-count">{charCount} chars</span>
            <button
              className="publish-btn"
              onClick={handlePublish}
              disabled={!title.trim() && !body.trim()}
              type="button"
            >
              PUBLISH →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}