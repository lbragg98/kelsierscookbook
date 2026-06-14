import { useEffect, useMemo, useState, type FormEvent } from 'react';
import JournalEditorFrame from '../../components/ui/JournalEditorFrame';
import SelectionList from '../../components/ui/SelectionList';
import {
  createIngredient,
  deleteIngredient,
  listIngredients,
  upsertIngredient,
  type Ingredient,
} from '../../lib/storage';

type IngredientFormValues = {
  name: string;
  flavorProfile: string;
  typicalCost: string;
  effect: string;
  harvestNotes: string;
};

type IngredientFormErrors = Partial<Record<keyof IngredientFormValues, string>>;

function toFormValues(ingredient: Ingredient): IngredientFormValues {
  return {
    name: ingredient.name,
    flavorProfile: ingredient.flavorProfile,
    typicalCost: ingredient.typicalCost,
    effect: ingredient.effect,
    harvestNotes: ingredient.harvestNotes,
  };
}

function emptyFormValues(): IngredientFormValues {
  return {
    name: '',
    flavorProfile: '',
    typicalCost: '',
    effect: '',
    harvestNotes: '',
  };
}

function validate(values: IngredientFormValues): IngredientFormErrors {
  const nextErrors: IngredientFormErrors = {};

  if (!values.name.trim()) {
    nextErrors.name = 'Ingredient name is required.';
  }

  if (!values.flavorProfile.trim()) {
    nextErrors.flavorProfile = 'Flavor profile is required.';
  }

  if (!values.typicalCost.trim()) {
    nextErrors.typicalCost = 'Typical cost is required.';
  }

  if (!values.effect.trim()) {
    nextErrors.effect = 'Effect is required.';
  }

  if (!values.harvestNotes.trim()) {
    nextErrors.harvestNotes = 'Harvest notes are required.';
  }

  return nextErrors;
}

function IngredientEditor({
  initialValues,
  onDelete,
  onSave,
  selectedIngredient,
}: {
  initialValues: IngredientFormValues;
  onDelete: () => void;
  onSave: (values: IngredientFormValues) => Promise<void>;
  selectedIngredient: Ingredient | null;
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<IngredientFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteState, setDeleteState] = useState<'idle' | 'confirming'>('idle');

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
    setDeleteState('idle');
  }, [initialValues]);

  function updateField(field: keyof IngredientFormValues, value: string) {
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

  const subtitle = selectedIngredient ? `Editing ${selectedIngredient.name}` : 'Writing a new ingredient';

  return (
    <JournalEditorFrame
      title="Pantry forge"
      subtitle={subtitle}
      beforeForm={
        selectedIngredient ? (
          deleteState === 'idle' ? (
            <div className="ingredient-editor__deletebar">
              <p className="ingredient-editor__deletecopy">
                Ingredient is saved. Delete it only if it no longer belongs in the pantry.
              </p>
              <button
                type="button"
                className="ingredient-editor__danger"
                onClick={() => setDeleteState('confirming')}
              >
                Delete ingredient
              </button>
            </div>
          ) : (
            <div className="ingredient-editor__confirm" role="alert" aria-live="polite">
              <p className="ingredient-editor__confirm-copy">
                Delete <strong>{selectedIngredient.name}</strong>? This removes it from storage.
              </p>
              <div className="ingredient-editor__confirm-actions">
                <button
                  type="button"
                  className="ingredient-editor__secondary"
                  onClick={() => setDeleteState('idle')}
                >
                  Cancel
                </button>
                <button type="button" className="ingredient-editor__danger" onClick={onDelete}>
                  Delete now
                </button>
              </div>
            </div>
          )
        ) : null
      }
    >
      <form className="ingredient-form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">Ingredient name</span>
          <input
            className="field__control"
            value={values.name}
            onChange={(event) => updateField('name', event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'ingredient-name-error' : undefined}
            placeholder="Ex. Ashroot"
          />
          {errors.name ? (
            <span className="field__error" id="ingredient-name-error">
              {errors.name}
            </span>
          ) : null}
        </label>

        <label className="field">
          <span className="field__label">Flavor profile</span>
          <textarea
            className="field__control field__control--textarea"
            value={values.flavorProfile}
            onChange={(event) => updateField('flavorProfile', event.target.value)}
            aria-invalid={Boolean(errors.flavorProfile)}
            aria-describedby={errors.flavorProfile ? 'ingredient-flavor-error' : undefined}
            rows={3}
            placeholder="Earthy, peppery, smoky..."
          />
          {errors.flavorProfile ? (
            <span className="field__error" id="ingredient-flavor-error">
              {errors.flavorProfile}
            </span>
          ) : (
            <span className="field__hint">Describe how the ingredient tastes or feels in the dish.</span>
          )}
        </label>

        <label className="field">
          <span className="field__label">Typical cost</span>
          <input
            className="field__control"
            value={values.typicalCost}
            onChange={(event) => updateField('typicalCost', event.target.value)}
            aria-invalid={Boolean(errors.typicalCost)}
            aria-describedby={errors.typicalCost ? 'ingredient-cost-error' : undefined}
            placeholder="2 sp per bunch"
          />
          {errors.typicalCost ? (
            <span className="field__error" id="ingredient-cost-error">
              {errors.typicalCost}
            </span>
          ) : (
            <span className="field__hint">Use whatever table currency makes sense for your campaign.</span>
          )}
        </label>

        <label className="field">
          <span className="field__label">Effect</span>
          <textarea
            className="field__control field__control--textarea"
            value={values.effect}
            onChange={(event) => updateField('effect', event.target.value)}
            aria-invalid={Boolean(errors.effect)}
            aria-describedby={errors.effect ? 'ingredient-effect-error' : undefined}
            rows={3}
            placeholder="What does it do in a recipe?"
          />
          {errors.effect ? (
            <span className="field__error" id="ingredient-effect-error">
              {errors.effect}
            </span>
          ) : (
            <span className="field__hint">Keep this focused on its in-game or recipe effect.</span>
          )}
        </label>

        <label className="field">
          <span className="field__label">How to harvest it</span>
          <textarea
            className="field__control field__control--textarea"
            value={values.harvestNotes}
            onChange={(event) => updateField('harvestNotes', event.target.value)}
            aria-invalid={Boolean(errors.harvestNotes)}
            aria-describedby={errors.harvestNotes ? 'ingredient-harvest-error' : undefined}
            rows={4}
            placeholder="Where it grows, how to collect it, and what to avoid"
          />
          {errors.harvestNotes ? (
            <span className="field__error" id="ingredient-harvest-error">
              {errors.harvestNotes}
            </span>
          ) : (
            <span className="field__hint">Note terrain, season, and anything dangerous about gathering it.</span>
          )}
        </label>

        <div className="ingredient-editor__actions">
          <button type="submit" className="ingredient-editor__primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : selectedIngredient ? 'Save changes' : 'Save ingredient'}
          </button>
        </div>
      </form>
    </JournalEditorFrame>
  );
}

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>(() => listIngredients());
  const [selectedId, setSelectedId] = useState<string | null>(() => listIngredients()[0]?.id ?? null);
  const [savedToast, setSavedToast] = useState<string | null>(null);

  const selectedIngredient = ingredients.find((ingredient) => ingredient.id === selectedId) ?? null;
  const editorValues = useMemo(
    () => (selectedIngredient ? toFormValues(selectedIngredient) : emptyFormValues()),
    [selectedIngredient?.id, selectedIngredient?.updatedAt],
  );

  function startNewIngredient() {
    setSelectedId(null);
    setSavedToast(null);
  }

  async function handleSave(values: IngredientFormValues) {
    const now = new Date().toISOString();
    const draft = {
      name: values.name.trim(),
      flavorProfile: values.flavorProfile.trim(),
      typicalCost: values.typicalCost.trim(),
      effect: values.effect.trim(),
      harvestNotes: values.harvestNotes.trim(),
    };

    const nextIngredient = selectedIngredient
      ? {
          ...selectedIngredient,
          name: draft.name,
          flavorProfile: draft.flavorProfile,
          typicalCost: draft.typicalCost,
          effect: draft.effect,
          harvestNotes: draft.harvestNotes,
          updatedAt: now,
        }
      : createIngredient(draft, now);

    const nextCollection = upsertIngredient(nextIngredient);
    setIngredients(nextCollection.items);
    setSelectedId(nextIngredient.id);
    setSavedToast(selectedIngredient ? 'Ingredient updated.' : 'Ingredient saved.');
  }

  function handleDelete() {
    if (!selectedIngredient) {
      return;
    }

    const nextCollection = deleteIngredient(selectedIngredient.id);
    setIngredients(nextCollection.items);
    setSelectedId(nextCollection.items[0]?.id ?? null);
    setSavedToast('Ingredient deleted.');
  }

  return (
    <div className="ingredient-layout">
      <section className="panel" aria-label="Ingredients overview">
        <h3 className="panel__title">Pantry ledger</h3>
        <p className="panel__body">
          A compact ingredient ledger for flavor, cost, and harvest notes. Click any entry to edit it.
        </p>
      </section>

      <section className="panel ingredient-workspace" aria-label="Ingredient workspace">
        <div className="ingredient-workspace__header">
          <button type="button" className="ingredient-workspace__new" onClick={startNewIngredient}>
            New ingredient
          </button>
          <p className="ingredient-workspace__copy">
            Choose an ingredient from the list to edit its notes in the journal below.
          </p>
        </div>

        {savedToast ? (
          <section className="panel ingredient-toast" aria-label="Save status">
            <p className="panel__body">{savedToast}</p>
          </section>
        ) : null}

        {ingredients.length === 0 ? (
          <section className="panel ingredient-empty" aria-label="No ingredients saved">
            <h3 className="panel__title">No ingredients yet</h3>
            <p className="panel__body">
              This shelf is ready for the pantry notes that power Kelsier's recipes, but there are no saved
              ingredients in storage yet. Start a new entry with the button on the left.
            </p>
          </section>
        ) : (
          <SelectionList
            ariaLabel="Ingredient list"
            activeId={selectedIngredient?.id ?? null}
            onSelect={setSelectedId}
            items={ingredients.map((ingredient) => ({
              id: ingredient.id,
              primary: ingredient.name,
              secondary:
                ingredient.flavorProfile || ingredient.typicalCost
                  ? [ingredient.flavorProfile, ingredient.typicalCost].filter(Boolean).join(' • ')
                  : 'Flavor profile not noted',
            }))}
          />
        )}
      </section>

      <IngredientEditor
        initialValues={editorValues}
        onDelete={handleDelete}
        onSave={handleSave}
        selectedIngredient={selectedIngredient}
      />
    </div>
  );
}
