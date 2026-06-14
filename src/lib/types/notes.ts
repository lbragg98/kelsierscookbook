export type NotesDocument = {
  version: 1;
  updatedAt: string;
  text: string;
};

export const NOTES_STORAGE_KEY = 'kelsiers-cookbook:notes:v1';
