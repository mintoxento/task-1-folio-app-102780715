import { Tag, TAGS } from './types'

type Props = {
  search: string
  onSearch: (v: string) => void
  filterTag: Tag | null
  onFilterTag: (t: Tag | null) => void
  composerOpen: boolean
  onToggleComposer: () => void
}

export default function Toolbar({
  search,
  onSearch,
  filterTag,
  onFilterTag,
  composerOpen,
  onToggleComposer,
}: Props) {
  return (
    <div className="toolbar">
      <div className="search-wrap">
        <span className="search-icon">⌕</span>
        <input
          className="search-input"
          placeholder="Search notes…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
        {search && (
          <button className="search-clear" onClick={() => onSearch('')}>
            ✕
          </button>
        )}
      </div>

      <div className="tag-filters">
        <button
          className={`tag-pill ${filterTag === null ? 'active' : ''}`}
          onClick={() => onFilterTag(null)}
        >
          ALL
        </button>
        {TAGS.map((t) => (
          <button
            key={t}
            className={`tag-pill tag-pill--${t} ${filterTag === t ? 'active' : ''}`}
            onClick={() => onFilterTag(filterTag === t ? null : t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <button className="new-btn" onClick={onToggleComposer}>
        {composerOpen ? '✕ CLOSE' : '+ NEW NOTE'}
      </button>
    </div>
  )
}