import { RECIPE_STORAGE_KEY, type Recipe, type RecipeCollection, type RecipeDraft } from '../types/recipes';
import { RECIPE_SEED_ITEMS, RECIPE_SEED_UPDATED_AT } from '../data/recipeSeeds';

const DEFAULT_COLLECTION: RecipeCollection = {
  version: 1,
  updatedAt: RECIPE_SEED_UPDATED_AT,
  items: RECIPE_SEED_ITEMS,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isRecipeIngredient(value: unknown): value is { name: string } {
  return isRecord(value) && typeof value.name === 'string';
}

function normalizeRecipeIngredients(value: unknown): { name: string }[] {
  if (isStringArray(value)) {
    return value.map((name) => ({ name: name.trim() })).filter((ingredient) => ingredient.name.length > 0);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'string') {
          return { name: item.trim() };
        }

        if (isRecipeIngredient(item)) {
          return { name: item.name.trim() };
        }

        return null;
      })
      .filter((ingredient): ingredient is { name: string } => Boolean(ingredient && ingredient.name.length > 0));
  }

  return [];
}

function isRecipe(value: unknown): value is Recipe {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    Array.isArray(value.ingredients) &&
    value.ingredients.every((ingredient) => typeof ingredient === 'string' || isRecipeIngredient(ingredient)) &&
    typeof value.prepTimeMinutes === 'number' &&
    Number.isFinite(value.prepTimeMinutes) &&
    typeof value.effect === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string'
  );
}

function isRecipeCollection(value: unknown): value is RecipeCollection {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.version === 1 &&
    typeof value.updatedAt === 'string' &&
    Array.isArray(value.items) &&
    value.items.every(isRecipe)
  );
}

function readStorage(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(RECIPE_STORAGE_KEY);
}

function writeStorage(value: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(RECIPE_STORAGE_KEY, value);
}

export function createRecipeDraft(): RecipeDraft {
  return {
    name: '',
    ingredients: [],
    prepTimeMinutes: 0,
    effect: '',
  };
}

export function createRecipe(draft: RecipeDraft, now: string = new Date().toISOString()): Recipe {
  const trimmedName = draft.name.trim();
  const trimmedEffect = draft.effect.trim();

  return {
    id: crypto.randomUUID(),
    name: trimmedName,
    ingredients: normalizeRecipeIngredients(draft.ingredients),
    prepTimeMinutes: Math.max(0, Math.floor(draft.prepTimeMinutes)),
    effect: trimmedEffect,
    createdAt: now,
    updatedAt: now,
  };
}

export function loadRecipeCollection(): RecipeCollection {
  const raw = readStorage();

  if (!raw) {
    return DEFAULT_COLLECTION;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (isRecipeCollection(parsed)) {
      return {
        ...parsed,
        items: parsed.items.map((recipe) => ({
          ...recipe,
          ingredients: normalizeRecipeIngredients(recipe.ingredients),
        })),
      };
    }
  } catch {
    // Fall through to the safe empty state.
  }

  return DEFAULT_COLLECTION;
}

export function saveRecipeCollection(collection: RecipeCollection): void {
  writeStorage(JSON.stringify(collection));
}

export function listRecipes(): Recipe[] {
  return loadRecipeCollection().items;
}

export function upsertRecipe(recipe: Recipe): RecipeCollection {
  const collection = loadRecipeCollection();
  const index = collection.items.findIndex((item) => item.id === recipe.id);
  const items =
    index === -1
      ? [...collection.items, recipe]
      : collection.items.map((item) => (item.id === recipe.id ? recipe : item));

  const nextCollection: RecipeCollection = {
    version: 1,
    updatedAt: new Date().toISOString(),
    items,
  };

  saveRecipeCollection(nextCollection);
  return nextCollection;
}

export function deleteRecipe(recipeId: string): RecipeCollection {
  const collection = loadRecipeCollection();
  const nextCollection: RecipeCollection = {
    version: 1,
    updatedAt: new Date().toISOString(),
    items: collection.items.filter((item) => item.id !== recipeId),
  };

  saveRecipeCollection(nextCollection);
  return nextCollection;
}

export function replaceAllRecipes(items: Recipe[]): RecipeCollection {
  const nextCollection: RecipeCollection = {
    version: 1,
    updatedAt: new Date().toISOString(),
    items: items.map((recipe) => ({
      ...recipe,
      ingredients: normalizeRecipeIngredients(recipe.ingredients),
    })),
  };

  saveRecipeCollection(nextCollection);
  return nextCollection;
}
