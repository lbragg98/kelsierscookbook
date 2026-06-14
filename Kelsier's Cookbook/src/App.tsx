import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import IngredientsPage from './features/ingredients/IngredientsPage';
import MorePage from './features/more/MorePage';
import NotesPage from './features/notes/NotesPage';
import RecipesPage from './features/recipes/RecipesPage';
import RulesPage from './features/rules/RulesPage';

type SectionKey = 'recipes' | 'ingredients' | 'rules' | 'notes' | 'more';

type Section = {
  key: SectionKey;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  notes: string[];
};

const sections: Section[] = [
  {
    key: 'recipes',
    label: 'Recipes',
    eyebrow: 'Field Notes',
    title: 'Recipes',
    description: 'Keep finished dishes, experimental drafts, and quick meal ideas in one worn page.',
    notes: ['Create and revisit recipes', 'Track prep time and effect', 'Edit without losing the original draft'],
  },
  {
    key: 'ingredients',
    label: 'Ingredients',
    eyebrow: 'Pantry Ledger',
    title: 'Ingredients',
    description: "Store the flavors, costs, and harvesting notes that make Kelsier's kitchen survive the road.",
    notes: ['Track flavor profile and cost', 'Record harvest notes', 'Reference ingredient effects later'],
  },
  {
    key: 'rules',
    label: 'Rules',
    eyebrow: 'College Lore',
    title: 'College of Cuisine',
    description: "A dedicated page for class rules and abilities when you're ready to add them.",
    notes: ['Rules live in one steady place', 'Expandable for future class features', 'Designed for reading at the table'],
  },
  {
    key: 'notes',
    label: 'Notes',
    eyebrow: 'Notepad',
    title: 'Campaign Notes',
    description: 'A quick page for table scribbles, reminders, and ideas you want near the cookbook.',
    notes: ['Quick jotting during play', 'Saved locally in the browser', 'Feels like a blank journal page'],
  },
  {
    key: 'more',
    label: 'More',
    eyebrow: 'Side Pages',
    title: 'Bardic Notes',
    description: 'Utility pages for food-themed inspiration, insults, and other small companion tools.',
    notes: ['Generate inspiration phrases', 'Generate vicious mockery lines', 'Reserve room for future tools'],
  },
];

const transition = { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const };

export default function App() {
  const [active, setActive] = useState<{ key: SectionKey; direction: number }>({
    key: 'recipes',
    direction: 1,
  });
  const reduceMotion = useReducedMotion();

  const pageVariants = {
    enter: (direction: number) =>
      reduceMotion
        ? { opacity: 0 }
        : { opacity: 0, x: direction > 0 ? 16 : -16, filter: 'blur(1px)' },
    center: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: (direction: number) =>
      reduceMotion
        ? { opacity: 0 }
        : { opacity: 0, x: direction > 0 ? -12 : 12, filter: 'blur(1px)' },
  };

  const currentIndex = sections.findIndex((section) => section.key === active.key);
  const current = sections[currentIndex] ?? sections[0];

  return (
    <MotionConfig reducedMotion="user">
      <div className="app-shell">
        <div className="app-shell__page">
          <header className="topbar" aria-label="Kelsier's Cookbook header">
            <div>
              <p className="topbar__eyebrow">Kelsier's Cookbook</p>
              <h1 className="topbar__title">{current.title}</h1>
            </div>
          </header>

          <main className="book-stage" aria-live="polite">
            <AnimatePresence mode="wait" initial={false} custom={active.direction}>
              <motion.section
                key={active.key}
                className="page"
                custom={active.direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                aria-labelledby="section-title"
              >
                <div className="page__eyebrow">{current.eyebrow}</div>
                <h2 className="page__title" id="section-title">
                  {current.title}
                </h2>
                <p className="page__description">{current.description}</p>

                {current.key === 'recipes' ? (
                  <RecipesPage />
                ) : current.key === 'ingredients' ? (
                  <IngredientsPage />
                ) : current.key === 'rules' ? (
                  <RulesPage />
                ) : current.key === 'notes' ? (
                  <NotesPage />
                ) : current.key === 'more' ? (
                  <MorePage />
                ) : (
                  <>
                    <section className="panel" aria-label={`${current.title} notes`}>
                      <h3 className="panel__title">What lives here</h3>
                      <ul className="notes-list">
                        {current.notes.map((note) => (
                          <li key={note} className="notes-list__item">
                            {note}
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="panel panel--quiet" aria-label="Coming soon">
                      <h3 className="panel__title">Foundation only</h3>
                      <p className="panel__body">
                        The app shell, parchment background, and navigation are in place. Feature pages will
                        be added one at a time after this foundation is confirmed.
                      </p>
                    </section>
                  </>
                )}
              </motion.section>
            </AnimatePresence>
          </main>

          <nav className="bottom-nav" aria-label="Primary">
            {sections.map((section) => {
              const isActive = section.key === active.key;

              return (
                <button
                  key={section.key}
                  type="button"
                  className="bottom-nav__item"
                  data-active={isActive}
                  onClick={() =>
                    setActive({
                      key: section.key,
                      direction:
                        sections.findIndex((item) => item.key === section.key) >= currentIndex ? 1 : -1,
                    })
                  }
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="bottom-nav__label">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </MotionConfig>
  );
}
