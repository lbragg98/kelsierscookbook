import { useEffect, useMemo, useState } from 'react';
import { loadNotesDocument, saveNotesDocument } from '../../lib/storage/notes';

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not saved yet';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export default function NotesPage() {
  const [text, setText] = useState(() => loadNotesDocument().text);
  const [updatedAt, setUpdatedAt] = useState(() => loadNotesDocument().updatedAt);
  const [status, setStatus] = useState('Ready to jot notes.');

  const wordCount = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return 0;
    }

    return trimmed.split(/\s+/).length;
  }, [text]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const nextUpdatedAt = new Date().toISOString();
      saveNotesDocument({
        version: 1,
        updatedAt: nextUpdatedAt,
        text,
      });
      setUpdatedAt(nextUpdatedAt);
      setStatus('Saved to the cookbook.');
    }, 160);

    return () => window.clearTimeout(timer);
  }, [text]);

  function clearNotes() {
    const nextUpdatedAt = new Date().toISOString();
    setText('');
    saveNotesDocument({
      version: 1,
      updatedAt: nextUpdatedAt,
      text: '',
    });
    setUpdatedAt(nextUpdatedAt);
    setStatus('Notepad cleared.');
  }

  return (
    <section className="panel notes-page" aria-label="Campaign notes">
      <div className="notes-page__header">
        <div>
          <h3 className="panel__title">Notepad</h3>
          <p className="notes-page__subtitle">
            Freeform notes for initiative orders, recipe ideas, table reminders, or anything else you want
            to keep near the book.
          </p>
        </div>
        <button type="button" className="notes-page__secondary" onClick={clearNotes}>
          Clear page
        </button>
      </div>

      <div className="notes-page__meta" aria-label="Notepad status">
        <span>{wordCount} words</span>
        <span>{status}</span>
        <span>Updated {formatDate(updatedAt)}</span>
      </div>

      <label className="notes-page__field">
        <span className="notes-page__label">Notes</span>
        <textarea
          className="field__control field__control--textarea notes-page__textarea"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setStatus('Saving...');
          }}
          placeholder="Write quick session notes here..."
          rows={14}
        />
      </label>
    </section>
  );
}
