import {
  INGREDIENT_STORAGE_KEY,
  type Ingredient,
  type IngredientCollection,
  type IngredientDraft,
} from '../types/ingredients';
import { INGREDIENT_SEED_ITEMS, INGREDIENT_SEED_UPDATED_AT } from '../data/ingredientSeeds';

const DEFAULT_COLLECTION: IngredientCollection = {
  version: 1,
  updatedAt: INGREDIENT_SEED_UPDATED_AT,
  items: INGREDIENT_SEED_ITEMS,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isIngredient(value: unknown): value is Ingredient {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.flavorProfile === 'string' &&
    typeof value.typicalCost === 'string' &&
    typeof value.effect === 'string' &&
    typeof value.harvestNotes === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string'
  );
}

function isIngredientCollection(value: unknown): value is IngredientCollection {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.version === 1 &&
    typeof value.updatedAt === 'string' &&
    Array.isArray(value.items) &&
    value.items.every(isIngredient)
  );
}

function readStorage(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(INGREDIENT_STORAGE_KEY);
}

function writeStorage(value: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(INGREDIENT_STORAGE_KEY, value);
}

export function createIngredientDraft(): IngredientDraft {
  return {
    name: '',
    flavorProfile: '',
    typicalCost: '',
    effect: '',
    harvestNotes: '',
  };
}

export function createIngredient(
  draft: IngredientDraft,
  now: string = new Date().toISOString(),
): Ingredient {
  return {
    id: crypto.randomUUID(),
    name: draft.name.trim(),
    flavorProfile: draft.flavorProfile.trim(),
    typicalCost: draft.typicalCost.trim(),
    effect: draft.effect.trim(),
    harvestNotes: draft.harvestNotes.trim(),
    createdAt: now,
    updatedAt: now,
  };
}

export function loadIngredientCollection(): IngredientCollection {
  const raw = readStorage();

  if (!raw) {
    return DEFAULT_COLLECTION;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (isIngredientCollection(parsed)) {
      return parsed;
    }
  } catch {
    // Fall through to the safe empty state.
  }

  return DEFAULT_COLLECTION;
}

export function saveIngredientCollection(collection: IngredientCollection): void {
  writeStorage(JSON.stringify(collection));
}

export function listIngredients(): Ingredient[] {
  return loadIngredientCollection().items;
}

export function upsertIngredient(ingredient: Ingredient): IngredientCollection {
  const collection = loadIngredientCollection();
  const index = collection.items.findIndex((item) => item.id === ingredient.id);
  const items =
    index === -1
      ? [...collection.items, ingredient]
      : collection.items.map((item) => (item.id === ingredient.id ? ingredient : item));

  const nextCollection: IngredientCollection = {
    version: 1,
    updatedAt: new Date().toISOString(),
    items,
  };

  saveIngredientCollection(nextCollection);
  return nextCollection;
}

export function deleteIngredient(ingredientId: string): IngredientCollection {
  const collection = loadIngredientCollection();
  const nextCollection: IngredientCollection = {
    version: 1,
    updatedAt: new Date().toISOString(),
    items: collection.items.filter((item) => item.id !== ingredientId),
  };

  saveIngredientCollection(nextCollection);
  return nextCollection;
}

export function replaceAllIngredients(items: Ingredient[]): IngredientCollection {
  const nextCollection: IngredientCollection = {
    version: 1,
    updatedAt: new Date().toISOString(),
    items,
  };

  saveIngredientCollection(nextCollection);
  return nextCollection;
}
