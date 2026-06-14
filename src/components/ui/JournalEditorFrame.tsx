import type { ReactNode } from 'react';

export default function JournalEditorFrame({
  title,
  subtitle,
  actionLabel,
  onAction,
  beforeForm,
  children,
}: {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
  beforeForm?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="panel journal-editor" aria-label={title}>
      <div className="journal-editor__header">
        <div>
          <h3 className="panel__title">{title}</h3>
          <p className="journal-editor__subtitle">{subtitle}</p>
        </div>
        {actionLabel && onAction ? (
          <button type="button" className="journal-editor__secondary" onClick={onAction}>
            {actionLabel}
          </button>
        ) : null}
      </div>

      {beforeForm}

      {children}
    </section>
  );
}
