import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

const inspirationPhrases = [
  'Serve courage with a side of salt.',
  'A warm meal can steady a shaking hand.',
  "Today's special is hope, lightly seared.",
  'Even road dust tastes better with company.',
  'One good bite can change the whole journey.',
  'Let the kettle sing before the battle begins.',
  'Feed the fire, feed the heart.',
];

const mockeryLines = [
  "You smell like yesterday's broth left in the sun.",
  'I have seen tougher garnish.',
  'Your cooking has the confidence of spoiled cream.',
  'That insult was under-seasoned and overcooked.',
  'The camp dog would refuse your stew out of principle.',
  'You plate chaos like a nervous apprentice.',
  'Even the onions are crying for your choices.',
];

function pickRandom(lines: string[]): string {
  const index = Math.floor(Math.random() * lines.length);
  return lines[index] ?? '';
}

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

function GeneratorCard({
  title,
  body,
  buttonLabel,
  copyLabel,
  value,
  onGenerate,
  onCopy,
}: {
  title: string;
  body: string;
  buttonLabel: string;
  copyLabel: string;
  value: string;
  onGenerate: () => void;
  onCopy: () => void;
}) {
  return (
    <section className="panel utility-card" aria-label={title}>
      <h3 className="panel__title">{title}</h3>
      <p className="panel__body">{body}</p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={value || 'empty'}
          className="utility-card__result"
          aria-live="polite"
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: 0.14 }}
        >
          {value || 'Press the button to generate a line.'}
        </motion.div>
      </AnimatePresence>
      <div className="utility-card__actions">
        <motion.button
          type="button"
          className="utility-card__secondary"
          onClick={onCopy}
          disabled={!value}
          whileTap={{ scale: 0.98 }}
          whileHover={{ y: -1 }}
          transition={{ duration: 0.12 }}
        >
          {copyLabel}
        </motion.button>
        <motion.button
          type="button"
          className="utility-card__button"
          onClick={onGenerate}
          whileTap={{ scale: 0.98 }}
          whileHover={{ y: -1 }}
          transition={{ duration: 0.12 }}
        >
          {buttonLabel}
        </motion.button>
      </div>
    </section>
  );
}

export default function MorePage() {
  const [inspiration, setInspiration] = useState('');
  const [mockery, setMockery] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const stats = useMemo(
    () => ({
      inspirationCount: inspirationPhrases.length,
      mockeryCount: mockeryLines.length,
    }),
    [],
  );

  return (
    <>
      <section className="panel" aria-label="Utility overview">
        <h3 className="panel__title">Side pages</h3>
        <p className="panel__body">
          Small companion tools for the table. These stay quick and food-themed so they feel like notes
          tucked into the back of the cookbook.
        </p>
      </section>

      <AnimatePresence mode="wait" initial={false}>
        {status ? (
          <motion.section
            key={status}
            className="panel utility-status"
            aria-label="Utility status"
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.14 }}
          >
            <p className="panel__body">{status}</p>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <div className="utility-grid">
        <GeneratorCard
          title="Bardic Inspiration"
          body={`A food-themed phrase generator with ${stats.inspirationCount} options.`}
          buttonLabel="Generate inspiration"
          copyLabel="Copy line"
          value={inspiration}
          onGenerate={() => {
            const next = pickRandom(inspirationPhrases);
            setInspiration(next);
            setStatus('Inspiration rerolled.');
          }}
          onCopy={async () => {
            if (!inspiration) {
              return;
            }

            const didCopy = await copyText(inspiration);
            setStatus(didCopy ? 'Inspiration copied.' : 'Copy failed.');
          }}
        />

        <GeneratorCard
          title="Vicious Mockery"
          body={`A food-themed insult generator with ${stats.mockeryCount} options.`}
          buttonLabel="Generate insult"
          copyLabel="Copy line"
          value={mockery}
          onGenerate={() => {
            const next = pickRandom(mockeryLines);
            setMockery(next);
            setStatus('Insult rerolled.');
          }}
          onCopy={async () => {
            if (!mockery) {
              return;
            }

            const didCopy = await copyText(mockery);
            setStatus(didCopy ? 'Insult copied.' : 'Copy failed.');
          }}
        />
      </div>
    </>
  );
}
