import { useEffect, useMemo, useState, type FormEvent } from 'react';
import JournalEditorFrame from '../../components/ui/JournalEditorFrame';
import SelectionList from '../../components/ui/SelectionList';
import { createRecipe, deleteRecipe, listRecipes, upsertRecipe, type Recipe } from '../../lib/storage';

type RecipeFormValues = {
  name: string;
  ingredients: string;
  prepTimeMinutes: string;
  effect: string;
};

type RecipeFormErrors = Partial<Record<keyof RecipeFormValues, string>>;

function formatMinutes(minutes: number): string {
  if (minutes <= 0) {
    return 'No prep time noted';
  }

  if (minutes === 1) {
    return '1 minute';
  }

  return `${minutes} minutes`;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function ingredientsToText(ingredients: Array<string | { name: string }>): string {
  return ingredients
    .map((ingredient) => (typeof ingredient === 'string' ? ingredient : ingredient.name))
    .join('\n');
}

function textToIngredients(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function toFormValues(recipe: Recipe): RecipeFormValues {
  return {
    name: recipe.name,
    ingredients: ingredientsToText(recipe.ingredients),
    prepTimeMinutes: String(recipe.prepTimeMinutes),
    effect: recipe.effect,
  };
}

function emptyFormValues(): RecipeFormValues {
  return {
    name: '',
    ingredients: '',
    prepTimeMinutes: '',
    effect: '',
  };
}

function validate(values: RecipeFormValues): RecipeFormErrors {
  const nextErrors: RecipeFormErrors = {};

  if (!values.name.trim()) {
    nextErrors.name = 'Recipe name is required.';
  }

  if (!values.prepTimeMinutes.trim()) {
    nextErrors.prepTimeMinutes = 'Prep time is required.';
  } else {
    const parsed = Number(values.prepTimeMinutes);
    if (!Number.isInteger(parsed) || parsed < 0) {
      nextErrors.prepTimeMinutes = 'Prep time must be a whole number of minutes.';
    }
  }

  if (!values.effect.trim()) {
    nextErrors.effect = 'Effect is required.';
  }

  return nextErrors;
}

function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const ingredients =
    recipe.ingredients.length > 0 ? recipe.ingredients.map((ingredient) => ingredient.name) : ['No ingredients recorded yet.'];

  return (
    <article className="panel recipe-detail" aria-label={`${recipe.name} details`}>
      <div className="recipe-detail__header">
        <div>
          <p className="panel__title">Selected recipe</p>
          <h3 className="recipe-detail__title">{recipe.name}</h3>
        </div>
        <p className="recipe-detail__meta">{formatMinutes(recipe.prepTimeMinutes)}</p>
      </div>

      <div className="recipe-detail__section">
        <h4 className="recipe-detail__label">Ingredients</h4>
        <ul className="recipe-detail__list">
          {ingredients.map((ingredient) => (
            <li key={ingredient} className="recipe-detail__list-item">
              {ingredient}
            </li>
          ))}
        </ul>
      </div>

      <div className="recipe-detail__section">
        <h4 className="recipe-detail__label">Effect</h4>
        <p className="recipe-detail__body">{recipe.effect || 'No effect recorded yet.'}</p>
      </div>

      <div className="recipe-detail__footer">
        <span>Created {formatDate(recipe.createdAt)}</span>
        <span>Updated {formatDate(recipe.updatedAt)}</span>
      </div>
    </article>
  );
}

function RecipeEditor({
  initialValues,
  onCreateNew,
  onDelete,
  onSave,
  selectedRecipe,
}: {
  initialValues: RecipeFormValues;
  onCreateNew: () => void;
  onDelete: () => void;
  onSave: (values: RecipeFormValues) => Promise<void>;
  selectedRecipe: Recipe | null;
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<RecipeFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteState, setDeleteState] = useState<'idle' | 'confirming'>('idle');

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
    setDeleteState('idle');
  }, [initialValues]);

  function updateField(field: keyof RecipeFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(values);
    } finally {
      setIsSubmitting(false);
    }
  }

  const subtitle = selectedRecipe ? `Editing ${selectedRecipe.name}` : 'Writing a new dish';

  return (
    <JournalEditorFrame
      title="Recipe forge"
      subtitle={subtitle}
      actionLabel="New recipe"
      onAction={onCreateNew}
      beforeForm={
        selectedRecipe ? (
          deleteState === 'idle' ? (
            <div className="recipe-editor__deletebar">
              <p className="recipe-editor__deletecopy">
                Recipe is saved. Delete it only if the dish is truly gone.
              </p>
              <button
                type="button"
                className="recipe-editor__danger"
                onClick={() => setDeleteState('confirming')}
              >
                Delete recipe
              </button>
            </div>
          ) : (
            <div className="recipe-editor__confirm" role="alert" aria-live="polite">
              <p className="recipe-editor__confirm-copy">
                Delete <strong>{selectedRecipe.name}</strong>? This removes it from storage.
              </p>
              <div className="recipe-editor__confirm-actions">
                <button
                  type="button"
                  className="recipe-editor__secondary"
                  onClick={() => setDeleteState('idle')}
                >
                  Cancel
                </button>
                <button type="button" className="recipe-editor__danger" onClick={onDelete}>
                  Delete now
                </button>
              </div>
            </div>
          )
        ) : null
      }
    >
      <form className="recipe-form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">Name of recipe</span>
          <input
            className="field__control"
            value={values.name}
            onChange={(event) => updateField('name', event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'recipe-name-error' : undefined}
            placeholder="Ex. Spiced road stew"
          />
          {errors.name ? (
            <span className="field__error" id="recipe-name-error">
              {errors.name}
            </span>
          ) : null}
        </label>

        <label className="field">
          <span className="field__label">Ingredients</span>
          <textarea
            className="field__control field__control--textarea"
            value={values.ingredients}
            onChange={(event) => updateField('ingredients', event.target.value)}
            placeholder="One ingredient per line"
            rows={4}
          />
          <span className="field__hint">Write one ingredient per line. Blank lines are ignored on save.</span>
        </label>

        <label className="field">
          <span className="field__label">Preparation time</span>
          <input
            className="field__control"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={values.prepTimeMinutes}
            onChange={(event) => updateField('prepTimeMinutes', event.target.value)}
            aria-invalid={Boolean(errors.prepTimeMinutes)}
            aria-describedby={errors.prepTimeMinutes ? 'recipe-prep-error' : undefined}
            placeholder="15"
          />
          {errors.prepTimeMinutes ? (
            <span className="field__error" id="recipe-prep-error">
              {errors.prepTimeMinutes}
            </span>
          ) : (
            <span className="field__hint">Use whole minutes for table-side clarity.</span>
          )}
        </label>

        <label className="field">
          <span className="field__label">Effect</span>
          <textarea
            className="field__control field__control--textarea"
            value={values.effect}
            onChange={(event) => updateField('effect', event.target.value)}
            aria-invalid={Boolean(errors.effect)}
            aria-describedby={errors.effect ? 'recipe-effect-error' : undefined}
            placeholder="Describe the dish's magical or narrative effect"
            rows={4}
          />
          {errors.effect ? (
            <span className="field__error" id="recipe-effect-error">
              {errors.effect}
            </span>
          ) : (
            <span className="field__hint">Keep this focused on the result a creature gets from the recipe.</span>
          )}
        </label>

        <div className="recipe-editor__actions">
          <button type="submit" className="recipe-editor__primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : selectedRecipe ? 'Save changes' : 'Save recipe'}
          </button>
        </div>
      </form>
    </JournalEditorFrame>
  );
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>(() => listRecipes());
  const [selectedId, setSelectedId] = useState<string | null>(() => listRecipes()[0]?.id ?? null);
  const [savedToast, setSavedToast] = useState<string | null>(null);

  const selectedRecipe = recipes.find((recipe) => recipe.id === selectedId) ?? null;
  const editorValues = useMemo(
    () => (selectedRecipe ? toFormValues(selectedRecipe) : emptyFormValues()),
    [selectedRecipe?.id, selectedRecipe?.updatedAt],
  );

  function startNewRecipe() {
    setSelectedId(null);
    setSavedToast(null);
  }

  async function handleSave(values: RecipeFormValues) {
    const now = new Date().toISOString();
    const draft = {
      name: values.name.trim(),
      ingredients: textToIngredients(values.ingredients),
      prepTimeMinutes: Number(values.prepTimeMinutes),
      effect: values.effect.trim(),
    };

    const nextRecipe = selectedRecipe
      ? {
          ...selectedRecipe,
          name: draft.name,
          ingredients: draft.ingredients.map((name) => ({ name })),
          prepTimeMinutes: draft.prepTimeMinutes,
          effect: draft.effect,
          updatedAt: now,
        }
      : createRecipe(draft, now);

    const nextCollection = upsertRecipe(nextRecipe);
    setRecipes(nextCollection.items);
    setSelectedId(nextRecipe.id);
    setSavedToast(selectedRecipe ? 'Recipe updated.' : 'Recipe saved.');
  }

  function handleDelete() {
    if (!selectedRecipe) {
      return;
    }

    const nextCollection = deleteRecipe(selectedRecipe.id);
    setRecipes(nextCollection.items);
    setSelectedId(nextCollection.items[0]?.id ?? null);
    setSavedToast('Recipe deleted.');
  }

  return (
    <>
      <section className="panel" aria-label="Recipes overview">
        <h3 className="panel__title">Field notes</h3>
        <p className="panel__body">
          A practical recipe ledger for the table. Saved dishes appear here once you start recording them,
          and the selected recipe opens beneath the list.
        </p>
      </section>

      {savedToast ? (
        <section className="panel recipe-toast" aria-label="Save status">
          <p className="panel__body">{savedToast}</p>
        </section>
      ) : null}

      <RecipeEditor
        initialValues={editorValues}
        onCreateNew={startNewRecipe}
        onDelete={handleDelete}
        onSave={handleSave}
        selectedRecipe={selectedRecipe}
      />

      {recipes.length === 0 ? (
        <section className="panel recipe-empty" aria-label="No recipes saved">
          <h3 className="panel__title">No recipes yet</h3>
          <p className="panel__body">
            This cookbook is ready to hold dishes, but there are no saved recipes in storage yet. Start
            writing one above.
          </p>
        </section>
      ) : (
        <div className="recipe-layout">
          <SelectionList
            ariaLabel="Saved recipes"
            activeId={selectedRecipe?.id ?? null}
            onSelect={setSelectedId}
            items={recipes.map((recipe) => ({
              id: recipe.id,
              primary: recipe.name,
              secondary: `${formatMinutes(recipe.prepTimeMinutes)} - ${recipe.ingredients.length} ingredients`,
            }))}
          />

          {selectedRecipe ? <RecipeDetail recipe={selectedRecipe} /> : null}
        </div>
      )}
    </>
  );
}
