import { NOTES_STORAGE_KEY, type NotesDocument } from '../types/notes';

const DEFAULT_DOCUMENT: NotesDocument = {
  version: 1,
  updatedAt: new Date(0).toISOString(),
  text: '',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNotesDocument(value: unknown): value is NotesDocument {
  return (
    isRecord(value) &&
    value.version === 1 &&
    typeof value.updatedAt === 'string' &&
    typeof value.text === 'string'
  );
}

function readStorage(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(NOTES_STORAGE_KEY);
}

function writeStorage(value: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(NOTES_STORAGE_KEY, value);
}

export function loadNotesDocument(): NotesDocument {
  const raw = readStorage();

  if (!raw) {
    return DEFAULT_DOCUMENT;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (isNotesDocument(parsed)) {
      return parsed;
    }
  } catch {
    // Fall through to the safe empty state.
  }

  return DEFAULT_DOCUMENT;
}

export function saveNotesDocument(document: NotesDocument): void {
  writeStorage(JSON.stringify(document));
}
