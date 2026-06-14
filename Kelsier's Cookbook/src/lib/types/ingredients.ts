export type IngredientId = string;

export type Ingredient = {
  id: IngredientId;
  name: string;
  flavorProfile: string;
  typicalCost: string;
  effect: string;
  harvestNotes: string;
  createdAt: string;
  updatedAt: string;
};

export type IngredientDraft = {
  name: string;
  flavorProfile: string;
  typicalCost: string;
  effect: string;
  harvestNotes: string;
};

export type IngredientCollection = {
  version: 1;
  updatedAt: string;
  items: Ingredient[];
};

export const INGREDIENT_STORAGE_KEY = 'kelsiers-cookbook:ingredients:v1';
