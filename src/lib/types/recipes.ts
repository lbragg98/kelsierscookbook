export type RecipeId = string;

export type RecipeIngredient = {
  name: string;
};

export type Recipe = {
  id: RecipeId;
  name: string;
  ingredients: RecipeIngredient[];
  prepTimeMinutes: number;
  effect: string;
  createdAt: string;
  updatedAt: string;
};

export type RecipeDraft = {
  name: string;
  ingredients: string[];
  prepTimeMinutes: number;
  effect: string;
};

export type RecipeCollection = {
  version: 1;
  updatedAt: string;
  items: Recipe[];
};

export const RECIPE_STORAGE_KEY = 'kelsiers-cookbook:recipes:v1';
