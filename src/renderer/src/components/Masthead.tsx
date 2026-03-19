import { format } from 'date-fns'
import { Note } from './types'

type Props = {
  notes: Note[]
}

export default function Masthead({ notes }: Props) {
  const wordCount = notes.reduce(
    (acc, n) => acc + n.body.split(/\s+/).filter(Boolean).length,
    0
  )
  const today = new Date()

  return (
    <header className="masthead">
      <div className="masthead-left">
        <div className="issue-label">PERSONAL JOURNAL</div>
        <h1 className="logo-text">FOLIO</h1>
      </div>

      <div className="masthead-center">
        <div className="stat">
          {notes.length}
          <span>NOTES</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          {wordCount}
          <span>WORDS</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          {notes.filter((n) => n.pinned).length}
          <span>PINNED</span>
        </div>
      </div>

      <div className="masthead-right">
        <div className="date-block">
          <span className="day">{format(today, 'd')}</span>
          <span className="month-year">{format(today, 'MMM yyyy').toUpperCase()}</span>
          <span className="weekday">{format(today, 'EEEE').toUpperCase()}</span>
        </div>
      </div>
    </header>
  )
}